const https = require("node:https");

function sendJson(res, status, obj) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(obj));
}

// POST helper that returns the parsed JSON body of a response.
async function postJson(url, { headers, body } = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.request(
      {
        hostname: u.hostname,
        path: u.pathname + u.search,
        protocol: u.protocol,
        method: "POST",
        headers: headers || {}
      },
      (resp) => {
        let data = "";
        resp.on("data", (chunk) => {
          data += chunk;
        });
        resp.on("end", () => {
          let parsed = null;
          try {
            parsed = JSON.parse(data);
          } catch {
            parsed = null;
          }
          resolve({ status: resp.statusCode || 0, json: parsed, raw: data });
        });
      }
    );
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

// Turn the UI selections into a rich, vibrant prompt for the image model.
function buildPrompt({ prompt, style, mode }) {
  const styleHints = {
    Cinematic: "cinematic film still, dramatic lighting, premium color grade",
    Anime: "vibrant anime illustration, crisp linework, glowing highlights",
    Cartoon: "playful glossy 3D cartoon style, bold saturated colors",
    Realistic: "photorealistic, shallow depth of field, 85mm lens, premium photo finish",
    "3D Render": "glossy 3D render, soft studio lighting, reflective materials",
    Horror: "moody atmospheric dark art, dramatic neon lighting, no gore"
  };

  const style_line = styleHints[style] || styleHints.Cinematic;
  const motion = mode === "video"
    ? "dynamic cinematic keyframe with a sense of motion"
    : "striking single hero composition";

  return `${prompt}. ${style_line}, ${motion}. Vibrant, colorful, highly saturated, rich gradients, energetic and modern, high detail, eye-catching premium quality.`;
}

// Map UI quality 1-5 to a render quality setting.
function qualityLevel(quality) {
  const q = typeof quality === "number" ? quality : 4;
  if (q >= 4) return "high";
  if (q >= 2) return "medium";
  return "low";
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  let payload = {};
  try {
    const raw = await new Promise((resolve, reject) => {
      let buf = "";
      req.on("data", (c) => {
        buf += c;
      });
      req.on("end", () => resolve(buf));
      req.on("error", reject);
    });
    payload = raw ? JSON.parse(raw) : {};
  } catch {
    sendJson(res, 400, { error: "Invalid JSON" });
    return;
  }

  const { prompt, mode, style, quality } = payload || {};

  if (!prompt || typeof prompt !== "string") {
    sendJson(res, 400, { error: "prompt is required" });
    return;
  }

  // Lightweight safety block list (kept in sync with the frontend).
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
  const lower = prompt.toLowerCase();
  if (unsafeTerms.some((t) => lower.includes(t))) {
    sendJson(res, 400, { error: "Prompt rejected" });
    return;
  }

  const apiKey = process.env.AI_GATEWAY_API_KEY;
  if (!apiKey) {
    sendJson(res, 500, { error: "Missing AI_GATEWAY_API_KEY on server" });
    return;
  }

  const model = process.env.IMAGE_MODEL || "openai/gpt-image-1";
  const size = mode === "video" ? "1536x1024" : "1024x1024";

  try {
    const { status, json, raw } = await postJson(
      "https://ai-gateway.vercel.sh/v1/images/generations",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          prompt: buildPrompt({ prompt, style, mode }),
          n: 1,
          size,
          quality: qualityLevel(quality)
        })
      }
    );

    if (status < 200 || status >= 300) {
      const message =
        json?.error?.message || json?.error || raw?.slice(0, 300) || `Image API error (${status})`;
      sendJson(res, status || 500, { error: message });
      return;
    }

    const first = json?.data?.[0];
    const imageUrl = first?.b64_json
      ? `data:image/png;base64,${first.b64_json}`
      : first?.url || null;

    if (!imageUrl) {
      sendJson(res, 502, { error: "No image returned from model" });
      return;
    }

    sendJson(res, 200, { ok: true, imageUrl, model });
  } catch (e) {
    sendJson(res, 500, { error: e?.message || "generation_failed" });
  }
};
