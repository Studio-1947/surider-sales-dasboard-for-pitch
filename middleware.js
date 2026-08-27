// Vercel Edge Middleware: password gate for the whole site.
// The password comes from the SITE_PASSWORD environment variable in Vercel; the fallback keeps the draft working without configuration.
const PASSWORD = (typeof process !== "undefined" && process.env && process.env.SITE_PASSWORD) || "sush27";
const COOKIE = "sr_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export const config = { matcher: "/(.*)" };

async function token(pw) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("sunrider-sales-desk|" + pw));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}
function cookieValue(req, name) {
  const m = (req.headers.get("cookie") || "").match(new RegExp("(?:^|;\\s*)" + name + "=([^;]+)"));
  return m ? m[1] : null;
}
function redirect(url, setCookie) {
  const h = { Location: url };
  if (setCookie) h["Set-Cookie"] = setCookie;
  return new Response(null, { status: 302, headers: h });
}

const LOGIN_PAGE = (error, next) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Sunrider India Sales Desk</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:wght@300..800&display=swap">
<style>
*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f4f5ef;color:#14170f;font-family:"Google Sans Flex",system-ui,sans-serif;padding:20px}
.card{width:min(400px,100%);background:#fdfdfb;border:1px solid rgba(20,23,15,.1);border-radius:16px;padding:30px 28px 26px;box-shadow:0 1px 2px rgba(20,23,15,.05),0 24px 60px -30px rgba(20,23,15,.4)}
.brand{display:flex;align-items:center;gap:12px;margin-bottom:22px}.brand svg{width:40px;height:40px}.wm{font-weight:800;font-size:22px;letter-spacing:.06em;color:#d0121b;display:flex;align-items:flex-start;gap:2px}.wm sup{font-size:9px;font-weight:600}
h1{font-size:20px;margin:0 0 4px;letter-spacing:-.01em}p{margin:0 0 18px;color:#55594e;font-size:14px;line-height:1.5}
label{display:block;font-size:12.5px;color:#55594e;margin-bottom:6px}
input{width:100%;font:inherit;font-size:15px;padding:11px 13px;border:1px solid #e2e4d8;border-radius:10px;background:#f4f5ef;color:#14170f;outline:0}input:focus{border-color:#1d5c3c;box-shadow:0 0 0 3px rgba(29,92,60,.15)}
button{margin-top:14px;width:100%;font:inherit;font-size:14.5px;font-weight:600;padding:11px;border:0;border-radius:10px;background:#1d5c3c;color:#fdfdfb;cursor:pointer}button:hover{background:#174a30}
.err{background:#fdeceb;color:#c0392f;border-radius:9px;padding:9px 12px;font-size:13px;margin-bottom:14px}
.foot{margin-top:18px;font-size:11.5px;color:#82867a;text-align:center;line-height:1.45}
</style></head><body>
<form class="card" method="post" action="/login" autocomplete="off">
  <div class="brand"><svg viewBox="0 0 100 100" aria-hidden="true"><defs><clipPath id="c"><circle cx="50" cy="50" r="48"/></clipPath></defs><g clip-path="url(#c)" fill="#d0121b"><rect y="0" width="100" height="26"/><rect y="33" width="100" height="15"/><rect y="55" width="100" height="12"/><rect y="74" width="100" height="9"/><rect y="90" width="100" height="10"/></g></svg><span class="wm">SUNRIDER<sup>®</sup></span></div>
  <h1>Sunrider India Sales Desk</h1>
  <p>This draft dashboard is private. Enter the access password to continue.</p>
  ${error ? '<div class="err">That password is not right. Please try again.</div>' : ""}
  <input type="hidden" name="next" value="${next}">
  <label for="pw">Password</label>
  <input id="pw" name="password" type="password" required autofocus placeholder="Enter password">
  <button type="submit">Open dashboard</button>
  <div class="foot">Sunrider India · Sales Dashboard · Draft version with mock data by Studio1947</div>
</form></body></html>`;

export default async function middleware(request) {
  const url = new URL(request.url);
  const path = url.pathname;
  const valid = await token(PASSWORD);

  if (path === "/logout") {
    return redirect("/login", `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`);
  }
  if (path === "/login") {
    if (request.method === "POST") {
      let pw = "", next = "/";
      try { const f = await request.formData(); pw = String(f.get("password") || ""); next = String(f.get("next") || "/"); } catch (e) {}
      if (!next.startsWith("/") || next.startsWith("//")) next = "/";
      if (pw === PASSWORD) {
        return redirect(next, `${COOKIE}=${valid}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Lax`);
      }
      return new Response(LOGIN_PAGE(true, next), { status: 401, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
    }
    if (cookieValue(request, COOKIE) === valid) return redirect("/");
    const next = url.searchParams.get("next") || "/";
    return new Response(LOGIN_PAGE(false, next.startsWith("/") ? next : "/"), { status: 200, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
  }
  if (cookieValue(request, COOKIE) === valid) return; // continue to the static file
  return redirect("/login?next=" + encodeURIComponent(path + url.search));
}
