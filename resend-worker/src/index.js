const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8"
};

const requiredFields = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "eventDate",
  "eventType",
  "guestCount"
];

function corsHeaders(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowedOrigins = new Set([
    env.ALLOWED_ORIGIN || "https://digitalcr8tive.github.io",
    "http://127.0.0.1:4173",
    "http://localhost:4173"
  ]);

  return {
    ...JSON_HEADERS,
    "access-control-allow-origin": allowedOrigins.has(origin) ? origin : "https://digitalcr8tive.github.io",
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "Content-Type",
    "vary": "Origin"
  };
}

function jsonResponse(body, status, headers) {
  return new Response(JSON.stringify(body), {
    status,
    headers
  });
}

function escapeHtml(value = "") {
  const entities = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };

  return String(value).replace(/[&<>"']/g, (character) => entities[character]);
}

function renderAddress(data) {
  return [data.streetAddress, data.streetAddressLine2, data.city, data.state, data.postalCode]
    .filter(Boolean)
    .join(", ") || "Not provided";
}

function renderEmail(data) {
  const rows = [
    ["Name", `${data.firstName} ${data.lastName}`],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Event date", data.eventDate],
    ["Event type", data.eventType],
    ["Guests", data.guestCount],
    ["Venue", renderAddress(data)],
    ["Preferred menu", data.preferredMenu || "Not provided"],
    ["Additional requests", data.comments || "Not provided"]
  ];

  return `
    <h1>New catering inquiry for The Factory</h1>
    <table cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; max-width: 680px; font-family: Arial, sans-serif;">
      <tbody>${rows.map(([label, value]) => `<tr><th align="left" style="border-bottom: 1px solid #ddd;">${escapeHtml(label)}</th><td style="border-bottom: 1px solid #ddd;">${escapeHtml(value)}</td></tr>`).join("")}</tbody>
    </table>
  `;
}

export default {
  async fetch(request, env) {
    const headers = corsHeaders(request, env);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405, headers);
    }

    let data;
    try {
      data = await request.json();
    } catch {
      return jsonResponse({ error: "Invalid request body" }, 400, headers);
    }

    const missingFields = requiredFields.filter((field) => !String(data[field] || "").trim());
    if (missingFields.length > 0 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || "")) {
      return jsonResponse({ error: "Please complete the required catering fields." }, 400, headers);
    }

    if (!env.RESEND_API_KEY || !env.CATERING_TO_EMAIL || !env.CATERING_FROM_EMAIL) {
      return jsonResponse({ error: "Catering delivery is not configured." }, 503, headers);
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: env.CATERING_FROM_EMAIL,
        to: [env.CATERING_TO_EMAIL],
        reply_to: data.email,
        subject: `Catering inquiry from ${data.firstName} ${data.lastName}`,
        html: renderEmail(data)
      })
    });

    if (!resendResponse.ok) {
      console.error("Resend request failed", resendResponse.status);
      return jsonResponse({ error: "Catering delivery failed." }, 502, headers);
    }

    return jsonResponse({ ok: true }, 200, headers);
  }
};
