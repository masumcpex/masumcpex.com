// Hidden chapters: every chapter has its OWN password, salt and key.
// Opening one chapter never opens another. A session lasts 1 hour per chapter.
const SESSION_DURATION_MS = 60 * 60 * 1000; // ১ ঘণ্টা
const KEY_ITERATIONS = 210000;
const CHAPTER_PREFIX = "khChapter:";

// Per chapter: salt + a small encrypted check value ("canary") used only to test a typed password.
const CHAPTERS = {
  "nasir": { salt: "7edd945de375569233253008e10781e6", iv: "Y+HogJAdYXXattVh", ct: "tSt3I2DPpE+QffT7xbZ7Qdng" },
  "nazim": { salt: "f8da3b3471d687ace0678a985b467522", iv: "UuUrdmncxJHIglpz", ct: "PmwRhPs33rgj0c1QnMzvEFBB" },
  "hafsa": { salt: "c90e53eb0b262aece1a63feeb79ad369", iv: "VERJTVSTa6hOp7rv", ct: "5OotMkBTOBd3hyXf7bwQcBEY" },
  "amar-golpo": { salt: "596d5808ba4eeec45bf9e7e1336fb3fd", iv: "XOmBi4YUwdAV6+5i", ct: "/VPiHQP/Yp8XBTsg8FVnr+9m" }
};

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  return bytes;
}
function bytesToHex(bytes) {
  return Array.from(new Uint8Array(bytes)).map(b => b.toString(16).padStart(2, "0")).join("");
}
function b64ToBytes(b64) {
  return Uint8Array.from(atob(b64), c => c.charCodeAt(0));
}

// Capital letters / spaces typed by a phone keyboard must not matter.
const normalizePassword = (p) => String(p || "").trim().toLowerCase();

async function deriveChapterKey(password, saltHex) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw", enc.encode(password), { name: "PBKDF2" }, false, ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: hexToBytes(saltHex), iterations: KEY_ITERATIONS, hash: "SHA-256" },
    keyMaterial, 256
  );
  return new Uint8Array(bits);
}

async function verifyChapterPassword(slug, password) {
  const ch = CHAPTERS[slug];
  const pw = normalizePassword(password);
  if (!ch || !pw) return null;
  try {
    const rawKey = await deriveChapterKey(pw, ch.salt);
    const aesKey = await crypto.subtle.importKey("raw", rawKey, { name: "AES-GCM" }, false, ["decrypt"]);
    await crypto.subtle.decrypt({ name: "AES-GCM", iv: b64ToBytes(ch.iv) }, aesKey, b64ToBytes(ch.ct));
    return bytesToHex(rawKey);
  } catch (e) {
    return null;
  }
}

function saveChapterSession(slug, hexKey) {
  localStorage.setItem(CHAPTER_PREFIX + slug, JSON.stringify({ key: hexKey, exp: Date.now() + SESSION_DURATION_MS }));
}

export function getChapterKey(slug) {
  try {
    const raw = localStorage.getItem(CHAPTER_PREFIX + slug);
    if (!raw) return null;
    const { key, exp } = JSON.parse(raw);
    if (!key || !exp || Date.now() > exp) { localStorage.removeItem(CHAPTER_PREFIX + slug); return null; }
    return key;
  } catch (e) {
    localStorage.removeItem(CHAPTER_PREFIX + slug);
    return null;
  }
}

export async function unlockChapter(slug, password) {
  const hexKey = await verifyChapterPassword(slug, password);
  if (hexKey) { saveChapterSession(slug, hexKey); return true; }
  return false;
}

export function refreshChapter(slug) {
  const key = getChapterKey(slug);
  if (key) saveChapterSession(slug, key);
}

export function clearChapter(slug) {
  localStorage.removeItem(CHAPTER_PREFIX + slug);
}

export function clearAllChapters() {
  Object.keys(CHAPTERS).forEach(clearChapter);
}

export function openChapterSlugs() {
  return Object.keys(CHAPTERS).filter(s => !!getChapterKey(s));
}

// The old single shared session is gone: remove it from phones that still have it.
try { localStorage.removeItem("khPrivateSession"); } catch (e) {}

const BOOK_SESSION_KEY   = "khBookSession";
const BOOK_KEY_SALT_HEX  = "41a249dfa0e6c0eca0665d9099fa3fa7";
const BOOK_CANARY_IV_B64 = "ZauK7HVIYEsFc/fc";
const BOOK_CANARY_CT_B64 = "k9GDD4VhZo6KDAhWvd0RDcx3Et+0YIZYowWi40QaLjhQ";

async function deriveBookRawKey(password) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw", enc.encode(password), { name: "PBKDF2" }, false, ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: hexToBytes(BOOK_KEY_SALT_HEX), iterations: KEY_ITERATIONS, hash: "SHA-256" },
    keyMaterial, 256
  );
  return new Uint8Array(bits);
}

async function verifyBookPassword(password) {
  if (!password) return null;
  try {
    const rawKey = await deriveBookRawKey(password);
    const aesKey = await crypto.subtle.importKey("raw", rawKey, { name: "AES-GCM" }, false, ["decrypt"]);
    await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: b64ToBytes(BOOK_CANARY_IV_B64) }, aesKey, b64ToBytes(BOOK_CANARY_CT_B64)
    );
    return bytesToHex(rawKey);
  } catch (e) {
    return null;
  }
}

function saveBookSession(hexKey) {
  const exp = Date.now() + SESSION_DURATION_MS;
  localStorage.setItem(BOOK_SESSION_KEY, JSON.stringify({ key: hexKey, exp }));
}

export function hasActiveBookSession() {
  try {
    const raw = localStorage.getItem(BOOK_SESSION_KEY);
    if (!raw) return false;
    const { key, exp } = JSON.parse(raw);
    if (!key || !exp || Date.now() > exp) {
      localStorage.removeItem(BOOK_SESSION_KEY);
      return false;
    }
    return true;
  } catch (e) {
    localStorage.removeItem(BOOK_SESSION_KEY);
    return false;
  }
}

export async function unlockBookWithPassword(password) {
  const hexKey = await verifyBookPassword(password);
  if (hexKey) {
    saveBookSession(hexKey);
    return true;
  }
  return false;
}
