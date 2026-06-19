const https = require("node:https");

function sendJson(res, status, obj) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(obj));
}

async function fetchJson(url, { headers, method, body } = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.request(
      {
        hostname: u.hostname,
        path: u.pathname + u.search,
        protocol: u.protocol,
        method: method || "POST",
        headers: headers || {}
      },
      (resp) => {
        let data = "";
        resp.on("data", (chunk) => {
          data += chunk;
        });
        resp.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch {
            reject(new Error(`Non-JSON response: ${data.slice(0, 500)}`));
          }
        });
      }
    );

    req.on("error", reject);

    if (body) {
      req.write(body);
    }
    req.end();
  });
}

// Vercel serverless handler wrapper
module.exports = async function handler(req, res) {
  // Basic CORS (optional)
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

  const {
    prompt,
    mode,
    style,
    quality,
    references
  } = payload || {};

  if (!prompt || typeof prompt !== "string") {
    sendJson(res, 400, { error: "prompt is required" });
    return;
  }

  // Safety block list (lightweight; keep in sync with frontend)
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

  // Replicate config
  const token = process.env.REPLICATE_API_TOKEN;
  const model = process.env.REPLICATE_MODEL || "stability-ai/sdxl";

  if (!token) {
    sendJson(res, 500, { error: "Missing REPLICATE_API_TOKEN on server" });
    return;
  }

  // NOTE: Different replicate models need different input schema.
  // This implementation is written for a common SDXL-style schema.
  // Replace REPLICATE_MODEL and inputs if you use a different model.

  const refCount = Array.isArray(references) ? references.length : 0;

  const input = {
    prompt,
    // image references are typically model-specific. For now, we pass them through if the model supports it.
    // You can adapt this to your chosen model.
    image_prompts: references && refCount ? references.map((r) => r.dataUrl) : undefined,
    // basic tuning
    num_outputs: 1,
    aspect_ratio: "1:1",
    guidance_scale: 7.5,
    num_inference_steps: 30,
    // simple mapping from UI quality 1-5 to steps
    num_inference_steps_override: typeof quality === "number" ? Math.round(quality * 6) : undefined
  };

  try {
    // 1) create prediction
    const create = await fetchJson(`https://api.replicate.com/v1/predictions`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`
      },
      method: "POST",
      body: JSON.stringify({
        version: model.startsWith("stability") ? undefined : model,
        // If REPLICATE_MODEL is a version ID, set it via VERSION_ID env var instead.
        // For robustness, we send model as "version" only if it looks like a version.
        // Otherwise, we assume user configured a direct version via REPLICATE_VERSION.
        // See env vars below.
        ...(process.env.REPLICATE_VERSION
          ? { version: process.env.REPLICATE_VERSION }
          : {})
      })
    }).catch((err) => {
      // If create call failed, return more actionable info
      throw err;
    });

    // If schema mismatch, we need to handle gracefully.
    // If your replicate model needs a different create call, update this file.

    // We won't poll in this minimal implementation.
    sendJson(res, 501, {
      error: "Replicate job creation needs model-specific input schema. Update api_generate.js REPLICATE_MODEL/inputs for your selected replicate model.",
      receivedModel: model,
      create
    });
    return;
  } catch (e) {
    sendJson(res, 500, { error: e.message || "generation_failed" });
  }
};

