import {
  db, collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot,
  query, where, serverTimestamp, writeBatch, runTransaction, getDoc
} from "./firebase.js";

const membersCol = collection(db, "kh_members");
const recordsCol = collection(db, "kh_records");

const ICON_KEBAB = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="5" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="19" r="1.5" fill="currentColor" stroke="none"/></svg>`;
const ICON_EDIT = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`;
const ICON_TRASH = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>`;
const ICON_TRASH_LG = ICON_TRASH.replace("<svg ", '<svg class="kh-modal-icon-svg" ');
const ICON_WARNING = `<svg class="kh-modal-icon-svg kh-modal-icon-svg--warn" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
const ICON_SPINNER = `<svg class="kh-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 3a9 9 0 1 0 9 9"/></svg>`;
const ICON_CLOSE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

let appStarted = false;

export function initKhApp(uid){
  if(appStarted) return; 
  appStarted = true;

  let members = [];
  let records = [];
  let membersLoaded = false;
  let recordsLoaded = false;

  const memberChips   = document.getElementById("memberChips");
  const noMemberNote  = document.getElementById("noMemberNote");
  const noMemberWarn  = document.getElementById("noMemberWarn");
  const memberInput   = document.getElementById("memberInput");
  const entryMember   = document.getElementById("entryMember");
  const filterMember  = document.getElementById("filterMember");
  const entryDate     = document.getElementById("entryDate");
  const entryHours    = document.getElementById("entryHours");
  const hoursField    = document.getElementById("hoursField");
  const entryForm     = document.getElementById("entryForm");
  const saveBtn       = entryForm.querySelector(".kh-save-btn");
  const addMemberBtn  = document.getElementById("addMemberBtn");
  const registerLoading = document.getElementById("registerLoading");
  const downloadCsvBtn  = document.getElementById("downloadCsvBtn");
  const downloadPdfBtn  = document.getElementById("downloadPdfBtn");
  const registerGroups  = document.getElementById("registerGroups");
  const summaryMonthSelect = document.getElementById("summaryMonthSelect");
  const currentMonthNameEl  = document.getElementById("currentMonthName");
  const currentMonthHoursEl = document.getElementById("currentMonthHours");
  const previousMonthNameEl  = document.getElementById("previousMonthName");
  const previousMonthHoursEl = document.getElementById("previousMonthHours");

  entryDate.value = new Date().toISOString().slice(0,10);

  function khBounce(el){
    if(!el) return;
    el.classList.remove("kh-bounce");
    void el.offsetWidth; 
    el.classList.add("kh-bounce");
    el.addEventListener("animationend", () => el.classList.remove("kh-bounce"), { once:true });
  }

  async function generateMemberId(name){
    const counterRef = doc(db, "kh_meta", uid);
    const seq = await runTransaction(db, async (tx) => {
      const snap = await tx.get(counterRef);
      const next = (snap.exists() ? (snap.data().memberCount || 0) : 0) + 1;
      tx.set(counterRef, { memberCount: next }, { merge: true });
      return next;
    });
    const prefix = (name || "USER").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12) || "USER";
    return `${prefix}-${String(seq).padStart(4, "0")}`;
  }

  const CHIP_COLORS = ["chip-mint","chip-sky","chip-coral","chip-violet","chip-amber","chip-indigo","chip-rose","chip-teal"];
  const backfillingIds = new Set(); 
  function renderMembers(){
    memberChips.innerHTML = members.map((m, i) => `
      <span class="member-chip ${CHIP_COLORS[i % CHIP_COLORS.length]}">
        ${m.name}
        <button class="kh-remove-member" data-id="${m.id}" title="Remove">${ICON_CLOSE}</button>
      </span>`).join("");
    noMemberNote.style.display = members.length ? "none" : "block";
    noMemberWarn.style.display = members.length ? "none" : "block";
    saveBtn.disabled = !members.length;

    const currentEntryVal  = entryMember.value;
    const currentFilterVal = filterMember.value;

    const opts = members.map(m => `<option value="${m.name}">${m.name}</option>`).join("");
    entryMember.innerHTML = opts || `<option value="">— No members —</option>`;
    filterMember.innerHTML = `<option value="All">All</option>` + opts;

    if(members.some(m => m.name === currentEntryVal)) entryMember.value = currentEntryVal;
    if(currentFilterVal === "All" || members.some(m => m.name === currentFilterVal)) filterMember.value = currentFilterVal;

    members.forEach(async m => {
      if(m.memberId || backfillingIds.has(m.id)) return;
      backfillingIds.add(m.id);
      try{
        const newId = await generateMemberId(m.name);
        await updateDoc(doc(db, "kh_members", m.id), { memberId: newId });
      }catch(err){
        console.error("memberId backfill failed for", m.name, err);
        backfillingIds.delete(m.id);
      }
    });
  }

  addMemberBtn.addEventListener("click", async () => {
    khBounce(addMemberBtn);
    const name = memberInput.value.trim();
    if(!name) return;
    if(members.some(m => m.name === name)){ memberInput.value = ""; return; }
    addMemberBtn.disabled = true;
    try{
      const memberId = await generateMemberId(name);
      await addDoc(membersCol, { name, memberId, ownerId: uid, createdAt: serverTimestamp() });
      memberInput.value = "";
    }catch(err){
      console.error(err);
      alert("Failed to add member. Please check your internet connection and try again.");
    }finally{
      addMemberBtn.disabled = false;
    }
  });
  memberInput.addEventListener("keydown", e => {
    if(e.key === "Enter"){ e.preventDefault(); addMemberBtn.click(); }
  });

  memberChips.addEventListener("click", async e => {
    const removeBtn = e.target.closest(".kh-remove-member");
    if(removeBtn){
      const m = members.find(x => x.id === removeBtn.dataset.id);
      if(!m) return;
      if(!confirm(`Remove "${m.name}" from the member list? (Existing records will not be deleted)`)) return;
      khBounce(removeBtn);
      try{
        await deleteDoc(doc(db, "kh_members", m.id));
      }catch(err){
        console.error(err);
        alert("Failed to remove member. Please try again.");
      }
    }
  });

  entryForm.querySelectorAll('input[name="status"]').forEach(radio => {
    radio.addEventListener("change", () => {
      const isLeave = entryForm.querySelector('input[name="status"]:checked').value === "leave";
      entryHours.disabled = isLeave;
      hoursField.style.opacity = isLeave ? .5 : 1;
      if(isLeave) entryHours.value = "";
    });
  });

  function findExistingRecord(date, member){
    return records.find(r => r.date === date && r.member === member);
  }

  function autoFillFromExisting(){
    const existing = findExistingRecord(entryDate.value, entryMember.value);
    if(!existing) return;
    const radio = entryForm.querySelector(`input[name="status"][value="${existing.status}"]`);
    if(radio){ radio.checked = true; }
    const isLeave = existing.status === "leave";
    entryHours.disabled = isLeave;
    hoursField.style.opacity = isLeave ? .5 : 1;
    entryHours.value = isLeave ? "" : existing.hours;
  }
  entryMember.addEventListener("change", autoFillFromExisting);
  entryDate.addEventListener("change", autoFillFromExisting);

  function ensureConfirmModal(){
    let overlay = document.getElementById("khConfirmModalOverlay");
    if(overlay) return overlay;
    overlay = document.createElement("div");
    overlay.id = "khConfirmModalOverlay";
    overlay.className = "kh-modal-overlay";
    overlay.innerHTML = `
      <div class="kh-modal-card">
        <p class="kh-modal-icon">${ICON_TRASH_LG}</p>
        <p class="kh-modal-text" id="khConfirmText"></p>
        <div class="kh-modal-actions">
          <button type="button" class="btn3d btn-coral" id="khConfirmYesBtn">Yes, Confirm</button>
          <button type="button" class="btn3d btn-mint" id="khConfirmNoBtn">Cancel</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    return overlay;
  }
  function askConfirm(message){
    return new Promise(resolve => {
      const overlay = ensureConfirmModal();
      overlay.querySelector("#khConfirmText").textContent = message;
      overlay.style.display = "flex";
      const yesBtn = overlay.querySelector("#khConfirmYesBtn");
      const noBtn  = overlay.querySelector("#khConfirmNoBtn");
      function cleanup(result){
        overlay.style.display = "none";
        yesBtn.removeEventListener("click", onYes);
        noBtn.removeEventListener("click", onNo);
        resolve(result);
      }
      function onYes(){ cleanup(true); }
      function onNo(){ cleanup(false); }
      yesBtn.addEventListener("click", onYes);
      noBtn.addEventListener("click", onNo);
    });
  }

  function ensureDuplicateModal(){
    let overlay = document.getElementById("khDupModalOverlay");
    if(overlay) return overlay;
    overlay = document.createElement("div");
    overlay.id = "khDupModalOverlay";
    overlay.className = "kh-modal-overlay";
    overlay.innerHTML = `
      <div class="kh-modal-card">
        <p class="kh-modal-icon">${ICON_WARNING}</p>
        <p class="kh-modal-text">An attendance record for this member on this date already exists.</p>
        <div class="kh-modal-actions">
          <button type="button" class="btn3d btn-mint" id="khDupUpdateBtn">${ICON_EDIT}Update Record</button>
          <button type="button" class="btn3d btn-coral" id="khDupCancelBtn">Cancel</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    return overlay;
  }
  function askDuplicateAction(){
    return new Promise(resolve => {
      const overlay = ensureDuplicateModal();
      overlay.style.display = "flex";
      const updateBtn = overlay.querySelector("#khDupUpdateBtn");
      const cancelBtn = overlay.querySelector("#khDupCancelBtn");
      function cleanup(result){
        overlay.style.display = "none";
        updateBtn.removeEventListener("click", onUpdate);
        cancelBtn.removeEventListener("click", onCancel);
        resolve(result);
      }
      function onUpdate(){ cleanup("update"); }
      function onCancel(){ cleanup("cancel"); }
      updateBtn.addEventListener("click", onUpdate);
      cancelBtn.addEventListener("click", onCancel);
    });
  }

  entryForm.addEventListener("submit", async e => {
    e.preventDefault();
    if(!members.length) return;
    khBounce(saveBtn);
    const status = entryForm.querySelector('input[name="status"]:checked').value;
    const record = {
      date: entryDate.value,
      member: entryMember.value,
      status: status,
      hours: status === "duty" ? (parseFloat(entryHours.value) || 0) : 0,
      ownerId: uid,
      createdAt: serverTimestamp()
    };

    const existing = findExistingRecord(record.date, record.member);

    saveBtn.disabled = true;
    try{
      if(existing){
        const action = await askDuplicateAction();
        if(action === "cancel"){ return; }
        await updateDoc(doc(db, "kh_records", existing.id), {
          status: record.status,
          hours: record.hours,
          updatedAt: serverTimestamp()
        });
      }else{
        await addDoc(recordsCol, record);
      }
      entryHours.value = "";
    }catch(err){
      console.error(err);
      alert("Failed to save record. Please check your internet connection and try again.");
    }finally{
      saveBtn.disabled = !members.length;
    }
  });

  function currentYearMonth(){
    return new Date().toISOString().slice(0,7);
  }
  function previousYearMonth(){
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().slice(0,7);
  }

 
  function updateMonthBadges(){
    const cur  = currentYearMonth();
    const prev = previousYearMonth();
    const hoursForMonth = ym => records
      .filter(r => r.date.startsWith(ym) && r.status === "duty")
      .reduce((sum, r) => sum + (r.hours || 0), 0);

    if(currentMonthNameEl)  currentMonthNameEl.textContent  = monthLabel(cur);
    if(currentMonthHoursEl) currentMonthHoursEl.textContent = `${hoursForMonth(cur)} hours`;
    if(previousMonthNameEl)  previousMonthNameEl.textContent  = monthLabel(prev);
    if(previousMonthHoursEl) previousMonthHoursEl.textContent = `${hoursForMonth(prev)} hours`;
  }

  function populateSummaryMonthOptions(){
    if(!summaryMonthSelect) return;
    const cur  = currentYearMonth();
    const prev = previousYearMonth();
    const monthSet = new Set(records.map(r => r.date.slice(0,7)));
    monthSet.add(cur);
    const months = Array.from(monthSet).sort((a,b) => b.localeCompare(a));

    const previouslySelected = summaryMonthSelect.value;
    summaryMonthSelect.innerHTML = months.map(ym => {
      let label = monthLabel(ym);
      if(ym === cur) label = `Current Month — ${label}`;
      else if(ym === prev) label = `Previous Month — ${label}`;
      return `<option value="${ym}">${label}</option>`;
    }).join("");

    if(months.includes(previouslySelected)) summaryMonthSelect.value = previouslySelected;
    else summaryMonthSelect.value = cur;
  }

  function renderSummary(){
    const tbody = document.querySelector("#summaryTable tbody");
    const noSummaryNote = document.getElementById("noSummaryNote");
    const selectedYm = (summaryMonthSelect && summaryMonthSelect.value) || currentYearMonth();
    const monthRecords = records.filter(r => r.date.startsWith(selectedYm));

    if(!monthRecords.length){
      tbody.innerHTML = "";
      noSummaryNote.textContent = "No records for this month yet.";
      noSummaryNote.style.display = "block";
      return;
    }
    noSummaryNote.style.display = "none";
    const byMember = {};
    monthRecords.forEach(r => {
      if(!byMember[r.member]) byMember[r.member] = { days:0, leaves:0, hours:0 };
      if(r.status === "duty"){ byMember[r.member].days++; byMember[r.member].hours += r.hours; }
      else{ byMember[r.member].leaves++; }
    });
    tbody.innerHTML = Object.keys(byMember).map(name => {
      const d = byMember[name];
      const m = members.find(x => x.name === name);
      const advanceVal = m && typeof m.advance === "number" ? m.advance : 0;
      const advanceCell = m
        ? `<div class="kh-advance-wrap">
             <span class="kh-advance-prefix">RM</span>
             <input type="number" class="kh-advance-input" data-id="${m.id}" value="${advanceVal}" step="0.01" min="0" placeholder="0">
           </div>`
        : `<span class="kh-advance-prefix">RM 0</span>`;
      return `<tr><td>${name}</td><td>${d.days}</td><td>${d.leaves}</td><td><strong>${d.hours}</strong></td><td>${advanceCell}</td></tr>`;
    }).join("");
  }

  function refreshSummarySection(){
    updateMonthBadges();
    populateSummaryMonthOptions();
    renderSummary();
  }

  summaryMonthSelect?.addEventListener("change", renderSummary);

  document.querySelector("#summaryTable tbody").addEventListener("change", async e => {
    const input = e.target.closest(".kh-advance-input");
    if(!input) return;
    const val = parseFloat(input.value);
    const safeVal = isNaN(val) ? 0 : val;
    input.disabled = true;
    try{
      await updateDoc(doc(db, "kh_members", input.dataset.id), { advance: safeVal });
    }catch(err){
      console.error(err);
      alert("Failed to save advance. Please try again.");
    }finally{
      input.disabled = false;
    }
  });

  const EN_MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  function toBn(n){ return String(n); }
  function monthLabel(ym){
    const [y, m] = ym.split("-").map(Number);
    return `${EN_MONTHS[m-1]} ${y}`;
  }

  function renderRegister(){
    const noRecordsNote = document.getElementById("noRecordsNote");
    const filter = filterMember.value;
    const filtered = filter === "All" ? records : records.filter(r => r.member === filter);

    if(!filtered.length){
      registerGroups.innerHTML = "";
      noRecordsNote.style.display = "block";
      return;
    }
    noRecordsNote.style.display = "none";

    const groups = {};
    filtered.forEach(r => {
      const ym = r.date.slice(0,7);
      (groups[ym] = groups[ym] || []).push(r);
    });
    const months = Object.keys(groups).sort((a,b) => b.localeCompare(a));

    registerGroups.innerHTML = months.map((ym, idx) => {
      const list = groups[ym].slice().sort((a,b) => b.date.localeCompare(a.date));
      const rows = list.map(r => `
        <tr>
          <td data-label="Date">${r.date}</td>
          <td data-label="Name">${r.member}</td>
          <td class="status-${r.status}" data-label="Status">${r.status === "duty" ? "Present" : "Leave"}</td>
          <td class="hours-cell" data-label="Hours">${r.status === "duty" ? r.hours : "—"}</td>
          <td class="row-actions-cell" data-label="Action">
            <div class="row-actions">
              <button type="button" class="row-menu-btn" data-id="${r.id}" aria-haspopup="true" aria-expanded="false" aria-label="Row actions">${ICON_KEBAB}</button>
              <div class="row-actions-menu" role="menu">
                <button type="button" class="row-action-edit" role="menuitem" data-id="${r.id}" data-member="${r.member}" data-date="${r.date}">${ICON_EDIT}Edit</button>
                <button type="button" class="row-action-delete" role="menuitem" data-id="${r.id}">${ICON_TRASH}Delete</button>
              </div>
            </div>
          </td>
        </tr>`).join("");
      return `
        <details class="kh-month-group"${idx === 0 ? " open" : ""}>
          <summary class="kh-month-summary">
            <span class="kh-month-label">${monthLabel(ym)}</span>
            <span class="kh-month-count">${list.length} entries</span>
            <button type="button" class="btn3d btn-danger kh-month-delete" data-ym="${ym}">${ICON_TRASH}Delete This Month</button>
          </summary>
          <div class="table-wrap">
            <table class="kh-table">
              <thead><tr><th>Date</th><th>Name</th><th>Status</th><th>Hours</th><th></th></tr></thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </details>`;
    }).join("");
  }

  async function deleteMonthRecords(ym, btn){
    const monthRecords = records.filter(r => r.date.startsWith(ym));
    if(!monthRecords.length) return;

    const ok = await askConfirm(
      `All ${monthRecords.length} entries for "${monthLabel(ym)}" will be permanently deleted. This action cannot be undone.`
    );
    if(!ok) return;

    if(btn) btn.disabled = true;
    try{
      const chunkSize = 400;
      for(let i = 0; i < monthRecords.length; i += chunkSize){
        const batch = writeBatch(db);
        monthRecords.slice(i, i + chunkSize).forEach(r => batch.delete(doc(db, "kh_records", r.id)));
        await batch.commit();
      }
    }catch(err){
      console.error(err);
      alert("Failed to delete this month's records. Please try again.");
    }finally{
      if(btn) btn.disabled = false;
    }
  }

  function closeAllRowMenus(){
    registerGroups.querySelectorAll(".row-actions-menu.open").forEach(m => m.classList.remove("open"));
    registerGroups.querySelectorAll('.row-menu-btn[aria-expanded="true"]').forEach(b => b.setAttribute("aria-expanded", "false"));
  }
  document.addEventListener("click", e => {
    if(!e.target.closest(".row-actions")) closeAllRowMenus();
  });

  registerGroups.addEventListener("click", async e => {
    const menuBtn = e.target.closest(".row-menu-btn");
    if(menuBtn){
      const menu = menuBtn.nextElementSibling;
      const willOpen = !menu.classList.contains("open");
      closeAllRowMenus();
      if(willOpen){
        menu.classList.add("open");
        menuBtn.setAttribute("aria-expanded", "true");
      }
      return;
    }

    const editBtn = e.target.closest(".row-action-edit");
    if(editBtn){
      closeAllRowMenus();
      entryMember.value = editBtn.dataset.member;
      entryDate.value = editBtn.dataset.date;
      autoFillFromExisting();
      entryForm.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const deleteBtn = e.target.closest(".row-action-delete");
    if(deleteBtn){
      closeAllRowMenus();
      const ok = await askConfirm("Delete this entry?");
      if(!ok) return;
      khBounce(deleteBtn);
      try{
        await deleteDoc(doc(db, "kh_records", deleteBtn.dataset.id));
      }catch(err){
        console.error(err);
        alert("Failed to delete entry. Please try again.");
      }
      return;
    }

    const monthDeleteBtn = e.target.closest(".kh-month-delete");
    if(monthDeleteBtn){
      e.preventDefault();
      e.stopPropagation();
      khBounce(monthDeleteBtn);
      await deleteMonthRecords(monthDeleteBtn.dataset.ym, monthDeleteBtn);
    }
  });

  filterMember.addEventListener("change", renderRegister);

  downloadCsvBtn.addEventListener("click", () => {
    khBounce(downloadCsvBtn);
    const ym = currentYearMonth();
    const filter = filterMember.value;
    const monthRecords = records
      .filter(r => r.date.startsWith(ym))
      .filter(r => filter === "All" || r.member === filter)
      .slice().sort((a,b) => a.date.localeCompare(b.date));

    if(!monthRecords.length){
      alert("No records for this month yet.");
      return;
    }

    const header = ["Date","Name","Status","Hours"];
    const rows = monthRecords.map(r => [
      r.date,
      r.member,
      r.status === "duty" ? "Present" : "Leave",
      r.status === "duty" ? r.hours : ""
    ]);
    const csvContent = [header, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g,'""')}"`).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance-report-${ym}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  downloadPdfBtn.addEventListener("click", async () => {
    if(typeof window.html2canvas === "undefined" || typeof window.jspdf === "undefined"){
      alert("PDF generation library failed to load. Please check your internet connection and try again.");
      return;
    }

    khBounce(downloadPdfBtn);
    const ym = currentYearMonth();
    const filter = filterMember.value;
    const monthRecords = records
      .filter(r => r.date.startsWith(ym))
      .filter(r => filter === "All" || r.member === filter)
      .slice().sort((a,b) => a.date.localeCompare(b.date));

    if(!monthRecords.length){
      alert("No records for this month yet.");
      return;
    }

    downloadPdfBtn.disabled = true;
    const originalLabel = downloadPdfBtn.innerHTML;
    downloadPdfBtn.innerHTML = `${ICON_SPINNER}Generating PDF...`;

    try{
      await generatePdfReport(ym, monthRecords);
    }catch(err){
      console.error(err);
      alert("Failed to generate PDF. Please try again.");
    }finally{
      downloadPdfBtn.disabled = false;
      downloadPdfBtn.innerHTML = originalLabel;
    }
  });

  async function generatePdfReport(ym, monthRecords){
    const byMember = {};
    monthRecords.forEach(r => {
      if(!byMember[r.member]) byMember[r.member] = { present:0, absent:0, hours:0 };
      if(r.status === "duty"){ byMember[r.member].present++; byMember[r.member].hours += (r.hours || 0); }
      else{ byMember[r.member].absent++; }
    });
    const memberNames = Object.keys(byMember).sort((a,b) => a.localeCompare(b));

    const summaryRowsHtml = memberNames.map(name => {
      const d = byMember[name];
      const total = d.present + d.absent;
      const pct = total > 0 ? Math.round((d.present / total) * 100) : 0;
      return `
        <tr>
          <td class="pdf-td pdf-td-left">${escapeHtml(name)}</td>
          <td class="pdf-td pdf-td-center">${toBn(d.present)}</td>
          <td class="pdf-td pdf-td-center">${toBn(d.absent)}</td>
          <td class="pdf-td pdf-td-center">${toBn(d.hours)}</td>
          <td class="pdf-td pdf-td-center">${toBn(pct)}%</td>
        </tr>`;
    }).join("");

    const detailRowsHtml = monthRecords
      .slice().sort((a,b) => a.date.localeCompare(b.date))
      .map(r => `
        <tr>
          <td class="pdf-td pdf-td-left">${escapeHtml(r.date)}</td>
          <td class="pdf-td pdf-td-left">${escapeHtml(r.member)}</td>
          <td class="pdf-td pdf-td-left">${r.status === "duty" ? "Present" : "Leave"}</td>
          <td class="pdf-td pdf-td-center">${r.status === "duty" ? toBn(r.hours) : "—"}</td>
        </tr>`).join("");

    const totalPresent = memberNames.reduce((sum,n) => sum + byMember[n].present, 0);
    const totalAbsent  = memberNames.reduce((sum,n) => sum + byMember[n].absent, 0);
    const generatedAt = new Date().toLocaleString("en-US", { dateStyle:"medium", timeStyle:"short" });

    const wrap = document.createElement("div");
    wrap.id = "pdfReportRoot";
    wrap.style.cssText = "position:fixed; left:-99999px; top:0; width:800px; background:#fff; padding:32px 30px; font-family:'Hind Siliguri','Noto Sans Bengali',sans-serif; color:#1B2A45; display:flex; flex-direction:column;";
    wrap.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; border-bottom:2px solid #0E6E5C; padding-bottom:16px; margin-bottom:24px;">
        <div style="display:flex; align-items:center; gap:14px;">
          <img src="masum-logo.webp" style="height:50px; object-fit:contain;" crossorigin="anonymous">
          <div style="font-size:13px; font-weight:600; color:#1B2A45; white-space:nowrap;">WorkTrack — Attendance Management System</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:19px; font-weight:700; color:#0E6E5C; letter-spacing:.2px;">Attendance Report</div>
          <div style="font-size:13px; color:#666; margin-top:2px;">${monthLabel(ym)}</div>
        </div>
      </div>

      <table class="pdf-table" style="margin-bottom:26px;">
        <thead>
          <tr>
            <th class="pdf-th pdf-th-left">Name</th>
            <th class="pdf-th">Present</th>
            <th class="pdf-th">Absent</th>
            <th class="pdf-th">Total Hours</th>
            <th class="pdf-th">Attendance Rate</th>
          </tr>
        </thead>
        <tbody>${summaryRowsHtml}</tbody>
        <tfoot>
          <tr class="pdf-tfoot-row">
            <td class="pdf-td pdf-td-left" style="font-weight:700;">Total</td>
            <td class="pdf-td pdf-td-center" style="font-weight:700;">${toBn(totalPresent)}</td>
            <td class="pdf-td pdf-td-center" style="font-weight:700;">${toBn(totalAbsent)}</td>
            <td class="pdf-td" colspan="2"></td>
          </tr>
        </tfoot>
      </table>

      <div style="font-size:14px; font-weight:700; color:#0E6E5C; margin-bottom:10px;">Daily Details</div>
      <table class="pdf-table" style="font-size:12px;">
        <thead>
          <tr>
            <th class="pdf-th pdf-th-left">Date</th>
            <th class="pdf-th pdf-th-left">Name</th>
            <th class="pdf-th pdf-th-left">Status</th>
            <th class="pdf-th">Hours</th>
          </tr>
        </thead>
        <tbody>${detailRowsHtml}</tbody>
      </table>

      <div style="flex:1;"></div>

      <div style="margin-top:28px; padding-top:12px; border-top:1px solid #ccc; font-size:10.5px; color:#666; display:flex; justify-content:space-between; align-items:center;">
        <span>masumcpex.com&nbsp;&nbsp;|&nbsp;&nbsp;contact@masumcpex.com&nbsp;&nbsp;|&nbsp;&nbsp;+601133192963</span>
        <span>Generated: ${escapeHtml(generatedAt)}</span>
      </div>
    `;

    const style = document.createElement("style");
    style.textContent = `
      #pdfReportRoot .pdf-table{ width:100%; border-collapse:collapse; font-size:13px; }
      #pdfReportRoot .pdf-th{
        background:#0E6E5C; color:#fff; padding:10px 8px; text-align:center;
        vertical-align:middle; font-weight:600; border:1px solid #0A5347;
      }
      #pdfReportRoot .pdf-th-left{ text-align:left; }
      #pdfReportRoot .pdf-td{
        padding:9px 8px; text-align:center; vertical-align:middle;
        border:1px solid #e2e2e2; line-height:1.4;
      }
      #pdfReportRoot .pdf-td-left{ text-align:left; }
      #pdfReportRoot .pdf-td-center{ text-align:center; }
      #pdfReportRoot .pdf-tfoot-row{ background:#F1F5F9; }
      #pdfReportRoot tr{ height:38px; }
    `;
    document.body.appendChild(style);
    document.body.appendChild(wrap);

    try{
      const canvas = await window.html2canvas(wrap, { scale:2, useCORS:true, backgroundColor:"#ffffff" });
      const { jsPDF } = window.jspdf;

      const A4_WIDTH_MM  = 210;
      const A4_HEIGHT_MM = 297;
      const imgWidthMM  = A4_WIDTH_MM;
      const imgHeightMM = (canvas.height * imgWidthMM) / canvas.width;
      const imgData = canvas.toDataURL("image/jpeg", 0.95);

      if(imgHeightMM <= A4_HEIGHT_MM){
        const pdf = new jsPDF({ orientation:"portrait", unit:"mm", format:[imgWidthMM, imgHeightMM] });
        pdf.addImage(imgData, "JPEG", 0, 0, imgWidthMM, imgHeightMM);
        pdf.save(`attendance-report-${ym}.pdf`);
      }else{
        const pdf = new jsPDF({ orientation:"portrait", unit:"mm", format:"a4" });
        let heightLeft = imgHeightMM;
        let position = 0;
        pdf.addImage(imgData, "JPEG", 0, position, imgWidthMM, imgHeightMM);
        heightLeft -= A4_HEIGHT_MM;
        while(heightLeft > 0){
          position = heightLeft - imgHeightMM;
          pdf.addPage();
          pdf.addImage(imgData, "JPEG", 0, position, imgWidthMM, imgHeightMM);
          heightLeft -= A4_HEIGHT_MM;
        }
        pdf.save(`attendance-report-${ym}.pdf`);
      }
    }finally{
      document.body.removeChild(wrap);
      document.body.removeChild(style);
    }
  }

  function escapeHtml(str){
    return String(str)
      .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;").replace(/'/g,"&#039;");
  }

  function updateLoadingState(){
    if(membersLoaded && recordsLoaded){
      registerLoading.style.display = "none";
    }
  }

  renderMembers();
  refreshSummarySection();
  renderRegister();

  const myMembersQuery = query(membersCol, where("ownerId", "==", uid));
  const myRecordsQuery = query(recordsCol, where("ownerId", "==", uid));

  onSnapshot(myMembersQuery, snapshot => {
    members = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      .sort((a,b) => (a.name || "").localeCompare(b.name || "", "bn"));
    membersLoaded = true;
    renderMembers();
    refreshSummarySection();
    renderRegister();
    updateLoadingState();
  }, err => {
    console.error(err);
    registerLoading.textContent = "Failed to load data. Please check your internet connection.";
  });

  onSnapshot(myRecordsQuery, snapshot => {
    records = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    recordsLoaded = true;
    refreshSummarySection();
    renderRegister();
    updateLoadingState();
  }, err => {
    console.error(err);
    registerLoading.textContent = "Failed to load data. Please check your internet connection.";
  });
}
