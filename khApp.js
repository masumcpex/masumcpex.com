import {
  db, collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot,
  query, where, serverTimestamp, writeBatch, runTransaction, getDoc, setDoc, getDocs
} from "./firebase.js";

const membersCol = collection(db, "kh_members");
const recordsCol = collection(db, "kh_records");
const usersCol   = collection(db, "kh_users");

const ICON_KEBAB = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="5" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="19" r="1.5" fill="currentColor" stroke="none"/></svg>`;
const ICON_EDIT = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`;
const ICON_TRASH = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>`;
const ICON_TRASH_LG = ICON_TRASH.replace("<svg ", '<svg class="kh-modal-icon-svg" ');
const ICON_WARNING = `<svg class="kh-modal-icon-svg kh-modal-icon-svg--warn" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
const ICON_SPINNER = `<svg class="kh-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 3a9 9 0 1 0 9 9"/></svg>`;
const ICON_CLOSE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
const ICON_CHECK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;
const ICON_INFO = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
const ICON_USER = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-6 8-6s8 2 8 6"/></svg>`;
const ICON_DOC = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>`;
const ICON_SETTINGS = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`;
const ICON_LOGOUT = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`;
const ICON_EYE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/></svg>`;
const ICON_CHEVRON_RIGHT = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;

let appStarted = false;

const ICON_CHEVRON_UP = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>`;
const ICON_TABLE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M3 15h18M9 4v16"/></svg>`;

/* ===== Attendance Register (Month → Date → Members) — styles live here so the whole feature ships in ONE file ===== */
function injectRegisterStyles(){
  if(document.getElementById("khRegisterStyles")) return;
  const st = document.createElement("style");
  st.id = "khRegisterStyles";
  st.textContent = `
.kh-reg-month-menu{
  margin-left:auto; display:inline-flex; align-items:center; justify-content:center;
  width:40px; height:40px; padding:0; border-radius:10px; cursor:pointer;
  border:1px solid var(--line,#E5E7EB); background:#fff; color:var(--muted,#667085);
}
.kh-reg-month-menu svg{ width:20px; height:20px; }
.kh-reg-month > .kh-month-summary{ gap:6px 12px; }
.kh-reg-month .kh-month-label{ order:1; }
.kh-reg-month .kh-reg-month-menu{ order:2; }
.kh-reg-brk{ order:3; flex-basis:100%; height:0; }
.kh-reg-month .kh-month-count{ order:4; margin-left:22px; }
@media (min-width:621px){
  .kh-reg-brk{ display:none; }
  .kh-reg-month .kh-month-count{ order:2; margin-left:0; }
  .kh-reg-month .kh-reg-month-menu{ order:3; }
}
.kh-reg-month-menu:hover, .kh-reg-month-menu:focus-visible{ background:#F3F6F9; color:#173B63; outline:none; }

.kh-reg-days{ padding:0 8px 10px; display:flex; flex-direction:column; gap:10px; }
.kh-reg-day{
  background:#fff; border:1px solid var(--line,#E5E7EB); border-radius:14px;
  box-shadow:var(--shadow,0 1px 3px rgba(16,24,40,.06)); overflow:hidden;
}
.kh-reg-day[open]{ border-color:#BFD0E4; }
.kh-reg-day-sum{
  display:flex; align-items:center; gap:10px; padding:12px; min-height:64px;
  cursor:pointer; list-style:none; -webkit-tap-highlight-color:transparent;
}
.kh-reg-day-sum::-webkit-details-marker{ display:none; }
.kh-reg-day-main{ flex:1; min-width:0; display:flex; flex-direction:column; gap:3px; }
.kh-reg-day-title{ font-weight:800; font-size:1rem; color:var(--wt-navy,#173B63); }
.kh-reg-day-meta{ font-size:.83rem; font-weight:600; color:var(--muted,#667085); line-height:1.35; }
.kh-reg-ok{ color:#0F766A; }
.kh-reg-lv{ color:#9C6B0F; }
.kh-reg-chev{
  flex-shrink:0; width:30px; height:30px; display:flex; align-items:center; justify-content:center;
  color:#667085; border-radius:50%; background:#F3F6F9; transition:transform .2s ease;
}
.kh-reg-chev svg{ width:18px; height:18px; }
.kh-reg-day[open] .kh-reg-chev{ transform:rotate(90deg); }

.kh-reg-day-body{ border-top:1px solid var(--line-soft,#EEF1F4); background:#FBFCFD; padding:2px 12px 8px; }
.kh-reg-list{ list-style:none; margin:0; padding:0; }
.kh-reg-row{
  display:grid; grid-template-columns:36px 1fr auto;
  grid-template-areas:"av name hours" "av badge acts";
  column-gap:10px; row-gap:4px; align-items:center;
  padding:10px 0; border-bottom:1px solid var(--line-soft,#EEF1F4);
}
.kh-reg-row:last-child{ border-bottom:none; }
.kh-reg-avatar{
  grid-area:av; width:36px; height:36px; border-radius:50%; color:#fff;
  display:flex; align-items:center; justify-content:center; font-weight:800; font-size:.95rem;
}
.kh-reg-name{
  grid-area:name; font-weight:700; font-size:1rem; color:var(--ink,#172033);
  overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
}
.kh-reg-hours{ grid-area:hours; text-align:right; font-weight:800; font-size:1.05rem; color:#173B63; }
.kh-reg-hours.is-off{ color:#98A2B3; font-weight:600; }
.kh-reg-badge{
  grid-area:badge; justify-self:start; display:inline-flex; align-items:center;
  padding:3px 11px; border-radius:999px; font-size:.78rem; font-weight:700;
}
.kh-reg-badge--duty{ background:rgba(21,154,134,.12); color:#0F766A; }
.kh-reg-badge--leave{ background:rgba(217,154,36,.14); color:#9C6B0F; }
.kh-reg-actions{ grid-area:acts; justify-self:end; display:flex; gap:6px; }
.kh-reg-act{
  width:40px; height:40px; padding:0; border-radius:10px; cursor:pointer;
  display:inline-flex; align-items:center; justify-content:center;
  border:1px solid var(--line,#E5E7EB); background:#fff; color:#475467;
}
.kh-reg-act svg{ width:18px; height:18px; }
.kh-reg-act:hover, .kh-reg-act:focus-visible{ background:#F3F6F9; outline:none; }
.kh-reg-act.row-action-delete{ color:#C0392B; border-color:#F1C9C5; }
.kh-reg-act.row-action-delete:hover{ background:#FEF2F2; }
.kh-reg-hide{
  display:flex; align-items:center; justify-content:center; gap:6px; width:100%;
  min-height:42px; margin-top:4px; border:none; border-radius:10px; background:transparent;
  color:#173B63; font-weight:700; font-size:.88rem; font-family:inherit; cursor:pointer;
}
.kh-reg-hide svg{ width:16px; height:16px; }
.kh-reg-hide:hover{ background:#EEF3F8; }

@media (min-width:621px){
  .kh-reg-days{ padding:0 14px 14px; gap:12px; }
  .kh-reg-day-sum{ padding:14px 18px; }
  .kh-reg-day-body{ padding:4px 18px 10px; }
  .kh-reg-row{
    grid-template-columns:36px 1fr 120px 80px auto;
    grid-template-areas:"av name badge hours acts";
  }
}

.kh-reg-sheet-overlay{ align-items:flex-end; padding:0; }
.kh-reg-sheet{
  max-width:440px; text-align:left; padding:1.2rem 1.1rem 1.1rem;
  border-radius:18px 18px 0 0;
}
.kh-reg-sheet-title{ margin:0; font-weight:800; font-size:1.08rem; color:#173B63; }
.kh-reg-sheet-sub{ margin:2px 0 14px; font-size:.85rem; color:#667085; }
.kh-reg-sheet-btn{
  display:flex; align-items:center; gap:12px; width:100%; min-height:48px; padding:0 14px;
  margin-bottom:8px; border:1px solid #E5E7EB; border-radius:12px; background:#fff;
  color:#173B63; font-weight:700; font-size:.95rem; font-family:inherit; cursor:pointer; text-align:left;
}
.kh-reg-sheet-btn svg{ width:20px; height:20px; flex-shrink:0; }
.kh-reg-sheet-btn:hover{ background:#F3F6F9; }
.kh-reg-sheet-btn.is-danger{ color:#C0392B; border-color:#F1C9C5; }
.kh-reg-sheet-btn.is-danger:hover{ background:#FEF2F2; }
.kh-reg-sheet-btn.is-cancel{ justify-content:center; margin-bottom:0; background:#F3F6F9; border-color:transparent; color:#475467; }
@media (min-width:621px){
  .kh-reg-sheet-overlay{ align-items:center; padding:1.2rem; }
  .kh-reg-sheet{ border-radius:18px; }
}
`;
  document.head.appendChild(st);
}

const SHARE_VIEW_URL = "https://masumcpex.com/attendanceview/";
const SHARE_COLLECTION = "attendance_shares";
const REPORT_COLLECTION = "attendance_reports";
const ICON_SHARE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5"/></svg>`;
const ICON_COPY = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>`;
const ICON_BAN = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/></svg>`;
const ICON_FLAG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V4"/><path d="M5 4h11l-1.5 4L16 12H5"/></svg>`;
const REPORT_CATEGORIES = {
  status: "Incorrect attendance status",
  hours: "Incorrect work hours",
  missing: "Missing attendance record",
  leave: "Incorrect leave record",
  duplicate: "Duplicate attendance",
  date: "Incorrect date",
  other: "Other"
};

function injectShareStyles(){
  if(document.getElementById("khShareStyles")) return;
  const st = document.createElement("style");
  st.id = "khShareStyles";
  st.textContent = `
.kh-share-overlay{ align-items:flex-end; padding:0; }
.kh-share-card{
  position:relative; width:100%; max-width:440px; max-height:92vh; overflow-y:auto; text-align:left;
  padding:1.2rem 1.1rem 1.1rem; border-radius:18px 18px 0 0;
}
@media (min-width:621px){
  .kh-share-overlay{ align-items:center; padding:1.2rem; }
  .kh-share-card{ border-radius:18px; }
}
.kh-share-head{ display:flex; align-items:center; gap:10px; margin:0 0 .9rem; padding-right:34px; }
.kh-share-head-ico{
  width:36px; height:36px; border-radius:10px; background:#EAF1F8; color:#173B63;
  display:flex; align-items:center; justify-content:center; flex-shrink:0;
}
.kh-share-head-ico svg{ width:20px; height:20px; }
.kh-share-title{ margin:0; font-size:1.1rem; font-weight:800; color:#173B63; }
.kh-share-row{
  display:flex; justify-content:space-between; align-items:baseline; gap:12px;
  padding:9px 0; border-bottom:1px solid var(--line-soft,#EEF1F4); font-size:.92rem;
}
.kh-share-row span:first-child{ color:#667085; font-weight:600; flex-shrink:0; }
.kh-share-row span:last-child{ color:#172033; font-weight:700; text-align:right; overflow-wrap:anywhere; }
.kh-share-perms{ display:grid; grid-template-columns:1fr; gap:6px; margin:.8rem 0; }
@media (min-width:380px){ .kh-share-perms{ grid-template-columns:1fr 1fr; } }
.kh-share-perm{ display:flex; align-items:center; gap:8px; font-size:.86rem; font-weight:600; color:#344054; }
.kh-share-perm svg{ width:16px; height:16px; flex-shrink:0; }
.kh-share-perm.is-yes svg{ color:#0F766A; }
.kh-share-perm.is-no{ color:#98A2B3; }
.kh-share-perm.is-no svg{ color:#C0392B; }
.kh-dot{ display:inline-block; width:9px; height:9px; border-radius:50%; margin-right:6px; background:#98A2B3; }
.kh-dot.is-on{ background:#16A34A; }
.kh-share-actions{ display:flex; flex-wrap:wrap; gap:10px; margin-top:1rem; }
.kh-share-btn{
  flex:1 1 150px; min-height:48px; display:inline-flex; align-items:center; justify-content:center; gap:8px;
  border-radius:12px; font-weight:700; font-size:.95rem; font-family:inherit; cursor:pointer;
  border:1px solid #173B63; background:#173B63; color:#fff; padding:0 14px;
}
.kh-share-btn svg{ width:18px; height:18px; }
.kh-share-btn.is-ghost{ background:#fff; color:#173B63; }
.kh-share-btn.is-danger{ background:#fff; color:#C0392B; border-color:#F1C9C5; }
.kh-share-btn:disabled{ opacity:.6; cursor:default; }
.kh-share-note{ margin:.8rem 0 0; font-size:.8rem; color:#667085; line-height:1.45; }
.kh-share-manual{ width:100%; margin-top:10px; padding:10px; border:1px solid #D0D5DD; border-radius:10px; font-size:.8rem; }

.kh-rep-head{ display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
.kh-rep-count{ background:#FEF3C7; color:#92400E; font-weight:800; font-size:.8rem; padding:2px 10px; border-radius:999px; }
.kh-rep-list{ display:flex; flex-direction:column; gap:10px; margin-top:12px; }
.kh-rep-item{
  border:1px solid var(--line,#E5E7EB); border-radius:14px; background:#fff; padding:12px 14px;
  display:flex; flex-direction:column; gap:4px;
}
.kh-rep-item b{ color:#173B63; font-size:1rem; overflow-wrap:anywhere; }
.kh-rep-meta{ font-size:.84rem; color:#667085; font-weight:600; }
.kh-rep-msg{
  font-size:.88rem; color:#344054; margin:2px 0 0; overflow-wrap:anywhere;
  display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
}
.kh-rep-item .kh-share-btn{ flex:none; align-self:flex-start; min-height:42px; margin-top:6px; }
.kh-rep-empty{ margin:12px 0 0; color:#667085; font-size:.9rem; }
.kh-rep-toggle{ margin-top:12px; background:none; border:none; color:#173B63; font-weight:700; cursor:pointer; padding:8px 0; font-family:inherit; }
.kh-rep-detail dt{ font-size:.75rem; color:#667085; font-weight:700; text-transform:uppercase; letter-spacing:.04em; margin-top:10px; }
.kh-rep-detail dd{ margin:2px 0 0; font-weight:600; color:#172033; overflow-wrap:anywhere; white-space:pre-wrap; }
`;
  document.head.appendChild(st);
}


const ICON_CHEV_DOWN = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;
const ICON_SEARCH = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>`;
const ICON_FILTER = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5h18l-7 8v6l-4 2v-8z"/></svg>`;
const ICON_CHEV_LEFT = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;

function injectDashboardStyles(){
  if(document.getElementById("khDashStyles")) return;
  const st = document.createElement("style");
  st.id = "khDashStyles";
  st.textContent = `
/* ---------- collapsible sections ---------- */
.kh-sec-toggle{ cursor:pointer; display:flex; align-items:center; justify-content:space-between; gap:10px; user-select:none; -webkit-tap-highlight-color:transparent; }
.kh-sec-toggle:focus-visible{ outline:2px solid #173B63; outline-offset:3px; border-radius:6px; }
.kh-sec-chev{ width:30px; height:30px; flex-shrink:0; display:inline-flex; align-items:center; justify-content:center; border-radius:50%; background:#F3F6F9; color:#667085; transition:transform .2s ease; }
.kh-sec-chev svg{ width:18px; height:18px; }
.kh-collapsed .kh-sec-chev{ transform:rotate(-90deg); }
.kh-collapsed > :not(.kh-sec-head){ display:none !important; }
.kh-sec-head{ margin-bottom:0; }
.kh-collapsible:not(.kh-collapsed) > .kh-sec-head{ margin-bottom:.9rem; }

/* ---------- Attendance Overview ---------- */
.kh-ov-top{ display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap; margin-bottom:12px; }
.kh-ov-top select{ min-height:42px; max-width:100%; }
.kh-ov-grid{ display:grid; grid-template-columns:repeat(2,1fr); gap:10px; }
.kh-ov-tile{ background:#F6F8FA; border:1px solid var(--line,#E5E7EB); border-radius:14px; padding:12px 14px; min-width:0; }
.kh-ov-tile b{ display:block; font-size:1.45rem; line-height:1.2; color:#173B63; font-family:var(--font-display,inherit); }
.kh-ov-tile span{ font-size:.78rem; color:#667085; font-weight:600; }
.kh-ov-tile:last-child:nth-child(odd){ grid-column:1 / -1; }
.kh-ov-bar{ height:6px; border-radius:99px; background:#E5E7EB; overflow:hidden; margin-top:8px; }
.kh-ov-bar i{ display:block; height:100%; background:#159A86; border-radius:99px; }
@media (min-width:700px){ .kh-ov-grid{ grid-template-columns:repeat(5,1fr); } .kh-ov-tile:last-child:nth-child(odd){ grid-column:auto; } }

/* ---------- Calendar ---------- */
.kh-cal-nav{ display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:10px; }
.kh-cal-title{ font-weight:800; color:#173B63; font-size:1.05rem; text-align:center; flex:1; }
.kh-cal-btn{ width:42px; height:42px; border-radius:12px; border:1px solid var(--line,#E5E7EB); background:#fff; color:#475467; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; padding:0; }
.kh-cal-btn svg{ width:18px; height:18px; }
.kh-cal-btn:hover,.kh-cal-btn:focus-visible{ background:#F3F6F9; outline:none; }
.kh-cal-today{ font-size:.78rem; font-weight:700; color:#173B63; background:none; border:none; cursor:pointer; padding:6px 4px; font-family:inherit; }
.kh-cal-grid{ display:grid; grid-template-columns:repeat(7,minmax(0,1fr)); gap:4px; }
.kh-cal-dow{ text-align:center; font-size:.68rem; font-weight:700; color:#98A2B3; text-transform:uppercase; padding:4px 0; }
.kh-cal-cell{ min-height:52px; border:1px solid var(--line-soft,#EEF1F4); border-radius:10px; background:#fff; padding:4px 2px; text-align:center; display:flex; flex-direction:column; align-items:center; gap:1px; cursor:default; font-family:inherit; color:#344054; }
.kh-cal-cell.is-empty{ border-color:transparent; background:transparent; }
button.kh-cal-cell{ cursor:pointer; }
.kh-cal-cell .n{ font-size:.82rem; font-weight:700; }
.kh-cal-cell .p, .kh-cal-cell .l{ font-size:.64rem; font-weight:700; line-height:1.15; }
.kh-cal-cell .p{ color:#0F766A; }
.kh-cal-cell .l{ color:#9C6B0F; }
.kh-cal-cell.has-data{ background:#FBFCFD; }
.kh-cal-cell.is-today{ border-color:#173B63; box-shadow:inset 0 0 0 1px #173B63; }
.kh-cal-cell.is-selected{ background:#EAF1F8; border-color:#173B63; }
.kh-cal-cell:focus-visible{ outline:2px solid #173B63; outline-offset:1px; }
.kh-cal-legend{ display:flex; gap:14px; flex-wrap:wrap; margin:10px 0 0; font-size:.74rem; color:#667085; font-weight:600; }
.kh-cal-legend .p{ color:#0F766A; } .kh-cal-legend .l{ color:#9C6B0F; }
.kh-cal-detail{ margin-top:12px; border-top:1px solid var(--line-soft,#EEF1F4); padding-top:12px; }
.kh-cal-detail h4{ margin:0 0 2px; color:#173B63; font-size:1rem; }
.kh-cal-detail .sub{ margin:0 0 8px; color:#667085; font-size:.82rem; font-weight:600; }
.kh-cal-row{ display:flex; align-items:center; gap:10px; padding:8px 0; border-bottom:1px solid var(--line-soft,#EEF1F4); }
.kh-cal-row:last-child{ border-bottom:none; }
.kh-cal-row .nm{ flex:1; min-width:0; font-weight:700; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.kh-cal-row .h{ min-width:42px; text-align:right; font-weight:800; color:#173B63; }

/* ---------- Register search + filters ---------- */
.kh-reg-tools{ display:flex; flex-direction:column; gap:10px; margin:0 0 12px; }
.kh-reg-search{ position:relative; }
.kh-reg-search svg{ position:absolute; left:12px; top:50%; transform:translateY(-50%); width:18px; height:18px; color:#98A2B3; pointer-events:none; }
.kh-reg-search input{ width:100%; box-sizing:border-box; min-height:46px; padding:0 14px 0 38px; border:1.5px solid #CBD5E1; border-radius:12px; font:inherit; background:#fff; }
.kh-reg-search input:focus{ outline:none; border-color:#173B63; box-shadow:0 0 0 3px rgba(23,59,99,.12); }
.kh-reg-filterbar{ display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
.kh-reg-fbtn{ display:inline-flex; align-items:center; gap:8px; min-height:42px; padding:0 14px; border-radius:12px; border:1px solid var(--line,#E5E7EB); background:#fff; color:#173B63; font-weight:700; font-family:inherit; cursor:pointer; }
.kh-reg-fbtn svg{ width:16px; height:16px; }
.kh-reg-fcount{ background:#173B63; color:#fff; border-radius:99px; font-size:.72rem; padding:1px 8px; }
.kh-reg-clear{ background:none; border:none; color:#C0392B; font-weight:700; cursor:pointer; padding:8px 4px; font-family:inherit; }
.kh-reg-panel{ display:none; grid-template-columns:1fr; gap:10px; padding:12px; border:1px solid var(--line,#E5E7EB); border-radius:14px; background:#FBFCFD; }
.kh-reg-panel.is-open{ display:grid; }
.kh-reg-panel label{ display:flex; flex-direction:column; gap:4px; font-size:.74rem; font-weight:700; color:#667085; text-transform:uppercase; letter-spacing:.04em; }
.kh-reg-panel select, .kh-reg-panel input{ min-height:44px; border:1.5px solid #CBD5E1; border-radius:10px; padding:0 10px; font:inherit; background:#fff; width:100%; box-sizing:border-box; }
.kh-reg-result{ font-size:.82rem; color:#667085; font-weight:600; margin:2px 0 0; }
@media (min-width:621px){ .kh-reg-tools{ flex-direction:row; flex-wrap:wrap; align-items:center; } .kh-reg-search{ flex:1 1 260px; } .kh-reg-panel.is-open{ grid-template-columns:repeat(3,1fr); flex-basis:100%; } .kh-reg-result{ flex-basis:100%; } }

/* ---------- Reports ---------- */
.kh-rep-clear{ display:flex; align-items:center; gap:10px; margin-top:10px; padding:12px 14px; border-radius:12px; background:rgba(21,154,134,.08); color:#0F766A; font-weight:700; }
.kh-rep-clear svg{ width:20px; height:20px; flex-shrink:0; }
.kh-rep-clear small{ display:block; font-weight:500; color:#475467; }
.kh-rep-dot{ display:inline-block; width:9px; height:9px; border-radius:50%; background:#C0392B; margin-right:6px; }

/* ---------- Profile history ---------- */
.kh-ph{ text-align:left; margin-top:14px; }
.kh-ph h4{ margin:0 0 6px; font-size:.95rem; color:#173B63; }
.kh-ph-row{ display:flex; align-items:center; gap:10px; padding:8px 0; border-bottom:1px solid var(--line-soft,#EEF1F4); font-size:.92rem; }
.kh-ph-row .d{ flex:1; font-weight:700; }
.kh-ph-row .h{ min-width:42px; text-align:right; font-weight:800; color:#173B63; }
.kh-ph-more{ width:100%; margin-top:6px; min-height:42px; border:none; border-radius:10px; background:#F3F6F9; color:#173B63; font-weight:700; font-family:inherit; cursor:pointer; }

/* ---------- Monthly Summary: cards on phones (no sideways scrolling) ---------- */
@media (max-width:620px){
  #summaryTable, #summaryTable tbody{ display:block; width:100%; }
  #summaryTable thead{ display:none; }
  #summaryTable tr{ display:grid; grid-template-columns:repeat(3,1fr); gap:6px 8px; padding:12px; margin-bottom:10px; border:1px solid var(--line,#E5E7EB); border-radius:14px; background:#fff; }
  #summaryTable td{ display:block; padding:0; border:none; min-width:0; font-size:.95rem; }
  #summaryTable td::before{ content:attr(data-label); display:block; font-size:.66rem; font-weight:700; color:#98A2B3; text-transform:uppercase; letter-spacing:.04em; }
  #summaryTable td:first-child{ grid-column:1 / -1; font-weight:800; font-size:1.02rem; color:#173B63; }
  #summaryTable td:first-child::before{ display:none; }
  #summaryTable td:last-child{ grid-column:1 / -1; padding-top:6px; border-top:1px solid var(--line-soft,#EEF1F4); }
}
`;
  document.head.appendChild(st);
}

export function initKhApp(uid, isAdmin){
  if(appStarted) return; 
  appStarted = true;
  injectRegisterStyles();
  injectShareStyles();
  injectDashboardStyles();

  const isAdminUser = !!isAdmin;

  let members = [];
  let records = [];
  let membersLoaded = false;
  const backfillingIds = new Set();   // was used but never declared (crashed for members without a memberId)
  let recordsLoaded = false;
  let selectedMemberId = null;

  // Admin-only: every user's data + profiles, kept separate from `members`/`records`
  // above so the admin's own Team Members / Attendance sections behave exactly as before.
  let allMembers = [];
  let allRecords = [];
  let ownerProfiles = {}; // { uid: { email, displayName } }
  let teamModalOpen = false;

  const memberChips   = document.getElementById("memberChips");
  const noMemberNote  = document.getElementById("noMemberNote");
  const noMemberWarn  = document.getElementById("noMemberWarn");
  const memberInput   = document.getElementById("memberInput");
  const entryMember   = document.getElementById("entryMember");
  const filterMember  = document.getElementById("filterMember");
  const entryDate     = document.getElementById("entryDate");
  const entryHours    = document.getElementById("entryHours");
  const entryHoursError = document.getElementById("entryHoursError");
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

  function ensureToastContainer(){
    return document.getElementById("khToastContainer");
  }
  function showToast(message, type){
    const container = ensureToastContainer();
    if(!container) return;
    const toast = document.createElement("div");
    toast.className = "kh-toast" + (type ? ` kh-toast--${type}` : "");
    const icon = type === "error" ? ICON_WARNING.replace('class="kh-modal-icon-svg kh-modal-icon-svg--warn"','class="kh-toast-icon"')
      : type === "warning" ? ICON_WARNING.replace('class="kh-modal-icon-svg kh-modal-icon-svg--warn"','class="kh-toast-icon"')
      : type === "info" ? ICON_INFO.replace('viewBox', 'class="kh-toast-icon" viewBox')
      : ICON_CHECK.replace('viewBox', 'class="kh-toast-icon" viewBox');
    toast.innerHTML = `${icon}<span>${escapeHtmlLocal(message)}</span><button type="button" class="kh-toast-close" aria-label="Close">${ICON_CLOSE}</button>`;
    container.appendChild(toast);
    const remove = () => { toast.remove(); };
    const timer = setTimeout(remove, 4200);
    toast.querySelector(".kh-toast-close").addEventListener("click", () => { clearTimeout(timer); remove(); });
  }
  function escapeHtmlLocal(str){
    return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }

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

  const AVATAR_COLORS = ["#3B82F6","#2ECC71","#F5A623","#9B59B6","#EF6C6C","#14B8A6","#EC4899","#6366F1"];
  function avatarColorFor(id){
    let hash = 0;
    for(let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
    return AVATAR_COLORS[hash % AVATAR_COLORS.length];
  }
  function monthStatsFor(name, ym){
    const monthRecords = records.filter(r => r.member === name && r.date.startsWith(ym));
    let hours = 0, duty = 0, leave = 0;
    monthRecords.forEach(r => {
      if(r.status === "duty"){ duty++; hours += (r.hours || 0); }
      else leave++;
    });
    return { hours, duty, leave };
  }
  // ================= Admin: cross-account overview =================
  function ownerLabelFor(oid){
    const p = ownerProfiles[oid];
    if(p && p.displayName) return p.displayName;
    if(p && p.email) return p.email.split("@")[0];
    return oid ? (oid.slice(0,6) + "…") : "Unknown";
  }
  function ownerEmailFor(oid){
    const p = ownerProfiles[oid];
    return (p && p.email) || "";
  }
  function ownerStatsFor(oid){
    let hours = 0, duty = 0, leave = 0;
    allRecords.forEach(r => {
      if(r.ownerId !== oid) return;
      if(r.status === "duty"){ duty++; hours += (r.hours || 0); }
      else leave++;
    });
    return { hours, duty, leave };
  }
  function otherOwnerIds(){
    const ids = new Set(Object.keys(ownerProfiles));
    allMembers.forEach(m => { if(m.ownerId) ids.add(m.ownerId); });
    allRecords.forEach(r => { if(r.ownerId) ids.add(r.ownerId); });
    ids.delete(uid);
    return Array.from(ids);
  }

  function ensureAdminOverviewUI(){
    if(!isAdminUser) return null;
    let wrap = document.getElementById("khAdminOverview");
    if(wrap) return wrap;
    wrap = document.createElement("div");
    wrap.id = "khAdminOverview";
    wrap.className = "kh-admin-overview";
    wrap.innerHTML = `
      <div class="member-card kh-you-card">
        <div class="member-card-avatar" id="khYouAvatar"></div>
        <div class="member-card-body">
          <span class="kh-you-badge">YOU</span>
          <div class="member-card-name" id="khYouName"></div>
          <div class="member-card-stats" id="khYouStats"></div>
        </div>
      </div>
      <button type="button" class="kh-team-overview-card" id="khTeamOverviewBtn">
        <span class="kh-team-overview-icon">${ICON_USER}</span>
        <span class="kh-team-overview-text">
          <span class="kh-team-overview-title">Team Members</span>
          <span class="kh-team-overview-sub" id="khTeamOverviewCount">0 members</span>
        </span>
        <span class="kh-team-overview-chevron">${ICON_CHEVRON_RIGHT}</span>
      </button>`;
    const anchor = document.getElementById("quickStats");
    if(anchor && anchor.parentNode){
      anchor.parentNode.insertBefore(wrap, anchor);
    }
    wrap.querySelector("#khTeamOverviewBtn").addEventListener("click", openTeamModal);
    return wrap;
  }

  function renderAdminOverview(){
    if(!isAdminUser) return;
    const wrap = ensureAdminOverviewUI();
    if(!wrap) return;
    const myStats = ownerStatsFor(uid);
    const myLabel = ownerLabelFor(uid);
    const avatarEl = wrap.querySelector("#khYouAvatar");
    avatarEl.style.background = avatarColorFor(uid);
    avatarEl.textContent = (myLabel || "?").trim().charAt(0).toUpperCase();
    wrap.querySelector("#khYouName").textContent = myLabel;
    wrap.querySelector("#khYouStats").textContent = `${myStats.hours}h • ${myStats.duty} Duty • ${myStats.leave} Leave`;
    const ids = otherOwnerIds();
    wrap.querySelector("#khTeamOverviewCount").textContent = `${ids.length} member${ids.length === 1 ? "" : "s"}`;
    if(teamModalOpen) renderTeamModalList();
    if(openOwnerDetailId) renderOwnerDetailModal();
  }

  function closeAllTeamRowMenus(root){
    root.querySelectorAll(".kh-team-row-menu.is-open").forEach(m => m.classList.remove("is-open"));
  }

  function ensureTeamModal(){
    let overlay = document.getElementById("khTeamModalOverlay");
    if(overlay) return overlay;
    overlay = document.createElement("div");
    overlay.id = "khTeamModalOverlay";
    overlay.className = "kh-modal-overlay";
    overlay.innerHTML = `
      <div class="kh-modal-card kh-team-modal-card">
        <button type="button" class="kh-modal-x" id="khTeamModalCloseBtn" aria-label="Close">${ICON_CLOSE}</button>
        <h3 class="kh-team-modal-title">Team Members — <span id="khTeamModalCount">0</span></h3>
        <div class="kh-team-modal-list" id="khTeamModalList"></div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener("click", e => { if(e.target === overlay) closeTeamModal(); });
    overlay.querySelector("#khTeamModalCloseBtn").addEventListener("click", closeTeamModal);
    const list = overlay.querySelector("#khTeamModalList");
    list.addEventListener("click", e => {
      const moreBtn = e.target.closest(".kh-team-row-more");
      if(moreBtn){
        const menu = moreBtn.parentElement.querySelector(".kh-team-row-menu");
        const wasOpen = menu.classList.contains("is-open");
        closeAllTeamRowMenus(list);
        if(!wasOpen) menu.classList.add("is-open");
        return;
      }
      const actionBtn = e.target.closest("[data-team-action]");
      if(actionBtn){
        closeAllTeamRowMenus(list);
        const oid = actionBtn.dataset.oid;
        const action = actionBtn.dataset.teamAction;
        if(!oid) return;
        if(action === "profile") openOwnerDetailModal(oid, { editable: false });
        else if(action === "edit") openOwnerDetailModal(oid, { editable: true });
        else if(action === "delete") deleteOwnerAccount(oid);
      }
    });
    document.addEventListener("click", e => {
      if(!e.target.closest(".kh-team-row-actions")) closeAllTeamRowMenus(overlay);
    });
    return overlay;
  }

  function renderTeamModalList(){
    const overlay = ensureTeamModal();
    const ids = otherOwnerIds().sort((a,b) => ownerLabelFor(a).localeCompare(ownerLabelFor(b), "bn"));
    overlay.querySelector("#khTeamModalCount").textContent = ids.length;
    overlay.querySelector("#khTeamModalList").innerHTML = ids.length ? ids.map(oid => {
      const stats = ownerStatsFor(oid);
      const label = ownerLabelFor(oid);
      const email = ownerEmailFor(oid);
      const initial = (label || "?").trim().charAt(0).toUpperCase();
      return `
      <div class="member-card kh-team-row" data-oid="${oid}">
        <div class="member-card-avatar" style="background:${avatarColorFor(oid)}">${escapeHtmlLocal(initial)}</div>
        <div class="member-card-body">
          <div class="member-card-name">${escapeHtmlLocal(label)}</div>
          <div class="member-card-stats">${stats.hours}h • ${stats.duty} Duty • ${stats.leave} Leave${email ? " • " + escapeHtmlLocal(email) : ""}</div>
        </div>
        <div class="member-card-actions kh-team-row-actions">
          <button type="button" class="member-card-icon-btn kh-team-row-view" data-oid="${oid}" data-team-action="profile" title="View" aria-label="View">${ICON_EYE}</button>
          <button type="button" class="member-card-icon-btn kh-team-row-more" title="More" aria-label="More" aria-haspopup="true">${ICON_KEBAB}</button>
          <div class="member-card-menu kh-team-row-menu">
            <button type="button" class="member-card-menu-item" data-oid="${oid}" data-team-action="profile">${ICON_USER}Profile</button>
            <button type="button" class="member-card-menu-item" data-oid="${oid}" data-team-action="edit">${ICON_EDIT}Edit</button>
            <button type="button" class="member-card-menu-item is-danger" data-oid="${oid}" data-team-action="delete">${ICON_TRASH}Delete</button>
          </div>
        </div>
      </div>`;
    }).join("") : `<p class="kh-empty-note">এখনো অন্য কোনো ইউজার নেই।</p>`;
  }

  function openTeamModal(){
    teamModalOpen = true;
    renderTeamModalList();
    ensureTeamModal().style.display = "flex";
  }
  function closeTeamModal(){
    teamModalOpen = false;
    const overlay = document.getElementById("khTeamModalOverlay");
    if(overlay) overlay.style.display = "none";
  }

  async function deleteOwnerAccount(oid){
    const label = ownerLabelFor(oid);
    const mCount = allMembers.filter(m => m.ownerId === oid).length;
    const rCount = allRecords.filter(r => r.ownerId === oid).length;
    const ok = await askConfirm(
      `"${label}" এর ${mCount} জন member ও ${rCount}টি attendance রেকর্ড স্থায়ীভাবে ডিলিট হয়ে যাবে। এটা আর ফিরিয়ে আনা যাবে না — নিশ্চিত?`
    );
    if(!ok) return;
    try{
      const memberIds = allMembers.filter(m => m.ownerId === oid).map(m => m.id);
      const recordIds = allRecords.filter(r => r.ownerId === oid).map(r => r.id);
      const allIds = [
        ...memberIds.map(id => ["kh_members", id]),
        ...recordIds.map(id => ["kh_records", id])
      ];
      const chunkSize = 400;
      for(let i = 0; i < allIds.length; i += chunkSize){
        const batch = writeBatch(db);
        allIds.slice(i, i + chunkSize).forEach(([col, id]) => batch.delete(doc(db, col, id)));
        await batch.commit();
      }
      if(openOwnerDetailId === oid) closeOwnerDetail();
      showToast(`"${label}" এর সব ডেটা ডিলিট হয়েছে।`);
    }catch(err){
      console.error(err);
      showToast("ডিলিট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।", "error");
    }
  }

  // ---- Owner detail modal (Profile = read-only, Edit = full control) ----
  let openOwnerDetailId = null;
  let openOwnerDetailEditable = false;

  function ensureOwnerDetailModal(){
    let overlay = document.getElementById("khOwnerDetailOverlay");
    if(overlay) return overlay;
    overlay = document.createElement("div");
    overlay.id = "khOwnerDetailOverlay";
    overlay.className = "kh-modal-overlay";
    overlay.innerHTML = `
      <div class="kh-modal-card kh-team-modal-card kh-owner-detail-card">
        <button type="button" class="kh-modal-x" id="khOwnerDetailCloseBtn" aria-label="Close">${ICON_CLOSE}</button>
        <h3 class="kh-team-modal-title" id="khOwnerDetailTitle"></h3>
        <div id="khOwnerDetailBody"></div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener("click", e => { if(e.target === overlay) closeOwnerDetail(); });
    overlay.querySelector("#khOwnerDetailCloseBtn").addEventListener("click", closeOwnerDetail);

    // Event delegation: content inside #khOwnerDetailBody is re-rendered often,
    // so all handlers live on the stable overlay instead of being re-bound each time.
    overlay.addEventListener("click", async e => {
      const oid = openOwnerDetailId;
      if(!oid) return;

      const memEdit = e.target.closest(".kh-owner-member-edit");
      if(memEdit){
        await renameOwnerMember(memEdit.dataset.id, memEdit.dataset.name, oid);
        return;
      }
      const memDel = e.target.closest(".kh-owner-member-delete");
      if(memDel){
        const ok = await askConfirm(`"${memDel.dataset.name}" কে ডিলিট করবেন? তার সব attendance রেকর্ডও মুছে যাবে।`);
        if(ok) await deleteOwnerMemberCascade(memDel.dataset.id, memDel.dataset.name, oid);
        return;
      }
      const recEdit = e.target.closest(".kh-owner-record-edit");
      if(recEdit){
        openOwnerRecordEditModal({
          id: recEdit.dataset.id,
          member: recEdit.dataset.member,
          date: recEdit.dataset.date,
          status: recEdit.dataset.status,
          hours: recEdit.dataset.hours
        });
        return;
      }
      const recDel = e.target.closest(".kh-owner-record-delete");
      if(recDel){
        const ok = await askConfirm("এই এন্ট্রিটা ডিলিট করবেন?");
        if(!ok) return;
        try{
          await deleteDoc(doc(db, "kh_records", recDel.dataset.id));
          showToast("Entry deleted successfully.");
        }catch(err){
          console.error(err);
          showToast("Failed to delete entry. Please try again.", "error");
        }
        return;
      }
    });

    overlay.addEventListener("submit", async e => {
      const form = e.target.closest("#khOwnerAddEntryForm");
      if(!form) return;
      e.preventDefault();
      const oid = openOwnerDetailId;
      if(!oid) return;
      const memberSel = form.querySelector("#khOwnerEntryMember");
      const dateInput = form.querySelector("#khOwnerEntryDate");
      const statusSel = form.querySelector("#khOwnerEntryStatus");
      const hoursInput = form.querySelector("#khOwnerEntryHours");
      const member = memberSel.value;
      const dateVal = dateInput.value;
      const status = statusSel.value;
      const hours = status === "duty" ? (parseFloat(hoursInput.value) || 0) : 0;
      if(!member || !dateVal) return;

      const saveBtn = form.querySelector("button[type=submit]");
      if(saveBtn) saveBtn.disabled = true;
      try{
        const existing = allRecords.find(r => r.ownerId === oid && r.member === member && r.date === dateVal);
        if(existing){
          await updateDoc(doc(db, "kh_records", existing.id), { status, hours });
          showToast("Attendance record updated successfully.");
        }else{
          await addDoc(recordsCol, { member, date: dateVal, status, hours, ownerId: oid, createdAt: serverTimestamp() });
          showToast("Attendance record added successfully.");
        }
        form.reset();
      }catch(err){
        console.error(err);
        showToast("Failed to save entry. Please try again.", "error");
      }finally{
        if(saveBtn) saveBtn.disabled = false;
      }
    });

    overlay.addEventListener("change", e => {
      const statusSel = e.target.closest("#khOwnerEntryStatus");
      if(statusSel){
        const hoursInput = overlay.querySelector("#khOwnerEntryHours");
        if(hoursInput) hoursInput.style.display = statusSel.value === "duty" ? "" : "none";
      }
    });

    return overlay;
  }

  function closeOwnerDetail(){
    openOwnerDetailId = null;
    openOwnerDetailEditable = false;
    const overlay = document.getElementById("khOwnerDetailOverlay");
    if(overlay) overlay.style.display = "none";
  }

  async function renameOwnerMember(id, currentName, oid){
    const newName = prompt("নতুন নাম লিখুন:", currentName);
    if(newName === null) return;
    const trimmed = newName.trim();
    if(!trimmed || trimmed === currentName) return;
    try{
      await updateDoc(doc(db, "kh_members", id), { name: trimmed });
      const matching = allRecords.filter(r => r.ownerId === oid && r.member === currentName);
      const chunkSize = 400;
      for(let i = 0; i < matching.length; i += chunkSize){
        const batch = writeBatch(db);
        matching.slice(i, i + chunkSize).forEach(r => batch.update(doc(db, "kh_records", r.id), { member: trimmed }));
        await batch.commit();
      }
      showToast("Member updated successfully.");
    }catch(err){
      console.error(err);
      showToast("Failed to update member. Please try again.", "error");
    }
  }

  async function deleteOwnerMemberCascade(id, name, oid){
    try{
      const matching = allRecords.filter(r => r.ownerId === oid && r.member === name);
      const chunkSize = 400;
      for(let i = 0; i < matching.length; i += chunkSize){
        const batch = writeBatch(db);
        matching.slice(i, i + chunkSize).forEach(r => batch.delete(doc(db, "kh_records", r.id)));
        await batch.commit();
      }
      await deleteDoc(doc(db, "kh_members", id));
      showToast("Member deleted successfully.");
    }catch(err){
      console.error(err);
      showToast("Failed to delete member. Please try again.", "error");
    }
  }

  function ensureOwnerRecordEditModal(){
    let overlay = document.getElementById("khOwnerRecordEditOverlay");
    if(overlay) return overlay;
    overlay = document.createElement("div");
    overlay.id = "khOwnerRecordEditOverlay";
    overlay.className = "kh-modal-overlay";
    overlay.innerHTML = `
      <div class="kh-modal-card">
        <p class="kh-modal-icon">${ICON_EDIT.replace("<svg ", '<svg class="kh-modal-icon-svg" ')}</p>
        <p class="kh-modal-text" style="margin-bottom:.2rem;" id="khOwnerRecEditTitle">Edit Entry</p>
        <select id="khOwnerRecEditStatus" class="kh-edit-modal-input">
          <option value="duty">Present</option>
          <option value="leave">Leave</option>
        </select>
        <input type="number" id="khOwnerRecEditHours" class="kh-edit-modal-input" placeholder="Hours" min="0" step="0.5" style="margin-top:.5rem;">
        <div class="kh-modal-actions" style="margin-top:1rem;">
          <button type="button" class="btn3d btn-mint" id="khOwnerRecEditSaveBtn">Save Changes</button>
          <button type="button" class="btn3d btn-coral" id="khOwnerRecEditCancelBtn">Cancel</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener("click", e => { if(e.target === overlay) overlay.style.display = "none"; });
    return overlay;
  }

  function openOwnerRecordEditModal(record){
    const overlay = ensureOwnerRecordEditModal();
    const titleEl = overlay.querySelector("#khOwnerRecEditTitle");
    const statusSel = overlay.querySelector("#khOwnerRecEditStatus");
    const hoursInput = overlay.querySelector("#khOwnerRecEditHours");
    const saveBtn = overlay.querySelector("#khOwnerRecEditSaveBtn");
    const cancelBtn = overlay.querySelector("#khOwnerRecEditCancelBtn");

    titleEl.textContent = `${record.member} — ${record.date}`;
    statusSel.value = record.status;
    hoursInput.value = record.hours || 0;
    hoursInput.style.display = record.status === "duty" ? "" : "none";
    overlay.style.display = "flex";

    function cleanup(){
      overlay.style.display = "none";
      saveBtn.removeEventListener("click", onSave);
      cancelBtn.removeEventListener("click", onCancel);
      statusSel.removeEventListener("change", onStatusChange);
    }
    function onCancel(){ cleanup(); }
    function onStatusChange(){ hoursInput.style.display = statusSel.value === "duty" ? "" : "none"; }
    async function onSave(){
      const status = statusSel.value;
      const hours = status === "duty" ? (parseFloat(hoursInput.value) || 0) : 0;
      saveBtn.disabled = true;
      try{
        await updateDoc(doc(db, "kh_records", record.id), { status, hours });
        showToast("Entry updated successfully.");
        cleanup();
      }catch(err){
        console.error(err);
        showToast("Failed to update entry. Please try again.", "error");
      }finally{
        saveBtn.disabled = false;
      }
    }
    statusSel.addEventListener("change", onStatusChange);
    saveBtn.addEventListener("click", onSave);
    cancelBtn.addEventListener("click", onCancel);
  }

  function openOwnerDetailModal(oid, opts){
    openOwnerDetailId = oid;
    openOwnerDetailEditable = !!(opts && opts.editable);
    renderOwnerDetailModal();
    ensureOwnerDetailModal().style.display = "flex";
  }

  function renderOwnerDetailModal(){
    const oid = openOwnerDetailId;
    if(!oid) return;
    const overlay = ensureOwnerDetailModal();
    const editable = openOwnerDetailEditable;
    const label = ownerLabelFor(oid);
    const email = ownerEmailFor(oid);
    overlay.querySelector("#khOwnerDetailTitle").textContent =
      (email ? `${label} (${email})` : label) + (editable ? " — Edit Mode" : "");

    const ownerMembers = allMembers.filter(m => m.ownerId === oid)
      .slice().sort((a,b) => (a.name||"").localeCompare(b.name||"", "bn"));
    const ownerRecords = allRecords.filter(r => r.ownerId === oid)
      .slice().sort((a,b) => b.date.localeCompare(a.date));

    const membersHtml = ownerMembers.length ? `
      <div class="member-card-grid kh-owner-detail-members">
        ${ownerMembers.map(m => {
          let hours = 0, duty = 0, leave = 0;
          ownerRecords.filter(r => r.member === m.name).forEach(r => {
            if(r.status === "duty"){ duty++; hours += (r.hours || 0); }
            else leave++;
          });
          const initial = (m.name || "?").trim().charAt(0).toUpperCase();
          return `
          <div class="member-card kh-readonly-card">
            <div class="member-card-avatar" style="background:${avatarColorFor(m.id)}">${escapeHtmlLocal(initial)}</div>
            <div class="member-card-body">
              <div class="member-card-name">${escapeHtmlLocal(m.name)}</div>
              <div class="member-card-stats">${hours}h • ${duty} Duty • ${leave} Leave</div>
            </div>
            ${editable ? `
            <div class="member-card-actions">
              <button type="button" class="member-card-icon-btn kh-owner-member-edit" data-id="${m.id}" data-name="${escapeHtmlLocal(m.name)}" title="Rename" aria-label="Rename">${ICON_EDIT}</button>
              <button type="button" class="member-card-icon-btn kh-owner-member-delete" data-id="${m.id}" data-name="${escapeHtmlLocal(m.name)}" title="Delete" aria-label="Delete">${ICON_TRASH}</button>
            </div>` : ""}
          </div>`;
        }).join("")}
      </div>` : `<p class="kh-empty-note">এই ইউজার এখনো কোনো member যোগ করেননি।</p>`;

    const recentRows = ownerRecords.slice(0, 40).map(r => `
      <tr>
        <td data-label="Date">${r.date}</td>
        <td data-label="Name">${escapeHtmlLocal(r.member)}</td>
        <td class="status-${r.status}" data-label="Status"><span>${r.status === "duty" ? "Present" : "Leave"}</span></td>
        <td class="hours-cell" data-label="Hours">${r.status === "duty" ? r.hours : "—"}</td>
        ${editable ? `
        <td class="row-actions-cell" data-label="Action">
          <div class="row-actions kh-owner-row-actions">
            <button type="button" class="member-card-icon-btn kh-owner-record-edit" data-id="${r.id}" data-member="${escapeHtmlLocal(r.member)}" data-date="${r.date}" data-status="${r.status}" data-hours="${r.hours || 0}" title="Edit" aria-label="Edit">${ICON_EDIT}</button>
            <button type="button" class="member-card-icon-btn kh-owner-record-delete" data-id="${r.id}" title="Delete" aria-label="Delete">${ICON_TRASH}</button>
          </div>
        </td>` : ""}
      </tr>`).join("");

    const registerHtml = ownerRecords.length ? `
      <h4 class="kh-subtitle">Recent Attendance</h4>
      <div class="table-wrap">
        <table class="kh-table">
          <thead><tr><th>Date</th><th>Name</th><th>Status</th><th>Hours</th>${editable ? "<th></th>" : ""}</tr></thead>
          <tbody>${recentRows}</tbody>
        </table>
      </div>
      ${ownerRecords.length > 40 ? `<p class="kh-empty-note">সর্বশেষ ৪০টি এন্ট্রি দেখানো হচ্ছে (মোট ${ownerRecords.length}টি)।</p>` : ""}
    ` : `<p class="kh-empty-note">এই ইউজারের এখনো কোনো attendance রেকর্ড নেই।</p>`;

    const addEntryHtml = editable ? `
      <h4 class="kh-subtitle">Add / Update Attendance</h4>
      <form id="khOwnerAddEntryForm" class="kh-owner-add-entry">
        <select id="khOwnerEntryMember" required>
          <option value="">Select member</option>
          ${ownerMembers.map(m => `<option value="${escapeHtmlLocal(m.name)}">${escapeHtmlLocal(m.name)}</option>`).join("")}
        </select>
        <input type="date" id="khOwnerEntryDate" required>
        <select id="khOwnerEntryStatus">
          <option value="duty">Present</option>
          <option value="leave">Leave</option>
        </select>
        <input type="number" id="khOwnerEntryHours" placeholder="Hours" min="0" step="0.5">
        <button type="submit" class="btn3d btn-mint">Save</button>
      </form>
    ` : "";

    overlay.querySelector("#khOwnerDetailBody").innerHTML = `
      ${addEntryHtml}
      <h4 class="kh-subtitle">Members</h4>
      ${membersHtml}
      ${registerHtml}
    `;
  }
  // ================= /Admin: cross-account overview =================

  function renderMembers(){
    const ym = currentYearMonth();
    memberChips.innerHTML = members.map(m => {
      const stats = monthStatsFor(m.name, ym);
      const initial = (m.name || "?").trim().charAt(0).toUpperCase();
      const isSelected = m.id === selectedMemberId;
      return `
      <div class="member-card${isSelected ? " is-selected" : ""}" data-id="${m.id}" data-name="${escapeHtmlLocal(m.name)}">
        <div class="member-card-avatar" style="background:${avatarColorFor(m.id)}">${escapeHtmlLocal(initial)}</div>
        <div class="member-card-body">
          <div class="member-card-name">${escapeHtmlLocal(m.name)}</div>
          <div class="member-card-stats">${stats.hours}h • ${stats.duty} Duty • ${stats.leave} Leave</div>
        </div>
        <div class="member-card-actions">
          <button type="button" class="member-card-icon-btn member-card-more" data-id="${m.id}" title="More options" aria-label="More options" aria-haspopup="true">${ICON_KEBAB}</button>
          <div class="member-card-menu" data-id="${m.id}">
            <button type="button" class="member-card-menu-item member-card-view" data-id="${m.id}">${ICON_USER}View Profile</button>
            <button type="button" class="member-card-menu-item member-card-edit" data-id="${m.id}">${ICON_EDIT}Edit Member</button>
            <button type="button" class="member-card-menu-item member-card-share" data-id="${m.id}">${ICON_SHARE}Share Attendance</button>
            <button type="button" class="member-card-menu-item is-danger member-card-delete" data-id="${m.id}">${ICON_TRASH}Remove Member</button>
          </div>
        </div>
      </div>`;
    }).join("");
    const memberDots = document.getElementById("memberDots");
    if(memberDots){
      memberDots.innerHTML = members.map((_, i) => `<span class="${i === 0 ? "is-active" : ""}"></span>`).join("");
    }
    noMemberNote.style.display = members.length ? "none" : "block";
    noMemberWarn.style.display = members.length ? "none" : "block";
    saveBtn.disabled = !members.length;

    if(selectedMemberId && !members.some(m => m.id === selectedMemberId)){
      selectedMemberId = null;
    }

    const currentEntryVal  = entryMember.value;
    const currentFilterVal = filterMember.value;

    const opts = members.map(m => `<option value="${m.name}">${m.name}</option>`).join("");
    entryMember.innerHTML = opts || `<option value="">— No members —</option>`;
    filterMember.innerHTML = `<option value="All">All Members</option>` + opts;

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
      showToast("Member added successfully.");
    }catch(err){
      console.error(err);
      showToast("Failed to add member. Please check your internet connection and try again.", "error");
    }finally{
      addMemberBtn.disabled = false;
    }
  });
  memberInput.addEventListener("keydown", e => {
    if(e.key === "Enter"){ e.preventDefault(); addMemberBtn.click(); }
  });

  function ensureEditMemberModal(){
    let overlay = document.getElementById("khEditMemberOverlay");
    if(overlay) return overlay;
    overlay = document.createElement("div");
    overlay.id = "khEditMemberOverlay";
    overlay.className = "kh-modal-overlay";
    overlay.innerHTML = `
      <div class="kh-modal-card">
        <p class="kh-modal-icon">${ICON_EDIT.replace("<svg ", '<svg class="kh-modal-icon-svg" ')}</p>
        <p class="kh-modal-text" style="margin-bottom:.2rem;">Edit Member</p>
        <input type="text" class="kh-edit-modal-input" id="khEditMemberInput" maxlength="60">
        <span class="kh-field-error" id="khEditMemberError" aria-live="polite"></span>
        <div class="kh-modal-actions" style="margin-top:1rem;">
          <button type="button" class="btn3d btn-mint" id="khEditMemberSaveBtn">Save Changes</button>
          <button type="button" class="btn3d btn-coral" id="khEditMemberCancelBtn">Cancel</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    return overlay;
  }
  function openEditMemberModal(member){
    const overlay = ensureEditMemberModal();
    const input = overlay.querySelector("#khEditMemberInput");
    const errorEl = overlay.querySelector("#khEditMemberError");
    const saveBtnEl = overlay.querySelector("#khEditMemberSaveBtn");
    input.value = member.name;
    errorEl.textContent = "";
    input.classList.remove("kh-input-error");
    overlay.style.display = "flex";
    setTimeout(() => { input.focus(); input.select(); }, 30);

    function cleanup(){
      overlay.style.display = "none";
      saveBtnEl.removeEventListener("click", onSave);
      cancelBtnEl.removeEventListener("click", onCancel);
      input.removeEventListener("keydown", onKeydown);
    }
    function onCancel(){ cleanup(); }
    function onKeydown(e){
      if(e.key === "Enter"){ e.preventDefault(); onSave(); }
      if(e.key === "Escape"){ cleanup(); }
    }
    async function onSave(){
      const newName = input.value.trim();
      if(!newName){
        errorEl.textContent = "Please enter a name.";
        input.classList.add("kh-input-error");
        return;
      }
      if(newName !== member.name && members.some(m => m.name === newName)){
        errorEl.textContent = "A member with this name already exists.";
        input.classList.add("kh-input-error");
        return;
      }
      if(newName === member.name){ cleanup(); return; }
      saveBtnEl.disabled = true;
      try{
        await renameMember(member, newName);
        cleanup();
        showToast("Member updated successfully.");
      }catch(err){
        console.error(err);
        errorEl.textContent = "Failed to update member. Please try again.";
      }finally{
        saveBtnEl.disabled = false;
      }
    }
    const cancelBtnEl = overlay.querySelector("#khEditMemberCancelBtn");
    saveBtnEl.addEventListener("click", onSave);
    cancelBtnEl.addEventListener("click", onCancel);
    input.addEventListener("keydown", onKeydown);
  }

  async function renameMember(member, newName){
    const oldName = member.name;
    await updateDoc(doc(db, "kh_members", member.id), { name: newName });
    const matching = records.filter(r => r.member === oldName);
    const chunkSize = 400;
    for(let i = 0; i < matching.length; i += chunkSize){
      const batch = writeBatch(db);
      matching.slice(i, i + chunkSize).forEach(r => batch.update(doc(db, "kh_records", r.id), { member: newName }));
      await batch.commit();
    }
  }

  function ensureDeleteMemberModal(){
    let overlay = document.getElementById("khDeleteMemberOverlay");
    if(overlay) return overlay;
    overlay = document.createElement("div");
    overlay.id = "khDeleteMemberOverlay";
    overlay.className = "kh-modal-overlay";
    overlay.innerHTML = `
      <div class="kh-modal-card">
        <p class="kh-modal-icon">${ICON_TRASH_LG}</p>
        <p class="kh-modal-text" id="khDeleteMemberText"></p>
        <ul class="kh-modal-list">
          <li>Member profile</li>
          <li>All related attendance records</li>
          <li>Work hours history</li>
        </ul>
        <p class="kh-modal-text" style="font-size:.85rem; color:#C0392B; margin-bottom:1rem;">This action cannot be undone.</p>
        <div class="kh-modal-actions">
          <button type="button" class="btn3d btn-danger" id="khDeleteMemberYesBtn">Delete Member</button>
          <button type="button" class="btn3d btn-mint" id="khDeleteMemberCancelBtn">Cancel</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    return overlay;
  }
  function askDeleteMember(member){
    return new Promise(resolve => {
      const overlay = ensureDeleteMemberModal();
      overlay.querySelector("#khDeleteMemberText").textContent = `Are you sure you want to delete "${member.name}"?`;
      overlay.style.display = "flex";
      const yesBtn = overlay.querySelector("#khDeleteMemberYesBtn");
      const noBtn  = overlay.querySelector("#khDeleteMemberCancelBtn");
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

  async function deleteMemberCascade(member){
    const matching = records.filter(r => r.member === member.name);
    const chunkSize = 400;
    for(let i = 0; i < matching.length; i += chunkSize){
      const batch = writeBatch(db);
      matching.slice(i, i + chunkSize).forEach(r => batch.delete(doc(db, "kh_records", r.id)));
      await batch.commit();
    }
    await deleteDoc(doc(db, "kh_members", member.id));
  }

  function closeAllMemberMenus(){
    memberChips.querySelectorAll(".member-card-menu.is-open").forEach(m => m.classList.remove("is-open"));
  }
  if(!memberChips.dataset.scrollBound){
    memberChips.dataset.scrollBound = "1";
    let scrollTimer;
    memberChips.addEventListener("scroll", () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const cards = memberChips.querySelectorAll(".member-card");
        const dots = document.querySelectorAll("#memberDots span");
        if(!cards.length || !dots.length) return;
        const center = memberChips.scrollLeft + memberChips.clientWidth / 2;
        let closestIdx = 0, closestDist = Infinity;
        cards.forEach((card, i) => {
          const dist = Math.abs((card.offsetLeft + card.offsetWidth / 2) - center);
          if(dist < closestDist){ closestDist = dist; closestIdx = i; }
        });
        dots.forEach((d, i) => d.classList.toggle("is-active", i === closestIdx));
      }, 80);
    }, { passive: true });
  }
  document.addEventListener("click", e => {
    if(!e.target.closest(".member-card-actions")) closeAllMemberMenus();
  });

  function ensureMemberProfileModal(){
    let overlay = document.getElementById("khMemberProfileOverlay");
    if(overlay) return overlay;
    overlay = document.createElement("div");
    overlay.id = "khMemberProfileOverlay";
    overlay.className = "kh-modal-overlay";
    overlay.innerHTML = `
      <div class="kh-modal-card kh-profile-card">
        <button type="button" class="kh-modal-x" id="khProfileCloseBtn" aria-label="Close">${ICON_CLOSE}</button>
        <div class="kh-profile-avatar" id="khProfileAvatar"></div>
        <div class="kh-profile-name" id="khProfileName"></div>
        <div class="kh-profile-month" id="khProfileMonth"></div>
        <div class="kh-profile-stats" id="khProfileStats"></div>
        <div class="kh-ph" id="khProfileHistory"></div>
        <button type="button" class="btn3d btn-sky" id="khProfilePdfBtn" style="width:100%; margin-top:1rem;">${ICON_DOC} Download Member Report</button>
      </div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener("click", e => { if(e.target === overlay) overlay.style.display = "none"; });
    overlay.querySelector("#khProfileCloseBtn").addEventListener("click", () => { overlay.style.display = "none"; });
    return overlay;
  }

  function openMemberProfileModal(member){
    const overlay = ensureMemberProfileModal();
    const ym = currentYearMonth();
    const stats = monthStatsFor(member.name, ym);
    const advanceVal = typeof member.advance === "number" ? member.advance : 0;
    const initial = (member.name || "?").trim().charAt(0).toUpperCase();
    overlay.querySelector("#khProfileAvatar").style.background = avatarColorFor(member.id);
    overlay.querySelector("#khProfileAvatar").textContent = initial;
    overlay.querySelector("#khProfileName").textContent = member.name;
    overlay.querySelector("#khProfileMonth").textContent = monthLabel(ym);
    overlay.querySelector("#khProfileStats").innerHTML = `
      <div class="kh-profile-stat"><strong>${stats.hours}</strong><span>Total Hours</span></div>
      <div class="kh-profile-stat"><strong>${stats.duty}</strong><span>Work Days</span></div>
      <div class="kh-profile-stat"><strong>${stats.leave}</strong><span>Leave</span></div>
      <div class="kh-profile-stat"><strong>RM ${advanceVal.toFixed(2)}</strong><span>Advance</span></div>
    `;
    renderProfileHistory(overlay.querySelector("#khProfileHistory"), member, 10);
    const pdfBtn = overlay.querySelector("#khProfilePdfBtn");
    pdfBtn.onclick = async () => {
      if(!(await ensurePdfLibs())){
        showToast("PDF generation library failed to load. Please check your internet connection.", "error");
        return;
      }
      const monthRecords = records
        .filter(r => r.date.startsWith(ym) && r.member === member.name)
        .slice().sort((a,b) => a.date.localeCompare(b.date));
      if(!monthRecords.length){
        showToast("No records for this member this month yet.", "warning");
        return;
      }
      pdfBtn.disabled = true;
      const originalLabel = pdfBtn.innerHTML;
      pdfBtn.innerHTML = `${ICON_SPINNER}Generating PDF...`;
      try{
        await generatePdfReport(ym, monthRecords, member.name);
      }catch(err){
        console.error(err);
        showToast("Failed to generate PDF. Please try again.", "error");
      }finally{
        pdfBtn.disabled = false;
        pdfBtn.innerHTML = originalLabel;
      }
    };
    overlay.style.display = "flex";
  }

  memberChips.addEventListener("click", async e => {
    const moreBtn = e.target.closest(".member-card-more");
    if(moreBtn){
      const menu = moreBtn.nextElementSibling;
      const wasOpen = menu.classList.contains("is-open");
      closeAllMemberMenus();
      if(!wasOpen) menu.classList.add("is-open");
      return;
    }
    const viewBtn = e.target.closest(".member-card-view");
    if(viewBtn){
      closeAllMemberMenus();
      const m = members.find(x => x.id === viewBtn.dataset.id);
      if(m) openMemberProfileModal(m);
      return;
    }
    const editBtn = e.target.closest(".member-card-edit");
    if(editBtn){
      closeAllMemberMenus();
      const m = members.find(x => x.id === editBtn.dataset.id);
      if(m) openEditMemberModal(m);
      return;
    }
    const shareBtn = e.target.closest(".member-card-share");
    if(shareBtn){
      closeAllMemberMenus();
      const m = members.find(x => x.id === shareBtn.dataset.id);
      if(m) openShareModal(m);
      return;
    }
    const deleteBtn = e.target.closest(".member-card-delete");
    if(deleteBtn){
      closeAllMemberMenus();
      const m = members.find(x => x.id === deleteBtn.dataset.id);
      if(!m) return;
      const ok = await askDeleteMember(m);
      if(!ok) return;
      deleteBtn.disabled = true;
      try{
        await deleteMemberCascade(m);
        if(selectedMemberId === m.id) selectedMemberId = null;
        showToast("Member and all related attendance records have been deleted.");
      }catch(err){
        console.error(err);
        showToast("Failed to delete member. Please try again.", "error");
      }
      return;
    }
    const card = e.target.closest(".member-card");
    if(card){
      const id = card.dataset.id;
      selectedMemberId = selectedMemberId === id ? null : id;
      const m = members.find(x => x.id === selectedMemberId);
      if(m){
        entryMember.value = m.name;
        filterMember.value = m.name;
      }else{
        filterMember.value = "All";
      }
      renderRegister();
      renderMembers();
      document.getElementById("attendanceRegisterSection")
        .scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  entryForm.querySelectorAll('input[name="status"]').forEach(radio => {
    radio.addEventListener("change", () => {
      const isLeave = entryForm.querySelector('input[name="status"]:checked').value === "leave";
      entryHours.disabled = isLeave;
      hoursField.style.opacity = isLeave ? .5 : 1;
      if(isLeave) entryHours.value = "";
      clearHoursError();
    });
  });
  entryHours.addEventListener("input", clearHoursError);
  function clearHoursError(){
    entryHoursError.textContent = "";
    entryHours.classList.remove("kh-input-error");
  }

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
    const hoursVal = parseFloat(entryHours.value);
    if(status === "duty" && (entryHours.value === "" || isNaN(hoursVal) || hoursVal <= 0)){
      entryHoursError.textContent = "Please enter the number of hours worked.";
      entryHours.classList.add("kh-input-error");
      entryHours.focus();
      return;
    }
    clearHoursError();
    const record = {
      date: entryDate.value,
      member: entryMember.value,
      status: status,
      hours: status === "duty" ? hoursVal : 0,
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
      showToast(`${record.member}'s attendance for ${record.date === new Date().toISOString().slice(0,10) ? "today" : "this date"} has been saved.`);

      // Auto-advance to the next member in the list, so you don't have to
      // reselect each time when entering attendance for many people in a row.
      const currentIdx = members.findIndex(m => m.name === record.member);
      if(currentIdx > -1 && currentIdx < members.length - 1){
        entryMember.value = members[currentIdx + 1].name;
        autoFillFromExisting();
      }
    }catch(err){
      console.error(err);
      showToast("Failed to save record. Please check your internet connection and try again.", "error");
    }finally{
      saveBtn.disabled = !members.length;
    }
  });

  function currentYearMonth(){
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
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
        ? `<div class="kh-advance-wrap" data-id="${m.id}" data-balance="${advanceVal}">
             <span class="kh-advance-display">RM ${advanceVal.toFixed(2)}</span>
             <button type="button" class="kh-advance-edit-btn" data-id="${m.id}" title="Add advance" aria-label="Add advance">${ICON_EDIT}</button>
           </div>`
        : `<span class="kh-advance-prefix">RM 0.00</span>`;
      return `<tr><td data-label="Name">${escapeHtml(name)}</td><td data-label="Work Days">${d.days}</td><td data-label="Leave Days">${d.leaves}</td><td data-label="Work Hours"><strong>${d.hours}</strong></td><td data-label="Advance (RM)">${advanceCell}</td></tr>`;
    }).join("");
  }

  function refreshSummarySection(){
    updateMonthBadges();
    populateSummaryMonthOptions();
    renderSummary();
    renderQuickStats();
    renderOverview();
    renderCalendar();
  }

  function renderQuickStats(){
    const ym = currentYearMonth();
    const monthRecords = records.filter(r => r.date.startsWith(ym));
    let present = 0, hours = 0;
    monthRecords.forEach(r => {
      if(r.status === "duty"){ present++; hours += (r.hours || 0); }
    });
    const totalAdvance = members.reduce((sum, m) => sum + (typeof m.advance === "number" ? m.advance : 0), 0);
    const qsMembers = document.getElementById("qsMembers");
    const qsPresent = document.getElementById("qsPresent");
    const qsHours   = document.getElementById("qsHours");
    const qsAdvance = document.getElementById("qsAdvance");
    if(qsMembers) qsMembers.textContent = toBn(members.length);
    if(qsPresent) qsPresent.textContent = toBn(present);
    if(qsHours)   qsHours.textContent = toBn(hours);
    if(qsAdvance) qsAdvance.textContent = `RM ${totalAdvance.toFixed(2)}`;
    const pill = document.getElementById("dashboardMonthPill");
    if(pill) pill.textContent = monthLabel(ym);
  }

  summaryMonthSelect?.addEventListener("change", () => { renderSummary(); renderOverview(); });

  document.querySelector("#summaryTable tbody").addEventListener("click", e => {
    const editBtn = e.target.closest(".kh-advance-edit-btn");
    if(editBtn){
      const wrap = editBtn.closest(".kh-advance-wrap");
      if(wrap.querySelector(".kh-advance-add-input")) return;
      wrap.innerHTML = `
        <div class="kh-advance-edit-wrap">
          <input type="number" class="kh-advance-add-input" min="0" step="0.01" placeholder="Amount" inputmode="decimal" autofocus>
          <button type="button" class="kh-advance-op-btn kh-advance-op-add" data-op="add" title="Add to advance">+ Add</button>
          <button type="button" class="kh-advance-op-btn kh-advance-op-deduct" data-op="deduct" title="Deduct from advance">&minus; Deduct</button>
          <input type="date" class="kh-advance-date-input" value="${localTodayStr()}" aria-label="Advance date" title="Date of this advance" style="flex:1 1 100%; width:100%; max-width:140px; box-sizing:border-box; padding:.3rem .4rem; border-radius:8px; border:1.5px solid #CBD5E1; font-size:.8rem;">
        </div>`;
      const input = wrap.querySelector(".kh-advance-add-input");
      input.focus();

      input.addEventListener("keydown", ev => {
        if(ev.key === "Escape"){ renderSummary(); }
      });
      input.addEventListener("blur", () => {
        // Give a click on +Add / -Deduct a chance to register before cancelling.
        setTimeout(() => {
          if(!wrap.contains(document.activeElement)) renderSummary();
        }, 150);
      });
      return;
    }

    const opBtn = e.target.closest(".kh-advance-op-btn");
    if(opBtn) commitAdvanceOp(opBtn);
  });

  function localTodayStr(){
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  // Advance history lives in the member document (`advanceLog`: [{ d: "YYYY-MM-DD", a: +taken / -deducted }]).
  // `advance` stays the running balance exactly as before. A transaction keeps balance + history in sync.
  async function commitAdvanceOp(opBtn){
    const wrap = opBtn.closest(".kh-advance-wrap");
    const input = wrap.querySelector(".kh-advance-add-input");
    const dateInput = wrap.querySelector(".kh-advance-date-input");
    const rawVal = parseFloat(input.value);
    if(isNaN(rawVal) || rawVal <= 0){
      input.focus();
      input.classList.add("kh-input-error");
      return;
    }
    const memberId = wrap.dataset.id;
    const op = opBtn.dataset.op;
    const entryDate = (dateInput && /^\d{4}-\d{2}-\d{2}$/.test(dateInput.value)) ? dateInput.value : localTodayStr();
    let newBalance = 0;

    wrap.querySelectorAll("input, button").forEach(el => el.disabled = true);
    try{
      const ref = doc(db, "kh_members", memberId);
      await runTransaction(db, async tx => {
        const snap = await tx.get(ref);
        if(!snap.exists()) throw new Error("member-missing");
        const cur = snap.data();
        const bal = typeof cur.advance === "number" ? cur.advance : 0;
        newBalance = op === "deduct" ? bal - rawVal : bal + rawVal;
        const log = Array.isArray(cur.advanceLog) ? cur.advanceLog.slice() : [];
        log.push({ d: entryDate, a: op === "deduct" ? -rawVal : rawVal });
        tx.update(ref, { advance: newBalance, advanceLog: log });
      });
      if(newBalance < 0){
        showToast(`Saved, but new balance is negative: RM ${newBalance.toFixed(2)}.`, "error");
      }else{
        showToast(`${op === "deduct" ? "Deducted" : "Added"} RM ${rawVal.toFixed(2)}. New balance: RM ${newBalance.toFixed(2)}.`);
      }
    }catch(err){
      console.error(err);
      showToast("Failed to save advance. Please try again.", "error");
      wrap.querySelectorAll("input, button").forEach(el => el.disabled = false);
    }
  }

  const EN_MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  function toBn(n){ return String(n); }
  function monthLabel(ym){
    const [y, m] = ym.split("-").map(Number);
    return `${EN_MONTHS[m-1]} ${y}`;
  }

  // ===== Attendance Register: Month → Date → Members =====
  // UI/rendering only. Reads the already-loaded `records` (no extra Firebase reads, no data changes).
  const regMonthOpen = {};       // ym -> true/false (what the user chose; default = current month open, older closed)
  const regDayOpen = new Set();  // "YYYY-MM-DD" dates the user expanded
  let regIndex = { months: [], byMonth: {}, total: 0 };

  function fmtHours(n){ return String(Math.round((Number(n) || 0) * 100) / 100); }

  function regDateLabel(dateStr){
    const [y, m, d] = dateStr.split("-").map(Number);
    return `${String(d).padStart(2, "0")} ${EN_MONTHS[m - 1]} ${y}`;
  }

  function regDaySummary(list){
    const names = new Set();
    let hours = 0, present = 0, leave = 0;
    list.forEach(r => {
      names.add(r.member);
      if(r.status === "duty"){ present++; hours += (Number(r.hours) || 0); }
      else leave++;
    });
    return { members: names.size, hours, present, leave };
  }

  // Register search + filters (in-memory, on the data that is already loaded — no extra Firebase reads)
  const regFilters = { q: "", status: "all", from: "", to: "" };
  function regFilterActive(){
    return !!(regFilters.q || regFilters.status !== "all" || regFilters.from || regFilters.to);
  }
  function regMatches(r){
    if(regFilters.status !== "all" && r.status !== regFilters.status) return false;
    if(regFilters.from && r.date < regFilters.from) return false;
    if(regFilters.to && r.date > regFilters.to) return false;
    if(regFilters.q){
      const q = regFilters.q;
      const hay = (String(r.member).toLowerCase() + " " + r.date + " " + regDateLabel(r.date).toLowerCase());
      if(!hay.includes(q)) return false;
    }
    return true;
  }

  function buildRegisterIndex(){
    const filter = filterMember.value;
    let src = filter === "All" ? records : records.filter(r => r.member === filter);
    if(regFilterActive()) src = src.filter(regMatches);
    const byMonth = {};
    src.forEach(r => {
      if(!r.date) return;
      const ym = r.date.slice(0, 7);
      const mo = byMonth[ym] || (byMonth[ym] = { records: 0, days: {} });
      mo.records++;
      (mo.days[r.date] = mo.days[r.date] || []).push(r);
    });
    const months = Object.keys(byMonth).sort((a, b) => b.localeCompare(a));
    return { months, byMonth, total: src.length };
  }

  function regDayBodyHtml(list){
    const rows = list.slice().sort((a, b) => String(a.member).localeCompare(String(b.member))).map(r => {
      const isDuty = r.status === "duty";
      const mem = members.find(m => m.name === r.member);
      const initial = (r.member || "?").trim().charAt(0).toUpperCase();
      const safeName = escapeHtml(r.member);
      return `
        <li class="kh-reg-row">
          <span class="kh-reg-avatar" style="background:${avatarColorFor(mem ? mem.id : String(r.member))}">${escapeHtml(initial)}</span>
          <span class="kh-reg-name">${safeName}</span>
          <span class="kh-reg-badge ${isDuty ? "kh-reg-badge--duty" : "kh-reg-badge--leave"}">${isDuty ? "Present" : "Leave"}</span>
          <span class="kh-reg-hours${isDuty ? "" : " is-off"}">${isDuty ? fmtHours(r.hours) + "h" : "—"}</span>
          <span class="kh-reg-actions">
            <button type="button" class="kh-reg-act row-action-edit" data-id="${r.id}" data-member="${safeName}" data-date="${r.date}" aria-label="Edit ${safeName}" title="Edit">${ICON_EDIT}</button>
            <button type="button" class="kh-reg-act row-action-delete" data-id="${r.id}" aria-label="Delete ${safeName}" title="Delete">${ICON_TRASH}</button>
          </span>
        </li>`;
    }).join("");
    return `<ul class="kh-reg-list">${rows}</ul><button type="button" class="kh-reg-hide">Hide details ${ICON_CHEVRON_UP}</button>`;
  }

  function regDayCardHtml(date, list){
    const s = regDaySummary(list);
    const open = regDayOpen.has(date);
    return `
      <details class="kh-reg-day" data-date="${date}"${open ? " open" : ""}>
        <summary class="kh-reg-day-sum">
          <span class="kh-reg-day-main">
            <span class="kh-reg-day-title">${regDateLabel(date)}</span>
            <span class="kh-reg-day-meta">${s.members} ${s.members === 1 ? "Member" : "Members"} · ${fmtHours(s.hours)} Total Hours</span>
            <span class="kh-reg-day-meta">Present: <b class="kh-reg-ok">${s.present}</b> · Leave: <b class="kh-reg-lv">${s.leave}</b></span>
          </span>
          <span class="kh-reg-chev">${ICON_CHEVRON_RIGHT}</span>
        </summary>
        <div class="kh-reg-day-body">${open ? regDayBodyHtml(list) : ""}</div>
      </details>`;
  }

  function regDaysHtml(ym){
    const mo = regIndex.byMonth[ym];
    if(!mo) return "";
    return Object.keys(mo.days).sort((a, b) => b.localeCompare(a))
      .map(d => regDayCardHtml(d, mo.days[d])).join("");
  }

  function regMonthHtml(ym){
    const mo = regIndex.byMonth[ym];
    const dayCount = Object.keys(mo.days).length;
    const isOpen = regFilterActive() ? true : ((ym in regMonthOpen) ? regMonthOpen[ym] : (ym === currentYearMonth()));
    return `
      <details class="kh-month-group kh-reg-month" data-ym="${ym}"${isOpen ? " open" : ""}>
        <summary class="kh-month-summary">
          <span class="kh-month-label">${monthLabel(ym)}</span>
          <button type="button" class="kh-reg-month-menu" data-ym="${ym}" aria-label="Actions for ${monthLabel(ym)}" aria-haspopup="dialog" title="Month actions">${ICON_KEBAB}</button>
          <span class="kh-reg-brk"></span>
          <span class="kh-month-count">${dayCount} ${dayCount === 1 ? "day" : "days"} · ${mo.records} ${mo.records === 1 ? "record" : "records"}</span>
        </summary>
        <div class="kh-reg-days">${isOpen ? regDaysHtml(ym) : ""}</div>
      </details>`;
  }

  function renderRegister(){
    const noRecordsNote = document.getElementById("noRecordsNote");
    regIndex = buildRegisterIndex();

    updateRegisterResultLine();
    if(!regIndex.total){
      registerGroups.innerHTML = "";
      noRecordsNote.textContent = regFilterActive() ? "No attendance matches your search or filters." : "No entries yet.";
      noRecordsNote.style.display = "block";
      return;
    }
    noRecordsNote.style.display = "none";
    registerGroups.innerHTML = regIndex.months.map(ym => regMonthHtml(ym)).join("");
  }

  function updateRegisterResultLine(){
    const line = document.getElementById("khRegResult");
    if(!line) return;
    if(!regFilterActive()){ line.style.display = "none"; return; }
    const days = regIndex.months.reduce((n, ym) => n + Object.keys(regIndex.byMonth[ym].days).length, 0);
    line.textContent = `Showing ${regIndex.total} ${regIndex.total === 1 ? "record" : "records"} in ${days} ${days === 1 ? "day" : "days"}`;
    line.style.display = "";
  }

  function buildRegisterTools(){
    if(document.getElementById("khRegTools")) return;
    const row = filterMember.closest(".filter-row");
    if(!row) return;
    const tools = document.createElement("div");
    tools.id = "khRegTools";
    tools.className = "kh-reg-tools";
    tools.innerHTML = `
      <div class="kh-reg-search">${ICON_SEARCH}<input type="search" id="khRegSearch" placeholder="Search name or date…" aria-label="Search attendance by member name or date" autocomplete="off"></div>
      <div class="kh-reg-filterbar">
        <button type="button" class="kh-reg-fbtn" id="khRegFilterBtn" aria-expanded="false" aria-controls="khRegPanel">${ICON_FILTER}Filters <span class="kh-reg-fcount" id="khRegFcount" style="display:none;">0</span></button>
        <button type="button" class="kh-reg-clear" id="khRegClear" style="display:none;">Clear all</button>
      </div>
      <div class="kh-reg-panel" id="khRegPanel">
        <label>Status<select id="khRegStatus"><option value="all">All status</option><option value="duty">Present</option><option value="leave">Leave</option></select></label>
        <label>From<input type="date" id="khRegFrom"></label>
        <label>To<input type="date" id="khRegTo"></label>
      </div>
      <p class="kh-reg-result" id="khRegResult" style="display:none;"></p>`;
    row.insertAdjacentElement("afterend", tools);

    let timer = null;
    const apply = () => {
      const n = (regFilters.status !== "all" ? 1 : 0) + (regFilters.from ? 1 : 0) + (regFilters.to ? 1 : 0);
      const c = document.getElementById("khRegFcount");
      c.textContent = String(n); c.style.display = n ? "" : "none";
      document.getElementById("khRegClear").style.display = regFilterActive() ? "" : "none";
      renderRegister();
    };
    tools.querySelector("#khRegSearch").addEventListener("input", e => {
      clearTimeout(timer);
      timer = setTimeout(() => { regFilters.q = e.target.value.trim().toLowerCase(); apply(); }, 180);
    });
    tools.querySelector("#khRegFilterBtn").addEventListener("click", e => {
      const panel = tools.querySelector("#khRegPanel");
      const open = panel.classList.toggle("is-open");
      e.currentTarget.setAttribute("aria-expanded", String(open));
    });
    tools.querySelector("#khRegStatus").addEventListener("change", e => { regFilters.status = e.target.value; apply(); });
    tools.querySelector("#khRegFrom").addEventListener("change", e => { regFilters.from = e.target.value; apply(); });
    tools.querySelector("#khRegTo").addEventListener("change", e => { regFilters.to = e.target.value; apply(); });
    tools.querySelector("#khRegClear").addEventListener("click", () => {
      regFilters.q = ""; regFilters.status = "all"; regFilters.from = ""; regFilters.to = "";
      tools.querySelector("#khRegSearch").value = "";
      tools.querySelector("#khRegStatus").value = "all";
      tools.querySelector("#khRegFrom").value = "";
      tools.querySelector("#khRegTo").value = "";
      apply();
    });
  }

  // Remember what the user expanded/collapsed, and build the heavy content only when something is opened.
  registerGroups.addEventListener("toggle", e => {
    const el = e.target;
    if(!el || !el.classList) return;

    if(el.classList.contains("kh-reg-month")){
      const ym = el.dataset.ym;
      regMonthOpen[ym] = el.open;
      if(el.open){
        const box = el.querySelector(":scope > .kh-reg-days");
        if(box && !box.firstElementChild) box.innerHTML = regDaysHtml(ym);
      }
    }else if(el.classList.contains("kh-reg-day")){
      const date = el.dataset.date;
      if(el.open) regDayOpen.add(date); else regDayOpen.delete(date);
      if(el.open){
        const body = el.querySelector(":scope > .kh-reg-day-body");
        const mo = regIndex.byMonth[date.slice(0, 7)];
        if(body && !body.firstElementChild && mo && mo.days[date]) body.innerHTML = regDayBodyHtml(mo.days[date]);
      }
    }
  }, true);

  // Month actions (PDF / CSV / Delete) in a clean bottom sheet instead of three buttons per month.
  function openMonthSheet(ym){
    const mo = regIndex.byMonth[ym];
    if(!mo) return;
    const old = document.getElementById("khMonthSheetOverlay");
    if(old) old.remove();

    const dayCount = Object.keys(mo.days).length;
    const overlay = document.createElement("div");
    overlay.id = "khMonthSheetOverlay";
    overlay.className = "kh-modal-overlay kh-reg-sheet-overlay";
    overlay.innerHTML = `
      <div class="kh-modal-card kh-reg-sheet" role="dialog" aria-modal="true" aria-label="${monthLabel(ym)} actions">
        <p class="kh-reg-sheet-title">${monthLabel(ym)}</p>
        <p class="kh-reg-sheet-sub">${dayCount} ${dayCount === 1 ? "day" : "days"} · ${mo.records} ${mo.records === 1 ? "record" : "records"}</p>
        <button type="button" class="kh-reg-sheet-btn" data-act="pdf">${ICON_DOC}Download PDF Report</button>
        <button type="button" class="kh-reg-sheet-btn" data-act="csv">${ICON_TABLE}Export CSV</button>
        <button type="button" class="kh-reg-sheet-btn is-danger" data-act="delete">${ICON_TRASH}Delete Month</button>
        <button type="button" class="kh-reg-sheet-btn is-cancel" data-act="cancel">Cancel</button>
      </div>`;
    document.body.appendChild(overlay);
    overlay.style.display = "flex";

    function onKey(ev){ if(ev.key === "Escape") close(); }
    function close(){
      document.removeEventListener("keydown", onKey);
      overlay.remove();
    }
    document.addEventListener("keydown", onKey);

    overlay.addEventListener("click", ev => {
      if(ev.target === overlay){ close(); return; }
      const b = ev.target.closest("[data-act]");
      if(!b) return;
      const act = b.dataset.act;
      close();
      if(act === "pdf"){
        showToast(`Preparing ${monthLabel(ym)} PDF...`);
        exportMonthPdf(ym, document.createElement("button"));
      }else if(act === "csv"){
        exportMonthCsv(ym, document.createElement("button"));
      }else if(act === "delete"){
        deleteMonthRecords(ym, null);   // existing confirmation dialog is kept
      }
    });
  }

  async function deleteMonthRecords(ym, btn){
    const monthRecords = records.filter(r => r.date.startsWith(ym));
    if(!monthRecords.length) return;

    const ok = await askConfirm(
      `Delete ${monthLabel(ym)} records? All ${monthRecords.length} entries will be permanently deleted. This action cannot be undone.`
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
      showToast("Failed to delete this month's records. Please try again.", "error");
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
        showToast("Attendance record deleted successfully.");
      }catch(err){
        console.error(err);
        showToast("Failed to delete entry. Please try again.", "error");
      }
      return;
    }

    const hideBtn = e.target.closest(".kh-reg-hide");
    if(hideBtn){
      const day = hideBtn.closest(".kh-reg-day");
      if(day){
        day.open = false;
        const sum = day.querySelector("summary");
        if(sum && sum.getBoundingClientRect().top < 90){
          sum.scrollIntoView({ block: "center", behavior: "smooth" });
        }
      }
      return;
    }

    const monthMenuBtn = e.target.closest(".kh-reg-month-menu");
    if(monthMenuBtn){
      e.preventDefault();
      e.stopPropagation();
      openMonthSheet(monthMenuBtn.dataset.ym);
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

  filterMember.addEventListener("change", () => {
    const m = members.find(x => x.name === filterMember.value);
    selectedMemberId = m ? m.id : null;
    renderRegister();
    renderMembers();
  });

  function getMonthRecordsForExport(ym){
    const filter = filterMember.value;
    return records
      .filter(r => r.date.startsWith(ym))
      .filter(r => filter === "All" || r.member === filter)
      .slice().sort((a,b) => a.date.localeCompare(b.date));
  }

  // Advance numbers for one member in one month, from the history log.
  function advanceStatsFor(member, ym){
    const log = Array.isArray(member && member.advanceLog) ? member.advanceLog : [];
    let taken = 0, deducted = 0, all = 0;
    const entries = [];
    log.forEach(e => {
      const a = Number(e && e.a) || 0;
      all += a;
      if(e && typeof e.d === "string" && e.d.startsWith(ym)){
        if(a > 0) taken += a; else deducted += -a;
        entries.push({ d: e.d, a });
      }
    });
    entries.sort((x, y) => x.d.localeCompare(y.d));
    const balance = member && typeof member.advance === "number" ? member.advance : 0;
    const untracked = Math.round((balance - all) * 100) / 100;   // part of the balance saved before history existed
    return { taken, deducted, balance, entries, untracked };
  }

  function exportMonthCsv(ym, btn){
    khBounce(btn);
    const monthRecords = getMonthRecordsForExport(ym);

    if(!monthRecords.length){
      alert(`No records for ${monthLabel(ym)} yet.`);
      return;
    }

    const header = ["Date","Name","Status","Hours"];
    const rows = monthRecords.map(r => [
      r.date,
      r.member,
      r.status === "duty" ? "Present" : "Leave",
      r.status === "duty" ? r.hours : ""
    ]);
    // Advance section (this month's history + current balance), for the members in this export.
    const csvNames = Array.from(new Set(monthRecords.map(r => r.member))).sort((a, b) => a.localeCompare(b));
    const csvMembers = csvNames.map(n => members.find(x => x.name === n)).filter(Boolean);
    const advSummary = csvMembers.map(m => {
      const st = advanceStatsFor(m, ym);
      return [m.name, st.taken.toFixed(2), st.deducted.toFixed(2), st.balance.toFixed(2)];
    });
    const advEntries = [];
    csvMembers.forEach(m => advanceStatsFor(m, ym).entries.forEach(e => advEntries.push([e.d, m.name, e.a > 0 ? "Taken" : "Deducted", Math.abs(e.a).toFixed(2)])));
    advEntries.sort((x, y) => x[0].localeCompare(y[0]) || x[1].localeCompare(y[1]));
    const advanceBlock = [
      [],
      ["Advance summary (" + monthLabel(ym) + ")"],
      ["Name", "Advance Taken (RM)", "Deducted (RM)", "Current Balance (RM)"],
      ...advSummary,
      [],
      ["Advance details (" + monthLabel(ym) + ")"],
      ["Date", "Name", "Type", "Amount (RM)"],
      ...(advEntries.length ? advEntries : [["No advance recorded this month"]])
    ];

    const csvContent = [header, ...rows, ...advanceBlock]
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
  }

  async function exportMonthPdf(ym, btn){
    if(!(await ensurePdfLibs())){
      alert("PDF generation library failed to load. Please check your internet connection and try again.");
      return;
    }

    khBounce(btn);
    const filter = filterMember.value;
    const monthRecords = getMonthRecordsForExport(ym);

    if(!monthRecords.length){
      alert(`No records for ${monthLabel(ym)} yet.`);
      return;
    }

    btn.disabled = true;
    const originalLabel = btn.innerHTML;
    btn.innerHTML = `${ICON_SPINNER}Generating PDF...`;

    try{
      await generatePdfReport(ym, monthRecords, filter);
    }catch(err){
      console.error(err);
      alert("Failed to generate PDF. Please try again.");
    }finally{
      btn.disabled = false;
      btn.innerHTML = originalLabel;
    }
  }

  // Top buttons: current month. Each month in the register has its own PDF/CSV buttons.
  downloadCsvBtn.addEventListener("click", () => exportMonthCsv(currentYearMonth(), downloadCsvBtn));
  downloadPdfBtn.addEventListener("click", () => exportMonthPdf(currentYearMonth(), downloadPdfBtn));

  async function generatePdfReport(ym, monthRecords, filter){
    const byMember = {};
    monthRecords.forEach(r => {
      if(!byMember[r.member]) byMember[r.member] = { present:0, absent:0, hours:0 };
      if(r.status === "duty"){ byMember[r.member].present++; byMember[r.member].hours += (r.hours || 0); }
      else{ byMember[r.member].absent++; }
    });
    const memberNames = Object.keys(byMember).sort((a,b) => a.localeCompare(b));
    const totalHoursAll = memberNames.reduce((sum,n) => sum + byMember[n].hours, 0);

    const PDF_BLUE   = "#0F4C81";
    const PDF_INK    = "#172033";
    const PDF_MUTED  = "#667085";
    const PDF_BORDER = "#E4E7EC";
    const PDF_LIGHT  = "#F8FAFC";
    const PDF_GREEN  = "#16A085";

    function prettyDate(dateStr){
      const d = new Date(dateStr + "T00:00:00");
      return d.toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" });
    }
    function dayName(dateStr){
      const d = new Date(dateStr + "T00:00:00");
      return d.toLocaleDateString("en-US", { weekday:"long" });
    }
    function money(n){
      return `RM ${(n || 0).toFixed(2)}`;
    }
    function reportIdFor(suffix){
      const clean = String(suffix || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0,3) || "GEN";
      return `WT-${ym}-${clean}`;
    }

    const singleMember = filter !== "All" ? members.find(m => m.name === filter) : null;
    const [yy, mm] = ym.split("-");
    const daysInMonth = new Date(Number(yy), Number(mm), 0).getDate();
    const periodLabel = `01 ${monthLabel(ym).split(" ")[0].slice(0,3)} ${yy} — ${String(daysInMonth).padStart(2,"0")} ${monthLabel(ym).split(" ")[0].slice(0,3)} ${yy}`;

    const kpiCard = (label, value, sub) => `
      <div style="flex:1; background:${PDF_LIGHT}; border:1px solid ${PDF_BORDER}; border-radius:8px; padding:14px 12px;">
        <div style="font-size:8.5px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:${PDF_MUTED};">${label}</div>
        <div style="font-size:19px; font-weight:800; color:${PDF_INK}; margin:5px 0 2px;">${value}</div>
        <div style="font-size:8.5px; color:${PDF_MUTED};">${sub}</div>
      </div>`;

    let identityBlockHtml, kpiCardsHtml, teamSummaryHtml = "", detailRowsHtml, tableColsHead, reportId, totalHoursLabelVal;

    if(singleMember){
      const stats = byMember[singleMember.name] || { present:0, absent:0, hours:0 };
      const advSingle = advanceStatsFor(singleMember, ym);
      const initial = (singleMember.name || "?").trim().charAt(0).toUpperCase();
      identityBlockHtml = `
        <div style="display:flex; align-items:center; gap:14px; background:${PDF_LIGHT}; border:1px solid ${PDF_BORDER}; border-radius:10px; padding:14px 18px; margin-bottom:20px;">
          <div style="width:42px; height:42px; line-height:42px; border-radius:50%; background:${PDF_BLUE}; color:#fff; text-align:center; font-weight:800; font-size:16px; flex-shrink:0;">${escapeHtml(initial)}</div>
          <div>
            <div style="font-size:8.5px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:${PDF_MUTED};">Employee</div>
            <div style="font-size:17px; font-weight:800; color:${PDF_INK}; margin:2px 0 3px;">${escapeHtml(singleMember.name)}</div>
            <div style="font-size:9px; color:${PDF_MUTED};">Monthly Attendance Report — ${monthLabel(ym)}</div>
          </div>
        </div>`;
      kpiCardsHtml = `
        <div style="display:flex; gap:10px; margin-bottom:22px;">
          ${kpiCard("Present", toBn(stats.present), "Work Days")}
          ${kpiCard("Leave", toBn(stats.absent), "Leave Days")}
          ${kpiCard("Total Hours", toBn(stats.hours), "Hours")}
          ${kpiCard("Advance Taken", money(advSingle.taken), `Balance ${money(advSingle.balance)}`)}
        </div>`;
      detailRowsHtml = monthRecords
        .filter(r => r.member === singleMember.name)
        .slice().sort((a,b) => a.date.localeCompare(b.date))
        .map(r => `
          <tr>
            <td class="pdf-td pdf-td-left">${escapeHtml(prettyDate(r.date))}</td>
            <td class="pdf-td pdf-td-left">${escapeHtml(dayName(r.date))}</td>
            <td class="pdf-td pdf-td-left">
              <span style="color:${r.status === "duty" ? PDF_GREEN : PDF_MUTED}; font-weight:700;">${r.status === "duty" ? "PRESENT" : "LEAVE"}</span>
            </td>
            <td class="pdf-td pdf-td-right">${r.status === "duty" ? toBn(r.hours) : "—"}</td>
          </tr>`).join("");
      tableColsHead = `<th class="pdf-th pdf-th-left">Date</th><th class="pdf-th pdf-th-left">Day</th><th class="pdf-th pdf-th-left">Status</th><th class="pdf-th pdf-th-right">Work Hours</th>`;
      reportId = reportIdFor(singleMember.memberId || singleMember.name);
      totalHoursLabelVal = `${toBn(stats.hours)} hrs`;
    }else{
      identityBlockHtml = `
        <div style="display:flex; align-items:center; gap:14px; background:${PDF_LIGHT}; border:1px solid ${PDF_BORDER}; border-radius:10px; padding:14px 18px; margin-bottom:20px;">
          <div>
            <div style="font-size:8.5px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:${PDF_MUTED};">Team</div>
            <div style="font-size:17px; font-weight:800; color:${PDF_INK}; margin:2px 0 3px;">All Members</div>
            <div style="font-size:9px; color:${PDF_MUTED};">Monthly Attendance Report — ${monthLabel(ym)}</div>
          </div>
        </div>`;
      const totalPresentAll = memberNames.reduce((sum,n) => sum + byMember[n].present, 0);
      const totalLeaveAll   = memberNames.reduce((sum,n) => sum + byMember[n].absent, 0);
      const advTakenAll = memberNames.reduce((sum,n) => sum + advanceStatsFor(members.find(x => x.name === n), ym).taken, 0);
      const advBalanceAll = memberNames.reduce((sum,n) => sum + advanceStatsFor(members.find(x => x.name === n), ym).balance, 0);
      kpiCardsHtml = `
        <div style="display:flex; gap:10px; margin-bottom:22px;">
          ${kpiCard("Present", toBn(totalPresentAll), "Work Days")}
          ${kpiCard("Leave", toBn(totalLeaveAll), "Leave Days")}
          ${kpiCard("Total Hours", toBn(totalHoursAll), "Hours")}
          ${kpiCard("Advance Taken", money(advTakenAll), `Balance ${money(advBalanceAll)}`)}
        </div>`;

      const summaryRowsHtml = memberNames.map(name => {
        const d = byMember[name];
        const m = members.find(x => x.name === name);
        const adv = advanceStatsFor(m, ym);
        return `
          <tr>
            <td class="pdf-td pdf-td-left" style="font-weight:700;">${escapeHtml(name)}</td>
            <td class="pdf-td pdf-td-center">${toBn(d.present)}</td>
            <td class="pdf-td pdf-td-center">${toBn(d.absent)}</td>
            <td class="pdf-td pdf-td-center">${toBn(d.hours)}</td>
            <td class="pdf-td pdf-td-right">${money(adv.taken)}</td>
            <td class="pdf-td pdf-td-right">${money(adv.balance)}${Math.abs(adv.untracked) >= 0.01 ? "*" : ""}</td>
          </tr>`;
      }).join("");
      teamSummaryHtml = `
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
          <div style="width:3px; height:16px; background:${PDF_BLUE}; border-radius:2px;"></div>
          <div style="font-size:14px; font-weight:700; color:${PDF_INK};">Per-Member Summary</div>
        </div>
        <table class="pdf-table" style="margin-bottom:24px;">
          <thead><tr>
            <th class="pdf-th pdf-th-left">Name</th>
            <th class="pdf-th">Present</th>
            <th class="pdf-th">Leave</th>
            <th class="pdf-th">Total Hours</th>
            <th class="pdf-th pdf-th-right">Advance Taken</th>
            <th class="pdf-th pdf-th-right">Balance</th>
          </tr></thead>
          <tbody>${summaryRowsHtml}</tbody>
        </table>`;
      detailRowsHtml = monthRecords
        .slice().sort((a,b) => a.date.localeCompare(b.date) || a.member.localeCompare(b.member))
        .map(r => `
          <tr>
            <td class="pdf-td pdf-td-left">${escapeHtml(prettyDate(r.date))}</td>
            <td class="pdf-td pdf-td-left">${escapeHtml(r.member)}</td>
            <td class="pdf-td pdf-td-left">
              <span style="color:${r.status === "duty" ? PDF_GREEN : PDF_MUTED}; font-weight:700;">${r.status === "duty" ? "PRESENT" : "LEAVE"}</span>
            </td>
            <td class="pdf-td pdf-td-right">${r.status === "duty" ? toBn(r.hours) : "—"}</td>
          </tr>`).join("");
      tableColsHead = `<th class="pdf-th pdf-th-left">Date</th><th class="pdf-th pdf-th-left">Name</th><th class="pdf-th pdf-th-left">Status</th><th class="pdf-th pdf-th-right">Work Hours</th>`;
      reportId = reportIdFor("ALL");
      totalHoursLabelVal = `${toBn(totalHoursAll)} hrs`;
    }

    // ----- Advance details for this month (who took how much, and when) -----
    const advTargets = singleMember ? [singleMember] : memberNames.map(n => members.find(x => x.name === n)).filter(Boolean);
    const advEntriesPdf = [];
    let advTakenTotal = 0, advDeductedTotal = 0, advUntrackedTotal = 0;
    advTargets.forEach(m => {
      const st = advanceStatsFor(m, ym);
      advTakenTotal += st.taken; advDeductedTotal += st.deducted;
      if(Math.abs(st.untracked) >= 0.01) advUntrackedTotal += st.untracked;
      st.entries.forEach(e => advEntriesPdf.push({ name: m.name, d: e.d, a: e.a }));
    });
    advEntriesPdf.sort((x, y) => x.d.localeCompare(y.d) || x.name.localeCompare(y.name));
    const advRowsHtml = advEntriesPdf.map(e => `
      <tr>
        <td class="pdf-td pdf-td-left">${escapeHtml(prettyDate(e.d))}</td>
        <td class="pdf-td pdf-td-left">${escapeHtml(e.name)}</td>
        <td class="pdf-td pdf-td-left"><span style="color:${e.a > 0 ? PDF_BLUE : PDF_MUTED}; font-weight:700;">${e.a > 0 ? "TAKEN" : "DEDUCTED"}</span></td>
        <td class="pdf-td pdf-td-right">${money(Math.abs(e.a))}</td>
      </tr>`).join("");
    const advNoteHtml = Math.abs(advUntrackedTotal) >= 0.01
      ? `<div style="font-size:9px; color:${PDF_MUTED}; margin-top:10px;">* Current balance includes ${money(advUntrackedTotal)} saved before advance history started (dates not available).</div>`
      : "";
    const advanceSectionHtml = `
      <div style="display:flex; align-items:center; gap:8px; margin:26px 0 12px;">
        <div style="width:3px; height:16px; background:${PDF_BLUE}; border-radius:2px;"></div>
        <div style="font-size:14px; font-weight:700; color:${PDF_INK};">Advance Details — ${monthLabel(ym)}</div>
      </div>
      ${advEntriesPdf.length ? `
        <table class="pdf-table">
          <thead><tr>
            <th class="pdf-th pdf-th-left">Date</th><th class="pdf-th pdf-th-left">Name</th>
            <th class="pdf-th pdf-th-left">Type</th><th class="pdf-th pdf-th-right">Amount</th>
          </tr></thead>
          <tbody>${advRowsHtml}</tbody>
          <tfoot>
            <tr class="pdf-tfoot-row"><td class="pdf-td pdf-td-left" style="font-weight:800;" colspan="3">Total Advance Taken</td><td class="pdf-td pdf-td-right" style="font-weight:800;">${money(advTakenTotal)}</td></tr>
            ${advDeductedTotal > 0 ? `<tr class="pdf-tfoot-row"><td class="pdf-td pdf-td-left" style="font-weight:800;" colspan="3">Total Deducted</td><td class="pdf-td pdf-td-right" style="font-weight:800;">${money(advDeductedTotal)}</td></tr>` : ""}
          </tfoot>
        </table>`
      : `<div style="font-size:10px; color:${PDF_MUTED};">No advance recorded for ${monthLabel(ym)}.</div>`}
      ${advNoteHtml}`;

    const wrap = document.createElement("div");
    wrap.id = "pdfReportRoot";
    wrap.style.cssText = `position:fixed; left:-99999px; top:0; width:800px; background:#fff; padding:40px 34px 30px; font-family:'Inter','Hind Siliguri',sans-serif; color:${PDF_INK};`;
    wrap.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; padding-bottom:16px; border-bottom:1px solid ${PDF_BORDER}; margin-bottom:26px;">
        <div style="display:flex; align-items:center; gap:14px;">
          <img src="masum.png" style="height:42px; object-fit:contain;" crossorigin="anonymous">
          <div>
            <div style="font-size:13px; font-weight:800; color:${PDF_INK}; letter-spacing:.03em;">WORKTRACK</div>
            <div style="font-size:9px; color:${PDF_MUTED};">Attendance &amp; Workforce Management</div>
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:11px; font-weight:800; color:${PDF_BLUE}; letter-spacing:.05em;">ATTENDANCE REPORT</div>
          <div style="font-size:9px; color:${PDF_MUTED}; margin-top:2px;">${monthLabel(ym)}</div>
        </div>
      </div>

      <div style="margin-bottom:22px;">
        <div style="font-size:24px; font-weight:800; color:${PDF_INK};">Attendance Report</div>
        <div style="font-size:10.5px; color:${PDF_MUTED}; margin-top:4px;">${periodLabel}</div>
      </div>

      ${identityBlockHtml}
      ${kpiCardsHtml}
      ${teamSummaryHtml}

      <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
        <div style="width:3px; height:16px; background:${PDF_BLUE}; border-radius:2px;"></div>
        <div style="font-size:14px; font-weight:700; color:${PDF_INK};">Daily Attendance Details</div>
      </div>

      <table class="pdf-table">
        <thead><tr>${tableColsHead}</tr></thead>
        <tbody>${detailRowsHtml}</tbody>
        <tfoot>
          <tr class="pdf-tfoot-row">
            <td class="pdf-td pdf-td-left" style="font-weight:800;" colspan="3">Total Work Hours</td>
            <td class="pdf-td pdf-td-right" style="font-weight:800;">${totalHoursLabelVal}</td>
          </tr>
        </tfoot>
      </table>
      ${advanceSectionHtml}
    `;

    const style = document.createElement("style");
    style.textContent = `
      #pdfReportRoot .pdf-table{ width:100%; border-collapse:collapse; font-size:10px; }
      #pdfReportRoot .pdf-th{
        background:${PDF_BLUE}; color:#fff; padding:9px 10px; text-align:center;
        vertical-align:middle; font-weight:600; text-transform:uppercase; font-size:8.5px; letter-spacing:.04em;
      }
      #pdfReportRoot .pdf-th-left{ text-align:left; }
      #pdfReportRoot .pdf-th-right{ text-align:right; }
      #pdfReportRoot .pdf-td{
        padding:9px 10px; text-align:center; vertical-align:middle;
        border-bottom:1px solid ${PDF_BORDER}; line-height:1.4; font-size:10px;
      }
      #pdfReportRoot .pdf-td-left{ text-align:left; }
      #pdfReportRoot .pdf-td-right{ text-align:right; }
      #pdfReportRoot .pdf-tfoot-row td{ background:${PDF_LIGHT}; border-bottom:none; border-top:1px solid ${PDF_BORDER}; }
      #pdfReportRoot tr{ height:34px; }
    `;
    document.body.appendChild(style);
    document.body.appendChild(wrap);

    const FOOTER_MARGIN_MM = 14;
    const generatedAt = new Date().toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" });

    function drawFooter(pdf, pageNum, totalPages, pageWidthMM, pageHeightMM){
      const bandTop = pageHeightMM - FOOTER_MARGIN_MM - 8;
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, bandTop, pageWidthMM, pageHeightMM - bandTop, "F");
      const y = pageHeightMM - FOOTER_MARGIN_MM;
      pdf.setDrawColor(228, 231, 236);
      pdf.setLineWidth(0.2);
      pdf.line(16, y - 5, pageWidthMM - 16, y - 5);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(7.5);
      pdf.setTextColor(23, 32, 51);
      pdf.text("masumcpex.com", 16, y);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(102, 112, 133);
      pdf.text("info@masumcpex.com", 16, y + 4);
      pdf.text(`Report ID: ${reportId}`, pageWidthMM / 2 - 15, y);
      const rightText1 = `Generated: ${generatedAt}`;
      const rightText2 = `Page ${pageNum} of ${totalPages}`;
      pdf.text(rightText1, pageWidthMM - 16, y, { align: "right" });
      pdf.text(rightText2, pageWidthMM - 16, y + 4, { align: "right" });
    }

    try{
      const canvas = await window.html2canvas(wrap, { scale:2, useCORS:true, backgroundColor:"#ffffff" });
      const { jsPDF } = window.jspdf;

      const A4_WIDTH_MM  = 210;
      const A4_HEIGHT_MM = 297;
      const CONTENT_HEIGHT_MM = A4_HEIGHT_MM - FOOTER_MARGIN_MM - 8;
      const imgWidthMM  = A4_WIDTH_MM;
      const imgHeightMM = (canvas.height * imgWidthMM) / canvas.width;
      const imgData = canvas.toDataURL("image/jpeg", 0.95);

      const totalPages = Math.max(1, Math.ceil(imgHeightMM / CONTENT_HEIGHT_MM));
      const pdf = new jsPDF({ orientation:"portrait", unit:"mm", format:"a4" });

      for(let page = 0; page < totalPages; page++){
        if(page > 0) pdf.addPage();
        const position = -(page * CONTENT_HEIGHT_MM);
        pdf.addImage(imgData, "JPEG", 0, position, imgWidthMM, imgHeightMM);
        drawFooter(pdf, page + 1, totalPages, A4_WIDTH_MM, A4_HEIGHT_MM);
      }
      pdf.save(`attendance-report-${ym}${singleMember ? "-" + singleMember.name : ""}.pdf`);
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

  // ================= Share Attendance (view-only links) + Reports =================
  // Security model (enforced by Firestore Rules, not by hiding buttons):
  //  - each link = one document in `attendance_shares`, whose ID is a 256-bit random token
  //  - that document contains ONLY one member's attendance (name, date, status, hours)
  //  - nobody can list the collection, so tokens can't be discovered; the owner alone can write
  //  - disabling clears the data in that document, so the old link shows nothing
  let shares = [];                // this owner's share docs: { id: token, memberId, active, hash, memberName, ... }
  let sharesLoaded = false;
  let reports = [];               // this owner's OPEN reports
  let reportsListenerOk = false;
  let shareSyncTimer = null;
  let shareModalMemberId = null;

  function makeShareToken(){
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    let bin = "";
    bytes.forEach(b => { bin += String.fromCharCode(b); });
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  function hashShareData(str){
    let h1 = 0x811c9dc5, h2 = 5381;
    for(let i = 0; i < str.length; i++){
      const c = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ c, 16777619) >>> 0;
      h2 = (((h2 << 5) + h2) ^ c) >>> 0;
    }
    return h1.toString(36) + "-" + h2.toString(36) + "-" + str.length;
  }

  // Only the minimum the viewer needs: date, status, hours — for ONE member. No advance, no other members.
  function buildSharePayload(member){
    const recs = records
      .filter(r => r.member === member.name && r.date)
      .map(r => ({ d: r.date, s: r.status === "duty" ? "duty" : "leave", h: r.status === "duty" ? (Number(r.hours) || 0) : 0 }))
      .sort((a, b) => a.d.localeCompare(b.d));
    const dates = Array.from(new Set(recs.map(r => r.d)));
    const hash = hashShareData(member.name + "|" + recs.map(r => r.d + r.s + r.h).join(","));
    return { memberName: member.name, records: recs, dates, hash };
  }

  function activeShareFor(memberId){
    return shares.find(x => x.memberId === memberId && x.active === true) || null;
  }

  async function syncShares(){
    if(!membersLoaded || !recordsLoaded || !sharesLoaded) return;   // never push half-loaded (empty) data
    for(const sh of shares){
      if(sh.active !== true) continue;
      const ref = doc(db, SHARE_COLLECTION, sh.id);
      const m = members.find(x => x.id === sh.memberId);
      try{
        if(!m){
          await updateDoc(ref, { active: false, memberName: "", records: [], dates: [], hash: "", disabledAt: serverTimestamp(), updatedAt: serverTimestamp() });
          continue;
        }
        const payload = buildSharePayload(m);
        if(payload.hash === sh.hash && payload.memberName === sh.memberName) continue;   // nothing changed → no write
        await updateDoc(ref, { ...payload, updatedAt: serverTimestamp() });
      }catch(err){
        console.warn("Share sync failed:", err);
      }
    }
  }

  function scheduleShareSync(){
    if(!shares.length) return;
    clearTimeout(shareSyncTimer);
    shareSyncTimer = setTimeout(syncShares, 1200);   // batches bursts (e.g. Delete Month) into one write
  }

  async function copyToClipboard(text){
    try{
      if(navigator.clipboard && window.isSecureContext){
        await navigator.clipboard.writeText(text);
        return true;
      }
    }catch(_){}
    try{
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;left:-9999px;top:0;";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    }catch(_){ return false; }
  }

  function mountKhModal(id, innerHtml, extraClass){
    const old = document.getElementById(id);
    if(old) old.remove();
    const overlay = document.createElement("div");
    overlay.id = id;
    overlay.className = "kh-modal-overlay kh-share-overlay";
    overlay.innerHTML = `<div class="kh-modal-card kh-share-card ${extraClass || ""}" role="dialog" aria-modal="true">
      <button type="button" class="kh-modal-x" data-close aria-label="Close">${ICON_CLOSE}</button>
      ${innerHtml}
    </div>`;
    document.body.appendChild(overlay);
    overlay.style.display = "flex";
    const onKey = ev => { if(ev.key === "Escape") close(); };
    function close(){
      document.removeEventListener("keydown", onKey);
      overlay.remove();
      if(id === "khShareModal") shareModalMemberId = null;
    }
    document.addEventListener("keydown", onKey);
    overlay.addEventListener("click", ev => {
      if(ev.target === overlay || ev.target.closest("[data-close]")) close();
    });
    return { overlay, close };
  }

  function shareModalHtml(member){
    const sh = activeShareFor(member.id);
    const everShared = shares.some(x => x.memberId === member.id);
    const status = sh ? `<span class="kh-dot is-on"></span>Active`
      : everShared ? `<span class="kh-dot"></span>Disabled`
      : `<span class="kh-dot"></span>Not created`;
    const yes = t => `<div class="kh-share-perm is-yes">${ICON_CHECK}${t}</div>`;
    const no = t => `<div class="kh-share-perm is-no">${ICON_CLOSE}${t}</div>`;
    const actions = sh
      ? `<button type="button" class="kh-share-btn" data-share-act="copy">${ICON_COPY}Copy Link</button>
         <button type="button" class="kh-share-btn is-danger" data-share-act="disable">${ICON_BAN}Disable Link</button>`
      : `<button type="button" class="kh-share-btn" data-share-act="create">${ICON_SHARE}${everShared ? "Create New Link" : "Create Link"}</button>`;
    return `
      <div class="kh-share-head">
        <span class="kh-share-head-ico">${ICON_SHARE}</span>
        <h3 class="kh-share-title">Share Attendance</h3>
      </div>
      <div class="kh-share-row"><span>Member</span><span>${escapeHtml(member.name)}</span></div>
      <div class="kh-share-row"><span>Access</span><span><span class="kh-dot is-on"></span>View only</span></div>
      <div class="kh-share-perms">
        ${yes("View attendance")}${yes("View work hours")}${yes("Download PDF")}${yes("Report an issue")}
        ${no("Add attendance")}${no("Edit attendance")}${no("Delete attendance")}
      </div>
      <div class="kh-share-row"><span>Link status</span><span>${status}</span></div>
      <div class="kh-share-row"><span>Expiration</span><span>No expiration</span></div>
      <div class="kh-share-actions">${actions}</div>
      <p class="kh-share-note">${sh
        ? "Anyone with this link can see only this member's attendance. Disable it any time."
        : "Creating a link shares only this member's date, status and work hours. No advance or other members."}</p>
      <div id="khShareManualBox"></div>`;
  }

  function openShareModal(member){
    shareModalMemberId = member.id;
    const { overlay } = mountKhModal("khShareModal", shareModalHtml(member));
    overlay.addEventListener("click", async ev => {
      const btn = ev.target.closest("[data-share-act]");
      if(!btn) return;
      const act = btn.dataset.shareAct;
      const m = members.find(x => x.id === member.id);
      if(!m) return;

      if(act === "create"){
        if(!membersLoaded || !recordsLoaded){ showToast("Please wait, data is still loading.", "warning"); return; }
        btn.disabled = true;
        try{
          await setDoc(doc(db, SHARE_COLLECTION, makeShareToken()), {
            ownerId: uid,
            memberId: m.id,
            ...buildSharePayload(m),
            active: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
          showToast("Share link created.");
        }catch(err){
          console.error(err);
          btn.disabled = false;
          showToast("Could not create the link. Sharing needs the new Firestore Rules to be published first.", "error");
        }
        return;
      }

      const sh = activeShareFor(m.id);
      if(!sh) return;

      if(act === "copy"){
        const url = SHARE_VIEW_URL + "?token=" + encodeURIComponent(sh.id);
        const ok = await copyToClipboard(url);
        if(ok){
          showToast("Attendance view link copied");
        }else{
          const box = overlay.querySelector("#khShareManualBox");
          box.innerHTML = `<input class="kh-share-manual" readonly value="${escapeHtml(url)}" aria-label="Share link">`;
          const inp = box.querySelector("input");
          inp.focus(); inp.select();
          showToast("Copy was blocked. Select the link and copy it manually.", "warning");
        }
        return;
      }

      if(act === "disable"){
        const ok = await askConfirm("Disable this link? Anyone using it will lose access immediately.");
        if(!ok) return;
        btn.disabled = true;
        try{
          await updateDoc(doc(db, SHARE_COLLECTION, sh.id), {
            active: false, memberName: "", records: [], dates: [], hash: "",
            disabledAt: serverTimestamp(), updatedAt: serverTimestamp()
          });
          showToast("Link disabled.");
        }catch(err){
          console.error(err);
          btn.disabled = false;
          showToast("Could not disable the link. Please try again.", "error");
        }
      }
    });
  }

  function refreshShareModal(){
    if(!shareModalMemberId) return;
    const overlay = document.getElementById("khShareModal");
    if(!overlay){ shareModalMemberId = null; return; }
    const m = members.find(x => x.id === shareModalMemberId);
    if(!m) return;
    const card = overlay.querySelector(".kh-share-card");
    const x = card.querySelector("[data-close]");
    card.innerHTML = "";
    card.appendChild(x);
    card.insertAdjacentHTML("beforeend", shareModalHtml(m));
  }

  // ---------- Reports inbox ----------
  function reportDateLabel(dateStr){
    if(!dateStr) return "No date selected";
    return regDateLabel(dateStr);
  }
  function reportTime(rep){
    const t = rep.createdAt && rep.createdAt.seconds ? rep.createdAt.seconds : 0;
    return t;
  }

  function ensureReportsCard(){
    let card = document.getElementById("sectionReports");
    if(card) return card;
    const anchorEl = document.getElementById("attendanceRegisterSection");
    if(!anchorEl) return null;
    card = document.createElement("section");
    card.id = "sectionReports";
    card.className = "kh-card kh-card--amber";
    card.style.display = "none";
    card.innerHTML = `
      <div class="kh-rep-head"><h2 class="kh-card-title" style="margin:0;">Attendance Reports</h2><span class="kh-rep-count" id="khRepCount"><span class="kh-rep-dot" aria-hidden="true"></span>0</span></div>
      <div class="kh-rep-clear" id="khRepEmpty" style="display:none;">${ICON_CHECK}<div>All clear<small>No open attendance reports</small></div></div>
      <div class="kh-rep-list" id="khRepList"></div>
      <button type="button" class="kh-rep-toggle" id="khRepResolvedBtn">Show resolved</button>
      <div class="kh-rep-list" id="khRepResolvedList"></div>`;
    anchorEl.parentNode.insertBefore(card, anchorEl);
    makeCollapsible(card, card.querySelector(".kh-rep-head"), "reports");
    card.addEventListener("click", ev => {
      const rv = ev.target.closest("[data-rep-id]");
      if(rv){
        const rep = reports.find(x => x.id === rv.dataset.repId) || resolvedReports.find(x => x.id === rv.dataset.repId);
        if(rep) openReportModal(rep);
        return;
      }
      if(ev.target.closest("#khRepResolvedBtn")) loadResolvedReports();
    });
    return card;
  }

  let resolvedReports = [];
  function reportItemHtml(rep){
    return `
      <div class="kh-rep-item">
        <b>${escapeHtml(rep.memberName || "Member")}</b>
        <span class="kh-rep-meta">${escapeHtml(reportDateLabel(rep.date))} · ${escapeHtml(REPORT_CATEGORIES[rep.category] || "Other")}</span>
        ${rep.message ? `<p class="kh-rep-msg">“${escapeHtml(rep.message)}”</p>` : ""}
        <button type="button" class="kh-share-btn is-ghost" data-rep-id="${escapeHtml(rep.id)}">Review</button>
      </div>`;
  }

  function renderReportsCard(){
    if(!reportsListenerOk) return;
    const card = ensureReportsCard();
    if(!card) return;
    card.style.display = "";
    const badge = card.querySelector("#khRepCount");
    badge.innerHTML = `<span class="kh-rep-dot" aria-hidden="true"></span>${reports.length} open`;
    badge.style.display = reports.length ? "" : "none";
    card.querySelector("#khRepEmpty").style.display = reports.length ? "none" : "";
    card.querySelector("#khRepList").innerHTML = reports.slice().sort((a, b) => reportTime(b) - reportTime(a)).map(reportItemHtml).join("");
  }

  async function loadResolvedReports(){
    const btn = document.getElementById("khRepResolvedBtn");
    const list = document.getElementById("khRepResolvedList");
    if(list.dataset.open === "1"){
      list.innerHTML = ""; list.dataset.open = ""; btn.textContent = "Show resolved";
      return;
    }
    btn.disabled = true;
    try{
      const snap = await getDocs(query(collection(db, REPORT_COLLECTION), where("ownerId", "==", uid), where("status", "==", "resolved")));
      resolvedReports = snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => reportTime(b) - reportTime(a));
      list.innerHTML = resolvedReports.length ? resolvedReports.map(reportItemHtml).join("") : `<p class="kh-rep-empty">No resolved reports.</p>`;
      list.dataset.open = "1";
      btn.textContent = "Hide resolved";
    }catch(err){
      console.error(err);
      showToast("Could not load resolved reports.", "error");
    }finally{
      btn.disabled = false;
    }
  }

  function openReportModal(rep){
    const isOpen = rep.status !== "resolved";
    const { overlay, close } = mountKhModal("khReportModal", `
      <div class="kh-share-head">
        <span class="kh-share-head-ico">${ICON_FLAG}</span>
        <h3 class="kh-share-title">Report Details</h3>
      </div>
      <dl class="kh-rep-detail">
        <dt>Member</dt><dd>${escapeHtml(rep.memberName || "")}</dd>
        <dt>Date</dt><dd>${escapeHtml(reportDateLabel(rep.date))}</dd>
        <dt>Issue</dt><dd>${escapeHtml(REPORT_CATEGORIES[rep.category] || "Other")}</dd>
        <dt>Message</dt><dd>${rep.message ? escapeHtml(rep.message) : "—"}</dd>
        <dt>Status</dt><dd>${isOpen ? "Open" : "Resolved"}</dd>
      </dl>
      <div class="kh-share-actions">
        <button type="button" class="kh-share-btn is-ghost" data-rep-act="view">View Attendance</button>
        ${isOpen ? `<button type="button" class="kh-share-btn" data-rep-act="resolve">${ICON_CHECK}Mark as Resolved</button>` : ""}
      </div>`);
    overlay.addEventListener("click", async ev => {
      const b = ev.target.closest("[data-rep-act]");
      if(!b) return;
      if(b.dataset.repAct === "view"){
        close();
        const m = members.find(x => x.id === rep.memberId);
        if(m) filterMember.value = m.name;
        if(rep.date){
          regMonthOpen[rep.date.slice(0, 7)] = true;
          regDayOpen.add(rep.date);
        }
        renderRegister();
        const sec = document.getElementById("attendanceRegisterSection");
        if(sec) sec.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if(b.dataset.repAct === "resolve"){
        b.disabled = true;
        try{
          await updateDoc(doc(db, REPORT_COLLECTION, rep.id), { status: "resolved", resolvedAt: serverTimestamp() });
          showToast("Report marked as resolved.");
          close();
        }catch(err){
          console.error(err);
          b.disabled = false;
          showToast("Could not update the report. Please try again.", "error");
        }
      }
    });
  }
  // ================= /Share Attendance =================

  // ================= Dashboard sections: collapsible, Overview, Calendar, profile history =================
  // One source of truth: everything below reads the same `records` / `members` arrays as Monthly Summary
  // and the Attendance Register. No new Firebase listeners and no extra reads.
  const PDF_LIBS = [
    "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
  ];
  function loadScriptOnce(src){
    return new Promise(resolve => {
      const el = document.createElement("script");
      el.src = src; el.onload = () => resolve(true); el.onerror = () => resolve(false);
      document.head.appendChild(el);
    });
  }
  // PDF libraries are only needed when someone downloads a report, so they can load on demand.
  async function ensurePdfLibs(){
    if(window.html2canvas && window.jspdf) return true;
    const results = await Promise.all([
      window.html2canvas ? true : loadScriptOnce(PDF_LIBS[0]),
      window.jspdf ? true : loadScriptOnce(PDF_LIBS[1])
    ]);
    return results.every(Boolean) && !!window.html2canvas && !!window.jspdf;
  }

  function secStateGet(key){ try{ return localStorage.getItem("kh_sec_" + key); }catch(_){ return null; } }
  function secStateSet(key, v){ try{ localStorage.setItem("kh_sec_" + key, v); }catch(_){} }

  // Turns a card's title row into an accessible expand/collapse control (state remembered per device).
  function makeCollapsible(card, head, key, defaultCollapsed, onExpand){
    if(!card || !head || card.dataset.collapsible) return;
    card.dataset.collapsible = key;
    card.classList.add("kh-collapsible");
    head.classList.add("kh-sec-head", "kh-sec-toggle");
    head.setAttribute("role", "button");
    head.setAttribute("tabindex", "0");
    head.insertAdjacentHTML("beforeend", `<span class="kh-sec-chev" aria-hidden="true">${ICON_CHEV_DOWN}</span>`);
    const saved = secStateGet(key);
    const collapsed = saved === null ? !!defaultCollapsed : saved === "1";
    card.classList.toggle("kh-collapsed", collapsed);
    head.setAttribute("aria-expanded", String(!collapsed));
    const toggle = () => {
      const now = card.classList.toggle("kh-collapsed");
      head.setAttribute("aria-expanded", String(!now));
      secStateSet(key, now ? "1" : "0");
      if(!now && onExpand) onExpand();
    };
    head.addEventListener("click", e => { if(e.target.closest("a, select, input")) return; toggle(); });
    head.addEventListener("keydown", e => { if(e.key === "Enter" || e.key === " "){ e.preventDefault(); toggle(); } });
  }
  const isCollapsed = card => !card || card.classList.contains("kh-collapsed");

  // ---- Shared month numbers: the same rules as Monthly Summary ----
  function monthTotals(ym){
    let duty = 0, leave = 0, hours = 0;
    records.forEach(r => {
      if(!r.date || !r.date.startsWith(ym)) return;
      if(r.status === "duty"){ duty++; hours += (Number(r.hours) || 0); } else leave++;
    });
    return { duty, leave, hours };
  }

  // ---- Attendance Overview ----
  let overviewCard = null;
  function ensureOverviewCard(){
    if(overviewCard) return overviewCard;
    const anchorEl = document.getElementById("sectionAttendance");
    if(!anchorEl) return null;
    overviewCard = document.createElement("section");
    overviewCard.id = "sectionOverview";
    overviewCard.className = "kh-card kh-card--mint";
    overviewCard.innerHTML = `
      <h2 class="kh-card-title">Attendance Overview</h2>
      <div class="kh-ov-top"><label for="khOvMonth" style="font-weight:700;">Month</label><select id="khOvMonth" aria-label="Overview month"></select></div>
      <div id="khOvBody"></div>`;
    anchorEl.insertAdjacentElement("afterend", overviewCard);
    overviewCard.querySelector("#khOvMonth").addEventListener("change", e => {
      if(summaryMonthSelect){ summaryMonthSelect.value = e.target.value; renderSummary(); }
      renderOverview();
    });
    return overviewCard;
  }
  function renderOverview(){
    const card = ensureOverviewCard();
    if(!card) return;
    const sel = card.querySelector("#khOvMonth");
    if(summaryMonthSelect){
      if(sel.innerHTML !== summaryMonthSelect.innerHTML) sel.innerHTML = summaryMonthSelect.innerHTML;
      sel.value = summaryMonthSelect.value;
    }
    const ym = (summaryMonthSelect && summaryMonthSelect.value) || currentYearMonth();
    const body = card.querySelector("#khOvBody");
    if(!recordsLoaded){ body.innerHTML = `<p class="kh-loading">Loading attendance...</p>`; return; }
    const t = monthTotals(ym);
    const total = t.duty + t.leave;
    if(!total){ body.innerHTML = `<p class="kh-empty-note" style="display:block;">No attendance data available for this period.</p>`; return; }
    const rate = Math.round((t.duty / total) * 100);
    const avg = t.duty ? Math.round((t.hours / t.duty) * 10) / 10 : 0;
    body.innerHTML = `
      <div class="kh-ov-grid">
        <div class="kh-ov-tile"><b>${rate}%</b><span>Present Rate</span><div class="kh-ov-bar" aria-hidden="true"><i style="width:${rate}%"></i></div></div>
        <div class="kh-ov-tile"><b>${t.duty}</b><span>Duty Days</span></div>
        <div class="kh-ov-tile"><b>${t.leave}</b><span>Leave Days</span></div>
        <div class="kh-ov-tile"><b>${fmtHours(t.hours)}h</b><span>Total Hours</span></div>
        <div class="kh-ov-tile"><b>${fmtHours(avg)}h</b><span>Average / Duty Day</span></div>
      </div>`;
  }

  // ---- Attendance Calendar ----
  let calCard = null, calYm = "", calSelected = "";
  function ensureCalendarCard(){
    if(calCard) return calCard;
    const sumTable = document.getElementById("summaryTable");
    const sumCard = sumTable ? sumTable.closest("section") : null;
    if(!sumCard) return null;
    if(!sumCard.id) sumCard.id = "sectionSummary";
    makeCollapsible(sumCard, sumCard.querySelector(".kh-card-title"), "summary", false);
    calCard = document.createElement("section");
    calCard.id = "sectionCalendar";
    calCard.className = "kh-card kh-card--sky";
    calCard.innerHTML = `
      <h2 class="kh-card-title">Attendance Calendar</h2>
      <div id="khCalBody"></div>`;
    sumCard.insertAdjacentElement("afterend", calCard);
    makeCollapsible(calCard, calCard.querySelector(".kh-card-title"), "calendar", true, () => renderCalendar());
    calCard.addEventListener("click", e => {
      const nav = e.target.closest("[data-cal]");
      if(nav){
        const act = nav.dataset.cal;
        if(act === "today"){ calYm = currentYearMonth(); calSelected = localTodayStr(); }
        else{
          const [y, m] = calYm.split("-").map(Number);
          const d = new Date(y, m - 1 + (act === "next" ? 1 : -1), 1);
          calYm = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
          calSelected = "";
        }
        renderCalendar();
        return;
      }
      const cell = e.target.closest("[data-date]");
      if(cell){ calSelected = cell.dataset.date; renderCalendar(); }
    });
    return calCard;
  }
  function renderCalendar(){
    const card = ensureCalendarCard();
    if(!card || isCollapsed(card)) return;          // secondary section: only render while it is open
    const body = card.querySelector("#khCalBody");
    if(!recordsLoaded){ body.innerHTML = `<p class="kh-loading">Loading attendance...</p>`; return; }
    if(!calYm){ calYm = currentYearMonth(); calSelected = localTodayStr(); }
    const [y, m] = calYm.split("-").map(Number);
    const daysInMonth = new Date(y, m, 0).getDate();
    const firstDow = (new Date(y, m - 1, 1).getDay() + 6) % 7;     // Monday first
    const byDate = {};
    records.forEach(r => { if(r.date && r.date.startsWith(calYm)) (byDate[r.date] = byDate[r.date] || []).push(r); });
    const today = localTodayStr();
    let cells = "";
    for(let i = 0; i < firstDow; i++) cells += `<div class="kh-cal-cell is-empty" aria-hidden="true"></div>`;
    for(let d = 1; d <= daysInMonth; d++){
      const ds = `${calYm}-${String(d).padStart(2, "0")}`;
      const list = byDate[ds];
      const cls = ["kh-cal-cell"];
      if(ds === today) cls.push("is-today");
      if(ds === calSelected) cls.push("is-selected");
      if(list){
        const s = regDaySummary(list);
        cls.push("has-data");
        cells += `<button type="button" class="${cls.join(" ")}" data-date="${ds}" aria-label="${regDateLabel(ds)}: ${s.present} present, ${s.leave} leave"${ds === calSelected ? ' aria-pressed="true"' : ""}>
          <span class="n">${d}</span>${s.present ? `<span class="p">✓${s.present}</span>` : ""}${s.leave ? `<span class="l">L${s.leave}</span>` : ""}</button>`;
      }else{
        cells += `<div class="${cls.join(" ")}"><span class="n" style="color:#98A2B3;">${d}</span></div>`;
      }
    }
    const dows = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(x => `<div class="kh-cal-dow">${x}</div>`).join("");
    let detail = `<p class="kh-empty-note" style="display:block;">Select a date to see attendance.</p>`;
    if(calSelected && calSelected.startsWith(calYm)){
      const list = byDate[calSelected];
      if(list){
        const s = regDaySummary(list);
        detail = `<h4>${regDateLabel(calSelected)}</h4>
          <p class="sub">${s.members} ${s.members === 1 ? "Member" : "Members"} · ${fmtHours(s.hours)} Total Hours · Present: ${s.present} · Leave: ${s.leave}</p>
          ${list.slice().sort((a, b) => String(a.member).localeCompare(String(b.member))).map(r => {
            const duty = r.status === "duty";
            return `<div class="kh-cal-row"><span class="nm">${escapeHtml(r.member)}</span>
              <span class="kh-reg-badge ${duty ? "kh-reg-badge--duty" : "kh-reg-badge--leave"}" style="grid-area:auto;">${duty ? "Present" : "Leave"}</span>
              <span class="h">${duty ? fmtHours(r.hours) + "h" : "—"}</span></div>`;
          }).join("")}`;
      }else{
        detail = `<h4>${regDateLabel(calSelected)}</h4><p class="sub">No attendance recorded for this date.</p>`;
      }
    }
    body.innerHTML = `
      <div class="kh-cal-nav">
        <button type="button" class="kh-cal-btn" data-cal="prev" aria-label="Previous month">${ICON_CHEV_LEFT}</button>
        <div class="kh-cal-title">${monthLabel(calYm)}<br><button type="button" class="kh-cal-today" data-cal="today">Today</button></div>
        <button type="button" class="kh-cal-btn" data-cal="next" aria-label="Next month">${ICON_CHEVRON_RIGHT}</button>
      </div>
      <div class="kh-cal-grid">${dows}${cells}</div>
      <div class="kh-cal-legend"><span class="p">✓ Present</span><span class="l">L Leave</span></div>
      <div class="kh-cal-detail" aria-live="polite">${detail}</div>`;
  }

  // ---- Member profile: attendance history (same records as the register) ----
  function renderProfileHistory(box, member, limit){
    if(!box) return;
    const list = records.filter(r => r.member === member.name && r.date)
      .slice().sort((a, b) => b.date.localeCompare(a.date));
    if(!list.length){ box.innerHTML = `<h4>Attendance History</h4><p class="kh-empty-note" style="display:block;">No attendance data available for this period.</p>`; return; }
    const shown = list.slice(0, limit);
    box.innerHTML = `<h4>Attendance History</h4>
      ${shown.map(r => {
        const duty = r.status === "duty";
        return `<div class="kh-ph-row"><span class="d">${regDateLabel(r.date).slice(0, 6)}</span>
          <span class="kh-reg-badge ${duty ? "kh-reg-badge--duty" : "kh-reg-badge--leave"}" style="grid-area:auto;">${duty ? "Present" : "Leave"}</span>
          <span class="h">${duty ? fmtHours(r.hours) + "h" : "—"}</span></div>`;
      }).join("")}
      ${list.length > limit ? `<button type="button" class="kh-ph-more">Show more</button>` : ""}`;
    const more = box.querySelector(".kh-ph-more");
    if(more) more.addEventListener("click", () => renderProfileHistory(box, member, limit + 15));
  }

  buildRegisterTools();
  // ================= /Dashboard sections =================

  function updateLoadingState(){
    if(membersLoaded && recordsLoaded){
      registerLoading.style.display = "none";
    }
  }

  renderMembers();
  refreshSummarySection();
  renderRegister();
  renderAdminOverview();

  // Members and records arrive as two separate snapshots within milliseconds of each other.
  // Draw the screen once for both (less work on low-end phones) instead of twice.
  let renderAllQueued = false;
  function scheduleRenderAll(){
    if(renderAllQueued) return;
    renderAllQueued = true;
    setTimeout(() => {
      renderAllQueued = false;
      renderMembers();
      refreshSummarySection();
      renderRegister();
      updateLoadingState();
      scheduleShareSync();
    }, 0);
  }

  const myMembersQuery = query(membersCol, where("ownerId", "==", uid));
  const myRecordsQuery = query(recordsCol, where("ownerId", "==", uid));

  onSnapshot(myMembersQuery, snapshot => {
    members = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      .sort((a,b) => (a.name || "").localeCompare(b.name || "", "bn"));
    membersLoaded = true;
    scheduleRenderAll();
  }, err => {
    console.error(err);
    registerLoading.textContent = "Failed to load data. Please check your internet connection.";
  });

  onSnapshot(myRecordsQuery, snapshot => {
    records = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    recordsLoaded = true;
    scheduleRenderAll();
  }, err => {
    console.error(err);
    registerLoading.textContent = "Failed to load data. Please check your internet connection.";
  });

  // Share links + reports (one small listener each, only this owner's documents).
  // If the new Firestore Rules are not published yet these just log a warning; the rest of the app is unaffected.
  onSnapshot(query(collection(db, SHARE_COLLECTION), where("ownerId", "==", uid)), snapshot => {
    shares = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    sharesLoaded = true;
    refreshShareModal();
    renderReportsCard();
    scheduleShareSync();
  }, err => {
    console.warn("Share links unavailable (publish the new Firestore Rules):", err && err.code);
  });

  onSnapshot(query(collection(db, REPORT_COLLECTION), where("ownerId", "==", uid), where("status", "==", "open")), snapshot => {
    reports = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    reportsListenerOk = true;
    renderReportsCard();
  }, err => {
    console.warn("Reports unavailable (publish the new Firestore Rules):", err && err.code);
  });

  // Admin-only: read every account's data (Firestore rules grant this to the admin UID)
  // so the "Team Members" overview can tag rows by owner. This never touches
  // `members`/`records` above, so the admin's own dashboard behaves as before.
  if(isAdminUser){
    onSnapshot(membersCol, snapshot => {
      allMembers = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      renderAdminOverview();
    }, err => console.error("Admin all-members snapshot failed:", err));

    onSnapshot(recordsCol, snapshot => {
      allRecords = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      renderAdminOverview();
    }, err => console.error("Admin all-records snapshot failed:", err));

    onSnapshot(usersCol, snapshot => {
      const next = {};
      snapshot.docs.forEach(d => { next[d.id] = d.data(); });
      ownerProfiles = next;
      renderAdminOverview();
    }, err => console.error("Admin kh_users snapshot failed:", err));
  }

  const sidebarLinks = document.querySelectorAll(".kh-sidebar-link[data-section]");
  if(sidebarLinks.length){
    const sectionEls = Array.from(sidebarLinks)
      .map(a => document.getElementById(a.dataset.section))
      .filter(Boolean);
    const setActive = id => {
      sidebarLinks.forEach(a => a.classList.toggle("is-active", a.dataset.section === id));
    };
    if("IntersectionObserver" in window){
      const observer = new IntersectionObserver(entries => {
        const visible = entries.filter(e => e.isIntersecting);
        if(visible.length) setActive(visible[0].target.id);
      }, { rootMargin: "-15% 0px -70% 0px" });
      sectionEls.forEach(el => observer.observe(el));
    }
    sidebarLinks.forEach(a => a.addEventListener("click", () => setActive(a.dataset.section)));
    setActive("sectionDashboard");
  }
}

document.addEventListener("click", e => {
  const trigger = e.target.closest("#khAccountTrigger");
  const dropdown = document.getElementById("khAccountDropdown");
  if(!dropdown) return;
  if(trigger){
    dropdown.classList.toggle("is-open");
    return;
  }
  if(!e.target.closest(".kh-account-wrap")){
    dropdown.classList.remove("is-open");
  }
});
