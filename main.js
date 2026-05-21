/* ================= AUDIO SYNTHESIS SYSTEM (WEB AUDIO API) ================= */
let audioCtx = null;
let audioEnabled = false;
let humOsc = null;
let humGain = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playHapticClick(frequency = 1200, duration = 0.03, volume = 0.015) {
  if (!audioEnabled) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + duration);
    
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    
    osc.start();
    osc.stop(ctx.currentTime + duration + 0.01);
  } catch (e) {
    console.warn("Failed to play haptic audio: ", e);
  }
}

function playTransitionBeep() {
  if (!audioEnabled) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.15);
    
    gain.gain.setValueAtTime(0.02, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.16);
  } catch (e) {}
}

function updateHum(isPlaying, speed = 1) {
  if (!audioEnabled) {
    stopHum();
    return;
  }
  try {
    const ctx = getAudioContext();
    if (!humOsc) {
      humOsc = ctx.createOscillator();
      humGain = ctx.createGain();
      const lpFilter = ctx.createBiquadFilter();
      
      humOsc.type = 'sawtooth';
      lpFilter.type = 'lowpass';
      lpFilter.frequency.setValueAtTime(60, ctx.currentTime);
      
      humOsc.connect(lpFilter);
      lpFilter.connect(humGain);
      humGain.connect(ctx.destination);
      
      humOsc.frequency.setValueAtTime(45, ctx.currentTime);
      humGain.gain.setValueAtTime(0, ctx.currentTime);
      humGain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 0.3);
      humOsc.start();
    }
    
    // Dynamically change hum pitch and volume based on autoplay state
    const targetFreq = isPlaying ? 55 + (speed * 10) : 42;
    const targetVol = isPlaying ? 0.035 : 0.015;
    
    humOsc.frequency.setTargetAtTime(targetFreq, ctx.currentTime, 0.2);
    humGain.gain.setTargetAtTime(targetVol, ctx.currentTime, 0.2);
  } catch (e) {}
}

function stopHum() {
  if (humOsc) {
    try {
      humOsc.stop();
    } catch(e) {}
    humOsc = null;
    humGain = null;
  }
}

/* ================= PRELOADER ENGINE ================= */
const TOTAL_FRAMES = 240;
const loadedImages = [];
let framesLoaded = 0;

function preloadFrames(onProgress, onComplete) {
  const frameDir = `${window.location.origin}/ezgif-77958c773886d714-jpg`;
  
  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const img = new Image();
    const frameNum = String(i).padStart(3, '0');
    img.src = `${frameDir}/ezgif-frame-${frameNum}.jpg`;
    
    img.onload = () => {
      framesLoaded++;
      loadedImages[i - 1] = img;
      
      onProgress(framesLoaded, TOTAL_FRAMES);
      
      if (framesLoaded === TOTAL_FRAMES) {
        onComplete();
      }
    };
    
    img.onerror = () => {
      console.error(`Failed to load frame ${i}`);
      // Continue preloading even if a frame fails so loader doesn't hang
      framesLoaded++;
      onProgress(framesLoaded, TOTAL_FRAMES);
      if (framesLoaded === TOTAL_FRAMES) {
        onComplete();
      }
    };
  }
}

/* ================= CORE APPLICATION LOGIC ================= */
document.addEventListener("DOMContentLoaded", () => {
  // HTML Nodes
  const loader = document.getElementById("loader");
  const loaderPercentText = document.getElementById("loader-percentage");
  const loaderProgressCircle = document.getElementById("loading-progress");
  const loaderBarFill = document.getElementById("loader-bar-fill");
  const loaderStatusText = document.getElementById("loader-status-text");
  
  const canvas = document.getElementById("animation-canvas");
  const ctx = canvas.getContext("2d");
  const scrollTrack = document.getElementById("animation-section");
  
  // Step nodes & overlays
  const stepNodes = document.querySelectorAll(".step-node");
  const stepLineProgress = document.getElementById("step-line-progress");
  const storyCards = document.querySelectorAll(".story-card");
  
  // State variables
  let currentFrameIndex = 0; // Lerped actual frame
  let targetFrameIndex = 0;  // User desired frame (based on scroll or autoplay)
  let isAutoplay = true;    // Autoplay by default (gives a amazing video intro)
  let playSpeed = 1.0;
  let lastFrameDrawn = -1;
  let isPlaying = true;      // Autoplay play/pause status
  let isScrubbing = false;
  
  // Setup SVG Progress Ring dimensions
  const radius = loaderProgressCircle.r.baseVal.value;
  const circumference = radius * 2 * Math.PI;
  loaderProgressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
  loaderProgressCircle.style.strokeDashoffset = circumference;
  
  function updateProgressRing(percent) {
    const offset = circumference - (percent / 100) * circumference;
    loaderProgressCircle.style.strokeDashoffset = offset;
  }

  // Preloading execution
  const loadingMessages = [
    "Synchronizing frame buffers...",
    "Allocating canvas memory...",
    "Loading textures & assets...",
    "Calibrating droid actuators...",
    "Preheating GPU shaders...",
    "Initializing Web Audio synthesizer...",
    "Spawning sandbox environment...",
    "Core system ONLINE."
  ];

  preloadFrames(
    (loaded, total) => {
      const percentage = Math.floor((loaded / total) * 100);
      loaderPercentText.innerText = `${percentage}%`;
      loaderBarFill.style.width = `${percentage}%`;
      updateProgressRing(percentage);
      
      // Rotate messages based on percentage
      const msgIndex = Math.min(
        loadingMessages.length - 1,
        Math.floor((percentage / 100) * loadingMessages.length)
      );
      loaderStatusText.innerText = loadingMessages[msgIndex];
    },
    () => {
      // Preloading complete, fade loader out
      setTimeout(() => {
        loader.classList.add("fade-out");
        document.body.classList.remove("loading-active");
        
        // Initialize Canvas Sizing
        resizeCanvas();
        
        // Draw first frame
        drawFrame(0);
        
        // Setup Lucide icons
        if (window.lucide) {
          window.lucide.createIcons();
        }
        
        // Start animation loops
        requestAnimationFrame(updateLoop);
        
        if (audioEnabled) {
          startHum();
        }
      }, 500);
    }
  );

  /* ================= CANVAS DRAW LOGIC (OBJECT-FIT: COVER) ================= */
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    lastFrameDrawn = -1; // Force redraw on next loop
  }

  window.addEventListener("resize", resizeCanvas);

  function drawFrame(frameIndex) {
    const img = loadedImages[frameIndex];
    if (!img) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw using standard object-fit cover math
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;
    
    const cw = canvas.width;
    const ch = canvas.height;
    
    const r = Math.min(cw / iw, ch / ih);
    let nw = iw * r;
    let nh = ih * r;
    let ar = 1;
    
    if (nw < cw) ar = cw / nw;
    if (Math.abs(ar - 1) < 1e-14 && nh < ch) ar = ch / nh;
    nw *= ar;
    nh *= ar;
    
    const srcW = iw / (nw / cw);
    const srcH = ih / (nh / ch);
    
    const srcX = (iw - srcW) * 0.5;
    const srcY = (ih - srcH) * 0.5;
    
    ctx.drawImage(
      img,
      Math.max(0, srcX),
      Math.max(0, srcY),
      Math.min(iw, srcW),
      Math.min(ih, srcH),
      0,
      0,
      cw,
      ch
    );
    
    lastFrameDrawn = frameIndex;
  }

  /* ================= MAIN ANIMATION & SMOOTH LERP LOOP ================= */
  let lastTime = 0;
  
  function updateLoop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    
    if (isAutoplay && isPlaying && !isScrubbing) {
      // In autoplay, advance targetFrameIndex at constant speed
      const framesPerSec = 24 * playSpeed; // 24fps base
      const frameDelta = (framesPerSec * deltaTime) / 1000;
      targetFrameIndex += frameDelta;
      
      // Loop or stop
      if (targetFrameIndex >= TOTAL_FRAMES) {
        targetFrameIndex = 0;
      }
      
      // Autoplay progress update
    }
    
    // Linearly interpolate actual frame towards target frame
    // This creates extreme smoothness even if the user scrolls in jagged steps
    const lerpFactor = 0.09;
    const prevFrame = Math.round(currentFrameIndex);
    
    currentFrameIndex += (targetFrameIndex - currentFrameIndex) * lerpFactor;
    
    // Bounds clamping
    if (currentFrameIndex < 0) currentFrameIndex = 0;
    if (currentFrameIndex > TOTAL_FRAMES - 1) currentFrameIndex = TOTAL_FRAMES - 1;
    
    const frameToDraw = Math.round(currentFrameIndex);
    
    if (frameToDraw !== lastFrameDrawn) {
      drawFrame(frameToDraw);
      
      // Synthesize haptic click sounds if frame moves (simulates a mechanical feel!)
      if (frameToDraw !== prevFrame) {
        // High click sound for key frame steps
        if (frameToDraw % 60 === 0) {
          playHapticClick(1500, 0.05, 0.035);
        } else {
          playHapticClick(800 + (frameToDraw * 2), 0.02, 0.012);
        }
      }
      
      // Frame counter update removed
      
      // Handle overlays (text boxes fading in/out)
      updateOverlays(frameToDraw);
    }
    
    requestAnimationFrame(updateLoop);
  }

  /* ================= SCROLL AND SCRUB INTEGRATION ================= */
  /* ================= SCROLL AND SCRUB INTEGRATION REMOVED ================= */
  // Page scrolling and scrollbar are completely disabled. Navigation is purely autoplay-driven.

  /* ================= STORYTELLING & NAVIGATION NODES ORCHESTRATION ================= */
  function updateOverlays(frameIndex) {
    // 4 step ranges
    // Step 1: 0 - 55
    // Step 2: 56 - 115
    // Step 3: 116 - 179
    // Step 4: 180 - 239
    let activeStep = 1;
    if (frameIndex >= 56 && frameIndex < 116) activeStep = 2;
    else if (frameIndex >= 116 && frameIndex < 180) activeStep = 3;
    else if (frameIndex >= 180) activeStep = 4;
    
    // Toggle active story cards
    storyCards.forEach((card, index) => {
      if (index === activeStep - 1) {
        card.classList.add("active");
      } else {
        card.classList.remove("active");
      }
    });
    
    // Toggle sidebar step nodes
    stepNodes.forEach((node, index) => {
      const nodeStep = parseInt(node.getAttribute("data-step"));
      if (nodeStep === activeStep) {
        node.classList.add("active");
      } else {
        node.classList.remove("active");
      }
    });
    
    // Update step tracker vertical line height
    const totalSteps = stepNodes.length;
    const linePercent = ((activeStep - 1) / (totalSteps - 1)) * 100;
    stepLineProgress.style.height = `${linePercent}%`;
  }

  // updateUIControls removed

  // Sidebar dot clicks
  stepNodes.forEach(node => {
    node.addEventListener("click", () => {
      const targetFrame = parseInt(node.getAttribute("data-target-frame"));
      playTransitionBeep();
      targetFrameIndex = targetFrame;
    });
  });

  // Connect CTA and scroll jump handlers removed

  /* HUD actions removed */

});
