(function(){

  const synth = window.speechSynthesis || null;
  const listeners = new Map();

  let bengaliVoice = null;
  let voiceLookupDone = false;
  let activeId = null;
  let activeUtterance = null;
  let activeState = "idle";

  function findBengaliVoice(){
    if(!synth) return null;
    const voices = synth.getVoices();
    if(!voices.length) return null;
    return voices.find(v => v.lang === "bn-BD")
      || voices.find(v => v.lang === "bn-IN")
      || voices.find(v => (v.lang || "").toLowerCase().startsWith("bn"))
      || null;
  }

  function loadVoice(callback){
    if(!synth){ callback(); return; }
    bengaliVoice = findBengaliVoice();
    if(bengaliVoice || voiceLookupDone){ callback(); return; }
    let settled = false;
    const finish = () => {
      if(settled) return;
      settled = true;
      bengaliVoice = findBengaliVoice();
      voiceLookupDone = true;
      callback();
    };
    synth.addEventListener("voiceschanged", finish, { once: true });
    setTimeout(finish, 400);
  }

  function extractText(html){
    const holder = document.createElement("div");
    holder.innerHTML = html || "";
    return holder.textContent.replace(/\s+/g, " ").trim();
  }

  function notify(id, state){
    const handler = listeners.get(id);
    if(handler) handler(state);
  }

  function clearActive(){
    activeId = null;
    activeUtterance = null;
    activeState = "idle";
  }

  function stop(){
    if(!synth) return;
    const previousId = activeId;
    synth.cancel();
    clearActive();
    if(previousId) notify(previousId, "idle");
  }

  function register(id, onState){
    listeners.set(id, onState);
  }

  function unregister(id){
    listeners.delete(id);
  }

  function getState(id){
    return activeId === id ? activeState : "idle";
  }

  function getActiveId(){
    return activeId;
  }

  function stopId(id){
    if(activeId === id) stop();
  }

  function toggle(id, html){
    if(!synth) return;

    if(activeId === id){
      if(activeState === "playing"){
        synth.pause();
        activeState = "paused";
        notify(id, "paused");
        return;
      }
      if(activeState === "paused"){
        synth.resume();
        activeState = "playing";
        notify(id, "playing");
        return;
      }
    }

    if(activeId && activeId !== id){
      const previousId = activeId;
      synth.cancel();
      clearActive();
      notify(previousId, "idle");
    } else {
      synth.cancel();
    }

    loadVoice(() => {
      const utterance = new SpeechSynthesisUtterance(extractText(html));
      utterance.lang = bengaliVoice ? bengaliVoice.lang : "bn-BD";
      if(bengaliVoice) utterance.voice = bengaliVoice;
      utterance.rate = 0.96;
      utterance.pitch = 1;

      utterance.onstart = () => {
        activeId = id;
        activeUtterance = utterance;
        activeState = "playing";
        notify(id, "playing");
      };
      utterance.onend = () => {
        if(activeUtterance === utterance) clearActive();
        notify(id, "idle");
      };
      utterance.onerror = () => {
        if(activeUtterance === utterance) clearActive();
        notify(id, "idle");
      };

      activeUtterance = utterance;
      synth.speak(utterance);
    });
  }

  window.JournalAudio = {
    isSupported: !!synth,
    register,
    unregister,
    toggle,
    stop,
    stopId,
    getState,
    getActiveId
  };

})();
