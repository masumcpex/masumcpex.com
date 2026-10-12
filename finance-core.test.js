const fs = require("fs");
const path = require("path");
const vm = require("vm");
const assert = require("assert");

const html = fs.readFileSync(path.join(__dirname, "..", "Finance.html"), "utf8");
const match = /<script id="core">([\s\S]*?)<\/script>/.exec(html);
assert.ok(match, "core script block not found in Finance.html");
const C = vm.runInNewContext(`${match[1]}\nFinanceCore`, {});

const same = (a, b) => assert.strictEqual(JSON.stringify(a), JSON.stringify(b));

let passed = 0;
const results = [];
function test(name, fn) {
  try {
    fn();
    passed++;
    results.push(`PASS  ${name}`);
  } catch (err) {
    results.push(`FAIL  ${name}\n      ${err.message}`);
  }
}

let seq = 0;
const rec = (store, date, amountMinor, extra) => {
  const base = { id: `id-${++seq}`, date, amountMinor, createdAt: seq, updatedAt: seq };
  const defaults = {
    income: { type: "salary", note: "", reference: "" },
    expenses: { category: "food", description: "item", note: "" },
    support: { recipient: "Father", method: "", reference: "" }
  };
  return { ...base, ...defaults[store], ...(extra || {}) };
};
const data = (income, expenses, support) => ({ income: income || [], expenses: expenses || [], support: support || [] });

test("parseMinor: decimal-safe parsing without floating point drift", () => {
  assert.strictEqual(C.parseMinor("1250"), 125000);
  assert.strictEqual(C.parseMinor("1250.5"), 125050);
  assert.strictEqual(C.parseMinor("0.1"), 10);
  assert.strictEqual(C.parseMinor("19.99"), 1999);
  assert.strictEqual(C.parseMinor("1,234.56"), 123456);
  assert.strictEqual(C.parseMinor("১২৫০.৫০"), 125050);
});

test("parseMinor: rejects invalid, zero, negative and over-precise input", () => {
  for (const bad of ["", "0", "0.00", "-5", "abc", "1.234", "1e5", "12..3", "99999999999999"]) {
    assert.strictEqual(C.parseMinor(bad), null, `should reject "${bad}"`);
  }
});

test("0.1 + 0.2 style sums stay exact using integer minor units", () => {
  const d = data([rec("income", "2026-01-01", C.parseMinor("0.1")), rec("income", "2026-01-02", C.parseMinor("0.2"))]);
  assert.strictEqual(C.sum(d.income), 30);
  assert.strictEqual(C.formatRM(C.sum(d.income)), "RM 0.30");
});

test("formatRM and formatBDT use separate formats", () => {
  assert.strictEqual(C.formatRM(123456789), "RM 1,234,567.89");
  assert.strictEqual(C.formatRM(-5000), "-RM 50.00");
  assert.strictEqual(C.formatBDT(1500000), "৳15,000");
  assert.strictEqual(C.formatBDT(15000000), "৳1,50,000");
  assert.strictEqual(C.formatBDT(1500050), "৳15,000.50");
  assert.strictEqual(C.formatSignedBDT(500000), "+৳5,000");
  assert.strictEqual(C.formatSignedBDT(-500000), "-৳5,000");
});

test("date validation: real calendar dates only", () => {
  assert.ok(C.isValidDate("2024-02-29"));
  assert.ok(!C.isValidDate("2025-02-29"));
  assert.ok(!C.isValidDate("2026-13-01"));
  assert.ok(!C.isValidDate("2026-04-31"));
  assert.ok(!C.isValidDate("26-04-01"));
});

test("month helpers: shiftMonth crosses year boundaries both ways", () => {
  assert.strictEqual(C.shiftMonth("2026-01", -1), "2025-12");
  assert.strictEqual(C.shiftMonth("2025-12", 1), "2026-01");
  assert.strictEqual(C.shiftMonth("2026-03", -14), "2025-01");
});

test("toDateString uses local date parts (no UTC shift)", () => {
  assert.strictEqual(C.toDateString(new Date(2026, 0, 1, 0, 5)), "2026-01-01");
  assert.strictEqual(C.toDateString(new Date(2026, 11, 31, 23, 55)), "2026-12-31");
});

test("monthly totals are correct and isolated by month", () => {
  const d = data(
    [rec("income", "2026-03-05", 300000), rec("income", "2026-03-28", 50000), rec("income", "2026-04-01", 999900)],
    [rec("expenses", "2026-03-10", 120000), rec("expenses", "2026-02-27", 77700)],
    [rec("support", "2026-03-15", 1500000)]
  );
  const m = C.monthSummary(d, "2026-03", {});
  assert.strictEqual(m.incomeMinor, 350000);
  assert.strictEqual(m.expenseMinor, 120000);
  assert.strictEqual(m.balanceMinor, 230000);
  assert.strictEqual(m.supportMinor, 1500000);
  assert.strictEqual(m.supportCount, 1);
});

test("lifetime totals come from all records", () => {
  const d = data(
    [rec("income", "2025-01-05", 100000), rec("income", "2026-03-05", 250000)],
    [rec("expenses", "2025-02-10", 40000), rec("expenses", "2026-03-10", 60000)],
    [rec("support", "2025-05-15", 500000), rec("support", "2026-03-15", 700000)]
  );
  const l = C.lifetimeSummary(d);
  assert.strictEqual(l.incomeMinor, 350000);
  assert.strictEqual(l.expenseMinor, 100000);
  assert.strictEqual(l.balanceMinor, 250000);
  assert.strictEqual(l.supportMinor, 1200000);
  assert.strictEqual(l.supportCount, 2);
});

test("family support never changes RM income, expense or balance", () => {
  const base = data([rec("income", "2026-03-05", 300000)], [rec("expenses", "2026-03-10", 100000)], []);
  const withSupport = data(base.income, base.expenses, [rec("support", "2026-03-15", 9999900), rec("support", "2026-03-20", 123400)]);
  const a = C.lifetimeSummary(base);
  const b = C.lifetimeSummary(withSupport);
  assert.strictEqual(a.incomeMinor, b.incomeMinor);
  assert.strictEqual(a.expenseMinor, b.expenseMinor);
  assert.strictEqual(a.balanceMinor, b.balanceMinor);
  const ma = C.monthSummary(base, "2026-03", {});
  const mb = C.monthSummary(withSupport, "2026-03", {});
  assert.strictEqual(ma.balanceMinor, mb.balanceMinor);
  assert.strictEqual(mb.supportMinor, 10123300);
});

test("negative RM balance is preserved, not clamped", () => {
  const d = data([rec("income", "2026-03-05", 10000)], [rec("expenses", "2026-03-10", 25000)]);
  assert.strictEqual(C.lifetimeSummary(d).balanceMinor, -15000);
});

test("comparison UP: 15000 -> 20000 = +5000, 33.33%", () => {
  const c = C.compareAmounts(1500000, 2000000);
  assert.strictEqual(c.status, "up");
  assert.strictEqual(c.diffMinor, 500000);
  assert.strictEqual(c.percent, 33.33);
  assert.ok(c.percentAvailable);
});

test("comparison DOWN: 20000 -> 15000 = -5000, 25%", () => {
  const c = C.compareAmounts(2000000, 1500000);
  assert.strictEqual(c.status, "down");
  assert.strictEqual(c.diffMinor, -500000);
  assert.strictEqual(c.percent, 25);
});

test("comparison NO CHANGE", () => {
  const c = C.compareAmounts(1500000, 1500000);
  assert.strictEqual(c.status, "same");
  assert.strictEqual(c.diffMinor, 0);
  assert.strictEqual(c.percent, 0);
});

test("comparison with zero previous month: no division by zero, no Infinity", () => {
  const c = C.compareAmounts(0, 1500000);
  assert.strictEqual(c.status, "up");
  assert.strictEqual(c.diffMinor, 1500000);
  assert.strictEqual(c.percent, null);
  assert.strictEqual(c.percentAvailable, false);
  assert.strictEqual(c.zeroBaseline, true);
  assert.ok(!Number.isNaN(c.diffMinor) && Number.isFinite(c.diffMinor));
});

test("comparison zero vs zero: NO CHANGE, no zero-baseline warning", () => {
  const c = C.compareAmounts(0, 0);
  assert.strictEqual(c.status, "same");
  assert.strictEqual(c.percent, null);
  assert.strictEqual(c.zeroBaseline, false);
});

test("comparison to zero current month: DOWN 100%", () => {
  const c = C.compareAmounts(1500000, 0);
  assert.strictEqual(c.status, "down");
  assert.strictEqual(c.percent, 100);
});

test("incomplete months: four distinct support states", () => {
  const d = data([], [], [rec("support", "2026-03-15", 100000), rec("support", "2026-05-15", 100000)]);
  const completion = { "2026-05": true, "2026-06": true };
  assert.strictEqual(C.monthSummary(d, "2026-03", completion).supportState, "incomplete");
  assert.strictEqual(C.monthSummary(d, "2026-05", completion).supportState, "complete");
  assert.strictEqual(C.monthSummary(d, "2026-06", completion).supportState, "confirmed-zero");
  assert.strictEqual(C.monthSummary(d, "2026-04", completion).supportState, "no-records");
});

test("yearly totals, highest and lowest recorded family-support months", () => {
  const d = data(
    [rec("income", "2026-01-05", 300000), rec("income", "2026-02-05", 300000)],
    [rec("expenses", "2026-01-10", 100000)],
    [rec("support", "2026-01-15", 1500000), rec("support", "2026-02-15", 2000000), rec("support", "2026-04-15", 800000), rec("support", "2025-12-15", 9900000)]
  );
  const y = C.yearSummary(d, 2026, {});
  assert.strictEqual(y.months.length, 12);
  assert.strictEqual(y.totals.incomeMinor, 600000);
  assert.strictEqual(y.totals.expenseMinor, 100000);
  assert.strictEqual(y.totals.balanceMinor, 500000);
  assert.strictEqual(y.totals.supportMinor, 4300000);
  assert.strictEqual(y.highest.month, "2026-02");
  assert.strictEqual(y.lowest.month, "2026-04");
});

test("yearly: empty year has no highest/lowest and all zero", () => {
  const y = C.yearSummary(data(), 2026, {});
  assert.strictEqual(y.highest, null);
  assert.strictEqual(y.lowest, null);
  assert.strictEqual(y.totals.supportMinor, 0);
});

test("edit updates totals; delete removes only the target record", () => {
  let d = data([rec("income", "2026-03-05", 100000, { id: "a" }), rec("income", "2026-03-06", 200000, { id: "b" })]);
  assert.strictEqual(C.lifetimeSummary(d).incomeMinor, 300000);
  d = { ...d, income: d.income.map((r) => (r.id === "a" ? { ...r, amountMinor: 150000 } : r)) };
  assert.strictEqual(C.lifetimeSummary(d).incomeMinor, 350000);
  d = { ...d, income: d.income.filter((r) => r.id !== "b") };
  assert.strictEqual(C.lifetimeSummary(d).incomeMinor, 150000);
  assert.strictEqual(d.income.length, 1);
});

test("filters: year, month, type and text search", () => {
  const list = [
    rec("income", "2026-03-05", 100, { type: "salary", note: "March pay" }),
    rec("income", "2026-03-20", 100, { type: "bonus", note: "Eid" }),
    rec("income", "2025-03-05", 100, { type: "salary", note: "Old" })
  ];
  assert.strictEqual(C.filterRecords(list, { year: "2026" }).length, 2);
  assert.strictEqual(C.filterRecords(list, { month: "3" }).length, 3);
  assert.strictEqual(C.filterRecords(list, { field: "type", value: "bonus" }).length, 1);
  assert.strictEqual(C.filterRecords(list, { query: "eid", searchFields: ["note"] }).length, 1);
  assert.strictEqual(C.filterRecords(list, { year: "2026", field: "type", value: "salary" }).length, 1);
});

test("income validation: required fields and messages", () => {
  assert.ok(!C.validateIncome({ date: "", amount: "", type: "salary" }).ok);
  const bad = C.validateIncome({ date: "2026-03-05", amount: "-5", type: "salary" });
  assert.ok(bad.errors.amount);
  const good = C.validateIncome({ date: "2026-03-05", amount: "2500.75", type: "overtime", note: " OT ", reference: "" });
  assert.ok(good.ok);
  assert.strictEqual(good.value.amountMinor, 250075);
  assert.strictEqual(good.value.note, "OT");
});

test("expense validation requires category and description", () => {
  assert.ok(C.validateExpense({ date: "2026-03-05", amount: "10", category: "food", description: "" }).errors.description);
  assert.ok(C.validateExpense({ date: "2026-03-05", amount: "10", category: "nope", description: "x" }).errors.category);
  assert.ok(C.validateExpense({ date: "2026-03-05", amount: "10", category: "food", description: "Lunch" }).ok);
});

test("support validation: BDT amount entered manually, no RM or rate required", () => {
  const r = C.validateSupport({ date: "2026-03-05", amount: "15000", recipient: "Father" });
  assert.ok(r.ok);
  assert.strictEqual(r.value.amountMinor, 1500000);
  assert.ok(!("rate" in r.value) && !("amountRm" in r.value));
  assert.ok(C.validateSupport({ date: "2026-03-05", amount: "15000", recipient: "" }).errors.recipient);
});

const sample = () => {
  seq = 100;
  return data(
    [rec("income", "2026-03-05", 300000, { id: "i1" })],
    [rec("expenses", "2026-03-10", 45050, { id: "e1" })],
    [rec("support", "2026-03-15", 1500000, { id: "s1", recipient: "Mother", method: "bank" })]
  );
};

test("backup: contains schema version, timestamp, all stores and completion", () => {
  const b = C.buildBackup(sample(), { "2026-03": true, "2026-02": false }, "2026-04-01T00:00:00.000Z");
  assert.strictEqual(b.schemaVersion, 1);
  assert.strictEqual(b.createdAt, "2026-04-01T00:00:00.000Z");
  assert.strictEqual(b.income.length, 1);
  assert.strictEqual(b.expenses.length, 1);
  assert.strictEqual(b.support.length, 1);
  same(b.completion, { "2026-03": true });
});

test("backup round trip: export -> JSON -> validate preserves every record", () => {
  const original = sample();
  const json = JSON.stringify(C.buildBackup(original, { "2026-03": true }, "2026-04-01T00:00:00.000Z"));
  const v = C.validateBackup(JSON.parse(json));
  assert.ok(v.ok, v.errors.join("; "));
  assert.strictEqual(C.lifetimeSummary(v.data).incomeMinor, C.lifetimeSummary(original).incomeMinor);
  assert.strictEqual(C.lifetimeSummary(v.data).supportMinor, C.lifetimeSummary(original).supportMinor);
  same(v.completion, { "2026-03": true });
});

test("invalid backups are rejected with messages", () => {
  const good = C.buildBackup(sample(), {}, "2026-04-01T00:00:00.000Z");
  const cases = {
    "not an object": "hello",
    "array": [],
    "wrong app": { ...good, app: "other" },
    "missing version": { ...good, schemaVersion: undefined },
    "future version": { ...good, schemaVersion: 99 },
    "bad timestamp": { ...good, createdAt: "yesterday" },
    "missing income list": { ...good, income: undefined },
    "bad date": { ...good, income: [{ ...good.income[0], date: "2026-02-30" }] },
    "negative amount": { ...good, expenses: [{ ...good.expenses[0], amountMinor: -5 }] },
    "float amount": { ...good, expenses: [{ ...good.expenses[0], amountMinor: 10.5 }] },
    "string amount": { ...good, support: [{ ...good.support[0], amountMinor: "1500" }] },
    "bad enum": { ...good, income: [{ ...good.income[0], type: "lottery" }] },
    "missing description": { ...good, expenses: [{ ...good.expenses[0], description: "" }] },
    "duplicate ids": { ...good, income: [good.income[0], good.income[0]] },
    "bad completion": { ...good, completion: { "2026-13": true } }
  };
  for (const [name, input] of Object.entries(cases)) {
    const v = C.validateBackup(input);
    assert.strictEqual(v.ok, false, `should reject: ${name}`);
    assert.ok(v.errors.length > 0, `should explain: ${name}`);
  }
});

test("merge import into empty database adds everything", () => {
  const backup = C.validateBackup(C.buildBackup(sample(), { "2026-03": true }, "2026-04-01T00:00:00.000Z"));
  const plan = C.planImport(data(), {}, backup, "merge");
  assert.strictEqual(plan.add.income.length + plan.add.expenses.length + plan.add.support.length, 3);
  same(plan.completionToSet, ["2026-03"]);
});

test("duplicate-import protection: importing the same backup twice adds nothing", () => {
  const original = sample();
  const backup = C.validateBackup(C.buildBackup(original, {}, "2026-04-01T00:00:00.000Z"));
  const first = C.applyImport(data(), {}, C.planImport(data(), {}, backup, "merge"));
  const secondPlan = C.planImport(first.data, first.completion, backup, "merge");
  assert.strictEqual(secondPlan.add.income.length + secondPlan.add.expenses.length + secondPlan.add.support.length, 0);
  assert.strictEqual(secondPlan.identical, 3);
  const second = C.applyImport(first.data, first.completion, secondPlan);
  assert.strictEqual(C.lifetimeSummary(second.data).recordCount, 3);
  assert.strictEqual(C.lifetimeSummary(second.data).incomeMinor, 300000);
});

test("merge keeps existing record when same id has different content (conflict reported)", () => {
  const original = sample();
  const backup = C.validateBackup(C.buildBackup(original, {}, "2026-04-01T00:00:00.000Z"));
  const edited = { ...original, income: original.income.map((r) => ({ ...r, amountMinor: 999999 })) };
  const plan = C.planImport(edited, {}, backup, "merge");
  assert.strictEqual(plan.conflicts, 1);
  const result = C.applyImport(edited, {}, plan);
  assert.strictEqual(result.data.income.length, 1);
  assert.strictEqual(result.data.income[0].amountMinor, 999999);
});

test("merge flags same-content records that have different ids as possible duplicates", () => {
  const original = sample();
  const backup = C.validateBackup(C.buildBackup(original, {}, "2026-04-01T00:00:00.000Z"));
  const renamed = { ...original, income: original.income.map((r) => ({ ...r, id: "other-id" })) };
  const plan = C.planImport(renamed, {}, backup, "merge");
  assert.strictEqual(plan.possibleDuplicates, 1);
});

test("merge into a populated database keeps unrelated records", () => {
  const original = sample();
  const backup = C.validateBackup(C.buildBackup(original, {}, "2026-04-01T00:00:00.000Z"));
  const existing = data([rec("income", "2026-01-01", 111100, { id: "mine" })]);
  const result = C.applyImport(existing, {}, C.planImport(existing, {}, backup, "merge"));
  assert.strictEqual(result.data.income.length, 2);
  assert.ok(result.data.income.some((r) => r.id === "mine"));
});

test("replace import replaces everything and completion markers", () => {
  const original = sample();
  const backup = C.validateBackup(C.buildBackup(original, { "2026-03": true }, "2026-04-01T00:00:00.000Z"));
  const existing = data([rec("income", "2026-01-01", 111100, { id: "mine" })]);
  const result = C.applyImport(existing, { "2025-01": true }, C.planImport(existing, { "2025-01": true }, backup, "replace"));
  assert.strictEqual(result.data.income.length, 1);
  assert.strictEqual(result.data.income[0].id, "i1");
  same(result.completion, { "2026-03": true });
});

test("failed validation means the plan cannot be built from rejected data", () => {
  const bad = C.validateBackup({ app: C.APP_ID, schemaVersion: 1, createdAt: "2026-04-01T00:00:00.000Z", income: [{ id: "x" }], expenses: [], support: [] });
  assert.strictEqual(bad.ok, false);
  assert.strictEqual(bad.data, undefined);
});

test("CSV exports keep currencies in separate, labelled columns", () => {
  const d = sample();
  const income = C.incomeCSV(d);
  const expenses = C.expensesCSV(d);
  const support = C.supportCSV(d);
  assert.ok(income.includes("amount_rm") && !income.includes("amount_bdt"));
  assert.ok(expenses.includes("amount_rm") && !expenses.includes("amount_bdt"));
  assert.ok(support.includes("amount_bdt") && !support.includes("amount_rm"));
  assert.ok(income.includes("3000.00"));
  assert.ok(support.includes("15000.00"));
  const monthly = C.monthlyCSV(d, { "2026-03": true });
  assert.ok(monthly.includes("income_rm") && monthly.includes("family_support_bdt"));
  assert.ok(monthly.includes("2026-03,3000.00,450.50,2549.50,15000.00,1,yes"));
});

test("CSV escaping: quotes, commas, newlines and formula injection", () => {
  assert.strictEqual(C.csvCell('He said "hi", ok'), '"He said ""hi"", ok"');
  assert.strictEqual(C.csvCell("=SUM(A1)"), "'=SUM(A1)");
  assert.strictEqual(C.csvCell("line1\nline2"), '"line1\nline2"');
  assert.strictEqual(C.csvCell(null), "");
});

test("escapeHtml neutralises markup", () => {
  assert.strictEqual(C.escapeHtml('<img src=x onerror="a()">'), "&lt;img src=x onerror=&quot;a()&quot;&gt;");
});

test("no automatic conversion: no exchange-rate function or RM/BDT mixing in API", () => {
  const names = Object.keys(C).join(" ").toLowerCase();
  assert.ok(!/rate|convert|exchange/.test(names));
  const s = C.monthSummary(sample(), "2026-03", {});
  assert.ok(!("totalMinor" in s));
});

console.log(results.join("\n"));
console.log(`\n${passed}/${results.length} tests passed`);
process.exit(passed === results.length ? 0 : 1);
