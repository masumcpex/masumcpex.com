import {
  auth, db, GoogleAuthProvider, FacebookAuthProvider,
  signInWithPopup,
  signOut, onAuthStateChanged,
  doc, setDoc, serverTimestamp,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail,
  sendEmailVerification, updateProfile
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
