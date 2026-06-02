/* ===============================================================
   IMDROID — Main JS
   Video hero is handled natively by <video autoplay loop muted>.
   This file manages: loader fade-out, story card overlays,
   and video sync for overlay timing.
   =============================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --- DOM refs --- */
  const loader               = document.getElementById('loader');
  const loaderPercentText    = document.getElementById('loader-percentage');
  const loaderProgressCircle = document.getElementById('loading-progress');
  const loaderBarFill        = document.getElementById('loader-bar-fill');
  const loaderStatusText     = document.getElementById('loader-status-text');

  const heroVideo        = document.getElementById('hero-video');
  const storyCards       = document.querySelectorAll('.story-card');
  const stepLineProgress = document.getElementById('step-line-progress');

  /* --- SVG progress ring setup --- */
  const radius        = loaderProgressCircle.r.baseVal.value;
  const circumference = radius * 2 * Math.PI;
  loaderProgressCircle.style.strokeDasharray  = `${circumference} ${circumference}`;
  loaderProgressCircle.style.strokeDashoffset = circumference;

  function setProgress(pct) {
    loaderProgressCircle.style.strokeDashoffset =
      circumference - (pct / 100) * circumference;
    loaderPercentText.innerText = `${pct}%`;
    loaderBarFill.style.width   = `${pct}%`;
  }

  const loadingMessages = [
    'Initializing render pipeline...',
    'Buffering video frames...',
    'Calibrating droid actuators...',
    'Preheating GPU shaders...',
    'Spawning sandbox environment...',
    'Core system ONLINE.',
  ];

  /* ---- Simulate loading progress while video buffers ---- */
  let fakeProgress = 0;
  const fakeInterval = setInterval(() => {
    fakeProgress = Math.min(fakeProgress + Math.random() * 12, 90);
    const msgIdx = Math.min(
      loadingMessages.length - 1,
      Math.floor((fakeProgress / 100) * loadingMessages.length)
    );
    loaderStatusText.innerText = loadingMessages[msgIdx];
    setProgress(Math.round(fakeProgress));
  }, 200);

  /* ---- When video is ready to play, complete the loader ---- */
  function onVideoReady() {
    clearInterval(fakeInterval);
    setProgress(100);
    loaderStatusText.innerText = 'Core system ONLINE.';

    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      loader.classList.add('fade-out');
      document.body.classList.remove('loading-active');
      // Show first story card
      updateOverlays(0);
      // Start overlay sync loop
      requestAnimationFrame(overlayLoop);
    }, 600);
  }

  if (heroVideo.readyState >= 3) {
    // Already buffered enough
    onVideoReady();
  } else {
    heroVideo.addEventListener('canplaythrough', onVideoReady, { once: true });
    // Fallback: if video takes too long, show site anyway after 4s
    setTimeout(onVideoReady, 4000);
  }

  /* ================= STORY OVERLAY SYNC ================= */
  // Drive story cards from video currentTime
  // Total video duration split into 4 equal phases
  function overlayLoop() {
    if (heroVideo.duration && heroVideo.duration > 0) {
      const progress = heroVideo.currentTime / heroVideo.duration;
      const frameIdx = Math.floor(progress * 300); // normalise to 300 steps
      updateOverlays(frameIdx);
    }
    requestAnimationFrame(overlayLoop);
  }

  const PHASE = 75; // out of 300 steps

  function updateOverlays(step) {
    let activeStep = 1;
    if (step >= PHASE)     activeStep = 2;
    if (step >= PHASE * 2) activeStep = 3;
    if (step >= PHASE * 3) activeStep = 4;

    storyCards.forEach((card, i) =>
      card.classList.toggle('active', i === activeStep - 1)
    );

    if (stepLineProgress) {
      stepLineProgress.style.height = `${((activeStep - 1) / 3) * 100}%`;
    }
  }

});
