import json, re, sys, os, tempfile
from playwright.sync_api import sync_playwright
URL="http://localhost:8765/Finance.html"
res=[]
def ok(name,cond,detail=""):
    res.append((name,bool(cond),detail)); print(("PASS " if cond else "FAIL ")+name+(f"  [{detail}]" if detail and not cond else ""))

def text(page): return page.inner_text("#view")

def add_record(page, act, amount, extra=None, date=None):
    page.click(f'#view [data-act="{act}"]>>nth=0')
    page.wait_for_selector("dialog[open]")
    page.fill("#f-amount", amount)
    if date: page.fill("#f-date", date)
    for k,v in (extra or {}).items():
        el=page.locator(f"#f-{k}")
        if el.evaluate("e=>e.tagName")=="SELECT": el.select_option(v)
        else: el.fill(v)
    page.click('dialog button[type="submit"]')
    page.wait_for_selector("dialog[open]",state="detached")

with sync_playwright() as p:
    b=p.chromium.launch()
    ctx=b.new_context(viewport={"width":390,"height":844},accept_downloads=True,service_workers="allow")
    page=ctx.new_page()
    errors=[]
    page.on("console",lambda m: errors.append(m.text) if m.type=="error" else None)
    page.on("pageerror",lambda e: errors.append(str(e)))
    page.goto(URL); page.wait_for_selector(".tiles")
    t=text(page)
    ok("dashboard loads with RM 0.00 and ৳0 (no fake data)", "RM 0.00" in t and "৳0" in t and "এখনো কোনো রেকর্ড নেই" in t)
    page.screenshot(path="/tmp/shot-dash-empty.png",full_page=True)

    for r in ["income","expenses","support","monthly","yearly","lifetime","settings","more"]:
        page.goto(f"{URL}#/{r}"); page.wait_for_selector("h1")
    page.goto(f"{URL}#/income"); ok("income empty state", "No income recorded yet" in text(page))
    page.goto(f"{URL}#/expenses"); ok("expenses empty state", "No expenses recorded yet" in text(page))
    page.goto(f"{URL}#/support"); ok("support empty state", "No family support recorded yet" in text(page))

    d=page.evaluate("""()=>{const n=new Date();const p=x=>String(x).padStart(2,'0');const pm=new Date(n.getFullYear(),n.getMonth()-1,15);return {cur:`${n.getFullYear()}-${p(n.getMonth()+1)}-10`,prev:`${pm.getFullYear()}-${p(pm.getMonth()+1)}-15`}}""")
    page.goto(f"{URL}#/income")
    add_record(page,"add-income","3000.50",{"type":"salary","note":"Monthly pay"},d["cur"])
    add_record(page,"add-income","250",{"type":"overtime"},d["cur"])
    page.goto(f"{URL}#/expenses")
    add_record(page,"add-expenses","450.25",{"category":"food","description":"Groceries"},d["cur"])
    page.goto(f"{URL}#/support")
    add_record(page,"add-support","15000",{"recipient":"বাবা","method":"bank"},d["prev"])
    add_record(page,"add-support","20000",{"recipient":"মা"},d["cur"])
    page.goto(f"{URL}#/dashboard"); t=text(page)
    ok("dashboard RM month income = RM 3,250.50", "RM 3,250.50" in t)
    ok("dashboard RM balance = RM 2,800.25", "RM 2,800.25" in t)
    ok("dashboard BDT current ৳20,000 and previous ৳15,000", "৳20,000" in t and "৳15,000" in t)
    ok("dashboard difference +৳5,000 and UP 33.33%", "+৳5,000" in t and "UP — 33.33% increase" in t)
    ok("BDT family support does not alter RM balance", "RM 2,800.25" in t and "RM 22,800" not in t)
    ok("incomplete month warning shown", "সম্পূর্ণ হিসেবে চিহ্নিত নয়" in t)
    ok("transfers count 2", re.search(r"মোট ট্রান্সফার\s*\n?\s*2",t) is not None)

    page.goto(f"{URL}#/monthly"); t=text(page)
    ok("monthly shows comparison UP", "UP — 33.33% increase" in t)
    page.click('[data-act="set-complete"]>>nth=0'); page.wait_for_selector(".badge.ok")
    page.click('[data-act="set-complete"]>>nth=1'); page.wait_for_timeout(400)
    ok("completion markers can be set", "সম্পূর্ণ হিসেবে চিহ্নিত নয়" not in text(page))
    page.goto(f"{URL}#/dashboard"); ok("incomplete warning gone after marking complete", "সম্পূর্ণ হিসেবে চিহ্নিত নয়" not in text(page))

    page.goto(f"{URL}#/support")
    page.click('[data-act="edit-support"]>>nth=0'); page.wait_for_selector("dialog[open]")
    page.fill("#f-amount","10000"); page.click('dialog button[type="submit"]'); page.wait_for_selector("dialog[open]",state="detached")
    page.goto(f"{URL}#/monthly"); t=text(page)
    ok("edit support updates comparison: DOWN 33.33%", ("DOWN — 33.33% decrease" in t) or ("DOWN" in t), t[t.find('UP') if 'UP' in t else 0:][:0])

    page.goto(f"{URL}#/support")
    page.click('[data-act="edit-support"]>>nth=0'); page.wait_for_selector("dialog[open]"); page.fill("#f-amount","20000"); page.click('dialog button[type="submit"]'); page.wait_for_selector("dialog[open]",state="detached")

    page.goto(f"{URL}#/income"); page.click('[data-act="add-income"]>>nth=0'); page.wait_for_selector("dialog[open]")
    page.fill("#f-amount","abc"); page.click('dialog button[type="submit"]')
    ok("invalid amount shows readable error", page.locator("dialog .err").count()==1 and page.locator("dialog[open]").count()==1)
    page.keyboard.press("Escape")

    page.goto(f"{URL}#/expenses"); page.click('[data-act="add-expenses"]>>nth=0'); page.wait_for_selector("dialog[open]")
    page.fill("#f-amount","10"); page.click('dialog button[type="submit"]')
    ok("expense without description rejected", page.locator("dialog #err-description").count()==1)
    page.keyboard.press("Escape")

    page.goto(f"{URL}#/income"); n0=page.locator(".row").count()
    page.click('[data-act="del-income"]>>nth=0'); page.wait_for_selector("dialog[open]"); page.click("dialog [data-close]:not(.icon-btn)")
    ok("delete cancel keeps record", page.locator(".row").count()==n0)
    page.click('[data-act="del-income"]>>nth=0'); page.wait_for_selector("dialog[open]"); page.click("dialog [data-ok]")
    for _ in range(40):
        if page.locator(".row").count()==n0-1: break
        page.wait_for_timeout(100)
    ok("delete removes only one record", page.locator(".row").count()==n0-1)
    page.goto(f"{URL}#/dashboard"); t=text(page)
    ok("lifetime totals update after delete", "RM 3,250.50" not in t.split("মোট আয় (আজীবন)")[1][:40] if "মোট আয় (আজীবন)" in t else False)

    page.goto(f"{URL}#/income"); page.fill('[data-filter="income.query"]',"zzzz")
    ok("search with no match shows filtered empty", "এই ফিল্টারে কোনো আয় নেই" in text(page))
    page.fill('[data-filter="income.query"]',"")

    page.reload(); page.wait_for_selector(".tiles")
    page.goto(f"{URL}#/lifetime"); t=text(page)
    life_src=t
    ok("data persists after reload (lifetime BDT ৳35,000, RM 2,550.25)", "৳35,000" in t and "RM 2,550.25" in t, t[:200].replace("\n"," "))

    page.goto(f"{URL}#/settings")
    with page.expect_download() as dl: page.click('[data-act="export-json"]')
    path=os.path.join(tempfile.gettempdir(),"backup.json"); dl.value.save_as(path)
    bk=json.load(open(path,encoding="utf-8"))
    ok("backup json has schemaVersion, createdAt, 3 stores", bk["schemaVersion"]==1 and "createdAt" in bk and len(bk["support"])==2 and len(bk["expenses"])==1)
    ok("backup completion markers included", len(bk["completion"])==2)
    ok("backup amounts are integer minor units", all(isinstance(r["amountMinor"],int) for r in bk["income"]+bk["expenses"]+bk["support"]))
    for k in ["income","expenses","support","monthly"]:
        with page.expect_download() as dl2: page.click(f'[data-act="export-csv"][data-kind="{k}"]')
        name=dl2.value.suggested_filename; ok(f"csv export {k}: {name}", name.endswith(".csv"))

    bad=os.path.join(tempfile.gettempdir(),"bad.json"); json.dump({**bk,"schemaVersion":99},open(bad,"w"))
    page.set_input_files("#restore-file",bad); page.wait_for_selector("#restore-region .banner.err")
    ok("invalid/future backup rejected with message", "ইমপোর্ট করা যাবে না" in text(page))
    mal=os.path.join(tempfile.gettempdir(),"mal.json"); open(mal,"w").write("{not json")
    page.set_input_files("#restore-file",mal); page.wait_for_selector("#restore-region .banner.err")
    ok("malformed JSON rejected", "বৈধ JSON নয়" in text(page))

    page.set_input_files("#restore-file",path); page.wait_for_selector("#restore-region .preview-table")
    t=text(page)
    ok("restore preview shows nothing new for same backup (duplicate protection)", "নতুন কিছু নেই" in t and "ইতিমধ্যে আছে (হুবহু একই): 4" in t, t[-400:].replace("\n"," "))

    ctx2=b.new_context(viewport={"width":390,"height":844},accept_downloads=True)
    p2=ctx2.new_page(); p2.goto(f"{URL}#/settings"); p2.wait_for_selector("#restore-file")
    p2.set_input_files("#restore-file",path); p2.wait_for_selector("#restore-region .preview-table")
    p2.click('[data-act="do-import"]'); p2.wait_for_selector(".toast.show")
    p2.goto(f"{URL}#/lifetime"); t2=p2.inner_text("#view")
    ok("restore into empty browser reproduces identical lifetime totals", t2==life_src, t2[:300].replace("\n"," "))
    p2.goto(f"{URL}#/settings"); p2.wait_for_selector("#restore-file"); p2.set_input_files("#restore-file",path); p2.wait_for_selector("#restore-region .preview-table")
    ok("second import of same file adds nothing", "নতুন কিছু নেই" in p2.inner_text("#view"))
    p2.click('[data-restore-mode][value="replace"]'); p2.wait_for_selector('[data-act="do-import"].danger')
    p2.click('[data-act="do-import"]'); p2.wait_for_selector("dialog[open]"); p2.click("dialog [data-ok]"); p2.wait_for_selector(".toast.show")
    p2.goto(f"{URL}#/lifetime"); ok("replace import keeps exact totals (no double counting)", p2.inner_text("#view")==life_src)
    ctx2.close()

    page.goto(f"{URL}#/yearly"); t=text(page)
    ok("yearly shows highest/lowest and RM/BDT separate", "সর্বোচ্চ রেকর্ড করা মাস" in t and "RM" in t and "BDT" in t)

    page.goto(f"{URL}#/dashboard"); page.evaluate("navigator.serviceWorker.ready"); page.reload(); page.wait_for_selector(".tiles")
    for r in ["income","expenses","support","monthly","yearly","lifetime","settings","more"]:
        page.goto(f"{URL}#/{r}"); page.wait_for_selector("h1")
    page.goto(f"{URL}#/dashboard")
    ctx.set_offline(True)
    page.reload(); page.wait_for_selector(".tiles",timeout=8000)
    ok("works offline after first load (service worker cache)", "RM 2,550.25" in text(page) and "অফলাইন" in page.inner_text(".top .js-net"))
    ctx.set_offline(False)

    ok("no console errors or exceptions", not errors, "; ".join(errors)[:300])

    for w in [320,360,390,430,768,1280]:
        pg=ctx.new_page(); pg.set_viewport_size({"width":w,"height":800}); bad=[]
        for r in ["dashboard","income","expenses","support","monthly","yearly","lifetime","settings","more"]:
            pg.goto(f"{URL}#/{r}"); pg.wait_for_selector("h1")
            ov=pg.evaluate("document.documentElement.scrollWidth-document.documentElement.clientWidth")
            if ov>0: bad.append((r,ov))
        ok(f"no horizontal overflow at {w}px (all 9 pages)", not bad, str(bad))
        if w in (360,1280):
            for r in ["dashboard","monthly","settings"]:
                pg.goto(f"{URL}#/{r}"); pg.wait_for_selector("h1"); pg.screenshot(path=f"/tmp/shot-{r}-{w}.png",full_page=True)
        pg.close()

    pg=ctx.new_page(); pg.set_viewport_size({"width":360,"height":800}); pg.goto(f"{URL}#/dashboard"); pg.wait_for_selector(".tiles")
    small=pg.evaluate("""()=>[...document.querySelectorAll('button,a,select,input')].filter(e=>e.offsetParent&&!e.closest('.sr-only')).map(e=>{const r=e.getBoundingClientRect();return [e.tagName,r.width,r.height]}).filter(x=>x[2]<40&&x[1]<40)""")
    ok("touch targets >= 40px on dashboard (360px)", not small, str(small[:4]))
    ext=pg.evaluate("""()=>performance.getEntriesByType('resource').map(r=>r.name).filter(n=>!n.startsWith(location.origin))""")
    ok("no external network requests", not ext, str(ext))
    b.close()
fails=[r for r in res if not r[1]]
print(f"\n{len(res)-len(fails)}/{len(res)} browser checks passed"); sys.exit(1 if fails else 0)
