import {
  auth, db, GoogleAuthProvider, FacebookAuthProvider,
  signInWithPopup,
  signOut, onAuthStateChanged,
  doc, setDoc, serverTimestamp,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail,
  sendEmailVerification, updateProfile,
  EmailAuthProvider, linkWithCredential, updatePassword, reauthenticateWithPopup
} from "./firebase.js";
import { initKhApp } from "./khApp.js";

// আপনার নিজের Firebase UID — এই UID দিয়ে লগইন করা অ্যাকাউন্টটাই admin হিসেবে গণ্য হবে
// (masumcpex@gmail.com দিয়ে সাইন-ইন করলে আপনার UID এটাই)
const ADMIN_UID = "dhVV4XAquCZw8u5Bb3egTK4Zb0U2";

document.addEventListener("DOMContentLoaded", () => {

  const gate         = document.getElementById("khAuthGate");
  const mainEl       = document.getElementById("khMain");
  const userBar      = document.getElementById("khUserBar");
  const userEmailEl  = document.getElementById("khUserEmail");
  const userEmailFullEl = document.getElementById("khUserEmailFull");
  const avatarImgEl  = document.getElementById("khAccountAvatarImg");
  const avatarIconEl = document.getElementById("khAccountAvatarIcon");
  const signInBtn    = document.getElementById("googleSignInBtn");
  const fbSignInBtn  = document.getElementById("facebookSignInBtn");
  const signOutBtn   = document.getElementById("khSignOutBtn");
  const authError    = document.getElementById("khAuthError");

  function ensureLogoutConfirmModal(){
    let overlay = document.getElementById("khLogoutConfirmOverlay");
    if(overlay) return overlay;
    overlay = document.createElement("div");
    overlay.id = "khLogoutConfirmOverlay";
    overlay.className = "kh-modal-overlay";
    overlay.innerHTML = `
      <div class="kh-modal-card">
        <p class="kh-modal-icon"><svg class="kh-modal-icon-svg kh-modal-icon-svg--warn" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></p>
        <p class="kh-modal-text">Are you sure you want to log out?</p>
        <div class="kh-modal-actions">
          <button type="button" class="btn3d btn-coral" id="khLogoutConfirmYesBtn">Yes, Log Out</button>
          <button type="button" class="btn3d btn-mint" id="khLogoutConfirmNoBtn">Cancel</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    return overlay;
  }
  function askLogoutConfirm(){
    return new Promise(resolve => {
      const overlay = ensureLogoutConfirmModal();
      overlay.style.display = "flex";
      const yesBtn = overlay.querySelector("#khLogoutConfirmYesBtn");
      const noBtn  = overlay.querySelector("#khLogoutConfirmNoBtn");
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

  function showAuthError(msg){
    authError.textContent = msg;
    authError.style.display = "block";
  }

  signInBtn.addEventListener("click", async () => {
    authError.style.display = "none";
    signInBtn.disabled = true;
    try{
      await signInWithPopup(auth, new GoogleAuthProvider());
    }catch(err){
      console.error(err);
      showAuthError("Couldn't sign in with Google: " + (err.code || err.message || "Unknown error"));
    }finally{
      signInBtn.disabled = false;
    }
  });

  fbSignInBtn.addEventListener("click", async () => {
    authError.style.display = "none";
    fbSignInBtn.disabled = true;
    try{
      await signInWithPopup(auth, new FacebookAuthProvider());
    }catch(err){
      console.error(err);
      showAuthError("Couldn't sign in with Facebook: " + (err.code || err.message || "Unknown error"));
    }finally{
      fbSignInBtn.disabled = false;
    }
  });

  signOutBtn.addEventListener("click", async () => {
    const dropdown = document.getElementById("khAccountDropdown");
    if(dropdown) dropdown.classList.remove("is-open");
    const confirmed = await askLogoutConfirm();
    if(confirmed) await signOut(auth);
  });

  // ---------- Set / change password (adds email + password login to the CURRENT account) ----------
  // Same account, same data: the password is linked to the user who is already signed in
  // (e.g. via Google), so the Firebase UID — and therefore every member, record and admin right — stays the same.
  const setPasswordBtn = document.getElementById("khSetPasswordBtn");

  function pwErrorText(err){
    const code = err && err.code;
    if(code === "auth/weak-password") return "That password is too weak. Use at least 10 characters.";
    if(code === "auth/requires-recent-login") return "For security, please log in again and then retry.";
    if(code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") return "Google confirmation was cancelled. Nothing was changed.";
    if(code === "auth/popup-blocked") return "The Google confirmation window was blocked. Allow pop-ups and try again.";
    if(code === "auth/email-already-in-use" || code === "auth/credential-already-in-use") return "This email already has a separate password account. Please contact support before continuing.";
    if(code === "auth/provider-already-linked") return "A password is already set. Use the same option again to change it.";
    if(code === "auth/operation-not-allowed") return "Email/password sign-in is switched off in Firebase (Authentication → Sign-in method).";
    if(code === "auth/network-request-failed") return "No internet connection. Please try again.";
    return "Could not save the password. Please try again.";
  }

  async function saveAccountPassword(password){
    const user = auth.currentUser;
    if(!user || !user.email) throw Object.assign(new Error("no-email"), { code: "custom/no-email" });
    const hasPassword = user.providerData.some(p => p.providerId === "password");
    const apply = async () => {
      if(hasPassword) await updatePassword(user, password);
      else await linkWithCredential(user, EmailAuthProvider.credential(user.email, password));
    };
    try{
      await apply();
    }catch(err){
      if(err && err.code === "auth/requires-recent-login" && user.providerData.some(p => p.providerId === "google.com")){
        await reauthenticateWithPopup(user, new GoogleAuthProvider());   // asks Google once, then retry
        await apply();
      }else{
        throw err;
      }
    }
  }

  function openSetPasswordModal(){
    const user = auth.currentUser;
    if(!user) return;
    const old = document.getElementById("khSetPwOverlay");
    if(old) old.remove();
    const hasPassword = user.providerData.some(p => p.providerId === "password");
    const email = user.email || "";
    const overlay = document.createElement("div");
    overlay.id = "khSetPwOverlay";
    overlay.className = "kh-modal-overlay";
    overlay.style.display = "flex";
    const field = "width:100%;box-sizing:border-box;min-height:46px;padding:0 12px;border:1.5px solid #CBD5E1;border-radius:10px;font:inherit;background:#fff;";
    overlay.innerHTML = `
      <div class="kh-modal-card" role="dialog" aria-modal="true" aria-labelledby="khSetPwTitle" style="max-width:420px;text-align:left;">
        <h3 id="khSetPwTitle" style="margin:0 0 .3rem;color:#173B63;">${hasPassword ? "Change password" : "Set a password"}</h3>
        <p style="margin:0 0 1rem;color:#667085;font-size:.9rem;line-height:1.45;">
          ${hasPassword ? "Choose a new password for" : "After this you can log in with"} <b style="overflow-wrap:anywhere;">${email.replace(/[<>&"]/g, "")}</b> ${hasPassword ? "." : "and this password, as well as with Google."}
        </p>
        <label style="display:block;font-size:.75rem;font-weight:700;color:#667085;text-transform:uppercase;margin-bottom:4px;" for="khPw1">New password</label>
        <input id="khPw1" type="password" autocomplete="new-password" minlength="10" style="${field}margin-bottom:12px;">
        <label style="display:block;font-size:.75rem;font-weight:700;color:#667085;text-transform:uppercase;margin-bottom:4px;" for="khPw2">Confirm password</label>
        <input id="khPw2" type="password" autocomplete="new-password" style="${field}">
        <label style="display:flex;align-items:center;gap:8px;margin:10px 0 0;font-size:.85rem;color:#475467;cursor:pointer;"><input type="checkbox" id="khPwShow" style="width:18px;height:18px;"> Show password</label>
        <p style="margin:10px 0 0;font-size:.78rem;color:#98A2B3;">At least 10 characters. Use a password you do not use anywhere else.</p>
        <p id="khPwMsg" role="alert" style="min-height:1.3em;margin:10px 0 0;font-size:.88rem;font-weight:600;color:#C0392B;"></p>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px;">
          <button type="button" id="khPwSave" class="btn3d btn-sky" style="flex:1 1 150px;min-height:46px;white-space:nowrap;">Save password</button>
          <button type="button" id="khPwCancel" class="btn3d" style="flex:1 1 110px;min-height:46px;background:#fff;color:#173B63;border:1px solid #CBD5E1;box-shadow:none;white-space:nowrap;">Cancel</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    const q = id => overlay.querySelector(id);
    const close = () => { document.removeEventListener("keydown", onKey); overlay.remove(); };
    const onKey = e => { if(e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    overlay.addEventListener("click", e => { if(e.target === overlay) close(); });
    q("#khPwCancel").addEventListener("click", close);
    q("#khPwShow").addEventListener("change", e => { q("#khPw1").type = q("#khPw2").type = e.target.checked ? "text" : "password"; });
    q("#khPw1").focus();

    q("#khPwSave").addEventListener("click", async () => {
      const msg = q("#khPwMsg"); const p1 = q("#khPw1").value; const p2 = q("#khPw2").value;
      msg.style.color = "#C0392B";
      if(p1.length < 10){ msg.textContent = "Use at least 10 characters."; return; }
      if(/^\d+$/.test(p1)){ msg.textContent = "Do not use only numbers."; return; }
      if(email && p1.toLowerCase().includes(email.split("@")[0].toLowerCase()) && email.split("@")[0].length >= 4){ msg.textContent = "Do not include your email name in the password."; return; }
      if(p1 !== p2){ msg.textContent = "The two passwords do not match."; return; }
      const btn = q("#khPwSave"); btn.disabled = true; btn.textContent = "Saving...";
      try{
        await saveAccountPassword(p1);
        q("#khPw1").value = q("#khPw2").value = "";
        msg.style.color = "#0F766A";
        msg.textContent = "Password saved. You can now log in with your email and this password.";
        btn.textContent = "Done";
        btn.disabled = false;
        btn.onclick = close;
      }catch(err){
        console.error("Set password failed:", err && err.code);
        msg.textContent = err && err.code === "custom/no-email" ? "This account has no email address, so a password cannot be added." : pwErrorText(err);
        btn.disabled = false; btn.textContent = "Save password";
      }
    });
  }

  if(setPasswordBtn){
    setPasswordBtn.addEventListener("click", () => {
      const dropdown = document.getElementById("khAccountDropdown");
      if(dropdown) dropdown.classList.remove("is-open");
      openSetPasswordModal();
    });
  }

  onAuthStateChanged(auth, (user) => {
    if(user){
      gate.style.display = "none";
      mainEl.style.display = "block";
      userBar.style.display = "flex";

      const email = user.email || user.phoneNumber || "";
      let displayName = user.displayName || (email.includes("@") ? email.split("@")[0] : email);
      userEmailEl.textContent = displayName;
      if(userEmailFullEl) userEmailFullEl.textContent = email;

      if(avatarImgEl && avatarIconEl){
        if(user.photoURL){
          avatarImgEl.src = user.photoURL;
          avatarImgEl.alt = displayName;
          avatarImgEl.style.display = "block";
          avatarIconEl.style.display = "none";
          avatarImgEl.onerror = () => {
            avatarImgEl.style.display = "none";
            avatarIconEl.style.display = "block";
          };
        }else{
          avatarImgEl.style.display = "none";
          avatarImgEl.src = "";
          avatarIconEl.style.display = "block";
        }
      }

      const isAdmin = user.uid === ADMIN_UID;

      // প্রতিবার লগইনে নিজের প্রোফাইল তথ্য kh_users এ সেভ/আপডেট করা হয়,
      // যাতে admin অন্য সবার নাম/ইমেইল দেখতে পারে (নিজেরটাই লেখা হয়, তাই rules-এর সাথে সমস্যা হবে না)
      setDoc(doc(db, "kh_users", user.uid), {
        email: email || null,
        displayName: displayName || null,
        updatedAt: serverTimestamp()
      }, { merge: true }).catch(err => console.error("kh_users sync failed:", err));

      initKhApp(user.uid, isAdmin);
    }else{
      gate.style.display = "flex";
      mainEl.style.display = "none";
      userBar.style.display = "none";
      if(avatarImgEl && avatarIconEl){
        avatarImgEl.style.display = "none";
        avatarImgEl.src = "";
        avatarIconEl.style.display = "block";
      }
      if(window.__khHideVerifyGate) window.__khHideVerifyGate();
    }
  });

});

document.addEventListener("DOMContentLoaded", () => {

  const authError = document.getElementById("khAuthError");
  const authTitle = document.getElementById("khAuthTitle");
  const subtitle  = document.getElementById("khAuthSubtitle");

  const form        = document.getElementById("khEmailForm");
  const submitBtn   = document.getElementById("khEmailSubmitBtn");
  const forgotBtn   = document.getElementById("khForgotPasswordBtn");
  const toggleModeBtn = document.getElementById("khToggleModeBtn");
  const toggleText    = document.getElementById("khToggleText");

  const fullNameWrap  = document.getElementById("khFullNameWrap");
  const fullNameInput = document.getElementById("khFullNameInput");
  const fullNameError = document.getElementById("khFullNameError");

  const emailInput = document.getElementById("khEmailInput");
  const emailError = document.getElementById("khEmailError");

  const passwordInput = document.getElementById("khPasswordInput");
  const passwordError = document.getElementById("khPasswordError");

  const confirmWrap  = document.getElementById("khConfirmPasswordWrap");
  const confirmInput = document.getElementById("khConfirmPasswordInput");
  const confirmError = document.getElementById("khConfirmPasswordError");

  const passwordToggle = document.getElementById("khPasswordToggle");
  const confirmPasswordToggle = document.getElementById("khConfirmPasswordToggle");

  const termsTextEl = document.getElementById("khTermsText");

  const loginSignupBox = document.getElementById("khLoginSignupBox");
  const verifyBox      = document.getElementById("khVerifyEmailBox");
  const resendBtn       = document.getElementById("khResendVerificationBtn");
  const backToLoginBtn  = document.getElementById("khBackToLoginBtn");
  const verifyError     = document.getElementById("khVerifyError");

  if(!form || !submitBtn || !toggleModeBtn) return;

  let mode = "login";
  let isSubmitting = false;

  function showAuthError(msg){
    if(!authError) return;
    authError.textContent = msg;
    authError.style.display = "block";
  }
  function clearAuthError(){
    if(!authError) return;
    authError.style.display = "none";
    authError.textContent = "";
  }
  function setFieldError(input, errorEl, msg){
    if(input) input.classList.add("kh-input-error");
    if(errorEl) errorEl.textContent = msg;
  }
  function clearFieldError(input, errorEl){
    if(input) input.classList.remove("kh-input-error");
    if(errorEl) errorEl.textContent = "";
  }
  function clearAllFieldErrors(){
    clearFieldError(fullNameInput, fullNameError);
    clearFieldError(emailInput, emailError);
    clearFieldError(passwordInput, passwordError);
    clearFieldError(confirmInput, confirmError);
  }

  fullNameInput?.addEventListener("input", () => clearFieldError(fullNameInput, fullNameError));
  emailInput?.addEventListener("input", () => clearFieldError(emailInput, emailError));
  passwordInput?.addEventListener("input", () => clearFieldError(passwordInput, passwordError));
  confirmInput?.addEventListener("input", () => clearFieldError(confirmInput, confirmError));

  const ICON_EYE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/></svg>`;
  const ICON_EYE_OFF = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a20.3 20.3 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a20.3 20.3 0 0 1-3.22 4.36M14.12 14.12a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;

  function wirePasswordToggle(toggleBtn, input){
    if(!toggleBtn || !input) return;
    toggleBtn.innerHTML = ICON_EYE;
    toggleBtn.addEventListener("click", () => {
      const showing = input.type === "text";
      input.type = showing ? "password" : "text";
      toggleBtn.innerHTML = showing ? ICON_EYE : ICON_EYE_OFF;
      toggleBtn.setAttribute("aria-pressed", String(!showing));
      toggleBtn.setAttribute("aria-label", showing ? "Show password" : "Hide password");
    });
  }
  wirePasswordToggle(passwordToggle, passwordInput);
  wirePasswordToggle(confirmPasswordToggle, confirmInput);

  function setMode(newMode){
    mode = newMode;
    const isLogin = mode === "login";

    fullNameWrap.style.display = isLogin ? "none" : "block";
    confirmWrap.style.display  = isLogin ? "none" : "block";
    if(termsTextEl) termsTextEl.style.display = isLogin ? "none" : "block";
    forgotBtn.style.display    = isLogin ? "inline-block" : "none";
    submitBtn.textContent      = isLogin ? "Log In" : "Create Account";
    if(authTitle) authTitle.textContent = isLogin ? "Welcome Back" : "Create Account";
    if(subtitle) subtitle.textContent   = isLogin
      ? "Sign in to continue to WorkTrack"
      : "Join WorkTrack today";
    if(toggleText) toggleText.textContent = isLogin ? "Don't have an account?" : "Already have an account?";
    toggleModeBtn.textContent = isLogin ? "Sign up" : "Log In";

    clearAuthError();
    clearAllFieldErrors();
  }

  toggleModeBtn.addEventListener("click", () => setMode(mode === "login" ? "signup" : "login"));

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateEmail(){
    const value = (emailInput.value || "").trim();
    if(!value){ setFieldError(emailInput, emailError, "Email is required."); return false; }
    if(!EMAIL_RE.test(value)){ setFieldError(emailInput, emailError, "Please enter a valid email address."); return false; }
    clearFieldError(emailInput, emailError);
    return true;
  }

  function validateLoginPassword(){
    if(!passwordInput.value){ setFieldError(passwordInput, passwordError, "Password is required."); return false; }
    clearFieldError(passwordInput, passwordError);
    return true;
  }

  function validateFullName(){
    const value = (fullNameInput.value || "").trim();
    if(!value){ setFieldError(fullNameInput, fullNameError, "Full name is required."); return false; }
    if(value.length < 2){ setFieldError(fullNameInput, fullNameError, "Please enter your full name."); return false; }
    clearFieldError(fullNameInput, fullNameError);
    return true;
  }

  function validateSignupPassword(){
    if(!passwordInput.value){ setFieldError(passwordInput, passwordError, "Password is required."); return false; }
    if(passwordInput.value.length < 8){ setFieldError(passwordInput, passwordError, "Password must be at least 8 characters."); return false; }
    clearFieldError(passwordInput, passwordError);
    return true;
  }

  function validateConfirmPassword(){
    if(!confirmInput.value){ setFieldError(confirmInput, confirmError, "Please confirm your password."); return false; }
    if(confirmInput.value !== passwordInput.value){ setFieldError(confirmInput, confirmError, "Passwords do not match."); return false; }
    clearFieldError(confirmInput, confirmError);
    return true;
  }

  function handleAuthError(err){
    const code = err && err.code ? err.code : "";
    if(mode === "login"){
      if(code === "auth/wrong-password" || code === "auth/invalid-credential" || code === "auth/invalid-login-credentials"){
        setFieldError(passwordInput, passwordError, "Incorrect password. Please try again.");
        return;
      }
      if(code === "auth/user-not-found"){
        setFieldError(emailInput, emailError, "No account found with this email.");
        return;
      }
      if(code === "auth/invalid-email"){
        setFieldError(emailInput, emailError, "Please enter a valid email address.");
        return;
      }
      if(code === "auth/too-many-requests"){
        showAuthError("Too many attempts. Please wait a moment and try again.");
        return;
      }
      showAuthError("Login failed: " + (err.message || "Unknown error."));
    }else{
      if(code === "auth/email-already-in-use"){
        setFieldError(emailInput, emailError, "This email is already registered.");
        return;
      }
      if(code === "auth/invalid-email"){
        setFieldError(emailInput, emailError, "Please enter a valid email address.");
        return;
      }
      if(code === "auth/weak-password"){
        setFieldError(passwordInput, passwordError, "Password is too weak. Please choose a stronger password.");
        return;
      }
      showAuthError("Account creation failed: " + (err.message || "Unknown error."));
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if(isSubmitting) return;
    clearAuthError();

    let valid = validateEmail();
    if(mode === "login"){
      if(!validateLoginPassword()) valid = false;
    }else{
      if(!validateFullName()) valid = false;
      if(!validateSignupPassword()) valid = false;
      if(!validateConfirmPassword()) valid = false;
    }
    if(!valid) return;

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    isSubmitting = true;
    submitBtn.disabled = true;
    const originalLabel = submitBtn.textContent;
    submitBtn.textContent = mode === "login" ? "Logging in…" : "Creating account…";

    try{
      if(mode === "login"){
        await signInWithEmailAndPassword(auth, email, password);
     
      }else{
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const name = fullNameInput.value.trim();
        if(name){
          try{ await updateProfile(cred.user, { displayName: name }); }
          catch(profileErr){ console.error(profileErr); }
        }
        
      }
    }catch(err){
      console.error(err);
      handleAuthError(err);
    }finally{
      isSubmitting = false;
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  });

  forgotBtn.addEventListener("click", async () => {
    clearAuthError();
    if(!validateEmail()) return;
    const email = emailInput.value.trim();

    forgotBtn.disabled = true;
    try{
      await sendPasswordResetEmail(auth, email);
      showAuthError("Password reset link sent to your email. Please check your inbox (and spam folder).");
    }catch(err){
      console.error(err);
      if(err.code === "auth/user-not-found"){
        setFieldError(emailInput, emailError, "No account found with this email.");
      }else{
        showAuthError("Couldn't send reset link: " + (err.code || err.message || "Unknown error."));
      }
    }finally{
      forgotBtn.disabled = false;
    }
  });

  window.__khShowVerifyGate = function(){
    if(loginSignupBox) loginSignupBox.style.display = "none";
    if(verifyBox) verifyBox.style.display = "block";
    clearInterval(resendCooldownTimer);
    if(resendBtn){ resendBtn.disabled = false; resendBtn.textContent = "Resend Verification Email"; }
  };
  window.__khHideVerifyGate = function(){
    if(verifyBox) verifyBox.style.display = "none";
    if(loginSignupBox) loginSignupBox.style.display = "block";
  };

  let resendCooldownTimer = null;
  function startResendCooldown(seconds){
    if(!resendBtn) return;
    let remaining = seconds;
    const originalLabel = "Resend Verification Email";
    resendBtn.disabled = true;
    resendBtn.textContent = `Resend Verification Email (${remaining}s)`;
    clearInterval(resendCooldownTimer);
    resendCooldownTimer = setInterval(() => {
      remaining -= 1;
      if(remaining <= 0){
        clearInterval(resendCooldownTimer);
        resendBtn.disabled = false;
        resendBtn.textContent = originalLabel;
      }else{
        resendBtn.textContent = `Resend Verification Email (${remaining}s)`;
      }
    }, 1000);
  }

  resendBtn?.addEventListener("click", async () => {
    if(verifyError) verifyError.style.display = "none";
    const user = auth.currentUser;
    if(!user) return;
    resendBtn.disabled = true;
    try{
      await sendEmailVerification(user);
      if(verifyError){
        verifyError.textContent = "Verification email sent again. Please check your inbox.";
        verifyError.style.display = "block";
      }
      startResendCooldown(60);
    }catch(err){
      console.error(err);
      if(verifyError){
        if(err.code === "auth/too-many-requests"){
          verifyError.textContent = "An email was just sent. Please wait a moment and try again, and check your inbox/spam folder.";
        }else{
          verifyError.textContent = "Couldn't resend email: " + (err.code || err.message || "Unknown error.");
        }
        verifyError.style.display = "block";
      }
     
      startResendCooldown(err.code === "auth/too-many-requests" ? 60 : 5);
    }
  });

  backToLoginBtn?.addEventListener("click", async () => {
    await signOut(auth);
    setMode("login");
  });

});
