const STORAGE_KEY = "klv.ai.studio.state";

const PAYSTACK_CONFIG = {
  publicKey: "pk_test_REPLACE_WITH_YOUR_PAYSTACK_PUBLIC_KEY",
  currency: "USD",
  checkoutUrl: "https://js.paystack.co/v2/inline.js"
};

const plans = [
  {
    name: "Free",
    kicker: "Free plan",
    price: "$0",
    cadence: "",
    featured: false,
    features: [
      "Unlimited image generation",
      "Limited video generation, 5 sec max",
      "Made with klv.ai watermark",
      "Shared queue speed",
      "Ads supported"
    ]
  },
  {
    name: "Starter",
    kicker: "Starter",
    price: "$9",
    cadence: "/mo",
    featured: false,
    features: [
      "Faster generation",
      "No ads",
      "50 videos per month",
      "1080p images and videos",
      "Reduced watermark"
    ]
  },
  {
    name: "Pro",
    kicker: "Most chosen",
    price: "$19",
    cadence: "/mo",
    featured: true,
    features: [
      "Instant generation",
      "No watermark",
      "1080p video plus audio",
      "200 video generations per month",
      "Commercial use license"
    ]
  },
  {
    name: "Ultra",
    kicker: "Studio",
    price: "$39",
    cadence: "/mo",
    featured: false,
    features: [
      "4K image upscale",
      "4K video export",
      "Unlimited images",
      "500 video generations per month",
      "Basic API access"
    ]
  },
  {
    name: "Max",
    kicker: "Scale",
    price: "$79",
    cadence: "/mo",
    featured: false,
    features: [
      "Dedicated GPU priority",
      "White-label rights",
      "Full API access",
      "Unlimited everything",
      "Developer tools dashboard"
    ]
  }
];

const planRules = {
  Free: { queue: "Shared queue", watermark: "full", imageMax: 100, videoMax: 10 },
  Starter: { queue: "Faster queue", watermark: "reduced", imageMax: 180, videoMax: 50 },
  Pro: { queue: "Priority queue", watermark: "none", imageMax: 260, videoMax: 200 },
  Ultra: { queue: "Ultra queue", watermark: "none", imageMax: 500, videoMax: 500 },
  Max: { queue: "Dedicated GPU", watermark: "none", imageMax: 999, videoMax: 999 }
};

const planCheckout = {
  Starter: { amount: 900, interval: "monthly", planCode: "" },
  Pro: { amount: 1900, interval: "monthly", planCode: "" },
  Ultra: { amount: 3900, interval: "monthly", planCode: "" },
  Max: { amount: 7900, interval: "monthly", planCode: "" }
};

const unsafeTerms = [
  "child sexual",
  "minor nude",
  "non-consensual",
  "deepfake nude",
  "bomb instructions",
  "weapon instructions",
  "terrorist attack",
  "suicide method",
  "self harm",
  "graphic gore"
];

const seedCreations = [
  {
    id: "seed-1",
    title: "Neon atelier portrait",
    prompt: "A cinematic founder portrait inside a black glass AI studio, rim light, blue interface glow",
    mode: "image",
    style: "Cinematic",
    createdAt: "Trending",
    saved: false,
    liked: false,
    image: "/assets/art-cinematic.svg"
  },
  {
    id: "seed-2",
    title: "Product launch loop",
    prompt: "A five second product film of a matte black device unfolding in clean studio light",
    mode: "video",
    style: "3D Render",
    createdAt: "Trending",
    saved: false,
    liked: true,
    image: "/assets/art-video.svg"
  },
  {
    id: "seed-3",
    title: "Rain mirror city",
    prompt: "Realistic night street reflections, silver wardrobe, blue neon highlights, 85mm lens",
    mode: "image",
    style: "Realistic",
    createdAt: "Featured",
    saved: true,
    liked: false,
    image: "/assets/art-realistic.svg"
  },
  {
    id: "seed-4",
    title: "Anime signal tower",
    prompt: "Anime skyline with glowing broadcast panels, clean black sky, sharp motion lines",
    mode: "image",
    style: "Anime",
    createdAt: "New",
    saved: false,
    liked: false,
    image: "/assets/art-anime.svg"
  },
  {
    id: "seed-5",
    title: "Horror corridor pass",
    prompt: "A slow camera move through a polished black corridor with blue emergency light",
    mode: "video",
    style: "Horror",
    createdAt: "Featured",
    saved: false,
    liked: false,
    image: "/assets/art-horror.svg"
  },
  {
    id: "seed-6",
    title: "Cartoon creator desk",
    prompt: "A cartoon creator desk with playful media panels, clean blue accents, premium app polish",
    mode: "image",
    style: "Cartoon",
    createdAt: "Trending",
    saved: false,
    liked: false,
    image: "/assets/art-cartoon.svg"
  }
];

const palettes = [
  ["rgba(77, 163, 255, 0.68)", "rgba(255, 255, 255, 0.22)", "#0a0b0d"],
  ["rgba(109, 240, 174, 0.5)", "rgba(77, 163, 255, 0.45)", "#070907"],
  ["rgba(255, 209, 102, 0.38)", "rgba(77, 163, 255, 0.44)", "#0c0b08"],
  ["rgba(255, 85, 112, 0.34)", "rgba(77, 163, 255, 0.46)", "#0b080a"],
  ["rgba(166, 171, 180, 0.45)", "rgba(77, 163, 255, 0.38)", "#08090b"],
  ["rgba(255, 255, 255, 0.28)", "rgba(77, 163, 255, 0.54)", "#050607"]
];

const defaultState = {
  mode: "image",
  style: "Cinematic",
  authMode: "signin",
  plan: "Free",
  filter: "All",
  user: null,
  subscriptionPromptSeen: false,
  // Free trial: total generations (image + video combined)
  trial: {
    limit: 3,
    used: 0
  },
  // reference images selected by the user
  references: {
    // Array of { name: string, dataUrl: string }
    images: []
  },
  usage: {
    images: 12,
    videos: 3
  },
  creations: [

    {
      id: "local-1",
      title: "Liquid chrome cabin",
      prompt: "A realistic black concept car cabin with glass controls and soft blue navigation light",
      mode: "image",
      style: "Realistic",
      createdAt: "Today",
      saved: true,
      liked: false,
      image: "/assets/art-realistic.svg"
    },
    {
      id: "local-2",
      title: "Studio reveal",
      prompt: "A cinematic three second camera push into a dark AI creative suite, holographic panels",
      mode: "video",
      style: "Cinematic",
      createdAt: "Today",
      saved: false,
      liked: false,
      image: "/assets/art-video.svg"
    }
  ]
};

let state = loadState();
let pendingCheckoutPlan = null;

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return structuredClone(defaultState);
    const parsed = { ...structuredClone(defaultState), ...JSON.parse(saved) };
    for (const staleKey of ["wal" + "let", "sign" + "ature"]) {
      delete parsed[staleKey];
    }
    return parsed;
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function titleFromPrompt(prompt) {
  const cleaned = prompt
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 4)
    .join(" ");
  return cleaned ? cleaned.replace(/\b\w/g, (letter) => letter.toUpperCase()) : "Untitled creation";
}

function id() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return `klv-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function activeRoute() {
  const known = ["/", "/create", "/explore", "/pricing", "/dashboard"];
  return known.includes(location.pathname) ? location.pathname : "/";
}

function navigate(path) {
  if (location.pathname !== path) {
    history.pushState({}, "", path);
  }
  renderRoute();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setMode(mode) {
  state.mode = mode;
  saveState();
  renderMode();
}

function setStyle(style) {
  state.style = style;
  saveState();
  renderStyle();
}

function setAuthMode(mode = "signin") {
  state.authMode = mode === "signup" ? "signup" : "signin";
  const isSignup = state.authMode === "signup";
  document.querySelector("[data-auth-title]").textContent = isSignup ? "Create your klv.ai account" : "Sign in to klv.ai";
  document.querySelector("[data-auth-submit]").textContent = isSignup ? "Create account" : "Sign in";
  document.querySelectorAll("[data-auth-tab]").forEach((button) => {
    const active = button.dataset.authTab === state.authMode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
}

function openAuthModal(mode = "signin") {
  setAuthMode(mode);
  openModal("[data-auth-modal]");
  requestAnimationFrame(() => document.querySelector("#auth-email")?.focus());
}

function markSelection(element) {
  element.classList.remove("just-selected");
  void element.offsetWidth;
  element.classList.add("just-selected");
  setTimeout(() => element.classList.remove("just-selected"), 520);
}

function focusCreatePrompt() {
  requestAnimationFrame(() => {
    document.querySelector(".create-page textarea")?.focus();
  });
}

function focusDashboardAccount() {
  requestAnimationFrame(() => {
    document.querySelector(".dashboard-page [data-open-auth]")?.focus();
  });
}

function handleStudioShortcut(shortcut) {
  if (shortcut === "image") {
    setMode("image");
    navigate("/create");
    focusCreatePrompt();
    showToast("Image studio ready", "Text to visual mode is active.");
  }

  if (shortcut === "video") {
    setMode("video");
    navigate("/create");
    focusCreatePrompt();
    showToast("Video studio ready", "Short clip and audio-ready mode is active.");
  }

  if (shortcut === "profile") {
    navigate("/dashboard");
    focusDashboardAccount();
    showToast("Account opened", state.user ? state.user.email : "Sign in or sign up to sync this profile.");
  }

  if (shortcut === "pricing") {
    navigate("/pricing");
    showToast("Pricing opened", "Choose any plan from Free to Max.");
  }
}

function currentPlan() {
  return planRules[state.plan] || planRules.Free;
}

function isFreePlan() {
  return state.plan === "Free";
}

function isUnsafe(prompt) {
  const value = prompt.toLowerCase();
  return unsafeTerms.some((term) => value.includes(term));
}

function enhancePrompt(prompt, style = state.style, mode = state.mode) {
  const base = prompt.trim() || "A premium AI creative studio generating a cinematic hero scene";
  const styleText = {
    Cinematic: "cinematic lighting, controlled contrast, premium lens language, soft atmospheric depth",
    Anime: "high-end anime composition, crisp silhouettes, expressive lighting, clean motion energy",
    Cartoon: "polished cartoon illustration, expressive shapes, bright character appeal, clean premium finish",
    Realistic: "photorealistic materials, true camera optics, natural scale, refined studio texture",
    "3D Render": "polished 3D render, product-grade reflections, precise geometry, elegant surfaces",
    Horror: "elevated horror mood, restrained tension, sculpted shadow, no graphic gore"
  }[style] || "premium creative direction";
  const modeText = mode === "video"
    ? "5 second shot plan with a clear opening frame, smooth camera motion, audio-ready atmosphere, and a strong final frame"
    : "high-resolution still image, clean subject hierarchy, rich detail, and elegant negative space";

  return `${base}. ${styleText}. ${modeText}. Black and white luxury palette with soft neon blue accents. Safe, cinematic, polished, no clutter.`;
}

function showToast(title, detail = "") {
  const stack = document.querySelector("[data-toast-stack]");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<strong>${title}</strong>${detail ? `<p>${detail}</p>` : ""}`;
  stack.append(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(8px)";
    setTimeout(() => toast.remove(), 220);
  }, 3600);
}

function renderRoute() {
  const route = activeRoute();
  document.querySelectorAll("[data-page]").forEach((page) => {
    page.classList.toggle("active", page.dataset.page === route);
  });
  document.querySelectorAll("[data-route-link]").forEach((link) => {
    link.classList.toggle("active", link.dataset.routeLink === route);
  });
  document.body.classList.remove("nav-open");
}

function renderMode() {
  document.querySelectorAll("[data-mode]").forEach((button) => {
    const active = button.dataset.mode === state.mode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
}

function renderStyle() {
  document.querySelectorAll("[data-style]").forEach((button) => {
    button.classList.toggle("active", button.dataset.style === state.style);
  });
}

function applyPalette(art, paletteId) {
  const [first, second, base] = palettes[paletteId % palettes.length];
  art.style.background = `
    linear-gradient(135deg, rgba(255, 255, 255, 0.18), transparent 30%),
    linear-gradient(315deg, ${first}, transparent 38%),
    linear-gradient(45deg, ${second}, transparent 42%),
    ${base}
  `;
}

function imageForStyle(style, mode) {
  if (mode === "video") return "/assets/art-video.svg";
  const images = {
    Anime: "/assets/art-anime.svg",
    Cartoon: "/assets/art-cartoon.svg",
    Cinematic: "/assets/art-cinematic.svg",
    Realistic: "/assets/art-realistic.svg",
    "3D Render": "/assets/art-render.svg",
    Horror: "/assets/art-horror.svg"
  };
  return images[style] || "/assets/art-cinematic.svg";
}

function shouldShowWatermark() {
  return currentPlan().watermark !== "none";
}

function createCard(item, context) {
  const template = document.querySelector("#creation-card-template");
  const card = template.content.firstElementChild.cloneNode(true);
  const art = card.querySelector(".creation-art");
  const watermark = card.querySelector(".watermark");
  const badge = card.querySelector(".media-badge");
  const title = card.querySelector("h3");
  const prompt = card.querySelector("p");

  card.dataset.id = item.id;
  card.dataset.context = context;
  card.classList.toggle("saved", Boolean(item.saved));
  card.classList.toggle("liked", Boolean(item.liked));
  art.classList.toggle("video", item.mode === "video");
  art.style.backgroundImage = `url("${item.image || imageForStyle(item.style, item.mode)}")`;
  watermark.hidden = !shouldShowWatermark();
  watermark.style.opacity = currentPlan().watermark === "reduced" ? "0.42" : "1";
  badge.textContent = item.mode === "video" ? "Video" : "Image";
  title.textContent = item.title;
  prompt.textContent = item.prompt;

  card.querySelector("[data-download]").addEventListener("click", () => downloadCreation(item));
  card.querySelector("[data-save]").addEventListener("click", () => toggleSave(item.id, context));
  card.querySelector("[data-like]").addEventListener("click", () => toggleLike(item.id, context));

  return card;
}

function renderOutput() {
  const grid = document.querySelector("[data-output-grid]");
  grid.replaceChildren(...state.creations.map((item) => createCard(item, "local")));
  const queue = document.querySelector("[data-queue-status]");
  queue.textContent = currentPlan().queue;
  const trial = document.querySelector("[data-trial-status]");
  if (trial) {
    trial.textContent = isFreePlan() ? `Trial ${state.trial.used}/${state.trial.limit}` : `${state.plan} active`;
  }
}

function renderExplore() {
  const grid = document.querySelector("[data-explore-grid]");
  const merged = [...state.creations.slice(0, 3), ...seedCreations];
  const filtered = merged.filter((item) => {
    if (state.filter === "All") return true;
    if (state.filter === "Images") return item.mode === "image";
    if (state.filter === "Videos") return item.mode === "video";
    return item.createdAt === "Trending" || item.liked;
  });
  grid.replaceChildren(...filtered.map((item) => createCard(item, item.id.startsWith("seed") ? "seed" : "local")));

  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === state.filter);
  });
}

function renderPricing() {
  const grid = document.querySelector("[data-pricing-grid]");
  const cards = plans.map((plan) => {
    const card = document.createElement("article");
    card.className = `pricing-card${plan.featured ? " featured" : ""}`;
    const selected = state.plan === plan.name;
    card.innerHTML = `
      <span class="plan-kicker">${plan.kicker}</span>
      <h3 class="plan-name">${plan.name}</h3>
      <div class="plan-price">${plan.price}<span>${plan.cadence}</span></div>
      <ul class="plan-features">
        ${plan.features.map((feature) => `<li>${feature}</li>`).join("")}
      </ul>
      <button class="${plan.featured ? "primary-button" : "ghost-button"}" type="button" data-select-plan="${plan.name}">
        ${selected ? "Current plan" : plan.price === "$0" ? "Use Free" : "Buy subscription"}
      </button>
    `;
    return card;
  });
  grid.replaceChildren(...cards);
}

function renderDashboard() {
  const userName = document.querySelector("[data-user-name]");
  const userEmail = document.querySelector("[data-user-email]");
  const avatar = document.querySelector("[data-avatar]");
  const planName = document.querySelector("[data-plan-name]");
  const accountStatus = document.querySelector("[data-account-status]");
  const emailStatus = document.querySelector("[data-email-status]");
  const imageMeter = document.querySelector("[data-image-meter]");
  const videoMeter = document.querySelector("[data-video-meter]");
  const savedMeter = document.querySelector("[data-saved-meter]");
  const imageUsage = document.querySelector("[data-image-usage]");
  const videoUsage = document.querySelector("[data-video-usage]");
  const savedUsage = document.querySelector("[data-saved-usage]");
  const history = document.querySelector("[data-history-list]");
  const savedCount = state.creations.filter((item) => item.saved).length;

  if (state.user) {
    userName.textContent = state.user.name;
    userEmail.textContent = state.user.email;
    avatar.textContent = state.user.name.slice(0, 1).toUpperCase();
  } else {
    userName.textContent = "Guest creator";
    userEmail.textContent = "Sign in to sync creations.";
    avatar.textContent = "K";
  }

  planName.textContent = state.plan;
  accountStatus.textContent = state.user ? "Signed in" : "Guest";
  emailStatus.textContent = state.user?.email || "Not signed in";

  imageMeter.max = currentPlan().imageMax;
  videoMeter.max = currentPlan().videoMax;
  savedMeter.max = Math.max(10, state.creations.length);
  imageMeter.value = state.usage.images;
  videoMeter.value = state.usage.videos;
  savedMeter.value = savedCount;
  imageUsage.textContent = state.usage.images;
  videoUsage.textContent = state.usage.videos;
  savedUsage.textContent = savedCount;

  const items = state.creations.slice(0, 6).map((item) => {
    const row = document.createElement("div");
    row.className = "history-item";
    row.innerHTML = `
      <div>
        <span>${item.mode} - ${item.style}</span>
        <strong>${item.title}</strong>
      </div>
      <button class="icon-button" type="button" aria-label="Download ${item.title}">
        <span class="icon download-icon" aria-hidden="true"></span>
      </button>
    `;
    row.querySelector("button").addEventListener("click", () => downloadCreation(item));
    return row;
  });
  history.replaceChildren(...items);
}

function renderAll() {
  renderRoute();
  renderMode();
  renderStyle();
  renderOutput();
  renderExplore();
  renderPricing();
  renderDashboard();
  setAuthMode(state.authMode);
}

function ensureTrialOrPlanAllows(mode) {
  // Paid plans bypass free trial in this demo UI; enforcement should be server-side later.
  if (!isFreePlan()) return { ok: true };

  // Free trial: total generations across image+video = trial.limit
  if (state.trial.used >= state.trial.limit) {
    return { ok: false, reason: "trial_over" };
  }

  return { ok: true };
}

function consumeTrialIfNeeded() {
  if (!isFreePlan()) return;
  state.trial.used += 1;
  saveState();
}

function maybeOpenSubscriptionModal(reason = "upgrade") {
  const modal = document.querySelector("[data-subscription-modal]");
  if (!modal) return;
  openModal("[data-subscription-modal]");

  const copy = modal.querySelector("[data-subscription-copy]");
  const primary = modal.querySelector("[data-select-plan]");

  if (reason === "trial_over") {
    if (copy) copy.textContent = "Your free trial is over. Upgrade to keep generating images and video concepts.";
    if (primary) primary.textContent = "Buy Pro subscription";
  }

  // If they already hit max limits, keep it generic.
  if (reason === "limits") {
    if (copy) copy.textContent = "You reached the Free plan generation limit. Unlock the full studio.";
  }
}

async function addCreation(prompt, form) {
  const trialGate = ensureTrialOrPlanAllows(state.mode);
  if (!trialGate.ok) {
    if (trialGate.reason === "trial_over") maybeOpenSubscriptionModal("trial_over");
    showToast("Trial ended", "Subscribe to continue generating.");
    return;
  }

  if (isUnsafe(prompt)) {
    showToast("Prompt refused", "That request crosses the studio safety rules. Try a safer creative direction.");
    return;
  }

  const refined = prompt.split(/\s+/).filter(Boolean).length < 8
    ? enhancePrompt(prompt)
    : prompt;

  // Deployment-ready: both tabs use AI image generation.
  // Video mode returns a strong video keyframe/concept image until true video generation is connected.
  const generationMode = state.mode === "video" ? "video" : "image";

  const creation = {
    id: id(),
    title: titleFromPrompt(refined),
    prompt: refined,
    mode: generationMode,
    style: state.style,
    createdAt: "Now",
    saved: false,
    liked: false,
    image: imageForStyle(state.style, generationMode),
    status: "pending"
  };

  state.creations.unshift(creation);
  saveState();
  renderAll();

  if (form.closest(".home-page")) {
    navigate("/create");
  }

  showToast("Generating", "Sending prompt to the AI backend.");

  try {
    const qualityEl = document.querySelector("[data-quality]");
    const quality = Number(qualityEl?.value || 4);

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: refined,
        mode: generationMode,
        style: state.style,
        quality,
        references: state.references.images
      })
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.ok || !data?.imageUrl) {
      throw new Error(data?.error || `Generation failed (${res.status})`);
    }

    creation.image = data.imageUrl;
    creation.status = "done";

    // Consume trial only after success
    consumeTrialIfNeeded();

    if (generationMode === "video") {
      state.usage.videos += 1;
    } else {
      state.usage.images += 1;
    }

    saveState();
    renderAll();

    showToast("Generation complete", creation.title);
  } catch (e) {
    state.creations = state.creations.filter((c) => c.id !== creation.id);
    saveState();
    renderAll();
    showToast("Generation failed", e?.message || "Try again.");

    // Generic upgrade hint
    const msg = String(e?.message || "");
    if (msg.includes("401") || msg.toLowerCase().includes("unauthorized")) {
      maybeOpenSubscriptionModal("upgrade");
    }
  }
}


function findLocalItem(idToFind) {
  return state.creations.find((item) => item.id === idToFind);
}

function findSeedItem(idToFind) {
  return seedCreations.find((item) => item.id === idToFind);
}

function toggleSave(idToFind, context) {
  const item = context === "seed" ? findSeedItem(idToFind) : findLocalItem(idToFind);
  if (!item) return;
  item.saved = !item.saved;
  if (context !== "seed") saveState();
  renderAll();
  showToast(item.saved ? "Saved" : "Removed", item.title);
}

function toggleLike(idToFind, context) {
  const item = context === "seed" ? findSeedItem(idToFind) : findLocalItem(idToFind);
  if (!item) return;
  item.liked = !item.liked;
  if (context !== "seed") saveState();
  renderAll();
}

function downloadCreation(item) {
  if (item.image?.startsWith("data:image/")) {
    const link = document.createElement("a");
    link.href = item.image;
    link.download = `${item.title.toLowerCase().replace(/\s+/g, "-")}.png`;
    document.body.append(link);
    link.click();
    link.remove();
    showToast("Download ready", item.title);
    return;
  }

  const watermarkText = shouldShowWatermark() ? "Made with klv.ai" : "";
  const mediaLabel = item.mode === "video" ? "Video concept" : "Image concept";
  const escapedPrompt = item.prompt.replace(/[<>&]/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[char]));
  const svg = `
    <svg width="1280" height="1280" viewBox="0 0 1280 1280" xmlns="http://www.w3.org/2000/svg">
      <rect width="1280" height="1280" fill="#030303"/>
      <rect x="70" y="70" width="1140" height="1140" rx="42" fill="#0b0d10" stroke="rgba(255,255,255,.18)" stroke-width="3"/>
      <path d="M180 900 C260 630 436 478 660 442 C844 413 1017 490 1100 650" fill="none" stroke="#4DA3FF" stroke-width="18" stroke-linecap="round" opacity=".75"/>
      <rect x="180" y="190" width="520" height="340" rx="28" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.18)" stroke-width="2"/>
      <rect x="750" y="190" width="350" height="520" rx="28" fill="rgba(77,163,255,.13)" stroke="rgba(255,255,255,.18)" stroke-width="2"/>
      <text x="180" y="815" fill="#f7f8fa" font-family="Arial, Helvetica, sans-serif" font-size="62" font-weight="700">${item.title}</text>
      <text x="180" y="875" fill="#9fd0ff" font-family="Arial, Helvetica, sans-serif" font-size="30">${mediaLabel} - ${item.style}</text>
      <foreignObject x="180" y="925" width="880" height="150">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font: 30px Arial, sans-serif; line-height:1.35; color:#a6abb4;">${escapedPrompt}</div>
      </foreignObject>
      <text x="180" y="1120" fill="#f7f8fa" font-family="Arial, Helvetica, sans-serif" font-size="32">klv.ai</text>
      <text x="900" y="1120" fill="rgba(255,255,255,.68)" font-family="Arial, Helvetica, sans-serif" font-size="28">${watermarkText}</text>
    </svg>
  `;
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${item.title.toLowerCase().replace(/\s+/g, "-")}.svg`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("Download ready", item.title);
}

function hasPaystackKey() {
  return PAYSTACK_CONFIG.publicKey && !PAYSTACK_CONFIG.publicKey.includes("REPLACE_WITH");
}

function customerEmail() {
  return state.user?.email || "";
}

function checkoutReference(planName) {
  return `klv-${planName.toLowerCase()}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function loadPaystackInline() {
  if (window.Paystack || window.PaystackPop) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${PAYSTACK_CONFIG.checkoutUrl}"]`);
    if (existing) {
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = PAYSTACK_CONFIG.checkoutUrl;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.append(script);
  });
}

function markPlanPaid(planName, reference) {
  state.plan = planName;
  state.lastPayment = {
    provider: "paystack",
    reference,
    plan: planName,
    paidAt: new Date().toISOString()
  };
  pendingCheckoutPlan = null;
  saveState();
  renderAll();
  showToast(`${planName} active`, `Paystack reference ${reference}`);
}

async function startPaystackCheckout(planName) {
  const plan = plans.find((entry) => entry.name === planName);
  const checkout = planCheckout[planName];
  if (!plan || !checkout) {
    state.plan = planName;
    saveState();
    renderAll();
    showToast(`${planName} selected`, "Free plan active.");
    return;
  }

  if (!hasPaystackKey()) {
    showToast("Add Paystack public key", "Replace PAYSTACK_CONFIG.publicKey in app.js with your Paystack public key.");
    return;
  }

  if (!customerEmail()) {
    pendingCheckoutPlan = planName;
    openAuthModal("signup");
    showToast("Email needed", "Enter an email so Paystack can open the subscription checkout.");
    return;
  }

  try {
    await loadPaystackInline();
  } catch {
    showToast("Paystack could not load", "Check your internet connection or the Paystack script URL.");
    return;
  }

  const reference = checkoutReference(planName);
  const subscriptionOptions = checkout.planCode
    ? { planCode: checkout.planCode }
    : { planInterval: checkout.interval };
  const metadata = {
    custom_fields: [
      {
        display_name: "Plan",
        variable_name: "plan",
        value: planName
      },
      {
        display_name: "Studio",
        variable_name: "studio",
        value: "klv.ai"
      }
    ]
  };

  if (window.Paystack) {
    const paystack = new window.Paystack();
    paystack.newTransaction({
      key: PAYSTACK_CONFIG.publicKey,
      email: customerEmail(),
      amount: checkout.amount,
      currency: PAYSTACK_CONFIG.currency,
      reference,
      ...subscriptionOptions,
      metadata,
      onSuccess: (transaction) => markPlanPaid(planName, transaction?.reference || reference),
      onCancel: () => showToast("Checkout closed", `${planName} was not purchased.`)
    });
    return;
  }

  if (window.PaystackPop) {
    window.PaystackPop.setup({
      key: PAYSTACK_CONFIG.publicKey,
      email: customerEmail(),
      amount: checkout.amount,
      currency: PAYSTACK_CONFIG.currency,
      ref: reference,
      ...subscriptionOptions,
      metadata,
      callback: (transaction) => markPlanPaid(planName, transaction?.reference || reference),
      onClose: () => showToast("Checkout closed", `${planName} was not purchased.`)
    }).openIframe();
  }
}

function selectPlan(planName) {
  const plan = plans.find((entry) => entry.name === planName);
  if (!plan) return;
  if (plan.price === "$0") {
    state.plan = planName;
    saveState();
    renderAll();
    showToast(`${planName} selected`, "Free plan active.");
    return;
  }

  startPaystackCheckout(planName);
}

function openModal(selector) {
  const modal = document.querySelector(selector);
  if (modal) modal.hidden = false;
}

function closeModals() {
  document.querySelectorAll(".modal-backdrop").forEach((modal) => {
    modal.hidden = true;
  });
}

function handleAuth(event) {
  event.preventDefault();
  const email = new FormData(event.currentTarget).get("email").trim();
  if (!email) return;
  const name = email.split("@")[0].replace(/[._-]+/g, " ");
  state.user = {
    email,
    name: name.replace(/\b\w/g, (letter) => letter.toUpperCase())
  };
  saveState();
  renderAll();
  closeModals();
  showToast(state.authMode === "signup" ? "Account created" : "Signed in", email);

  if (pendingCheckoutPlan) {
    startPaystackCheckout(pendingCheckoutPlan);
  }
}

function setupReferenceImageDropzones() {
  const dropzones = Array.from(document.querySelectorAll("[data-dropzone]"));

  for (const dz of dropzones) {
    const pickButton = dz.querySelector("[data-pick-image]");
    const fileInput = dz.querySelector("[data-file-input]");
    const previews = dz.querySelector("[data-image-previews]");

    if (pickButton && fileInput) {
      pickButton.addEventListener("click", () => fileInput.click());
    }

    if (fileInput) {
      fileInput.addEventListener("change", () => {
        if (!fileInput.files?.length) return;
        addReferenceFiles(Array.from(fileInput.files));
        fileInput.value = "";
      });
    }

    dz.addEventListener("dragenter", (e) => {
      e.preventDefault();
      dz.classList.add("drag-active");
    });

    dz.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    dz.addEventListener("dragleave", (e) => {
      if (e.relatedTarget && dz.contains(e.relatedTarget)) return;
      dz.classList.remove("drag-active");
    });

    dz.addEventListener("drop", (e) => {
      e.preventDefault();
      dz.classList.remove("drag-active");
      const files = Array.from(e.dataTransfer?.files || []).filter((f) => f.type.startsWith("image/"));
      if (!files.length) return;
      addReferenceFiles(files);
    });

    // Local helper uses the first matching previews container on this dz.
    function addReferenceFiles(files) {
      renderReferencePreviews(previews, files);
    }
  }
}

function renderReferencePreviews(previewsEl, files) {
  if (!previewsEl) return;

  const maxFiles = 4;
  const current = state.references.images;
  const remaining = Math.max(0, maxFiles - current.length);
  const accepted = files.slice(0, remaining);

  const readAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("read_failed"));
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });

  Promise.all(
    accepted.map(async (file) => {
      const dataUrl = await readAsDataUrl(file);
      return { name: file.name || "reference", dataUrl };
    })
  )
    .then((newOnes) => {
      state.references.images.push(...newOnes);
      saveState();
      refreshReferencePreviews();
      showToast("References added", `${newOnes.length} image${newOnes.length === 1 ? "" : "s"} ready.`);
    })
    .catch(() => showToast("Upload failed", "Could not read one of the images."));
}

function refreshReferencePreviews() {
  const previewContainers = Array.from(document.querySelectorAll("[data-image-previews]"));
  for (const el of previewContainers) {
    el.replaceChildren(
      ...state.references.images.map((ref, idx) => {
        const wrap = document.createElement("div");
        wrap.className = "image-preview";

        const img = document.createElement("img");
        img.alt = "Reference upload";
        img.src = ref.dataUrl;

        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "icon-button remove-image-button";
        remove.style.width = "22px";
        remove.style.height = "22px";
        remove.style.position = "absolute";
        remove.style.top = "3px";
        remove.style.right = "3px";
        remove.style.borderRadius = "50%";
        remove.style.background = "rgba(0,0,0,.55)";
        remove.style.border = "1px solid rgba(255,255,255,.16)";
        remove.style.color = "white";
        remove.setAttribute("aria-label", "Remove reference image");
        remove.textContent = "×";

        remove.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          state.references.images.splice(idx, 1);
          saveState();
          refreshReferencePreviews();
          showToast("Reference removed");
        });

        wrap.append(img, remove);
        return wrap;
      })
    );
  }
}

function attachEvents() {
  document.addEventListener("click", (event) => {

    const link = event.target.closest("[data-link]");
    if (link) {
      const url = new URL(link.href);
      if (url.origin === location.origin) {
        event.preventDefault();
        navigate(url.pathname);
      }
    }

    const studioShortcut = event.target.closest("[data-studio-shortcut]");
    if (studioShortcut) handleStudioShortcut(studioShortcut.dataset.studioShortcut);

    const mode = event.target.closest("[data-mode]");
    if (mode) {
      setMode(mode.dataset.mode);
      markSelection(mode);
    }

    const style = event.target.closest("[data-style]");
    if (style) {
      setStyle(style.dataset.style);
      markSelection(style);
    }

    const example = event.target.closest("[data-example]");
    if (example) {
      const prompt = example.dataset.example;
      const input = document.querySelector(".home-page textarea");
      input.value = prompt;
      input.focus();
    }

    const filter = event.target.closest("[data-filter]");
    if (filter) {
      state.filter = filter.dataset.filter;
      saveState();
      renderExplore();
      markSelection(filter);
    }

    const planButton = event.target.closest("[data-select-plan]");
    if (planButton) {
      markSelection(planButton);
      selectPlan(planButton.dataset.selectPlan);
    }

    const openAuth = event.target.closest("[data-open-auth]");
    if (openAuth) openAuthModal(openAuth.dataset.openAuth || "signin");

    const authTab = event.target.closest("[data-auth-tab]");
    if (authTab) {
      setAuthMode(authTab.dataset.authTab);
      markSelection(authTab);
    }

    const close = event.target.closest("[data-close-modal]");
    if (close) closeModals();

    const menu = event.target.closest("[data-menu-toggle]");
    if (menu) document.body.classList.toggle("nav-open");

    const google = event.target.closest("[data-google-auth]");
    if (google) showToast("Google OAuth hook", "Connect Firebase Auth or Supabase Auth for production login.");

    const refresh = event.target.closest("[data-refresh-dashboard]");
    if (refresh) {
      renderDashboard();
      showToast("Dashboard refreshed");
    }

    const enhance = event.target.closest("[data-enhance-prompt]");
    if (enhance) {
      const form = enhance.closest("form");
      const textarea = form.querySelector("textarea");
      textarea.value = enhancePrompt(textarea.value);
      showToast("Prompt enhanced", "Creative direction optimized for the selected mode.");
    }
  });

  document.querySelectorAll("[data-generate-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const textarea = form.querySelector("textarea");
      const prompt = textarea.value.trim();
      if (!prompt) {
        showToast("Prompt needed", "Add a subject, scene, or mood before generation.");
        textarea.focus();
        return;
      }

      // Ensure references are captured (dropzones store into state.references)
      // Enforce trial/limits and unsafe safety on the frontend demo, backend also enforces.
      void addCreation(prompt, form);
    });
  });


  setupReferenceImageDropzones();


  document.querySelector("[data-auth-form]").addEventListener("submit", handleAuth);

  document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
    backdrop.addEventListener("click", (event) => {
      if (event.target === backdrop) closeModals();
    });
  });

  window.addEventListener("popstate", renderRoute);

  window.addEventListener("scroll", () => {
    document.querySelector(".site-header").dataset.elevated = String(window.scrollY > 8);
  }, { passive: true });

}

attachEvents();
renderAll();
