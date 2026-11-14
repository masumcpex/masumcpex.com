import {
  db, collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot,
  query, where, serverTimestamp, writeBatch, runTransaction, getDoc, setDoc, getDocs,
  auth, GoogleAuthProvider, FacebookAuthProvider, EmailAuthProvider, reauthenticateWithPopup
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
const ICON_CALCHECK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M8 3v4M16 3v4M3.5 10h17M9 15l2 2 4-4"/></svg>`;
const ICON_WALLET2 = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18a2 2 0 0 1 2 2v2"/><path d="M4 7.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6.5A2.5 2.5 0 0 1 4 7.5z"/><circle cx="16" cy="14" r="1.1"/></svg>`;
const ICON_IDCARD = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5"/><circle cx="9" cy="11" r="2"/><path d="M6.5 16c.5-1.6 1.6-2.3 2.5-2.3s2 .7 2.5 2.3M14 10h4M14 14h3"/></svg>`;
const ICON_COPYSM = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h8"/></svg>`;
const ICON_OKSM = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`;
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

const SHARE_VIEW_URL = "https://masumcpex.com/attendanceview.html";
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
  // ---- WorkTrack dashboard v2 helpers (language + today status) ----
  const WT_LANG = (() => { try{ return localStorage.getItem("wt-lang") === "en" ? "en" : "bn"; }catch(e){ return "bn"; } })();
  const tr = (bn, en) => WT_LANG === "en" ? en : bn;
  window.__wtScope = window.__wtScope || "month";
  function todayStatusFor(name){
    const t = new Date();
    const ds = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
    const r = records.find(x => x.member === name && x.date === ds);
    return r ? (r.status === "duty" ? "duty" : "leave") : "none";
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
        <button type="button" class="kh-you-share" id="khYouShare" aria-label="Share attendance link" title="Share attendance link"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg></button>
      </div>
      <button type="button" class="kh-team-overview-card" id="khAddMemberShortcut">
        <span class="kh-team-overview-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="4"/><path d="M2 20c0-3.6 3.1-6 7-6s7 2.4 7 6M19 8v6M16 11h6"/></svg></span>
        <span class="kh-team-overview-text">
          <span class="kh-team-overview-title">Add Member</span>
          <span class="kh-team-overview-sub">Add a new team member</span>
        </span>
        <span class="kh-team-overview-chevron">${ICON_CHEVRON_RIGHT}</span>
      </button>
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

    // Add Member shortcut: opens the Team view at the Add Member card and focuses the name box
    wrap.querySelector("#khAddMemberShortcut").addEventListener("click", () => {
      if(window.wtShowView) window.wtShowView("team", { keepScroll: true, target: "sectionTeam" });
      setTimeout(() => {
        const sec = document.getElementById("sectionTeam");
        if(sec) sec.scrollIntoView({ behavior: "smooth", block: "start" });
        const inp = document.getElementById("memberInput");
        if(inp) inp.focus({ preventScroll: true });
      }, 80);
    });

    // Share icon on the YOU card: opens the existing secure "Share Attendance" window (copy link) for the member that matches this account's name
    wrap.querySelector("#khYouShare").addEventListener("click", ev => {
      ev.stopPropagation();
      const label = String(ownerLabelFor(uid) || "").trim().toLowerCase();
      const hits = members.filter(m => {
        const n = String(m.name || "").trim().toLowerCase();
        return n && label && (label === n || label.includes(n) || n.includes(label));
      });
      if(hits.length === 1){ openShareModal(hits[0]); return; }
      showToast("Open a member's menu and choose Share Attendance to copy a view-only link.", "warning");
    });

    // The old dashboard "Team Members" (all accounts) card is hidden; admin reaches it from More > All Accounts (Admin)
    const adminLink = document.getElementById("wtAdminAccounts");
    if(adminLink){
      adminLink.style.display = "";
      adminLink.addEventListener("click", e => {
        e.preventDefault();
        if(window.wtCloseMenu) window.wtCloseMenu();
        const b = document.getElementById("khTeamOverviewBtn");
        if(b) b.click();
      });
    }
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
    const youLetter = (myLabel || "?").trim().charAt(0).toUpperCase();
    avatarEl.textContent = youLetter;
    // Show the signed-in Google account's photo (only this card; team members keep their first letter).
    const acctImg = document.getElementById("khAccountAvatarImg");
    const photoSrc = acctImg ? (acctImg.getAttribute("src") || "") : "";
    if(photoSrc){
      avatarEl.textContent = "";
      const im = document.createElement("img");
      im.alt = ""; im.referrerPolicy = "no-referrer"; im.decoding = "async";
      im.style.cssText = "width:100%;height:100%;object-fit:cover;border-radius:inherit;display:block;";
      im.onerror = () => { avatarEl.textContent = youLetter; };
      im.src = photoSrc;
      avatarEl.appendChild(im);
    }
    if(acctImg && !acctImg.dataset.khYouWatch){
      acctImg.dataset.khYouWatch = "1";
      // The account photo is set after sign-in; refresh the YOU card once it arrives.
      new MutationObserver(() => renderAdminOverview()).observe(acctImg, { attributes: true, attributeFilter: ["src"] });
    }
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
      const st = todayStatusFor(m.name);
      const stTxt = st === "duty" ? tr("আজ: উপস্থিত","Today: Present") : st === "leave" ? tr("আজ: ছুটি","Today: Leave") : tr("আজ: বাকি","Today: Pending");
      const stats2 = WT_LANG === "en" ? `${stats.hours}h • ${stats.duty} Duty • ${stats.leave} Leave` : `${stats.hours} ঘণ্টা • ${stats.duty} দিন কাজ • ${stats.leave} দিন ছুটি`;
      return `
      <div class="member-card${isSelected ? " is-selected" : ""}" data-id="${m.id}" data-name="${escapeHtmlLocal(m.name)}">
        <div class="member-card-top">
          <div class="member-card-avatar" style="background:${avatarColorFor(m.id)}">${escapeHtmlLocal(initial)}</div>
          <div class="member-card-actions">
            <button type="button" class="member-card-icon-btn member-card-more" data-id="${m.id}" title="${tr("আরও","More options")}" aria-label="More options" aria-haspopup="true">${ICON_KEBAB}</button>
            <div class="member-card-menu" data-id="${m.id}">
              <button type="button" class="member-card-menu-item member-card-view" data-id="${m.id}">${ICON_USER}${tr("প্রোফাইল দেখুন","View Profile")}</button>
              <button type="button" class="member-card-menu-item member-card-attreport" data-id="${m.id}">${ICON_CALCHECK}${tr("হাজিরা রিপোর্ট","Attendance Report")}</button>
              <button type="button" class="member-card-menu-item member-card-earnmenu" data-id="${m.id}">${ICON_WALLET2}${tr("আয়ের সারাংশ","Earnings Summary")}</button>
              <button type="button" class="member-card-menu-item member-card-edit" data-id="${m.id}">${ICON_EDIT}${tr("নাম বদলান","Edit Member")}</button>
              <button type="button" class="member-card-menu-item member-card-share" data-id="${m.id}">${ICON_SHARE}${tr("লিংক শেয়ার","Share Attendance")}</button>
              <button type="button" class="member-card-menu-item is-danger member-card-delete" data-id="${m.id}">${ICON_TRASH}${tr("সদস্য মুছুন","Remove Member")}</button>
            </div>
          </div>
        </div>
        <div class="member-card-body">
          <div class="member-card-name">${escapeHtmlLocal(m.name)}</div>
          <span class="wt-today-chip is-${st}">${stTxt}</span>
          <div class="member-card-stats">${stats2}</div>
          <div class="member-card-id">${m.memberId ? `<button type="button" class="wt-idchip" data-copy="${escapeHtmlLocal(m.memberId)}" title="${tr("ID কপি করুন","Copy ID")}: ${escapeHtmlLocal(m.memberId)}" aria-label="${tr("সদস্য ID কপি করুন","Copy member ID")} ${escapeHtmlLocal(m.memberId)}"><span class="wt-idchip-ico">${ICON_IDCARD}</span><span class="wt-idchip-num">${escapeHtmlLocal(String(m.memberId).split("-").pop())}</span><span class="wt-idchip-cp">${ICON_COPYSM}</span><span class="wt-idchip-ok">${ICON_OKSM}</span></button>` : ""}</div>
        </div>
        <div class="wt-card-btns">
          <button type="button" class="member-card-share wt-card-linkbtn" data-id="${m.id}" aria-label="${tr("লিংক শেয়ার","Share link")}">${ICON_SHARE}<span>${tr("লিংক","Link")}</span></button>
          <button type="button" class="member-card-earn wt-card-linkbtn wt-card-earnbtn" data-id="${m.id}" aria-label="${tr("আয়ের PDF","Earnings PDF")}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="6" width="19" height="13" rx="2.5"/><path d="M2.5 10h19"/><circle cx="17" cy="14.5" r="1.2"/></svg><span>${tr("আয়","Earnings")}</span></button>
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
    const idChip = e.target.closest(".wt-idchip");
    if(idChip){
      const val = idChip.dataset.copy || "";
      const done = () => {
        idChip.classList.add("is-copied");
        setTimeout(() => idChip.classList.remove("is-copied"), 1300);
        showToast(tr("ID কপি হয়েছে", "ID copied"));
      };
      try{ await navigator.clipboard.writeText(val); done(); }
      catch(_){
        const ta = document.createElement("textarea");
        ta.value = val; ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        try{ document.execCommand("copy"); done(); }
        catch(__){ showToast(tr("কপি করা যায়নি", "Could not copy"), "error"); }
        ta.remove();
      }
      return;
    }
    const attRepBtn = e.target.closest(".member-card-attreport");
    if(attRepBtn){
      closeAllMemberMenus();
      const m = members.find(x => x.id === attRepBtn.dataset.id);
      if(!m) return;
      if(!(await ensurePdfLibs())){
        showToast("PDF generation library failed to load. Please check your internet connection.", "error");
        return;
      }
      const ymR = currentYearMonth();
      const monthRecordsR = records
        .filter(r => r.date.startsWith(ymR) && r.member === m.name)
        .slice().sort((a,b) => a.date.localeCompare(b.date));
      if(!monthRecordsR.length){
        showToast("No records for this member this month yet.", "warning");
        return;
      }
      showToast(tr("রিপোর্ট তৈরি হচ্ছে…", "Generating report…"), "info");
      try{ await generatePdfReport(ymR, monthRecordsR, m.name); }
      catch(err){ console.error(err); showToast("Failed to generate PDF. Please try again.", "error"); }
      return;
    }
    const earnMenuBtn = e.target.closest(".member-card-earnmenu");
    if(earnMenuBtn){
      closeAllMemberMenus();
      const m = members.find(x => x.id === earnMenuBtn.dataset.id);
      if(m) openSalaryDialog(currentYearMonth(), m.name);
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
    const earnBtn = e.target.closest(".member-card-earn");
    if(earnBtn){
      closeAllMemberMenus();
      const m = members.find(x => x.id === earnBtn.dataset.id);
      if(m) openSalaryDialog(currentYearMonth(), m.name);
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
      overlay.style.zIndex = "2147483000";
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

  // ===== Backup & Delete account (More menu) =====
  let accountDeleting = false;
  const AUTH_MODULE_URL = "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

  function fileStamp(){
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }
  function downloadBlob(filename, blob){
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    setTimeout(() => { a.remove(); URL.revokeObjectURL(url); }, 1500);
  }
  function csvCell(v){
    const t = String(v == null ? "" : v);
    return /[",\n\r]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t;
  }
  async function downloadBackupJson(){
    let meta = null;
    try{ const sn = await getDoc(doc(db, "kh_meta", uid)); if(sn.exists()) meta = sn.data(); }catch(e){ /* optional */ }
    const data = {
      app: "WorkTrack", format: 1, exportedAt: new Date().toISOString(),
      members: members.map(m => ({ ...m })),
      records: records.map(r => ({ ...r })),
      settings: meta
    };
    const text = JSON.stringify(data, function(k, v){
      const raw = this[k];
      return raw && typeof raw.toDate === "function" ? raw.toDate().toISOString() : v;   // Firestore time → text
    }, 2);
    downloadBlob(`worktrack-backup-${fileStamp()}.json`, new Blob([text], { type: "application/json" }));
  }
  function downloadAttendanceCsv(){
    const rows = [["Date", "Member", "Status", "Hours"]];
    records.slice().sort((a, b) => String(a.date).localeCompare(String(b.date)) || String(a.member).localeCompare(String(b.member)))
      .forEach(r => rows.push([r.date, r.member, r.status === "duty" ? "Present" : "Leave", r.status === "duty" ? (r.hours || 0) : ""]));
    const text = "\ufeff" + rows.map(r => r.map(csvCell).join(",")).join("\r\n");   // BOM so Excel reads Bengali names correctly
    downloadBlob(`worktrack-attendance-${fileStamp()}.csv`, new Blob([text], { type: "text/csv;charset=utf-8" }));
  }

  function openOverlay(id, inner){
    const old = document.getElementById(id);
    if(old) old.remove();
    const ov = document.createElement("div");
    ov.id = id;
    ov.className = "kh-modal-overlay";
    ov.style.display = "flex";
    ov.style.zIndex = "2147483000";
    ov.innerHTML = inner;
    document.body.appendChild(ov);
    return ov;
  }

  function openBackupDialog(){
    if(!membersLoaded || !recordsLoaded){ showToast(tr("একটু অপেক্ষা করুন, ডেটা লোড হচ্ছে।", "Please wait, data is still loading."), "warning"); return; }
    const ov = openOverlay("wtBackupOverlay", `
      <div class="kh-modal-card wt-bk-card" role="dialog" aria-modal="true">
        <button type="button" class="kh-modal-x" id="wtBkX" aria-label="Close">${ICON_CLOSE}</button>
        <p class="wt-dlg-title">${tr("ডেটা ব্যাকআপ", "Backup your data")}</p>
        <p class="wt-dlg-sub">${tr(`${members.length} জন সদস্য, ${records.length}টি হাজিরা রেকর্ড, অ্যাডভান্স ও রেট ফাইলে নামবে। ফাইলটা নিরাপদ জায়গায় রাখুন।`, `${members.length} members, ${records.length} attendance records, advances and rates will be saved to a file. Keep it somewhere safe.`)}</p>
        <div class="wt-dlg-btns">
          <button type="button" class="btn3d btn-sky" id="wtBkJson">${tr("সম্পূর্ণ ব্যাকআপ (JSON)", "Full backup (JSON)")}</button>
          <button type="button" class="btn3d btn-mint" id="wtBkCsv">${tr("হাজিরার তালিকা (Excel / CSV)", "Attendance list (Excel / CSV)")}</button>
        </div>
        <p class="wt-dlg-note">${tr("শেয়ার লিংকের গোপন টোকেন ব্যাকআপে থাকে না।", "Share-link secret tokens are not included in the backup.")}</p>
      </div>`);
    const close = () => ov.remove();
    ov.addEventListener("click", e => { if(e.target === ov) close(); });
    ov.querySelector("#wtBkX").addEventListener("click", close);
    ov.querySelector("#wtBkJson").addEventListener("click", async () => {
      try{ await downloadBackupJson(); showToast(tr("ব্যাকআপ ফাইল নামানো হয়েছে।", "Backup file downloaded.")); }
      catch(err){ console.error(err); showToast(tr("ব্যাকআপ নামানো যায়নি।", "Could not create the backup."), "error"); }
    });
    ov.querySelector("#wtBkCsv").addEventListener("click", () => {
      try{ downloadAttendanceCsv(); showToast(tr("হাজিরার তালিকা নামানো হয়েছে।", "Attendance list downloaded.")); }
      catch(err){ console.error(err); showToast(tr("ফাইল নামানো যায়নি।", "Could not create the file."), "error"); }
    });
  }

  async function deleteRefsInBatches(refs){
    for(let i = 0; i < refs.length; i += 400){
      const batch = writeBatch(db);
      refs.slice(i, i + 400).forEach(r => batch.delete(r));
      await batch.commit();
    }
  }

  // Proves "it is really you" right before deleting. The sign-in popup must be the FIRST thing that happens after the tap.
  async function reauthForDelete(user, password){
    const pid = (user.providerData && user.providerData[0] && user.providerData[0].providerId) || "";
    if(pid === "google.com") await reauthenticateWithPopup(user, new GoogleAuthProvider());
    else if(pid === "facebook.com") await reauthenticateWithPopup(user, new FacebookAuthProvider());
    else if(pid === "password"){
      const m = await import(AUTH_MODULE_URL);
      await m.reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, password));
    }else{
      const last = Date.parse((user.metadata && user.metadata.lastSignInTime) || "") || 0;
      if(Date.now() - last > 4 * 60 * 1000) throw new Error("needs-fresh-login");
    }
  }

  function openDeleteAccountDialog(){
    if(!membersLoaded || !recordsLoaded){ showToast(tr("একটু অপেক্ষা করুন, ডেটা লোড হচ্ছে।", "Please wait, data is still loading."), "warning"); return; }
    const user = auth.currentUser;
    if(!user){ showToast(tr("আবার লগইন করুন।", "Please sign in again."), "error"); return; }
    const isPassword = !!(user.providerData && user.providerData[0] && user.providerData[0].providerId === "password");
    const activeLinks = shares.filter(x => x.active === true).length;
    const ov = openOverlay("wtDeleteOverlay", `
      <div class="kh-modal-card wt-del-card" role="dialog" aria-modal="true">
        <button type="button" class="kh-modal-x" id="wtDelX" aria-label="Close">${ICON_CLOSE}</button>
        <p class="wt-dlg-title wt-del-title">${tr("অ্যাকাউন্ট চিরতরে ডিলিট করবেন?", "Delete your account forever?")}</p>
        <p class="wt-dlg-sub">${tr("এটা আর ফেরানো যাবে না। যা যা মুছে যাবে:", "This cannot be undone. This will be deleted:")}</p>
        <ul class="wt-del-list">
          <li>${tr(`${members.length} জন সদস্য`, `${members.length} team member(s)`)}</li>
          <li>${tr(`${records.length}টি হাজিরা রেকর্ড, অ্যাডভান্স ও রেট`, `${records.length} attendance record(s), advances and rates`)}</li>
          <li>${tr(`${activeLinks}টি চালু শেয়ার লিংক (সাথে সাথে বন্ধ হবে)`, `${activeLinks} active share link(s) (closed immediately)`)}</li>
          <li>${tr("আপনার লগইন অ্যাকাউন্ট", "Your sign-in account")}</li>
        </ul>
        <button type="button" class="wt-del-bk" id="wtDelBackup">${tr("আগে ব্যাকআপ নামান", "Download a backup first")}</button>
        ${isPassword ? `<label class="wt-del-lbl" for="wtDelPw">${tr("আপনার অ্যাকাউন্টের পাসওয়ার্ড লিখুন", "Enter your account password")}</label><input type="password" id="wtDelPw" class="wt-del-input" autocomplete="current-password" placeholder="${tr("আপনার পাসওয়ার্ড", "Your password")}">` : ""}
        <label class="wt-del-lbl" for="wtDelType">${tr("নিশ্চিত করতে নিচে <b class=\"wt-del-word\">“DELETE”</b> লিখুন", "Type <b class=\"wt-del-word\">“DELETE”</b> below to confirm")}</label>
        <input type="text" id="wtDelType" class="wt-del-input" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="DELETE">
        <p class="wt-del-status" id="wtDelStatus" aria-live="polite"></p>
        <div class="wt-dlg-btns">
          <button type="button" class="btn3d btn-coral" id="wtDelGo" disabled>${tr("চিরতরে ডিলিট করুন", "Delete forever")}</button>
          <button type="button" class="wt-del-cancel" id="wtDelCancel">${tr("বাতিল", "Cancel")}</button>
        </div>
      </div>`);
    const close = () => { if(!accountDeleting) ov.remove(); };
    ov.addEventListener("click", e => { if(e.target === ov) close(); });
    ov.querySelector("#wtDelX").addEventListener("click", close);
    ov.querySelector("#wtDelCancel").addEventListener("click", close);
    ov.querySelector("#wtDelBackup").addEventListener("click", async () => {
      try{ await downloadBackupJson(); showToast(tr("ব্যাকআপ ফাইল নামানো হয়েছে।", "Backup file downloaded.")); }
      catch(err){ console.error(err); showToast(tr("ব্যাকআপ নামানো যায়নি।", "Could not create the backup."), "error"); }
    });
    const typed = ov.querySelector("#wtDelType");
    const go = ov.querySelector("#wtDelGo");
    const okWord = v => { const t = String(v || "").trim(); return t.toUpperCase() === "DELETE" || t === "ডিলেট"; };
    typed.addEventListener("input", () => { go.disabled = !okWord(typed.value); });
    go.addEventListener("click", () => runAccountDeletion(ov, user, isPassword ? (ov.querySelector("#wtDelPw").value || "") : ""));
  }

  async function runAccountDeletion(ov, user, password){
    const status = msg => { const e = ov.querySelector("#wtDelStatus"); if(e) e.textContent = msg; };
    const go = ov.querySelector("#wtDelGo");
    if(go) go.disabled = true;
    // 1) identity check first (nothing is deleted if this fails)
    try{
      status(tr("পরিচয় যাচাই হচ্ছে…", "Checking it is you…"));
      await reauthForDelete(user, password);
    }catch(err){
      console.error(err);
      if(go) go.disabled = false;
      status(err && err.message === "needs-fresh-login"
        ? tr("নিরাপত্তার জন্য আগে লগআউট করে আবার লগইন করুন, তারপর ৫ মিনিটের মধ্যে ডিলিট করুন। কিছু মোছা হয়নি।", "For safety, log out and sign in again, then delete within 5 minutes. Nothing was deleted.")
        : (err && /wrong-password|invalid-credential|invalid-login-credentials/.test(String(err.code || "")))
        ? tr("পাসওয়ার্ড মেলেনি, তাই কিছুই মোছা হয়নি। সঠিক পাসওয়ার্ড দিন।", "That password doesn't match, so nothing was deleted. Enter your correct password.")
        : tr("পরিচয় যাচাই হয়নি, তাই কিছুই মোছা হয়নি। আবার চেষ্টা করুন।", "Identity check failed, so nothing was deleted. Please try again."));
      return;
    }
    accountDeleting = true;
    clearTimeout(shareSyncTimer);
    let dataGone = false;
    try{
      // 2) close share links first, so nobody can see anything any more
      status(tr("শেয়ার লিংক বন্ধ করা হচ্ছে…", "Closing share links…"));
      const shareSnap = await getDocs(query(collection(db, SHARE_COLLECTION), where("ownerId", "==", uid)));
      for(const d of shareSnap.docs){
        try{ await updateDoc(d.ref, { active: false, memberName: "", records: [], dates: [], hash: "", earnings: {}, disabledAt: serverTimestamp(), updatedAt: serverTimestamp() }); }
        catch(e){ console.warn("share scrub failed", e); }
        try{ await deleteDoc(d.ref); }catch(e){ /* the rules do not allow deleting: the emptied, closed shell stays and shows nothing */ }
      }
      // 3) issue reports, attendance records, members
      status(tr("রিপোর্ট ও হাজিরা মোছা হচ্ছে…", "Deleting reports and attendance…"));
      const repSnap = await getDocs(query(collection(db, REPORT_COLLECTION), where("ownerId", "==", uid)));
      await deleteRefsInBatches(repSnap.docs.map(d => d.ref));
      const recSnap = await getDocs(query(recordsCol, where("ownerId", "==", uid)));
      await deleteRefsInBatches(recSnap.docs.map(d => d.ref));
      status(tr("সদস্য মোছা হচ্ছে…", "Deleting members…"));
      const memSnap = await getDocs(query(membersCol, where("ownerId", "==", uid)));
      await deleteRefsInBatches(memSnap.docs.map(d => d.ref));
      try{ await deleteDoc(doc(db, "kh_meta", uid)); }catch(e){ console.warn(e); }
      try{ await deleteDoc(doc(db, "kh_users", uid)); }catch(e){ console.warn(e); }
      dataGone = true;
      // 4) the sign-in account itself
      status(tr("লগইন অ্যাকাউন্ট মোছা হচ্ছে…", "Deleting your sign-in account…"));
      const m = await import(AUTH_MODULE_URL);
      await m.deleteUser(user);
      ov.querySelector(".wt-del-card").innerHTML = `
        <p class="wt-dlg-title">${tr("অ্যাকাউন্ট ডিলিট হয়েছে", "Account deleted")}</p>
        <p class="wt-dlg-sub">${tr("আপনার সব ডেটা মুছে গেছে। এখন পেজটা বন্ধ হয়ে লগইন পেজে যাবে।", "All your data has been removed. The page will now return to the sign-in screen.")}</p>`;
      setTimeout(() => { window.location.replace(window.location.pathname); }, 2500);
    }catch(err){
      console.error(err);
      accountDeleting = false;
      if(go) go.disabled = false;
      status(dataGone
        ? tr("আপনার ডেটা মুছে গেছে, কিন্তু লগইন অ্যাকাউন্ট মোছা যায়নি। লগআউট করে আবার লগইন করুন, তারপর আবার ডিলিট চাপুন।", "Your data was deleted, but the sign-in account could not be removed. Log out, sign in again and press delete once more.")
        : tr("সব মোছা যায়নি। কিছু ডেটা থেকে যেতে পারে, আবার চেষ্টা করুন।", "Not everything could be deleted. Some data may remain, please try again."));
    }
  }

  document.addEventListener("click", e => {
    const b = e.target.closest("[data-wt-backup]");
    const d = e.target.closest("[data-wt-delete-account]");
    if(!b && !d) return;
    e.preventDefault();
    const closeBtn = document.querySelector("[data-wt-menu-close]");
    if(closeBtn && document.getElementById("wtSidebar") && document.getElementById("wtSidebar").classList.contains("is-open")) closeBtn.click();
    if(b) openBackupDialog(); else openDeleteAccountDialog();
  });

  // ===== Daily evening reminder (calendar file; nothing happens until the person adds it) =====
  function icsFold(line){
    // Calendar files must not have lines longer than 75 bytes; fold on whole characters so Bengali letters never split.
    const enc = new TextEncoder();
    const out = [];
    let cur = "", bytes = 0;
    for(const ch of line){
      const n = enc.encode(ch).length;
      if(bytes + n > 72){ out.push(cur); cur = " " + ch; bytes = 1 + n; }
      else{ cur += ch; bytes += n; }
    }
    out.push(cur);
    return out.join("\r\n");
  }
  function buildReminderIcs(hhmm){
    const [hh, mm] = hhmm.split(":").map(Number);
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hh, mm, 0);
    if(start.getTime() <= now.getTime()) start.setDate(start.getDate() + 1);   // first reminder: the next time that clock time comes
    const end = new Date(start.getTime() + 10 * 60 * 1000);
    const pad = n => String(n).padStart(2, "0");
    const local = d => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;   // floating time: follows the phone's own time zone
    const stamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}00Z`;
    const title = tr("WorkTrack: আজকের হাজিরা লিখুন", "WorkTrack: Record today's attendance");
    const lines = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Masum Cpex//WorkTrack//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "UID:worktrack-daily-reminder@masumcpex.com",
      `DTSTAMP:${stamp}`,
      `DTSTART:${local(start)}`,
      `DTEND:${local(end)}`,
      "RRULE:FREQ=DAILY",
      `SUMMARY:${title}`,
      "DESCRIPTION:https://masumcpex.com/attendance",
      "URL:https://masumcpex.com/attendance",
      "TRANSP:TRANSPARENT",
      "BEGIN:VALARM", "TRIGGER:PT0M", "ACTION:DISPLAY", `DESCRIPTION:${title}`, "END:VALARM",
      "END:VEVENT", "END:VCALENDAR"
    ];
    return lines.map(icsFold).join("\r\n") + "\r\n";
  }
  // Opens Google Calendar with the daily event already filled in (you only press Save there).
  function googleCalendarUrl(hhmm){
    const [hh, mm] = hhmm.split(":").map(Number);
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hh, mm, 0);
    if(start.getTime() <= now.getTime()) start.setDate(start.getDate() + 1);
    const end = new Date(start.getTime() + 10 * 60 * 1000);
    const pad = n => String(n).padStart(2, "0");
    const local = d => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: tr("WorkTrack: আজকের হাজিরা লিখুন", "WorkTrack: Record today's attendance"),
      details: "https://masumcpex.com/attendance",
      dates: `${local(start)}/${local(end)}`,
      recur: "RRULE:FREQ=DAILY"
    });
    return "https://calendar.google.com/calendar/render?" + params.toString();
  }
  function openReminderDialog(){
    let saved = "21:00";
    try{ saved = localStorage.getItem("wt-reminder-time") || "21:00"; }catch(e){}
    const ov = openOverlay("wtReminderOverlay", `
      <div class="kh-modal-card wt-bk-card" role="dialog" aria-modal="true">
        <button type="button" class="kh-modal-x" id="wtRmX" aria-label="Close">${ICON_CLOSE}</button>
        <p class="wt-dlg-title">${tr("রাতের রিমাইন্ডার", "Daily evening reminder")}</p>
        <p class="wt-dlg-sub">${tr("প্রতিদিন নির্দিষ্ট সময়ে ফোন আপনাকে মনে করাবে: \"আজকের হাজিরা লিখুন\"। সময় বেছে নিন, তারপর ক্যালেন্ডারে যোগ করুন।", "Your phone will remind you every day at the time you choose: \"Record today's attendance\". Pick a time, then add it to your calendar.")}</p>
        <label class="wt-del-lbl" for="wtRmTime">${tr("কোন সময়ে?", "What time?")}</label>
        <input type="time" id="wtRmTime" class="wt-del-input" value="${saved}">
        <div class="wt-dlg-btns">
          <button type="button" class="btn3d btn-sky" id="wtRmGoogle">${tr("Google Calendar-এ খুলুন", "Open in Google Calendar")}</button>
          <button type="button" class="wt-del-bk" id="wtRmAdd">${tr("অথবা ফাইল নামান (.ics)", "Or download a calendar file (.ics)")}</button>
        </div>
        <p class="wt-dlg-note">${tr("নিজে থেকে কিছু যোগ হবে না: Google Calendar খুলে আপনি \"Save\" চাপলে তবেই যোগ হবে। বন্ধ করতে ক্যালেন্ডার থেকে \"WorkTrack\" ঘটনাটা মুছে দিন।", "Nothing is added automatically: it is added only when you press \"Save\" in Google Calendar. To stop, delete the \"WorkTrack\" event from your calendar.")}</p>
      </div>`);
    const close = () => ov.remove();
    ov.addEventListener("click", e => { if(e.target === ov) close(); });
    ov.querySelector("#wtRmX").addEventListener("click", close);
    ov.querySelector("#wtRmGoogle").addEventListener("click", () => {
      const v = ov.querySelector("#wtRmTime").value;
      if(!/^\d{2}:\d{2}$/.test(v)){ showToast(tr("একটা সময় বেছে নিন।", "Please pick a time."), "warning"); return; }
      try{ localStorage.setItem("wt-reminder-time", v); }catch(e){}
      window.open(googleCalendarUrl(v), "_blank", "noopener");
    });
    ov.querySelector("#wtRmAdd").addEventListener("click", () => {
      const v = ov.querySelector("#wtRmTime").value;
      if(!/^\d{2}:\d{2}$/.test(v)){ showToast(tr("একটা সময় বেছে নিন।", "Please pick a time."), "warning"); return; }
      try{ localStorage.setItem("wt-reminder-time", v); }catch(e){}
      downloadBlob("worktrack-daily-reminder.ics", new Blob([buildReminderIcs(v)], { type: "text/calendar;charset=utf-8" }));
      showToast(tr("ফাইল নেমেছে। খুলে ক্যালেন্ডারে যোগ করুন।", "File downloaded. Open it to add the reminder to your calendar."));
    });
  }
  document.addEventListener("click", e => {
    if(!e.target.closest("[data-wt-reminder]")) return;
    e.preventDefault();
    const closeBtn = document.querySelector("[data-wt-menu-close]");
    if(closeBtn && document.getElementById("wtSidebar") && document.getElementById("wtSidebar").classList.contains("is-open")) closeBtn.click();
    openReminderDialog();
  });

  // ===== Verify a report code (checks it against the data in the app) =====
  function openVerifyDialog(){
    if(!membersLoaded || !recordsLoaded){ showToast(tr("একটু অপেক্ষা করুন, ডেটা লোড হচ্ছে।", "Please wait, data is still loading."), "warning"); return; }
    const ov = openOverlay("wtVerifyOverlay", `
      <div class="kh-modal-card wt-bk-card" role="dialog" aria-modal="true">
        <button type="button" class="kh-modal-x" id="wtVfX" aria-label="Close">${ICON_CLOSE}</button>
        <p class="wt-dlg-title">${tr("রিপোর্ট যাচাই", "Verify a report")}</p>
        <p class="wt-dlg-sub">${tr("PDF-এর Report ID এখানে লিখুন (যেমন WT-E-2026-10-MAS-7K4Q)। অ্যাপ দেখবে এখনকার তথ্যের সাথে মিলছে কি না।", "Type the Report ID from the PDF (e.g. WT-E-2026-10-MAS-7K4Q). The app checks it against your current records.")}</p>
        <input type="text" id="wtVfCode" class="wt-del-input" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="WT-E-2026-10-MAS-XXXX">
        <div class="wt-dlg-btns"><button type="button" class="btn3d btn-sky" id="wtVfGo">${tr("যাচাই করুন", "Check")}</button></div>
        <div id="wtVfOut" class="wt-vf-out" aria-live="polite"></div>
        <p class="wt-dlg-note">${tr("এটা আপনার অ্যাপের বর্তমান ডেটার সাথে মেলায়। কেউ PDF নিজে এডিট করেছে কি না, এটা তা ধরতে পারে না।", "This compares the code with the data in your app. It cannot prove that nobody edited a PDF file.")}</p>
      </div>`);
    const close = () => ov.remove();
    ov.addEventListener("click", e => { if(e.target === ov) close(); });
    ov.querySelector("#wtVfX").addEventListener("click", close);
    const out = ov.querySelector("#wtVfOut");
    const run = () => { out.innerHTML = verifyReportHtml(ov.querySelector("#wtVfCode").value); };
    ov.querySelector("#wtVfGo").addEventListener("click", run);
    ov.querySelector("#wtVfCode").addEventListener("keydown", e => { if(e.key === "Enter"){ e.preventDefault(); run(); } });
  }
  function verifyReportHtml(input){
    const code = String(input || "").toUpperCase().replace(/[\u2010-\u2015\u2212]/g, "-").replace(/\s+/g, "");
    const mt = code.match(/^WT-E-(\d{4}-\d{2})-([A-Z0-9]{1,3})(?:-([A-Z0-9]{4}))?$/);
    const bad = msg => `<div class="wt-vf is-bad"><b>${tr("পাওয়া যায়নি", "Not found")}</b><span>${msg}</span></div>`;
    if(!mt) return bad(tr("কোডটা ঠিক লেখা হয়নি। উদাহরণ: WT-E-2026-10-MAS-7K4Q", "That is not a valid Report ID. Example: WT-E-2026-10-MAS-7K4Q"));
    const ym = mt[1], who = mt[2], tail = mt[3] || "";
    const recsAll = records.filter(r => r.date && r.date.startsWith(ym));
    let rows, label;
    if(who === "ALL"){
      rows = buildSalaryRows(ym, recsAll);
      label = tr("সব সদস্য", "All members");
    }else{
      const cands = members.filter(m => clean3(m.memberId || m.name) === who);
      if(!cands.length) return bad(tr("এই কোডের কোনো সদস্য এখন অ্যাপে নেই।", "No member in the app matches this code."));
      const m = cands[0];
      rows = buildSalaryRows(ym, recsAll.filter(r => r.member === m.name));
      label = m.name;
    }
    if(!rows.length) return bad(tr("ওই মাসে এখন কোনো হাজিরা নেই (মুছে গিয়ে থাকতে পারে)।", "There is no attendance for that month now (it may have been deleted)."));
    rows.forEach(r => { r.rate = r.member ? rateFor(r.member, ym) : 0; });
    computeEarnings(rows, ym);
    const now = who === "ALL" ? `WT-E-${ym}-ALL-` + earnCheck(["ALL", ym].concat(rows.map(r => r.rid))) : rows[0].rid;
    const money = fmtMoneyRM;
    const sum = rows.reduce((t, r) => ({ h: t.h + r.hours, g: t.g + (r.rate > 0 ? r.gross : 0), d: t.d + (r.rate > 0 ? r.advDeducted : 0), n: t.n + (r.rate > 0 ? r.net : 0) }), { h: 0, g: 0, d: 0, n: 0 });
    const facts = `<ul class="wt-vf-list"><li>${tr("সদস্য", "Member")}: <b>${escapeHtml(label)}</b></li><li>${tr("মাস", "Month")}: <b>${monthLabel(ym)}</b></li><li>${tr("মোট ঘণ্টা", "Total hours")}: <b>${fmtHours(sum.h)} h</b></li><li>${tr("মোট আয়", "Total earned")}: <b>${money(sum.g)}</b></li><li>${tr("অ্যাডভান্স কাটা", "Advance cut")}: <b>${money(sum.d)}</b></li><li>${tr("হাতে পাবেন", "Take-home")}: <b>${money(sum.n)}</b></li></ul>`;
    if(!tail) return `<div class="wt-vf is-warn"><b>${tr("পুরনো ধরনের কোড", "Older-style code")}</b><span>${tr("এই কোডে যাচাইয়ের অক্ষর নেই, তাই মেলানো যায় না। এখনকার তথ্য:", "This code has no check letters, so it cannot be matched. Current figures:")}</span>${facts}</div>`;
    if(tail === now.split("-").pop()) return `<div class="wt-vf is-ok"><b>${tr("মিলেছে", "Matches")}</b><span>${tr("এই রিপোর্টের সংখ্যা এখনকার তথ্যের সাথে হুবহু মিলছে।", "The figures in this report match your current records exactly.")}</span>${facts}</div>`;
    return `<div class="wt-vf is-warn"><b>${tr("মেলেনি", "Does not match")}</b><span>${tr("PDF বানানোর পর তথ্য বদলেছে, অথবা কোডে ভুল আছে। এখনকার তথ্য:", "The data changed after that PDF was made, or the code was typed wrongly. Current figures:")}</span>${facts}</div>`;
  }
  document.addEventListener("click", e => {
    if(!e.target.closest("[data-wt-verify]")) return;
    e.preventDefault();
    const closeBtn = document.querySelector("[data-wt-menu-close]");
    if(closeBtn && document.getElementById("wtSidebar") && document.getElementById("wtSidebar").classList.contains("is-open")) closeBtn.click();
    openVerifyDialog();
  });

  function renderTodayCard(){
    const el = document.getElementById("wtTodayStats");
    if(!el) return;
    let p = 0, l = 0;
    members.forEach(m => { const st = todayStatusFor(m.name); if(st === "duty") p++; else if(st === "leave") l++; });
    const pending = Math.max(0, members.length - p - l);
    el.innerHTML = members.length
      ? `<span class="wt-tc-pill is-duty"><b>${p}</b> ${tr("উপস্থিত","present")}</span><span class="wt-tc-pill is-leave"><b>${l}</b> ${tr("ছুটি","leave")}</span><span class="wt-tc-pill is-none"><b>${pending}</b> ${tr("বাকি","pending")}</span>`
      : `<span class="wt-tc-empty">${tr("আগে প্রথম সদস্য যোগ করুন","Add your first member to begin")}</span>`;
    const btn = document.getElementById("wtTodayBtn");
    if(btn) btn.querySelector("span").textContent = members.length ? tr("আজকের হাজিরা লিখুন","Record today's attendance") : tr("সদস্য যোগ করুন","Add a member");
  }

  function renderQuickStats(){
    const ym = currentYearMonth();
    const all = window.__wtScope === "all";
    const baseRecords = all ? records : records.filter(r => r.date.startsWith(ym));
    let present = 0, hours = 0;
    baseRecords.forEach(r => {
      if(r.status === "duty"){ present++; hours += (r.hours || 0); }
    });
    hours = Math.round(hours * 100) / 100;
    const totalAdvance = members.reduce((sum, m) => sum + (typeof m.advance === "number" ? m.advance : 0), 0);
    const set = (id, v) => { const e = document.getElementById(id); if(e) e.textContent = v; };
    set("qsMembers", toBn(members.length));
    set("qsPresent", toBn(present));
    set("qsHours", toBn(hours));
    set("qsAdvance", `RM ${totalAdvance.toFixed(2)}`);
    set("qsLblMembers", tr("আমার টিম", "My team"));
    set("qsLblPresent", all ? tr("মোট কাজের দিন", "Total days worked") : tr("এই মাসে কাজের দিন", "Days worked this month"));
    set("qsLblHours", all ? tr("মোট ঘণ্টা", "Total hours") : tr("এই মাসে ঘণ্টা", "Hours this month"));
    set("qsLblAdvance", tr("অ্যাডভান্স ব্যালেন্স", "Advance balance"));
    const pill = document.getElementById("dashboardMonthPill");
    if(pill) pill.textContent = all ? tr("সব সময়ের হিসাব", "All-time totals") : monthLabel(ym);
    document.querySelectorAll("#wtScopeTabs button").forEach(b => b.classList.toggle("is-on", b.dataset.scope === (all ? "all" : "month")));
    renderTodayCard();
    refreshStatSheet();
  }
  (function bindScopeTabs(){
    const tabs = document.getElementById("wtScopeTabs");
    if(!tabs || tabs.dataset.bound) return;
    tabs.dataset.bound = "1";
    tabs.addEventListener("click", e => {
      const b = e.target.closest("button[data-scope]");
      if(!b) return;
      window.__wtScope = b.dataset.scope === "all" ? "all" : "month";
      renderQuickStats();
    });
    const eb = document.getElementById("wtEarnBtn");
    if(eb) eb.addEventListener("click", () => {
      if(!members.length){ showToast(tr("আগে একজন সদস্য যোগ করুন।", "Add a member first."), "info"); return; }
      openSalaryDialog(currentYearMonth());
    });
    const tb = document.getElementById("wtTodayBtn");
    if(tb) tb.addEventListener("click", () => {
      if(!members.length){
        if(window.wtShowView) window.wtShowView("team", { keepScroll: true, target: "sectionTeam" });
        setTimeout(() => { const i = document.getElementById("memberInput"); if(i) i.focus({ preventScroll: false }); }, 120);
        return;
      }
      const sec = document.getElementById("sectionAttendance");
      if(sec) sec.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  })();

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
        <button type="button" class="kh-reg-sheet-btn" data-act="salary">${ICON_DOC}Earnings PDF</button>
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
      }else if(act === "salary"){
        openSalaryDialog(ym);
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

  function getMonthRecordsForExport(ym, filterOverride){
    const filter = filterOverride || filterMember.value;
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

  async function exportMonthPdf(ym, btn, allMembers){
    if(!(await ensurePdfLibs())){
      alert("PDF generation library failed to load. Please check your internet connection and try again.");
      return;
    }

    khBounce(btn);
    const filter = allMembers ? "All" : filterMember.value;
    const monthRecords = getMonthRecordsForExport(ym, allMembers ? "All" : undefined);

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
  const downloadSalaryBtn = document.getElementById("downloadSalaryBtn");
  if(downloadSalaryBtn) downloadSalaryBtn.addEventListener("click", () => { khBounce(downloadSalaryBtn); openSalaryDialog(currentYearMonth()); });
  downloadCsvBtn.addEventListener("click", () => exportMonthCsv(currentYearMonth(), downloadCsvBtn));
  downloadPdfBtn.addEventListener("click", () => exportMonthPdf(currentYearMonth(), downloadPdfBtn));
  // Header "Download Monthly Report" button: the month chosen in Monthly Summary (or the current month), all members.
  window.wtDownloadSelectedMonthPdf = () => exportMonthPdf((summaryMonthSelect && summaryMonthSelect.value) || currentYearMonth(), downloadPdfBtn, true);

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

    const advSubText = (taken, deducted) => `Taken ${(taken || 0).toFixed(2)}` + (deducted > 0 ? ` · Deducted ${deducted.toFixed(2)}` : "");
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
          ${kpiCard("Advance Balance", money(advSingle.balance), advSubText(advSingle.taken, advSingle.deducted))}
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
      const advDeductedAll = memberNames.reduce((sum,n) => sum + advanceStatsFor(members.find(x => x.name === n), ym).deducted, 0);
      // Same total as the dashboard "Total Advance" card: balance of every member.
      const advBalanceAll = members.reduce((sum,m) => sum + (typeof m.advance === "number" ? m.advance : 0), 0);
      kpiCardsHtml = `
        <div style="display:flex; gap:10px; margin-bottom:22px;">
          ${kpiCard("Present", toBn(totalPresentAll), "Work Days")}
          ${kpiCard("Leave", toBn(totalLeaveAll), "Leave Days")}
          ${kpiCard("Total Hours", toBn(totalHoursAll), "Hours")}
          ${kpiCard("Advance Balance", money(advBalanceAll), advSubText(advTakenAll, advDeductedAll))}
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
    let advTakenTotal = 0, advDeductedTotal = 0, advUntrackedTotal = 0, advBalanceTotal = 0;
    advTargets.forEach(m => {
      const st = advanceStatsFor(m, ym);
      advTakenTotal += st.taken; advDeductedTotal += st.deducted; advBalanceTotal += st.balance;
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
            <tr class="pdf-tfoot-row"><td class="pdf-td pdf-td-left" style="font-weight:800;" colspan="3">Current Advance Balance</td><td class="pdf-td pdf-td-right" style="font-weight:800;">${money(advBalanceTotal)}</td></tr>
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
      // Sharper text: up to 3x, lowered automatically for long reports so phones don't run out of canvas memory.
      const hdScale = Math.max(2, Math.min(4, Math.sqrt(20000000 / (wrap.offsetWidth * wrap.scrollHeight))));
      const canvas = await window.html2canvas(wrap, { scale:hdScale, useCORS:true, backgroundColor:"#ffffff", logging:false });
      const { jsPDF } = window.jspdf;

      const A4_WIDTH_MM  = 210;
      const A4_HEIGHT_MM = 297;
      const BODY_BOTTOM_MM = A4_HEIGHT_MM - FOOTER_MARGIN_MM - 8;   // content must end above the footer band
      const TOP_MARGIN_MM = 12;                                      // top gap on pages 2+
      const pdf = new jsPDF({ orientation:"portrait", unit:"mm", format:"a4" });

      // Work in the report's own pixel space; k converts to canvas pixels.
      const wrapRect = wrap.getBoundingClientRect();
      const totalPx = wrap.scrollHeight;
      const k = canvas.width / wrap.offsetWidth;
      const pxPerMM = wrap.offsetWidth / A4_WIDTH_MM;
      const relTop = el => el.getBoundingClientRect().top - wrapRect.top;

      // Places where a page may start: before a whole table row or a whole block, never inside one.
      const breaks = [];
      Array.from(wrap.children).forEach(el => {
        const next = el.nextElementSibling;
        if(next && next.tagName === "TABLE") return;          // keep a heading with its table
        breaks.push({ y: relTop(el), table: null });
      });
      wrap.querySelectorAll("table").forEach(t => {
        const head = t.tHead ? { top: relTop(t.tHead), h: t.tHead.getBoundingClientRect().height } : null;
        const bodyRows = Array.from(t.querySelectorAll("tbody tr"));
        bodyRows.forEach((tr, i) => { if(i > 0) breaks.push({ y: relTop(tr), table: head }); });
        const foot = t.tFoot ? t.tFoot.querySelector("tr") : null;
        if(foot && bodyRows.length) breaks.push({ y: relTop(foot), table: head });
      });
      breaks.sort((a, b) => a.y - b.y);

      // Greedy: fill each page up to the last safe break that still fits.
      const pages = [];
      let start = 0, repeatHead = null;
      while(start < totalPx - 1){
        const headMM = repeatHead ? repeatHead.h / pxPerMM : 0;
        const availMM = BODY_BOTTOM_MM - (pages.length ? TOP_MARGIN_MM : 0) - headMM;
        const limit = start + availMM * pxPerMM;
        if(totalPx <= limit){ pages.push({ y0: start, y1: totalPx, head: repeatHead }); break; }
        let cut = null;
        for(let i = 0; i < breaks.length; i++){
          if(breaks[i].y > start + 20 && breaks[i].y <= limit) cut = breaks[i];
        }
        if(!cut) cut = { y: limit, table: null };               // a block taller than a page: split it
        pages.push({ y0: start, y1: cut.y, head: repeatHead });
        start = cut.y;
        repeatHead = cut.table;
      }

      const slice = (y0, y1) => {
        const sy = Math.max(0, Math.round(y0 * k)), sh = Math.max(1, Math.round((y1 - y0) * k));
        const c = document.createElement("canvas");
        c.width = canvas.width; c.height = sh;
        const g = c.getContext("2d");
        g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height);
        g.drawImage(canvas, 0, sy, canvas.width, sh, 0, 0, canvas.width, sh);
        return c.toDataURL("image/jpeg", 0.98);
      };

      pages.forEach((pg, idx) => {
        if(idx > 0) pdf.addPage();
        let yMM = idx > 0 ? TOP_MARGIN_MM : 0;
        if(pg.head){
          const hh = pg.head.h / pxPerMM;
          pdf.addImage(slice(pg.head.top, pg.head.top + pg.head.h), "JPEG", 0, yMM, A4_WIDTH_MM, hh);
          yMM += hh;
        }
        pdf.addImage(slice(pg.y0, pg.y1), "JPEG", 0, yMM, A4_WIDTH_MM, (pg.y1 - pg.y0) / pxPerMM);
        drawFooter(pdf, idx + 1, pages.length, A4_WIDTH_MM, A4_HEIGHT_MM);
      });
      pdf.save(`attendance-report-${ym}${singleMember ? "-" + singleMember.name : ""}.pdf`);
    }finally{
      document.body.removeChild(wrap);
      document.body.removeChild(style);
    }
  }


  // ================= Salary PDF (hourly rate x hours, with analytics) =================
  const rateKey = ym => "m" + ym.replace("-", "");
  function rateFor(member, ym){
    if(!member) return 0;
    const map = member.rates || {};
    const keys = Object.keys(map).filter(k => /^m\d{6}$/.test(k) && Number(map[k]) > 0).sort();
    const want = rateKey(ym);
    let pick = null;
    keys.forEach(k => { if(k <= want) pick = k; });
    if(pick) return Number(map[pick]);                         // latest rate saved for this month or earlier
    if(keys.length) return Number(map[keys[0]]);               // before the first saved month: use the first saved rate
    return (typeof member.rate === "number" && member.rate > 0) ? member.rate : 0;
  }
  // Exact-money helpers: rates keep up to 4 decimals (e.g. 9.375); only the final amounts are rounded to sen.
  const round2 = x => Math.round((Number(x) || 0) * 100 + 1e-7) / 100;
  const round4 = x => Math.round((Number(x) || 0) * 10000 + 1e-7) / 10000;
  function fmtRate(n){
    let t = round4(n).toFixed(4);
    t = t.replace(/0+$/, "");
    if(/\.\d$/.test(t)) t += "0";
    if(t.endsWith(".")) t += "00";
    return t;
  }
  const fmtRateRM = n => "RM " + fmtRate(n);
  function fmtMoneyRM(n){
    const v = Number(n) || 0;
    return (v < 0 ? "− " : "") + "RM " + Math.abs(v).toLocaleString("en-US", { minimumFractionDigits:2, maximumFractionDigits:2 });
  }
  function ensureSalaryStyle(){
    if(document.getElementById("khSalaryStyle")) return;
    const st = document.createElement("style");
    st.id = "khSalaryStyle";
    st.textContent = `
      .kh-sal{ max-width:430px; width:100%; max-height:90vh; overflow-y:auto; }
      .kh-sal-head{ display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:12px; }
      .kh-sal-title{ text-align:center; flex:1; min-width:0; }
      .kh-sal-title h3{ margin:0; font-size:1.15rem; }
      .kh-sal-sub{ margin:2px 0 0; font-size:.82rem; opacity:.7; }
      .kh-sal-nav{ width:38px; height:38px; border-radius:12px; border:1.5px solid rgba(128,128,128,.35); background:transparent; color:inherit; font-size:1.4rem; font-weight:700; line-height:1; cursor:pointer; flex-shrink:0; font-family:inherit; }
      .kh-sal-nav:active{ background:rgba(15,118,106,.18); }
      .kh-sal-list{ display:flex; flex-direction:column; gap:10px; margin-bottom:10px; }
      .kh-sal-empty{ text-align:center; opacity:.65; font-size:.9rem; margin:8px 0; }
      .kh-sal-row{ display:flex; flex-direction:column; gap:10px; padding:12px; border:1px solid rgba(128,128,128,.28); border-radius:14px; }
      .kh-sal-row.is-edit{ border-color:#0F766A; box-shadow:0 0 0 2px rgba(15,118,106,.14); }
      .kh-sal-row .nm{ display:flex; flex-direction:column; min-width:0; font-weight:700; }
      .kh-sal-row .nm small{ font-weight:500; opacity:.65; font-size:.76rem; }
      .kh-sal-rate{ display:flex; align-items:center; justify-content:space-between; gap:8px; }
      .kh-sal-row .inp{ display:flex; align-items:center; gap:6px; }
      .kh-sal-row .inp em{ font-style:normal; font-size:.8rem; opacity:.7; font-weight:700; }
      .kh-sal-row input[type="number"]{ width:84px; padding:9px 8px; border-radius:10px; border:1.5px solid rgba(128,128,128,.4); background:transparent; color:inherit; font-size:1rem; font-weight:700; text-align:right; font-family:inherit; }
      .kh-sal-row input[readonly]{ border-color:transparent; background:rgba(128,128,128,.1); }
      .kh-sal-row input.is-bad{ border-color:#D64545; }
      .kh-sal-edit{ width:38px; height:38px; border-radius:12px; border:1.5px solid rgba(128,128,128,.35); background:transparent; color:inherit; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; }
      .kh-sal-row.is-edit .kh-sal-edit{ background:#0F766A; border-color:#0F766A; color:#fff; }
      .kh-sal-pub{ display:flex; align-items:center; gap:8px; font-size:.78rem; padding-top:8px; border-top:1px dashed rgba(128,128,128,.3); }
      .kh-sal-pub.is-off{ opacity:.55; }
      .kh-sal-pub input{ width:18px; height:18px; accent-color:#0F766A; margin:0; }
      .kh-sal-step{ width:34px; height:36px; border-radius:10px; border:1.5px solid rgba(128,128,128,.4); background:rgba(15,118,106,.1); color:inherit; font-size:1.2rem; font-weight:800; line-height:1; cursor:pointer; touch-action:manipulation; -webkit-user-select:none; user-select:none; font-family:inherit; }
      .kh-sal-step:disabled{ opacity:.3; cursor:default; }
      .kh-sal-step:not(:disabled):active{ background:rgba(15,118,106,.28); }
      .kh-sal-note{ font-size:.76rem; opacity:.65; margin:0 0 12px; line-height:1.5; }
      .kh-sal-go{ background:#0F766A !important; color:#fff !important; border-color:#0F766A !important; }
      .kh-sal-alt{ border-color:#0F766A !important; color:#0F766A !important; }
    `;
    document.head.appendChild(st);
  }

  // One row per member who has records in the month.
  function buildSalaryRows(ym, recs){
    const map = {};
    recs.forEach(r => {
      const o = map[r.member] || (map[r.member] = { name:r.member, days:0, leave:0, hours:0, daily:[] });
      if(r.status === "duty"){ o.days++; const h = Number(r.hours) || 0; o.hours = round4(o.hours + h); o.daily.push({ d:r.date, h }); }
      else o.leave++;
    });
    return Object.keys(map).sort((a, b) => a.localeCompare(b)).map(n => {
      const o = map[n];
      o.member = members.find(m => m.name === n) || null;
      return o;
    });
  }

  function openSalaryDialog(startYm, filterOverride){
    ensureSalaryStyle();
    const filter = filterOverride || filterMember.value;
    let ym = startYm;
    let rows = [];
    const PEN = `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>`;
    const shiftYm = (v, d) => { const [y, m] = v.split("-").map(Number); const t = new Date(y, m - 1 + d, 1); return t.getFullYear() + "-" + String(t.getMonth() + 1).padStart(2, "0"); };

    const overlay = document.createElement("div");
    overlay.className = "kh-modal-overlay";
    overlay.innerHTML = `
      <div class="kh-modal-card kh-sal" role="dialog" aria-modal="true" aria-label="Earnings PDF">
        <div class="kh-sal-head">
          <button type="button" class="kh-sal-nav" data-nav="-1" aria-label="Previous month">‹</button>
          <div class="kh-sal-title"><h3>Earnings PDF</h3><p class="kh-sal-sub" id="khSalSub"></p></div>
          <button type="button" class="kh-sal-nav" data-nav="1" aria-label="Next month">›</button>
        </div>
        <div class="kh-sal-list" id="khSalList"></div>
        <p class="kh-sal-note" id="khSalNote"></p>
        <button type="button" class="kh-reg-sheet-btn kh-sal-go" data-act="save">Save</button>
        <button type="button" class="kh-reg-sheet-btn kh-sal-alt" data-act="go" id="khSalGen">${ICON_DOC}Generate Earnings PDF</button>
        <button type="button" class="kh-reg-sheet-btn is-cancel" data-act="cancel">Close</button>
      </div>`;
    document.body.appendChild(overlay);
    overlay.style.display = "flex";
    const listEl = overlay.querySelector("#khSalList"), subEl = overlay.querySelector("#khSalSub");
    const noteEl = overlay.querySelector("#khSalNote"), genBtn = overlay.querySelector("#khSalGen");

    function loadRows(){
      const recs = getMonthRecordsForExport(ym, filter);
      if(recs.length){
        rows = buildSalaryRows(ym, recs);
        rows.forEach(r => { r.hasData = true; });
      }else{
        const scope = filter === "All" ? members.slice() : members.filter(m => m.name === filter);
        rows = scope.sort((a, b) => a.name.localeCompare(b.name)).map(m => ({ name: m.name, member: m, days: 0, leave: 0, hours: 0, daily: [], hasData: false }));
      }
    }
    function rowHtml(r, i){
      const cur = rateFor(r.member, ym);
      const sh = r.member ? activeShareFor(r.member.id) : null;
      const on = !!(sh && sh.earnings && sh.earnings[rateKey(ym)]);
      const pub = !r.hasData ? "" : sh
        ? `<span class="kh-sal-pub"><input type="checkbox" data-pub="${i}"${on ? " checked" : ""}><span>Show on this member's share link</span></span>`
        : `<span class="kh-sal-pub is-off"><span>No active share link</span></span>`;
      return `<div class="kh-sal-row" data-row="${i}">
        <div class="nm">${escapeHtml(r.name)}<small>${r.hasData ? `${fmtHours(r.hours)} h · ${r.days} ${r.days === 1 ? "day" : "days"}` : "No attendance yet"}</small></div>
        <div class="kh-sal-rate">
          <span class="inp"><em>RM</em><button type="button" class="kh-sal-step" data-i="${i}" data-step="-0.1" aria-label="Decrease rate" disabled>−</button><input type="number" inputmode="decimal" min="0" step="any" placeholder="0.00" data-rate="${i}" value="${cur ? fmtRate(cur) : ""}" readonly><button type="button" class="kh-sal-step" data-i="${i}" data-step="0.1" aria-label="Increase rate" disabled>+</button><em>/h</em></span>
          <button type="button" class="kh-sal-edit" data-edit="${i}" aria-label="Edit rate">${PEN}</button>
        </div>
        ${pub}
      </div>`;
    }
    function draw(){
      const hasData = rows.some(r => r.hasData);
      subEl.textContent = `${monthLabel(ym)} · ${rows.length} ${rows.length === 1 ? "member" : "members"}`;
      listEl.innerHTML = rows.length ? rows.map(rowHtml).join("") : `<p class="kh-sal-empty">No members found.</p>`;
      genBtn.style.display = hasData ? "" : "none";
      noteEl.textContent = hasData
        ? "Tap the pen to change a rate, then press Save. Tick “Show on share link” only after you have checked the numbers; untick it to hide them again."
        : "No attendance is recorded for this month yet. You can still set the rates in advance and press Save.";
    }
    function setEdit(i, on){
      const row = overlay.querySelector(`[data-row="${i}"]`);
      if(!row) return;
      row.classList.toggle("is-edit", on);
      const inp = row.querySelector("input[data-rate]");
      inp.readOnly = !on;
      row.querySelectorAll(".kh-sal-step").forEach(b => { b.disabled = !on; });
      if(on){ inp.focus(); inp.select(); } else inp.blur();
    }
    function readRates(){
      return rows.map((r, i) => {
        const v = parseFloat(overlay.querySelector(`input[data-rate="${i}"]`).value);
        return isFinite(v) && v > 0 ? round4(v) : 0;
      });
    }
    // Saves the rates (and the share-link switches). Never throws: a failed save must not lose the user's work.
    async function persist(){
      const key = rateKey(ym);
      const rates = readRates();
      let failed = false;
      for(let i = 0; i < rows.length; i++){
        const m = rows[i].member ? members.find(x => x.id === rows[i].member.id) : null;
        if(!m || !(rates[i] > 0)) continue;
        const had = m.rates && m.rates[key];
        if(had === rates[i]) continue;
        try{ await updateDoc(doc(db, "kh_members", m.id), { ["rates." + key]: rates[i] }); }
        catch(err){ console.error("rate save failed", err); failed = true; }
      }
      if(failed) showToast("Some rates could not be saved. Please try again.", "error");

      rows.forEach((r, i) => { r.rate = rates[i]; });
      const dataRows = rows.filter(r => r.hasData);
      if(dataRows.length){
        computeEarnings(dataRows, ym);
        try{
          for(let i = 0; i < rows.length; i++){
            const r = rows[i];
            if(!r.hasData) continue;
            const sh = r.member ? activeShareFor(r.member.id) : null;
            if(!sh) continue;
            const box = overlay.querySelector(`input[data-pub="${i}"]`);
            const want = !!(box && box.checked) && r.rate > 0;
            const have = !!(sh.earnings && sh.earnings[key]);
            if(want) await updateDoc(doc(db, SHARE_COLLECTION, sh.id), { ["earnings." + key]: earningsPayload(r), updatedAt: serverTimestamp() });
            else if(have) await updateDoc(doc(db, SHARE_COLLECTION, sh.id), { ["earnings." + key]: null, updatedAt: serverTimestamp() });
          }
        }catch(err){ console.error("earnings publish failed", err); failed = true; showToast("Could not update the share link.", "error"); }
      }
      return { rates, failed };
    }

    // - / + buttons: one tap = 0.10, hold to keep changing (only while the row is in edit mode)
    let holdT = null, holdI = null;
    const stepInput = btn => {
      if(btn.disabled) return;
      const inp = overlay.querySelector(`input[data-rate="${btn.dataset.i}"]`);
      if(!inp) return;
      const v = parseFloat(inp.value) || 0;
      inp.value = fmtRate(Math.max(0, round4(v + Number(btn.dataset.step))));
    };
    const stopHold = () => { clearTimeout(holdT); clearInterval(holdI); holdT = holdI = null; };
    overlay.addEventListener("pointerdown", e => {
      const b = e.target.closest(".kh-sal-step");
      if(!b || b.disabled) return;
      e.preventDefault();
      stepInput(b);
      holdT = setTimeout(() => { holdI = setInterval(() => stepInput(b), 90); }, 400);
    });
    ["pointerup", "pointercancel"].forEach(ev => { overlay.addEventListener(ev, stopHold); window.addEventListener(ev, stopHold); });

    const close = () => { stopHold(); if(overlay.parentNode) overlay.parentNode.removeChild(overlay); };
    let busy = false;
    overlay.addEventListener("click", async e => {
      if(e.target === overlay){ close(); return; }
      const nav = e.target.closest("[data-nav]");
      if(nav){ ym = shiftYm(ym, Number(nav.dataset.nav)); loadRows(); draw(); return; }
      const edit = e.target.closest("[data-edit]");
      if(edit){
        const i = edit.dataset.edit;
        const row = overlay.querySelector(`[data-row="${i}"]`);
        setEdit(i, !(row && row.classList.contains("is-edit")));
        return;
      }
      const b = e.target.closest("[data-act]");
      if(!b || busy) return;
      const act = b.dataset.act;
      if(act === "cancel"){ close(); return; }

      if(act === "save"){
        busy = true; const old = b.innerHTML; b.textContent = "Saving...";
        const res = await persist();
        rows.forEach((r, i) => {
          setEdit(i, false);
          const inp = overlay.querySelector(`input[data-rate="${i}"]`);
          if(inp && res.rates[i] > 0) inp.value = fmtRate(res.rates[i]);
        });
        if(!res.failed) showToast("Saved");
        b.innerHTML = old; busy = false;
        return;
      }

      if(act === "go"){
        const dataRows = rows.filter(r => r.hasData);
        if(!dataRows.length) return;
        if(dataRows.length === 1 && !(readRates()[rows.indexOf(dataRows[0])] > 0)){
          const inp = overlay.querySelector(`input[data-rate="${rows.indexOf(dataRows[0])}"]`);
          if(inp) inp.classList.add("is-bad");
          showToast("Please enter the hourly rate.", "error");
          return;
        }
        busy = true;
        await persist();
        close();
        showToast(`Preparing ${monthLabel(ym)} earnings PDF...`);
        try{
          if(!(await ensurePdfLibs())){ alert("PDF generation library failed to load. Please check your internet connection and try again."); return; }
          await generateSalaryPdf(ym, dataRows);
        }catch(err){
          console.error(err);
          alert("Failed to generate the earnings PDF. Please try again.");
        }
      }
    });

    loadRows();
    draw();
  }

  // Shared by the app and the share page: builds the "Earnings Summary" sections (each one a direct child of the page).
  function buildEarningsSections(E){
    const INK = "#172033", MUTED = "#667085", BORDER = "#E4E7EC", LIGHT = "#F8FAFC", BLUE = "#0F4C81", GREEN = "#0F766A", AMBER = "#D97706";
    const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
    const hrs = n => String(Math.round((Number(n) || 0) * 100) / 100);
    const money = n => { const v = Number(n) || 0; return (v < 0 ? "− " : "") + "RM " + Math.abs(v).toLocaleString("en-US", { minimumFractionDigits:2, maximumFractionDigits:2 }); };
    const rateStr = n => { let t = (Math.round((Number(n) || 0) * 10000) / 10000).toFixed(4).replace(/0+$/, ""); if(/\.\d$/.test(t)) t += "0"; if(t.endsWith(".")) t += "00"; return t; };
    const rateRM = n => "RM " + rateStr(n);
    const pct = (a, b) => b > 0 ? Math.round(a / b * 100) : 0;
    const MN = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const [yy, mm] = E.ym.split("-");
    const monthName = MN[Number(mm) - 1] + " " + yy;
    const mon3 = MN[Number(mm) - 1].slice(0, 3);
    const dim = new Date(Number(yy), Number(mm), 0).getDate();
    const period = `01 ${mon3} ${yy} — ${String(dim).padStart(2, "0")} ${mon3} ${yy}`;
    const bar = (v, color, h) => `<div style="height:${h || 7}px; background:${BORDER}; border-radius:6px; overflow:hidden;"><div style="height:100%; width:${Math.max(0, Math.min(100, v))}%; background:${color}; border-radius:6px;"></div></div>`;
    const heading = t => `<div style="display:flex; align-items:center; gap:8px; margin:0 0 10px;"><div style="width:3px; height:15px; background:${BLUE}; border-radius:2px;"></div><div style="font-size:13px; font-weight:700; color:${INK};">${t}</div></div>`;
    const panel = (label, big, body) => `<div style="flex:1; background:${LIGHT}; border:1px solid ${BORDER}; border-radius:10px; padding:13px 13px 12px;"><div style="font-size:8.5px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:${MUTED};">${label}</div><div style="font-size:22px; font-weight:800; color:${INK}; margin:5px 0 7px;">${big}</div>${body}</div>`;
    const kpi = (label, value, sub, dark) => `<div style="flex:1; border-radius:10px; padding:14px 12px; ${dark ? `background:${dark}; border:1px solid ${dark};` : `background:${LIGHT}; border:1px solid ${BORDER};`}"><div style="font-size:8.5px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:${dark ? "rgba(255,255,255,.78)" : MUTED};">${label}</div><div style="font-size:18px; font-weight:800; color:${dark ? "#fff" : INK}; margin:5px 0 2px;">${value}</div><div style="font-size:8.5px; color:${dark ? "rgba(255,255,255,.78)" : MUTED};">${sub}</div></div>`;
    const pd = d => { const x = new Date(d + "T00:00:00"); return String(x.getDate()).padStart(2, "0") + " " + MN[x.getMonth()].slice(0, 3); };

    const takeHome = E.gross > 0 ? Math.max(0, Math.min(100, Math.round(E.net / E.gross * 100))) : 0;
    const cutPct = E.gross > 0 ? Math.max(0, Math.min(100 - takeHome, Math.round(E.ded / E.gross * 100))) : 0;
    const weeks = E.weeks || [];
    const maxWeek = Math.max(1, ...weeks.map(w => w.h));
    const rateOk = E.rate > 0;

    const css = `<style>
      .earn-root .pdf-table{ width:100%; border-collapse:collapse; font-size:10px; }
      .earn-root .pdf-th{ background:${BLUE}; color:#fff; padding:9px 10px; text-align:center; font-weight:600; text-transform:uppercase; font-size:8.5px; letter-spacing:.04em; }
      .earn-root .pdf-th-left{ text-align:left; } .earn-root .pdf-th-right{ text-align:right; }
      .earn-root .pdf-td{ padding:9px 10px; text-align:center; border-bottom:1px solid ${BORDER}; line-height:1.4; font-size:10px; }
      .earn-root .pdf-td-left{ text-align:left; } .earn-root .pdf-td-right{ text-align:right; }
      .earn-root .pdf-tfoot-row td{ background:${LIGHT}; border-bottom:none; border-top:1px solid ${BORDER}; }
      .earn-root tr{ height:32px; }
    </style>`;

    return css + `
      <div style="display:flex; align-items:center; justify-content:space-between; padding-bottom:14px; border-bottom:1px solid ${BORDER}; margin-bottom:20px;">
        <div style="display:flex; align-items:center; gap:14px;">
          <img src="masum.png" style="height:42px; object-fit:contain;" crossorigin="anonymous">
          <div><div style="font-size:13px; font-weight:800; color:${INK}; letter-spacing:.03em;">WORKTRACK</div><div style="font-size:9px; color:${MUTED};">Attendance &amp; Workforce Management</div></div>
        </div>
        <div style="text-align:right;"><div style="font-size:11px; font-weight:800; color:${BLUE}; letter-spacing:.05em;">EARNINGS SUMMARY</div><div style="font-size:9px; color:${MUTED}; margin-top:2px;">${monthName}</div></div>
      </div>
      <div style="margin-bottom:16px;"><div style="font-size:23px; font-weight:800; color:${INK};">Earnings Summary</div><div style="font-size:10.5px; color:${MUTED}; margin-top:3px;">${period}</div></div>
      <div style="display:flex; align-items:center; gap:14px; padding:14px 16px; background:${LIGHT}; border:1px solid ${BORDER}; border-radius:12px; margin-bottom:14px;">
        <div style="width:44px; height:44px; border-radius:50%; background:${BLUE}; color:#fff; display:flex; align-items:center; justify-content:center; font-size:19px; font-weight:800; flex-shrink:0;">${esc((E.name.trim().charAt(0) || "?").toUpperCase())}</div>
        <div style="flex:1;"><div style="font-size:8.5px; font-weight:700; letter-spacing:.08em; color:${MUTED};">MEMBER</div><div style="font-size:18px; font-weight:800; color:${INK};">${esc(E.name)}</div><div style="font-size:9px; color:${MUTED};">Monthly earnings overview — ${monthName}</div></div>
        <div style="text-align:right;"><div style="font-size:8.5px; font-weight:700; letter-spacing:.08em; color:${MUTED};">REFERENCE</div><div style="font-size:11px; font-weight:800; color:${INK};">${esc(E.rid)}</div></div>
      </div>
      <div style="display:flex; gap:10px; margin-bottom:16px;">
        ${kpi("Total Hours", `${hrs(E.hours)} h`, `${E.days} work days`)}
        ${kpi("Hourly Rate", rateOk ? rateRM(E.rate) : "Not set", "per hour")}
        ${kpi("Total Earned", money(E.gross), `${hrs(E.hours)} h × ${rateOk ? rateRM(E.rate) : "—"}`, BLUE)}
        ${kpi("Take-home", money(E.net), "after advance cut", GREEN)}
      </div>
      <div style="margin-bottom:16px;">
        ${heading("Earnings Breakdown")}
        <table class="pdf-table">
          <thead><tr><th class="pdf-th pdf-th-left">Description</th><th class="pdf-th pdf-th-left">Calculation</th><th class="pdf-th pdf-th-right">Amount</th></tr></thead>
          <tbody>
            <tr><td class="pdf-td pdf-td-left" style="font-weight:700;">Total earned</td><td class="pdf-td pdf-td-left" style="color:${MUTED};">${hrs(E.hours)} h × ${rateOk ? rateRM(E.rate) : "rate not set"}</td><td class="pdf-td pdf-td-right" style="font-weight:700;">${money(E.gross)}</td></tr>
            <tr><td class="pdf-td pdf-td-left" style="font-weight:700;">Advance cut</td><td class="pdf-td pdf-td-left" style="color:${MUTED};">Recorded in ${monthName}</td><td class="pdf-td pdf-td-right" style="font-weight:700; color:${AMBER};">− ${money(E.ded)}</td></tr>
          </tbody>
          <tfoot><tr class="pdf-tfoot-row"><td class="pdf-td pdf-td-left" style="font-weight:800; font-size:11px;" colspan="2">Take-home</td><td class="pdf-td pdf-td-right" style="font-weight:800; font-size:12px; color:${GREEN};">${money(E.net)}</td></tr></tfoot>
        </table>
        ${(() => {
          const bal = Math.round((Number(E.balance) || 0) * 100) / 100, tk = Number(E.taken) || 0;
          if(Math.abs(bal) < 0.005 && tk < 0.005) return `<div style="font-size:9px; color:${MUTED}; margin-top:7px;">Take-home = Total earned &minus; Advance cut</div>`;
          const label = bal >= 0 ? "Advance still to be cut later" : "Advance cut is more than taken by";
          return `<div style="margin-top:9px; padding:9px 12px; border:1px solid #F3D9A4; background:#FFF8EA; border-radius:9px; font-size:9.5px; color:${INK};">
            <div style="display:flex; justify-content:space-between; gap:10px;"><span style="color:${MUTED};">Advance taken this month</span><b>${money(tk)}</b></div>
            <div style="display:flex; justify-content:space-between; gap:10px; margin-top:5px; font-size:10.5px;"><span style="font-weight:700;">${label}</span><b style="color:${AMBER};">${money(Math.abs(bal))}</b></div>
            <div style="margin-top:5px; font-size:8.5px; color:${MUTED};">Take-home = Total earned &minus; Advance cut</div>
          </div>`;
        })()}
      </div>
      <div style="margin-bottom:16px;">
        ${heading("Performance Analysis")}
        <div style="display:flex; gap:10px;">
          ${panel("Attendance rate", `${E.att}%`, `${bar(E.att, GREEN)}<div style="font-size:8.5px; color:${MUTED}; margin-top:6px;">${E.days} present · ${E.leave} leave</div>`)}
          ${panel("Take-home", E.gross > 0 ? `${takeHome}%` : "—", `<div style="display:flex; height:7px; border-radius:6px; overflow:hidden; background:${BORDER};"><div style="width:${takeHome}%; background:${GREEN};"></div><div style="width:${cutPct}%; background:${AMBER};"></div></div><div style="font-size:8.5px; color:${MUTED}; margin-top:6px;">${cutPct}% advance cut</div>`)}
          ${panel("Average per day", `${hrs(Math.round(E.avg * 10) / 10)} h`, `<div style="font-size:8.5px; color:${MUTED}; margin-top:2px;">${E.longest ? `Longest: ${hrs(E.longest.h)} h on ${pd(E.longest.d)}` : "No work days"}</div>`)}
        </div>
      </div>
      <div style="margin-bottom:16px;">
        ${heading("Hours by Week")}
        ${weeks.map(w => `<div style="display:flex; align-items:center; gap:10px; margin-bottom:7px;"><div style="width:62px; font-size:9px; color:${MUTED}; font-weight:600;">${mon3} ${w.l}</div><div style="flex:1;">${bar(Math.round(w.h / maxWeek * 100), BLUE, 8)}</div><div style="width:78px; text-align:right; font-size:9.5px; font-weight:700; color:${INK};">${hrs(w.h)} h <span style="color:${MUTED}; font-weight:600;">· ${pct(w.h, E.hours)}%</span></div></div>`).join("")}
      </div>
      ${E.linkUrl ? `<div id="khEarnLinkBox" style="display:flex; align-items:center; justify-content:space-between; gap:12px; padding:11px 14px; border:1px solid ${BORDER}; border-radius:10px; background:${LIGHT}; margin-bottom:16px;"><div><div style="font-size:10px; font-weight:700; color:${INK};">Daily attendance details</div><div style="font-size:8.5px; color:${MUTED}; margin-top:2px;">Day-by-day records are in the attendance report.</div></div><div style="display:flex; align-items:center; gap:12px;"><div style="font-size:9.5px; font-weight:700; color:${BLUE}; white-space:nowrap; text-align:right;">Open attendance report &rarr;${E.qr ? `<div style="font-size:7.5px; font-weight:600; color:${MUTED}; margin-top:2px;">or scan the code</div>` : ""}</div>${E.qr ? `<img src="${E.qr}" alt="QR code" style="width:62px; height:62px; display:block;">` : ""}</div></div>` : ""}
      <div style="border-top:1px solid ${BORDER}; padding-top:9px; font-size:8.5px; color:${MUTED}; line-height:1.6;">Calculated from recorded attendance hours and the hourly rate. For reference only.</div>`;
  }

  const clean3 = x => String(x || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 3) || "GEN";

  // 4-character check code made from the report's own numbers: if any figure changes, the code changes.
  function earnCheck(parts){
    const text = parts.join("|");
    let h = 0x811c9dc5;
    for(let i = 0; i < text.length; i++){ h ^= text.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    const A = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";   // no 0/O/1/I so it is easy to read out loud
    let out = "";
    for(let i = 0; i < 4; i++){ out += A[h % A.length]; h = Math.floor(h / A.length); }
    return out;
  }

  // Numbers for each member row (shared by the PDF and the share-link payload).
  function computeEarnings(rows, ym){
    const [yy, mm] = ym.split("-");
    const dim = new Date(Number(yy), Number(mm), 0).getDate();
    const pct = (a, b) => b > 0 ? Math.round(a / b * 100) : 0;
    rows.forEach(r => {
      r.gross = round2(r.hours * (r.rate || 0));
      const adv = advanceStatsFor(r.member, ym);
      r.advTaken = round2(adv.taken); r.advDeducted = round2(adv.deducted); r.advBalance = round2(adv.balance);
      r.net = round2(r.gross - r.advDeducted);
      r.attRate = pct(r.days, r.days + r.leave);
      r.avg = r.days ? r.hours / r.days : 0;
      const weeks = [];
      for(let w = 0; w < 5; w++){
        const from = w * 7 + 1, to = Math.min(dim, w * 7 + 7);
        if(from > dim) break;
        weeks.push({ l: `${String(from).padStart(2, "0")}–${String(to).padStart(2, "0")}`, h: 0 });
      }
      r.daily.forEach(x => { const w = Math.min(weeks.length - 1, Math.floor((Number(x.d.slice(8, 10)) - 1) / 7)); weeks[w].h = round4(weeks[w].h + x.h); });
      r.weeks = weeks;
      r.longest = r.daily.reduce((a, c) => (c.h > (a ? a.h : -1) ? c : a), null);
      const base = `WT-E-${ym}-${clean3(r.member ? (r.member.memberId || r.member.name) : r.name)}`;
      r.rid = base + "-" + earnCheck([base, round4(r.hours), r.days, r.leave, round4(r.rate || 0), r.gross, r.advTaken, r.advDeducted, r.net]);
    });
  }
  function earningsPayload(r){
    return {
      rate: r.rate, hours: r.hours, days: r.days, leave: r.leave, gross: r.gross, ded: r.advDeducted, net: r.net,
      taken: r.advTaken, balance: r.advBalance, att: r.attRate, avg: round4(r.avg), weeks: r.weeks,
      longest: r.longest ? { d: r.longest.d, h: r.longest.h } : null, rid: r.rid, ts: Date.now()
    };
  }

  async function generateSalaryPdf(ym, rows){
    const PDF_BLUE = "#0F4C81", PDF_INK = "#172033", PDF_MUTED = "#667085", PDF_BORDER = "#E4E7EC", PDF_LIGHT = "#F8FAFC";
    const PDF_GREEN = "#0F766A", PDF_AMBER = "#D97706";
    computeEarnings(rows, ym);
    const single = rows.length === 1;
    const pct = (a, b) => b > 0 ? Math.round(a / b * 100) : 0;
    const bar = (value, color, h) => `<div style="height:${h || 7}px; background:${PDF_BORDER}; border-radius:6px; overflow:hidden;"><div style="height:100%; width:${Math.max(0, Math.min(100, value))}%; background:${color}; border-radius:6px;"></div></div>`;
    const [yy, mm] = ym.split("-");
    const daysInMonth = new Date(Number(yy), Number(mm), 0).getDate();
    const mon3 = monthLabel(ym).split(" ")[0].slice(0, 3);
    const periodLabel = `01 ${mon3} ${yy} — ${String(daysInMonth).padStart(2, "0")} ${mon3} ${yy}`;
    const T = rows.reduce((t, r) => ({
      hours: t.hours + r.hours, days: t.days + r.days, leave: t.leave + r.leave,
      gross: round2(t.gross + (r.rate > 0 ? r.gross : 0)), ded: round2(t.ded + (r.rate > 0 ? r.advDeducted : 0)), net: round2(t.net + (r.rate > 0 ? r.net : 0))
    }), { hours:0, days:0, leave:0, gross:0, ded:0, net:0 });

    let reportId, innerHtml, linkEls = [], fileName;
    if(single){
      const r = rows[0];
      const sh = r.member ? activeShareFor(r.member.id) : null;
      const E = {
        name: r.name, ym, rate: r.rate, hours: r.hours, days: r.days, leave: r.leave, gross: r.gross, ded: r.advDeducted, net: r.net,
        taken: r.advTaken, balance: r.advBalance, att: r.attRate, avg: r.avg, weeks: r.weeks, longest: r.longest, rid: r.rid,
        linkUrl: sh ? SHARE_VIEW_URL + "?token=" + encodeURIComponent(sh.id) : ""
      };
      reportId = r.rid;
      fileName = `earnings-summary-${ym}-${r.name}.pdf`;
      E.qr = E.linkUrl ? await qrDataUrl(E.linkUrl) : "";
      innerHtml = buildEarningsSections(E);
      if(E.linkUrl) linkEls = [{ id: "khEarnLinkBox", url: E.linkUrl }];
    }else{
      reportId = `WT-E-${ym}-ALL-` + earnCheck(["ALL", ym].concat(rows.map(r => r.rid)));
      fileName = `earnings-summary-${ym}-all-members.pdf`;
      const money = fmtMoneyRM;
      const withRate = rows.filter(r => r.rate > 0);
      const ratedHours = withRate.reduce((t, r) => t + r.hours, 0);
      const avgRate = ratedHours > 0 && T.gross > 0 ? T.gross / ratedHours : 0;
      const takeHome = T.gross > 0 ? Math.max(0, Math.min(100, Math.round(T.net / T.gross * 100))) : 0;
      const cutPct = T.gross > 0 ? Math.max(0, Math.min(100 - takeHome, Math.round(T.ded / T.gross * 100))) : 0;
      const teamAtt = pct(T.days, T.days + T.leave);
      const missing = rows.length - withRate.length;
      const heading = t => `<div style="display:flex; align-items:center; gap:8px; margin:0 0 10px;"><div style="width:3px; height:15px; background:${PDF_BLUE}; border-radius:2px;"></div><div style="font-size:13px; font-weight:700; color:${PDF_INK};">${t}</div></div>`;
      const panel = (label, big, body) => `<div style="flex:1; background:${PDF_LIGHT}; border:1px solid ${PDF_BORDER}; border-radius:10px; padding:13px 13px 12px;"><div style="font-size:8.5px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:${PDF_MUTED};">${label}</div><div style="font-size:22px; font-weight:800; color:${PDF_INK}; margin:5px 0 7px;">${big}</div>${body}</div>`;
      const kpi = (label, value, sub, dark) => `<div style="flex:1; border-radius:10px; padding:14px 12px; ${dark ? `background:${dark}; border:1px solid ${dark};` : `background:${PDF_LIGHT}; border:1px solid ${PDF_BORDER};`}"><div style="font-size:8.5px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:${dark ? "rgba(255,255,255,.78)" : PDF_MUTED};">${label}</div><div style="font-size:18px; font-weight:800; color:${dark ? "#fff" : PDF_INK}; margin:5px 0 2px;">${value}</div><div style="font-size:8.5px; color:${dark ? "rgba(255,255,255,.78)" : PDF_MUTED};">${sub}</div></div>`;
      innerHtml = `<style>
        .earn-root .pdf-table{ width:100%; border-collapse:collapse; font-size:10px; }
        .earn-root .pdf-th{ background:${PDF_BLUE}; color:#fff; padding:9px 8px; text-align:center; font-weight:600; text-transform:uppercase; font-size:8.5px; letter-spacing:.04em; }
        .earn-root .pdf-th-left{ text-align:left; } .earn-root .pdf-th-right{ text-align:right; }
        .earn-root .pdf-td{ padding:9px 8px; text-align:center; border-bottom:1px solid ${PDF_BORDER}; line-height:1.4; font-size:10px; }
        .earn-root .pdf-td-left{ text-align:left; } .earn-root .pdf-td-right{ text-align:right; }
        .earn-root .pdf-tfoot-row td{ background:${PDF_LIGHT}; border-bottom:none; border-top:1px solid ${PDF_BORDER}; }
        .earn-root tr{ height:32px; }
      </style>
      <div style="display:flex; align-items:center; justify-content:space-between; padding-bottom:14px; border-bottom:1px solid ${PDF_BORDER}; margin-bottom:20px;">
        <div style="display:flex; align-items:center; gap:14px;">
          <img src="masum.png" style="height:42px; object-fit:contain;" crossorigin="anonymous">
          <div><div style="font-size:13px; font-weight:800; color:${PDF_INK}; letter-spacing:.03em;">WORKTRACK</div><div style="font-size:9px; color:${PDF_MUTED};">Attendance &amp; Workforce Management</div></div>
        </div>
        <div style="text-align:right;"><div style="font-size:11px; font-weight:800; color:${PDF_BLUE}; letter-spacing:.05em;">EARNINGS SUMMARY</div><div style="font-size:9px; color:${PDF_MUTED}; margin-top:2px;">${monthLabel(ym)}</div></div>
      </div>
      <div style="margin-bottom:16px;"><div style="font-size:23px; font-weight:800; color:${PDF_INK};">Earnings Summary</div><div style="font-size:10.5px; color:${PDF_MUTED}; margin-top:3px;">All members · ${periodLabel}</div></div>
      <div style="display:flex; gap:10px; margin-bottom:16px;">
        ${kpi("Members", String(rows.length), `${T.days} work days`)}
        ${kpi("Total Hours", `${fmtHours(T.hours)} h`, `avg ${fmtHours(Math.round((rows.length ? T.hours / rows.length : 0) * 10) / 10)} h per member`)}
        ${kpi("Total Earned", money(T.gross), "hours × rate", PDF_BLUE)}
        ${kpi("Take-home", money(T.net), "after advance cut", PDF_GREEN)}
      </div>
      <div style="margin-bottom:16px;">
        ${heading("Earnings by Member")}
        <table class="pdf-table">
          <thead><tr>
            <th class="pdf-th pdf-th-left">Member</th><th class="pdf-th">Days</th><th class="pdf-th">Hours</th><th class="pdf-th">Rate</th>
            <th class="pdf-th pdf-th-right">Earned</th><th class="pdf-th pdf-th-right">Adv. cut</th><th class="pdf-th pdf-th-right">Take-home</th><th class="pdf-th pdf-th-left" style="width:92px;">Share</th>
          </tr></thead>
          <tbody>
            ${rows.map(r => `<tr>
              <td class="pdf-td pdf-td-left" style="font-weight:700;">${escapeHtml(r.name)}</td>
              <td class="pdf-td">${r.days}</td><td class="pdf-td">${fmtHours(r.hours)}</td>
              <td class="pdf-td">${r.rate > 0 ? fmtRate(r.rate) : "—"}</td>
              <td class="pdf-td pdf-td-right">${r.rate > 0 ? money(r.gross) : "—"}</td>
              <td class="pdf-td pdf-td-right" style="color:${PDF_AMBER};">${r.advDeducted > 0 ? "− " + money(r.advDeducted) : "—"}</td>
              <td class="pdf-td pdf-td-right" style="font-weight:800; color:${PDF_GREEN};">${r.rate > 0 ? money(r.net) : "—"}</td>
              <td class="pdf-td pdf-td-left"><div style="display:flex; align-items:center; gap:6px;"><div style="flex:1;">${bar(pct(r.gross, T.gross), PDF_BLUE, 6)}</div><span style="font-size:8.5px; font-weight:700; width:26px; text-align:right;">${pct(r.gross, T.gross)}%</span></div></td>
            </tr>`).join("")}
          </tbody>
          <tfoot><tr class="pdf-tfoot-row">
            <td class="pdf-td pdf-td-left" style="font-weight:800;">Total</td><td class="pdf-td" style="font-weight:800;">${T.days}</td><td class="pdf-td" style="font-weight:800;">${fmtHours(T.hours)}</td><td class="pdf-td"></td>
            <td class="pdf-td pdf-td-right" style="font-weight:800;">${money(T.gross)}</td><td class="pdf-td pdf-td-right" style="font-weight:800;">${T.ded > 0 ? "− " + money(T.ded) : "—"}</td><td class="pdf-td pdf-td-right" style="font-weight:800; color:${PDF_GREEN};">${money(T.net)}</td><td class="pdf-td"></td>
          </tr></tfoot>
        </table>
        ${missing ? `<div style="font-size:9px; color:${PDF_AMBER}; margin-top:7px;">${missing} member${missing > 1 ? "s have" : " has"} no hourly rate set, so ${missing > 1 ? "their earnings are" : "the earnings are"} not included in the totals.</div>` : ""}
      </div>
      <div style="margin-bottom:16px;">
        ${heading("Team Analysis")}
        <div style="display:flex; gap:10px;">
          ${panel("Attendance rate", `${teamAtt}%`, `${bar(teamAtt, PDF_GREEN)}<div style="font-size:8.5px; color:${PDF_MUTED}; margin-top:6px;">${T.days} present · ${T.leave} leave</div>`)}
          ${panel("Take-home", T.gross > 0 ? `${takeHome}%` : "—", `<div style="display:flex; height:7px; border-radius:6px; overflow:hidden; background:${PDF_BORDER};"><div style="width:${takeHome}%; background:${PDF_GREEN};"></div><div style="width:${cutPct}%; background:${PDF_AMBER};"></div></div><div style="font-size:8.5px; color:${PDF_MUTED}; margin-top:6px;">${cutPct}% advance cut</div>`)}
          ${panel("Average rate", avgRate > 0 ? fmtRateRM(avgRate) : "—", `<div style="font-size:8.5px; color:${PDF_MUTED}; margin-top:2px;">per hour, weighted by hours</div>`)}
        </div>
      </div>
      <div style="border-top:1px solid ${PDF_BORDER}; padding-top:9px; font-size:8.5px; color:${PDF_MUTED}; line-height:1.6;">Calculated from recorded attendance hours and the hourly rates. For reference only.</div>`;
    }

    const wrap = document.createElement("div");
    wrap.id = "pdfReportRoot";
    wrap.className = "earn-root";
    wrap.style.cssText = `position:fixed; left:-99999px; top:0; width:800px; background:#fff; padding:38px 34px 26px; font-family:'Inter','Hind Siliguri',sans-serif; color:${PDF_INK};`;
    wrap.innerHTML = innerHtml;
    document.body.appendChild(wrap);
    try{
      await renderWrapToA4Pdf(wrap, reportId, fileName, linkEls, { fitOnePage: true });
    }finally{
      document.body.removeChild(wrap);
    }
  }

  // Turns the prepared report element into an A4 portrait PDF. Pages break only between rows/sections.
  async function renderWrapToA4Pdf(wrap, reportId, fileName, linkEls, opts){
    const FOOTER_MARGIN_MM = 14;
    const generatedAt = new Date().toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" });
    function drawFooter(pdf, pageNum, totalPages, pageWidthMM, pageHeightMM){
      const bandTop = pageHeightMM - FOOTER_MARGIN_MM - 8;
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, bandTop, pageWidthMM, pageHeightMM - bandTop, "F");
      const y = pageHeightMM - FOOTER_MARGIN_MM;
      pdf.setDrawColor(228, 231, 236); pdf.setLineWidth(0.2);
      pdf.line(16, y - 5, pageWidthMM - 16, y - 5);
      pdf.setFont("helvetica", "bold"); pdf.setFontSize(7.5); pdf.setTextColor(23, 32, 51);
      pdf.text("masumcpex.com", 16, y);
      pdf.setFont("helvetica", "normal"); pdf.setTextColor(102, 112, 133);
      pdf.text("info@masumcpex.com", 16, y + 4);
      pdf.text(`Report ID: ${reportId}`, pageWidthMM / 2 - 15, y);
      pdf.text(`Generated: ${generatedAt}`, pageWidthMM - 16, y, { align: "right" });
      pdf.text(`Page ${pageNum} of ${totalPages}`, pageWidthMM - 16, y + 4, { align: "right" });
    }

    const hdScale = Math.max(2, Math.min(4, Math.sqrt(20000000 / (wrap.offsetWidth * wrap.scrollHeight))));
    const canvas = await window.html2canvas(wrap, { scale:hdScale, useCORS:true, backgroundColor:"#ffffff", logging:false });
    const { jsPDF } = window.jspdf;
    const A4_WIDTH_MM = 210, A4_HEIGHT_MM = 297;
    const BODY_BOTTOM_MM = A4_HEIGHT_MM - FOOTER_MARGIN_MM - 8;
    const TOP_MARGIN_MM = 12;
    const pdf = new jsPDF({ orientation:"portrait", unit:"mm", format:"a4" });

    const wrapRect = wrap.getBoundingClientRect();
    const totalPx = wrap.scrollHeight;
    const k = canvas.width / wrap.offsetWidth;
    const pxPerMM = wrap.offsetWidth / A4_WIDTH_MM;
    const relTop = el => el.getBoundingClientRect().top - wrapRect.top;

    const breaks = [];
    Array.from(wrap.children).forEach(el => {
      const next = el.nextElementSibling;
      if(next && next.tagName === "TABLE") return;
      breaks.push({ y: relTop(el), table: null });
    });
    wrap.querySelectorAll("table").forEach(t => {
      const head = t.tHead ? { top: relTop(t.tHead), h: t.tHead.getBoundingClientRect().height } : null;
      const bodyRows = Array.from(t.querySelectorAll("tbody tr"));
      bodyRows.forEach((tr, i) => { if(i > 0) breaks.push({ y: relTop(tr), table: head }); });
      const foot = t.tFoot ? t.tFoot.querySelector("tr") : null;
      if(foot && bodyRows.length) breaks.push({ y: relTop(foot), table: head });
    });
    breaks.sort((a, b) => a.y - b.y);

    let pages = [];
    let start = 0, repeatHead = null;
    // Earnings report: if it only slightly overflows one page, shrink it to fit instead of leaving a near-empty page 2.
    let fitScale = 0;
    if(opts && opts.fitOnePage){
      const onePagePx = BODY_BOTTOM_MM * pxPerMM;
      if(totalPx > onePagePx){
        const sc = onePagePx / totalPx;
        if(sc >= 0.7) fitScale = sc;
      }
    }
    if(fitScale){
      pages = [{ y0: 0, y1: totalPx, head: null, fit: fitScale }];
      start = totalPx;
    }
    while(start < totalPx - 1){
      const headMM = repeatHead ? repeatHead.h / pxPerMM : 0;
      const availMM = BODY_BOTTOM_MM - (pages.length ? TOP_MARGIN_MM : 0) - headMM;
      const limit = start + availMM * pxPerMM;
      if(totalPx <= limit){ pages.push({ y0: start, y1: totalPx, head: repeatHead }); break; }
      let cut = null;
      for(let i = 0; i < breaks.length; i++){ if(breaks[i].y > start + 20 && breaks[i].y <= limit) cut = breaks[i]; }
      if(!cut) cut = { y: limit, table: null };
      pages.push({ y0: start, y1: cut.y, head: repeatHead });
      start = cut.y; repeatHead = cut.table;
    }

    const slice = (y0, y1) => {
      const sy = Math.max(0, Math.round(y0 * k)), sh = Math.max(1, Math.round((y1 - y0) * k));
      const c = document.createElement("canvas");
      c.width = canvas.width; c.height = sh;
      const g = c.getContext("2d");
      g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height);
      g.drawImage(canvas, 0, sy, canvas.width, sh, 0, 0, canvas.width, sh);
      return c.toDataURL("image/jpeg", 0.98);
    };
    pages.forEach((pg, idx) => {
      if(idx > 0) pdf.addPage();
      if(pg.fit){
        const wMM = A4_WIDTH_MM * pg.fit, hMM = (pg.y1 - pg.y0) / pxPerMM * pg.fit;
        pdf.addImage(slice(pg.y0, pg.y1), "JPEG", (A4_WIDTH_MM - wMM) / 2, 0, wMM, hMM);
        drawFooter(pdf, idx + 1, pages.length, A4_WIDTH_MM, A4_HEIGHT_MM);
        return;
      }
      let yMM = idx > 0 ? TOP_MARGIN_MM : 0;
      if(pg.head){
        const hh = pg.head.h / pxPerMM;
        pdf.addImage(slice(pg.head.top, pg.head.top + pg.head.h), "JPEG", 0, yMM, A4_WIDTH_MM, hh);
        yMM += hh;
      }
      pdf.addImage(slice(pg.y0, pg.y1), "JPEG", 0, yMM, A4_WIDTH_MM, (pg.y1 - pg.y0) / pxPerMM);
      drawFooter(pdf, idx + 1, pages.length, A4_WIDTH_MM, A4_HEIGHT_MM);
    });

    // clickable links drawn over the page image
    (linkEls || []).forEach(l => {
      const el = document.getElementById(l.id);
      if(!el) return;
      const r = el.getBoundingClientRect();
      const topPx = r.top - wrapRect.top;
      const idx = pages.findIndex(pg => topPx >= pg.y0 && topPx < pg.y1);
      if(idx < 0) return;
      const pg = pages[idx];
      pdf.setPage(idx + 1);
      if(pg.fit){
        const f = pg.fit, offX = (A4_WIDTH_MM - A4_WIDTH_MM * f) / 2;
        pdf.link(offX + (r.left - wrapRect.left) / pxPerMM * f, topPx / pxPerMM * f, r.width / pxPerMM * f, r.height / pxPerMM * f, { url: l.url });
        return;
      }
      const yMM = (idx > 0 ? TOP_MARGIN_MM : 0) + (pg.head ? pg.head.h / pxPerMM : 0) + (topPx - pg.y0) / pxPerMM;
      pdf.link((r.left - wrapRect.left) / pxPerMM, yMM, r.width / pxPerMM, r.height / pxPerMM, { url: l.url });
    });
    pdf.save(fileName);
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

  // Link key = readable name + 14 random characters, e.g. "jakir-k7q2m9x4vr8t3z".
  // Only the random part is the secret (36^14 ≈ 2^72 possibilities, cannot be guessed).
  // The name part is just a label, so knowing someone's name does NOT give access.
  function makeShareToken(name){
    const slug = String(name || "")
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .split("-")
      .reduce((acc, w) => (acc ? acc + "-" + w : w).length <= 12 ? (acc ? acc + "-" + w : w) : acc, "")
      .slice(0, 12) || "view";
    const ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";
    let random = "";
    while(random.length < 14){
      const bytes = new Uint8Array(24);
      crypto.getRandomValues(bytes);
      for(const b of bytes){
        if(b < 252 && random.length < 14) random += ALPHABET[b % 36];   // 252 = 7 × 36 → no bias
      }
    }
    return slug + "-" + random;
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
    if(accountDeleting) return;
    if(!membersLoaded || !recordsLoaded || !sharesLoaded) return;   // never push half-loaded (empty) data
    for(const sh of shares){
      if(sh.active !== true) continue;
      const ref = doc(db, SHARE_COLLECTION, sh.id);
      const m = members.find(x => x.id === sh.memberId);
      try{
        if(!m){
          await updateDoc(ref, { active: false, memberName: "", records: [], dates: [], hash: "", earnings: {}, disabledAt: serverTimestamp(), updatedAt: serverTimestamp() });
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
    if(accountDeleting || !shares.length) return;
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
          await setDoc(doc(db, SHARE_COLLECTION, makeShareToken(m.name)), {
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
            active: false, memberName: "", records: [], dates: [], hash: "", earnings: {},
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
  const QR_LIB = "https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js";
  async function qrDataUrl(text){
    try{
      if(typeof window.qrcode !== "function") await loadScriptOnce(QR_LIB);
      if(typeof window.qrcode !== "function") return "";   // library not available: the PDF simply has no QR
      const qr = window.qrcode(0, "M");
      qr.addData(text);
      qr.make();
      return qr.createDataURL(6, 12);
    }catch(e){ console.warn("QR failed", e); return ""; }
  }
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
  // Warm up the PDF libraries and logo in the background, so the first tap on Download starts at once.
  // (Waiting for a slow download on tap made the browser drop the tap's permission, so a 2nd tap was needed.)
  function warmPdf(){
    try{
      ensurePdfLibs();
      loadScriptOnce(QR_LIB);
      const im = new Image(); im.crossOrigin = "anonymous"; im.src = "masum.png";
    }catch(_){}
  }
  (function schedulePdfWarm(){
    const go = () => setTimeout(() => (window.requestIdleCallback ? window.requestIdleCallback(warmPdf, { timeout: 4000 }) : warmPdf()), 1500);
    if(document.readyState === "complete") go(); else window.addEventListener("load", go, { once: true });
  })();

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
    return null;   // Attendance Overview cards removed (Monthly Summary is a table only); renderOverview() returns early on null
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


  // ===== STAT-SHEET BEGIN: dashboard stat cards -> details sheet (UI only; reads the already-loaded members/records) =====
  let statType = "", statYm = "", statForm = false, statSaving = false, statTrigger = null;
  let advHist = null;   // null = normal Advance sheet; { member, month } = full history view
  const fmtRM = n => `RM ${(Number(n) || 0).toFixed(2)}`;
  function daysElapsedIn(ym){
    const [y, m] = ym.split("-").map(Number);
    const now = new Date(), cy = now.getFullYear(), cm = now.getMonth() + 1;
    if(y === cy && m === cm) return now.getDate();
    if(y * 12 + m > cy * 12 + cm) return 0;
    return new Date(y, m, 0).getDate();
  }
  function statMonths(){
    const set = new Set(records.map(r => (r.date || "").slice(0, 7)).filter(Boolean));
    set.add(currentYearMonth());
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }
  function statMonthPicker(ym){
    return `<label class="kh-sh-month">Month <select id="khStatMonth">${statMonths().map(m => `<option value="${m}"${m === ym ? " selected" : ""}>${monthLabel(m)}</option>`).join("")}</select></label>`;
  }
  function ensureStatSheet(){
    let ov = document.getElementById("khStatSheet");
    if(ov) return ov;
    ov = document.createElement("div");
    ov.id = "khStatSheet";
    ov.className = "kh-modal-overlay kh-sheet-overlay";
    ov.setAttribute("role", "dialog");
    ov.setAttribute("aria-modal", "true");
    ov.setAttribute("aria-labelledby", "khStatTitle");
    ov.innerHTML = `<div class="kh-modal-card kh-sheet"><div class="kh-sheet-head"><h2 id="khStatTitle"></h2><button type="button" class="kh-modal-x" id="khStatClose" aria-label="Close">${ICON_CLOSE}</button></div><div class="kh-sheet-body" id="khStatBody"></div></div>`;
    document.body.appendChild(ov);
    ov.addEventListener("click", e => { if(e.target === ov) closeStatSheet(); });
    ov.querySelector("#khStatClose").addEventListener("click", closeStatSheet);
    ov.addEventListener("click", onSheetClick);
    ov.addEventListener("change", e => {
      if(e.target.id === "khStatMonth"){ statYm = e.target.value; renderStatSheet(); }
      else if(advHist && e.target.id === "khHistMember"){ advHist.member = e.target.value; renderStatSheet(); }
      else if(advHist && e.target.id === "khHistMonth"){ advHist.month = e.target.value; renderStatSheet(); }
    });
    ov.addEventListener("submit", onAdvanceSubmit);
    document.addEventListener("keydown", e => { if(e.key === "Escape" && ov.style.display === "flex" && !document.querySelector("#khMemberProfileOverlay[style*='flex']")) closeStatSheet(); });
    return ov;
  }
  function closeStatSheet(){
    const ov = document.getElementById("khStatSheet");
    if(ov) ov.style.display = "none";
    statType = ""; statForm = false; advHist = null;
    if(statTrigger && statTrigger.focus) statTrigger.focus();
  }
  function openStatSheet(type, trigger){
    statType = type; statYm = currentYearMonth(); statForm = false; advHist = null; statTrigger = trigger || null;
    const ov = ensureStatSheet();
    renderStatSheet();
    ov.style.display = "flex";
    const x = ov.querySelector("#khStatClose"); if(x) x.focus();
  }
  function refreshStatSheet(){
    const ov = document.getElementById("khStatSheet");
    if(ov && ov.style.display === "flex" && statType && !statForm && !statSaving) renderStatSheet();
  }
  function renderStatSheet(){
    const ov = ensureStatSheet();
    const title = { members: "Team Members", present: "Attendance Overview", hours: "Work Hours", advance: "Advance" }[statType] || "";
    ov.querySelector("#khStatTitle").textContent = (statType === "advance" && advHist) ? "Advance History" : title;
    const body = ov.querySelector("#khStatBody");
    const html = statType === "members" ? sheetMembers() : statType === "present" ? sheetPresent() : statType === "hours" ? sheetHours() : statType === "advance" ? sheetAdvance() : "";
    body.innerHTML = html;
    if(statForm){ const f = body.querySelector("#khAdvMember"); if(f) f.focus(); }
  }
  const initialOf = n => (n || "?").trim().charAt(0).toUpperCase();
  const sortedMembers = () => members.slice().sort((a, b) => (a.name || "").localeCompare(b.name || ""));

  function sheetMembers(){
    const ym = currentYearMonth();
    const rows = sortedMembers().map(m => {
      const s = monthStatsFor(m.name, ym);
      const adv = typeof m.advance === "number" ? m.advance : 0;
      return `<button type="button" class="kh-sh-row" data-member="${m.id}" aria-label="View ${escapeHtml(m.name)} details">
        <span class="kh-sh-avatar" style="background:${avatarColorFor(m.id)}">${escapeHtml(initialOf(m.name))}</span>
        <span class="kh-sh-main"><b>${escapeHtml(m.name)}</b><small>${s.duty} work days · ${fmtHours(s.hours)}h · ${s.leave} leave</small></span>
        <span class="kh-sh-side">${fmtRM(adv)}<small>Advance</small></span>
        <span class="kh-sh-chev">${ICON_CHEVRON_RIGHT}</span></button>`;
    }).join("");
    return `<p class="kh-sh-note">${members.length} member${members.length === 1 ? "" : "s"} · ${monthLabel(ym)}. Tap a member to see their details.</p>
      ${rows || `<p class="kh-empty-note" style="display:block;">No members added yet.</p>`}
      <div class="kh-sh-actions"><button type="button" class="btn3d btn-mint" data-sheet-act="add-member">+ Add Member</button></div>`;
  }

  function donutSvg(duty, leave){
    const total = duty + leave, R = 52, C = 2 * Math.PI * R;
    const pArc = total ? C * duty / total : 0, lArc = total ? C * leave / total : 0;
    const rate = total ? Math.round(duty / total * 100) : 0;
    return `<svg class="kh-sh-donut" viewBox="0 0 140 140" role="img" aria-label="Present rate ${rate} percent">
      <circle cx="70" cy="70" r="${R}" fill="none" stroke="currentColor" stroke-opacity=".12" stroke-width="16"/>
      ${total ? `<circle cx="70" cy="70" r="${R}" fill="none" stroke="#20BF78" stroke-width="16" stroke-dasharray="${pArc} ${C - pArc}" transform="rotate(-90 70 70)"/>
      <circle cx="70" cy="70" r="${R}" fill="none" stroke="#F5A524" stroke-width="16" stroke-dasharray="${lArc} ${C - lArc}" stroke-dashoffset="${-pArc}" transform="rotate(-90 70 70)"/>` : ""}
      <text x="70" y="68" text-anchor="middle" class="kh-sh-donut-num">${total ? rate + "%" : "–"}</text>
      <text x="70" y="86" text-anchor="middle" class="kh-sh-donut-sub">Present rate</text></svg>`;
  }
  function sheetPresent(){
    const ym = statYm || currentYearMonth();
    const days = daysElapsedIn(ym);
    const per = sortedMembers().map(m => {
      const s = monthStatsFor(m.name, ym);
      return { m, duty: s.duty, leave: s.leave, none: Math.max(0, days - s.duty - s.leave) };
    });
    const duty = per.reduce((a, p) => a + p.duty, 0), leave = per.reduce((a, p) => a + p.leave, 0), none = per.reduce((a, p) => a + p.none, 0);
    const total = duty + leave;
    const pct = n => total ? Math.round(n / total * 100) : 0;
    const rows = per.map(p => {
      const t = p.duty + p.leave, r = t ? Math.round(p.duty / t * 100) : 0;
      return `<div class="kh-sh-trow"><span class="kh-sh-name">${escapeHtml(p.m.name)}</span><span>${p.duty}</span><span>${p.leave}</span><span>${p.none}</span><span><b>${t ? r + "%" : "–"}</b></span></div>`;
    }).join("");
    return `${statMonthPicker(ym)}
      <div class="kh-sh-chart">${donutSvg(duty, leave)}
        <ul class="kh-sh-legend">
          <li><i style="background:#20BF78"></i>Present<b>${duty}</b><small>${pct(duty)}%</small></li>
          <li><i style="background:#F5A524"></i>Leave<b>${leave}</b><small>${pct(leave)}%</small></li>
          <li><i style="background:#94A3B8"></i>Absent<b>${none}</b><small>member-days</small></li>
        </ul></div>
      <p class="kh-sh-note">Present rate = present days ÷ (present + leave), the same as before. "Absent" counts days up to today with no attendance entry, so days off are included.</p>
      <h3 class="kh-sh-h">Member-wise</h3>
      <div class="kh-sh-table"><div class="kh-sh-trow kh-sh-thead"><span class="kh-sh-name">Member</span><span>Present</span><span>Leave</span><span>Absent</span><span>Rate</span></div>
      ${rows || `<p class="kh-empty-note" style="display:block;">No members yet.</p>`}</div>`;
  }

  function sheetHours(){
    const ym = statYm || currentYearMonth();
    const per = sortedMembers().map(m => ({ m, s: monthStatsFor(m.name, ym) }));
    const total = per.reduce((a, p) => a + p.s.hours, 0), duty = per.reduce((a, p) => a + p.s.duty, 0);
    const max = Math.max(1, ...per.map(p => p.s.hours));
    const avg = duty ? Math.round(total / duty * 10) / 10 : 0;
    const rows = per.map(p => `<div class="kh-sh-hrow"><div class="kh-sh-hrow-top"><span class="kh-sh-name">${escapeHtml(p.m.name)}</span><b>${fmtHours(p.s.hours)}h</b></div><div class="kh-sh-bar"><i style="width:${Math.round(p.s.hours / max * 100)}%"></i></div><small>${p.s.duty} work days · avg ${p.s.duty ? fmtHours(Math.round(p.s.hours / p.s.duty * 10) / 10) : 0}h/day</small></div>`).join("");
    const now = new Date(); const last6 = [];
    for(let i = 0; i < 6; i++){ const d = new Date(now.getFullYear(), now.getMonth() - i, 1); last6.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`); }
    const mh = last6.map(m => ({ m, h: monthTotals(m).hours })); const mmax = Math.max(1, ...mh.map(x => x.h));
    return `${statMonthPicker(ym)}
      <div class="kh-sh-grid"><div class="kh-sh-tile"><b>${fmtHours(total)}h</b><span>Total hours</span></div><div class="kh-sh-tile"><b>${duty}</b><span>Work days</span></div><div class="kh-sh-tile"><b>${fmtHours(avg)}h</b><span>Avg / work day</span></div></div>
      <h3 class="kh-sh-h">Member-wise · ${monthLabel(ym)}</h3>${rows || `<p class="kh-empty-note" style="display:block;">No members yet.</p>`}
      <h3 class="kh-sh-h">Last 6 months</h3>
      ${mh.map(x => `<div class="kh-sh-mrow"><span>${monthLabel(x.m)}</span><div class="kh-sh-bar"><i style="width:${Math.round(x.h / mmax * 100)}%"></i></div><b>${fmtHours(x.h)}h</b></div>`).join("")}`;
  }

  // Opening balance = the saved advance balance minus everything in the dated history (old advance from before history existed).
  function openingBalanceOf(m){
    const log = Array.isArray(m && m.advanceLog) ? m.advanceLog : [];
    const sum = log.reduce((t, e) => t + (Number(e && e.a) || 0), 0);
    const bal = typeof (m && m.advance) === "number" ? m.advance : 0;
    return Math.round((bal - sum) * 100) / 100;
  }
  async function clearOpeningBalance(id){
    if(statSaving) return;
    const m = members.find(x => x.id === id);
    if(!m) return;
    const opening = openingBalanceOf(m);
    if(Math.abs(opening) < 0.01){ showToast("No opening balance to clear.", "info"); renderStatSheet(); return; }
    const bal = typeof m.advance === "number" ? m.advance : 0;
    const target = Math.round((bal - opening) * 100) / 100;
    const ok = await askConfirm(`Clear ${m.name}'s opening balance of ${fmtRM(opening)}? This is advance saved before the dated history started. ${m.name}'s balance will change from ${fmtRM(bal)} to ${fmtRM(target)}.`);
    if(!ok) return;
    statSaving = true;
    let nb = 0;
    try{
      const ref = doc(db, "kh_members", m.id);
      await runTransaction(db, async tx => {
        const snap = await tx.get(ref);
        if(!snap.exists()) throw new Error("member-missing");
        const cur = snap.data();
        const op = openingBalanceOf(cur);
        if(Math.abs(op - opening) > 0.009) throw new Error("entry-changed");
        nb = Math.round((typeof cur.advance === "number" ? cur.advance : 0) * 100 - op * 100) / 100;
        tx.update(ref, { advance: nb });
      });
      showToast(`Opening balance cleared. New balance: ${fmtRM(nb)}.`);
    }catch(err){
      console.error(err);
      showToast(err && err.message === "entry-changed" ? "The balance changed. Please check and try again." : "Failed to clear. Please try again.", "error");
    }finally{
      statSaving = false;
      renderStatSheet();
      setTimeout(() => { renderSummary(); renderQuickStats(); }, 350);
    }
  }

  // Small trash button that removes one advance entry (always asks first).
  function advDelBtn(x){
    return `<button type="button" class="kh-adv-del" data-sheet-act="adv-del" data-id="${x.id}" data-i="${x.i}" data-d="${x.d}" data-a="${x.a}" aria-label="Delete this advance entry" title="Delete">${ICON_TRASH}</button>`;
  }
  async function deleteAdvanceEntry(ds){
    if(statSaving) return;
    const m = members.find(x => x.id === ds.id);
    const idx = Number(ds.i), amt = Number(ds.a);
    const e = m && Array.isArray(m.advanceLog) ? m.advanceLog[idx] : null;
    if(!m || !e || e.d !== ds.d || Math.abs((Number(e.a) || 0) - amt) > 0.0001){
      showToast("This entry has changed. Please check the list again.", "error");
      renderStatSheet();
      return;
    }
    const bal = typeof m.advance === "number" ? m.advance : 0;
    const after = Math.round((bal - amt) * 100) / 100;
    const ok = await askConfirm(`Delete this advance entry? ${m.name} · ${amt < 0 ? "Deducted" : "Taken"} ${fmtRM(Math.abs(amt))} · ${ds.d}. ${m.name}'s balance will change from ${fmtRM(bal)} to ${fmtRM(after)}.`);
    if(!ok) return;
    statSaving = true;
    let nb = 0;
    try{
      const ref = doc(db, "kh_members", m.id);
      await runTransaction(db, async tx => {
        const snap = await tx.get(ref);
        if(!snap.exists()) throw new Error("member-missing");
        const cur = snap.data();
        const log = Array.isArray(cur.advanceLog) ? cur.advanceLog.slice() : [];
        const ce = log[idx];
        if(!ce || ce.d !== ds.d || Math.abs((Number(ce.a) || 0) - amt) > 0.0001) throw new Error("entry-changed");
        log.splice(idx, 1);
        const b = typeof cur.advance === "number" ? cur.advance : 0;
        nb = Math.round((b - amt) * 100) / 100;
        tx.update(ref, { advance: nb, advanceLog: log });
      });
      showToast(`Entry deleted. New balance: ${fmtRM(nb)}.`);
    }catch(err){
      console.error(err);
      showToast(err && err.message === "entry-changed" ? "This entry has changed. Please check the list again." : "Failed to delete. Please try again.", "error");
    }finally{
      statSaving = false;
      renderStatSheet();
      setTimeout(() => { renderSummary(); renderQuickStats(); }, 350);
    }
  }

  function sheetAdvance(){
    ensureAdvHistStyle();
    if(statForm) return advanceFormHtml();
    if(advHist) return advanceHistoryHtml();
    const ym = currentYearMonth();
    const per = sortedMembers().map(m => ({ m, st: advanceStatsFor(m, ym) }));
    const total = per.reduce((a, p) => a + p.st.balance, 0), taken = per.reduce((a, p) => a + p.st.taken, 0), ded = per.reduce((a, p) => a + p.st.deducted, 0);
    const hist = [];
    members.forEach(m => (Array.isArray(m.advanceLog) ? m.advanceLog : []).forEach((e, i) => { if(e && typeof e.d === "string") hist.push({ d: e.d, a: Number(e.a) || 0, n: m.name, id: m.id, i }); }));
    hist.sort((x, y) => y.d.localeCompare(x.d));
    const rows = per.map(p => {
      const op = openingBalanceOf(p.m);
      const note = Math.abs(op) >= 0.01
        ? `<div class="kh-open-note"><span>Includes <b>${fmtRM(op)}</b> opening balance (saved before dated history, so it has no entry to delete)</span><button type="button" class="kh-open-clear" data-sheet-act="adv-open-del" data-id="${p.m.id}">Clear</button></div>`
        : "";
      return `<div class="kh-sh-arow"><span class="kh-sh-name">${escapeHtml(p.m.name)}</span><span class="kh-sh-abal">${fmtRM(p.st.balance)}</span><small>${monthLabel(ym)}: +${p.st.taken.toFixed(2)} / −${p.st.deducted.toFixed(2)}</small></div>${note}`;
    }).join("");
    return `<div class="kh-sh-actions kh-sh-actions--top"><button type="button" class="btn3d btn-mint kh-sh-addadv" data-sheet-act="add-advance">+ Add Advance</button></div>
      <div class="kh-sh-grid"><div class="kh-sh-tile"><b>${fmtRM(total)}</b><span>Total advance</span></div><div class="kh-sh-tile"><b>${fmtRM(taken)}</b><span>Taken · ${monthLabel(ym)}</span></div><div class="kh-sh-tile"><b>${fmtRM(ded)}</b><span>Deducted · ${monthLabel(ym)}</span></div></div>
      <h3 class="kh-sh-h">By member</h3>${rows || `<p class="kh-empty-note" style="display:block;">No members yet.</p>`}
      <div class="kh-ah-headrow"><h3 class="kh-sh-h" style="margin:0;">Recent advance history</h3>${hist.length > 8 ? `<button type="button" class="kh-ah-viewall" data-sheet-act="adv-history">View all (${hist.length})</button>` : ""}</div>
      ${hist.length ? hist.slice(0, 8).map(x => `<div class="kh-sh-hist"><span>${x.d}</span><span class="kh-sh-name">${escapeHtml(x.n)}</span><b class="${x.a < 0 ? "is-neg" : "is-pos"}">${x.a < 0 ? "−" : "+"}${Math.abs(x.a).toFixed(2)}</b>${advDelBtn(x)}</div>`).join("") : `<p class="kh-empty-note" style="display:block;">No advance history yet.</p>`}
      <p class="kh-sh-note">You can also edit an advance from the Monthly Summary table.</p>`;
  }

  // ----- Full advance history (every + / − with its date), filterable by member and month -----
  function ensureAdvHistStyle(){
    if(document.getElementById("khAhStyle")) return;
    const st = document.createElement("style");
    st.id = "khAhStyle";
    st.textContent = `
      .kh-ah-headrow{ display:flex; align-items:center; justify-content:space-between; gap:10px; margin:18px 0 8px; }
      .kh-ah-viewall{ border:1px solid rgba(15,76,129,.35); background:rgba(15,76,129,.08); color:#0F4C81; font-weight:700; font-size:.78rem; padding:6px 12px; border-radius:999px; cursor:pointer; font-family:inherit; }
      [data-theme="dark"] .kh-ah-viewall{ color:#8FBFFF; border-color:rgba(143,191,255,.4); background:rgba(143,191,255,.1); }
      .kh-ah-back{ display:inline-flex; align-items:center; gap:6px; border:none; background:none; color:inherit; font-weight:700; font-size:.85rem; cursor:pointer; padding:2px 0 10px; font-family:inherit; opacity:.8; }
      .kh-ah-filters{ display:grid; grid-template-columns:1fr 1fr; gap:10px; margin:2px 0 12px; }
      .kh-ah-filters label{ display:flex; flex-direction:column; gap:4px; font-size:.7rem; font-weight:700; text-transform:uppercase; letter-spacing:.05em; opacity:.85; }
      .kh-ah-filters select{ width:100%; padding:9px 10px; border-radius:10px; border:1px solid rgba(128,128,128,.35); background:transparent; color:inherit; font-size:.9rem; font-family:inherit; text-transform:none; letter-spacing:0; font-weight:600; }
      .kh-ah-month{ display:flex; justify-content:space-between; align-items:baseline; margin:16px 0 6px; padding-bottom:6px; border-bottom:1px solid rgba(128,128,128,.25); font-size:.78rem; font-weight:800; text-transform:uppercase; letter-spacing:.05em; }
      .kh-ah-month small{ font-weight:700; text-transform:none; letter-spacing:0; opacity:.75; }
      .kh-ah-row{ display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid rgba(128,128,128,.16); }
      .kh-ah-ico{ width:34px; height:34px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:1.1rem; flex-shrink:0; }
      .kh-ah-ico.is-pos{ background:rgba(22,160,133,.14); color:#16A085; }
      .kh-ah-ico.is-neg{ background:rgba(214,69,69,.14); color:#D64545; }
      .kh-ah-ico.is-open{ background:rgba(128,128,128,.16); color:inherit; font-size:.8rem; }
      .kh-ah-mid{ flex:1; min-width:0; display:flex; flex-direction:column; }
      .kh-ah-mid b{ font-size:.92rem; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
      .kh-ah-mid small, .kh-ah-amt small{ font-size:.74rem; opacity:.7; }
      .kh-ah-amt{ display:flex; flex-direction:column; align-items:flex-end; }
      .kh-ah-amt b{ font-size:.95rem; white-space:nowrap; }
      .kh-ah-amt b.is-pos{ color:#16A085; } .kh-ah-amt b.is-neg{ color:#D64545; }
      .kh-sh-hist{ display:flex !important; align-items:center; gap:10px; }
      .kh-sh-hist .kh-sh-name{ flex:1; min-width:0; }
      .kh-adv-del{ flex:none; width:30px; height:30px; padding:0; border:none; border-radius:9px; display:inline-flex; align-items:center; justify-content:center; background:rgba(214,69,69,.1); color:#D64545; cursor:pointer; }
      .kh-adv-del svg{ width:15px; height:15px; }
      .kh-open-note{ display:flex; align-items:center; justify-content:space-between; gap:10px; margin:-4px 0 10px; padding:8px 10px; border-radius:10px; background:rgba(245,165,36,.14); font-size:.74rem; line-height:1.4; }
      .kh-open-clear{ flex:none; border:1px solid rgba(214,69,69,.45); background:rgba(214,69,69,.1); color:#D64545; font-weight:700; font-size:.74rem; padding:5px 11px; border-radius:999px; cursor:pointer; font-family:inherit; }
      [data-theme="dark"] .kh-open-clear{ color:#FF8A8A; border-color:rgba(255,138,138,.45); }
      .kh-adv-del:active{ transform:scale(.92); }
      [data-theme="dark"] .kh-adv-del{ background:rgba(255,120,120,.14); color:#FF8A8A; }
    `;
    document.head.appendChild(st);
  }
  function advanceHistoryHtml(){
    ensureAdvHistStyle();
    const all = [];
    members.forEach(m => (Array.isArray(m.advanceLog) ? m.advanceLog : []).forEach((e, i) => {
      if(e && typeof e.d === "string") all.push({ d: e.d, a: Number(e.a) || 0, n: m.name, id: m.id, i });
    }));
    const months = Array.from(new Set(all.map(x => x.d.slice(0, 7)))).sort((a, b) => b.localeCompare(a));
    if(advHist.member && !members.some(m => m.id === advHist.member)) advHist.member = "";
    if(advHist.month && months.indexOf(advHist.month) < 0) advHist.month = "";
    const f = advHist;
    const sel = f.member ? members.find(m => m.id === f.member) : null;
    const list = all.filter(x => (!f.member || x.id === f.member) && (!f.month || x.d.startsWith(f.month)));
    list.sort((x, y) => y.d.localeCompare(x.d) || y.i - x.i);

    // Running balance only makes sense for one member: balance right after each entry.
    const after = {};
    let opening = 0;
    if(sel){
      const log = all.filter(x => x.id === sel.id).sort((x, y) => x.d.localeCompare(y.d) || x.i - y.i);
      const sum = log.reduce((t, x) => t + x.a, 0);
      opening = Math.round(((typeof sel.advance === "number" ? sel.advance : 0) - sum) * 100) / 100;
      let run = opening;
      log.forEach(x => { run += x.a; after[x.d + "|" + x.i] = run; });
    }

    const taken = list.reduce((t, x) => t + (x.a > 0 ? x.a : 0), 0);
    const ded = list.reduce((t, x) => t + (x.a < 0 ? -x.a : 0), 0);
    const balNow = sel ? (typeof sel.advance === "number" ? sel.advance : 0) : members.reduce((t, m) => t + (typeof m.advance === "number" ? m.advance : 0), 0);
    const pretty = d => new Date(d + "T00:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const dow = d => new Date(d + "T00:00:00").toLocaleDateString("en-US", { weekday: "short" });

    const rowHtml = x => `<div class="kh-ah-row">
        <span class="kh-ah-ico ${x.a < 0 ? "is-neg" : "is-pos"}" aria-hidden="true">${x.a < 0 ? "−" : "+"}</span>
        <div class="kh-ah-mid"><b>${escapeHtml(x.n)}</b><small>${x.a < 0 ? "Deducted" : "Taken"} · ${escapeHtml(pretty(x.d))} · ${dow(x.d)}</small></div>
        <div class="kh-ah-amt"><b class="${x.a < 0 ? "is-neg" : "is-pos"}">${x.a < 0 ? "−" : "+"}${fmtRM(Math.abs(x.a))}</b>${sel ? `<small>Balance ${fmtRM(after[x.d + "|" + x.i])}</small>` : ""}</div>
        ${advDelBtn(x)}
      </div>`;

    let body = "";
    if(!list.length){
      body = `<p class="kh-empty-note" style="display:block;">No advance entries${(f.member || f.month) ? " for this filter" : " yet"}.</p>`;
    }else{
      let curM = "";
      list.forEach(x => {
        const ym = x.d.slice(0, 7);
        if(ym !== curM){
          curM = ym;
          const mt = list.filter(y => y.d.startsWith(ym));
          const mTaken = mt.reduce((t, y) => t + (y.a > 0 ? y.a : 0), 0), mDed = mt.reduce((t, y) => t + (y.a < 0 ? -y.a : 0), 0);
          body += `<div class="kh-ah-month"><span>${escapeHtml(monthLabel(ym))}</span><small>+${mTaken.toFixed(2)}${mDed > 0 ? " / −" + mDed.toFixed(2) : ""}</small></div>`;
        }
        body += rowHtml(x);
      });
      if(sel && !f.month && Math.abs(opening) >= 0.01){
        body += `<div class="kh-ah-row"><span class="kh-ah-ico is-open" aria-hidden="true">•</span><div class="kh-ah-mid"><b>Opening balance</b><small>Saved before history started (no date)</small></div><div class="kh-ah-amt"><b>${fmtRM(opening)}</b></div><button type="button" class="kh-adv-del" data-sheet-act="adv-open-del" data-id="${sel.id}" aria-label="Clear opening balance" title="Clear opening balance">${ICON_TRASH}</button></div>`;
      }
    }

    return `<button type="button" class="kh-ah-back" data-sheet-act="adv-back">‹ Back to Advance</button>
      <div class="kh-ah-filters">
        <label>Member<select id="khHistMember"><option value="">All members</option>${sortedMembers().map(m => `<option value="${m.id}"${m.id === f.member ? " selected" : ""}>${escapeHtml(m.name)}</option>`).join("")}</select></label>
        <label>Month<select id="khHistMonth"><option value="">All time</option>${months.map(m => `<option value="${m}"${m === f.month ? " selected" : ""}>${escapeHtml(monthLabel(m))}</option>`).join("")}</select></label>
      </div>
      <div class="kh-sh-grid"><div class="kh-sh-tile"><b>${fmtRM(taken)}</b><span>Taken</span></div><div class="kh-sh-tile"><b>${fmtRM(ded)}</b><span>Deducted</span></div><div class="kh-sh-tile"><b>${fmtRM(balNow)}</b><span>${sel ? "Current balance" : "Total balance"}</span></div></div>
      ${body}
      <p class="kh-sh-note">${list.length} entr${list.length === 1 ? "y" : "ies"}. Newest first.</p>`;
  }
  function advanceFormHtml(){
    return `<form id="khAdvForm" class="kh-sh-form" novalidate>
      <div class="kh-sh-field"><label for="khAdvMember">Team member</label><select id="khAdvMember"><option value="">Select a member</option>${sortedMembers().map(m => `<option value="${m.id}">${escapeHtml(m.name)} — ${fmtRM(m.advance)}</option>`).join("")}</select><span class="kh-field-error" id="khAdvMemberErr" aria-live="polite"></span></div>
      <div class="kh-sh-field"><span class="kh-sh-lbl">Type</span><div class="kh-sh-seg" role="radiogroup" aria-label="Advance type"><label><input type="radio" name="khAdvOp" value="add" checked><span>+ Add advance</span></label><label><input type="radio" name="khAdvOp" value="deduct"><span>− Deduct (repaid)</span></label></div></div>
      <div class="kh-sh-field"><label for="khAdvAmount">Amount (RM)</label><input type="number" id="khAdvAmount" min="0.01" step="0.01" inputmode="decimal" placeholder="0.00"><span class="kh-field-error" id="khAdvAmountErr" aria-live="polite"></span></div>
      <div class="kh-sh-field"><label for="khAdvDate">Date</label><input type="date" id="khAdvDate" value="${localTodayStr()}"><span class="kh-field-error" id="khAdvDateErr" aria-live="polite"></span></div>
      <div class="kh-sh-actions"><button type="button" class="btn3d kh-sh-cancel" data-sheet-act="adv-cancel">Cancel</button><button type="submit" class="btn3d btn-mint" id="khAdvSave">Save Advance</button></div></form>`;
  }
  function onSheetClick(e){
    const act = e.target.closest("[data-sheet-act]");
    if(act){
      const a = act.dataset.sheetAct;
      if(a === "add-member"){
        closeStatSheet();
        if(window.wtShowView) window.wtShowView("team", { keepScroll: true, target: "sectionTeam" });
        setTimeout(() => { const i = document.getElementById("memberInput"); if(i) i.focus(); }, 80);
      }else if(a === "add-advance"){ statForm = true; renderStatSheet(); }
      else if(a === "adv-cancel"){ statForm = false; renderStatSheet(); }
      else if(a === "adv-history"){ advHist = { member: "", month: "" }; renderStatSheet(); const b = document.getElementById("khStatBody"); if(b) b.scrollTop = 0; }
      else if(a === "adv-back"){ advHist = null; renderStatSheet(); }
      else if(a === "adv-del"){ deleteAdvanceEntry(act.dataset); }
      else if(a === "adv-open-del"){ clearOpeningBalance(act.dataset.id); }
      return;
    }
    const row = e.target.closest("[data-member]");
    if(row){ const m = members.find(x => x.id === row.dataset.member); if(m) openMemberProfileModal(m); }
  }
  async function onAdvanceSubmit(e){
    if(e.target.id !== "khAdvForm") return;
    e.preventDefault();
    if(statSaving) return;
    const q = id => document.getElementById(id);
    const err = (id, msg) => { const el = q(id); if(el) el.textContent = msg || ""; };
    const memberId = q("khAdvMember").value, op = (document.querySelector('input[name="khAdvOp"]:checked') || {}).value === "deduct" ? "deduct" : "add";
    const raw = parseFloat(q("khAdvAmount").value), date = q("khAdvDate").value;
    let ok = true;
    err("khAdvMemberErr", memberId ? "" : "Please select a team member."); if(!memberId) ok = false;
    if(!isFinite(raw) || raw <= 0){ err("khAdvAmountErr", "Enter an amount greater than 0."); ok = false; }
    else if(raw > 1000000){ err("khAdvAmountErr", "Amount is too large."); ok = false; }
    else err("khAdvAmountErr", "");
    if(!/^\d{4}-\d{2}-\d{2}$/.test(date)){ err("khAdvDateErr", "Choose a valid date."); ok = false; } else err("khAdvDateErr", "");
    if(!ok) return;
    const amount = Math.round(raw * 100) / 100;
    statSaving = true;
    const btn = q("khAdvSave"); if(btn){ btn.disabled = true; btn.textContent = "Saving…"; }
    let newBalance = 0;
    try{
      const ref = doc(db, "kh_members", memberId);
      await runTransaction(db, async tx => {
        const snap = await tx.get(ref);
        if(!snap.exists()) throw new Error("member-missing");
        const cur = snap.data();
        const bal = typeof cur.advance === "number" ? cur.advance : 0;
        newBalance = op === "deduct" ? bal - amount : bal + amount;
        const log = Array.isArray(cur.advanceLog) ? cur.advanceLog.slice() : [];
        log.push({ d: date, a: op === "deduct" ? -amount : amount });
        tx.update(ref, { advance: newBalance, advanceLog: log });
      });
      if(newBalance < 0) showToast(`Saved, but new balance is negative: ${fmtRM(newBalance)}.`, "error");
      else showToast(`${op === "deduct" ? "Deducted" : "Added"} ${fmtRM(amount)}. New balance: ${fmtRM(newBalance)}.`);
      statSaving = false; statForm = false;
      renderStatSheet();
      setTimeout(() => { renderSummary(); renderQuickStats(); }, 350);
    }catch(error){
      console.error(error);
      showToast("Failed to save advance. Please try again.", "error");
      statSaving = false;
      if(btn){ btn.disabled = false; btn.textContent = "Save Advance"; }
    }
  }
  (function bindStatCards(){
    const qs = document.getElementById("quickStats");
    if(!qs || qs.dataset.wtBound) return;
    qs.dataset.wtBound = "1";
    const open = el => { const card = el.closest("[data-stat]"); if(card) openStatSheet(card.dataset.stat, card); };
    qs.addEventListener("click", e => open(e.target));
    qs.addEventListener("keydown", e => { if((e.key === "Enter" || e.key === " ") && e.target.closest("[data-stat]")){ e.preventDefault(); open(e.target); } });
  })();
  // ===== STAT-SHEET END =====

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
