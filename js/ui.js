// frontend/js/ui.js
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";

/* ===============================
   SUPABASE CLIENT
================================ */
const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

/* ===============================
   NAVBAR
================================ */
export function nav(active = "") {
  return `
  <nav class="bg-white border-b shadow-sm">
    <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
      <a href="index.html" class="font-bold text-lg text-blue-600">
        KursusKu
      </a>

      <div class="flex items-center gap-4 text-sm font-semibold">

        <a class="${
          active === "home"
            ? "text-blue-600"
            : "text-gray-600 hover:text-black"
        }" href="index.html">
          Home
        </a>

        <a class="${
          active === "courses"
            ? "text-blue-600"
            : "text-gray-600 hover:text-black"
        }" href="courses.html">
          Kursus
        </a>

        <!-- DASHBOARD LINK (DINAMIS) -->
        <a id="navDashboard"
           class="${
             active === "dashboard"
               ? "text-blue-600"
               : "text-gray-600 hover:text-black"
           } hidden"
           href="#">
          Dashboard
        </a>

        <!-- LOGIN -->
        <a id="navLogin"
           class="${
             active === "login"
               ? "text-blue-600"
               : "text-gray-600 hover:text-black"
           }"
           href="login.html">
          Login
        </a>

        <!-- USER INFO -->
        <span id="navUser"
              class="hidden text-gray-600 text-sm"></span>

        <!-- LOGOUT -->
        <button id="btnLogout"
          class="hidden bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition">
          Logout
        </button>

      </div>
    </div>
  </nav>`;
}

/* ===============================
   NAVBAR AUTH LOGIC
================================ */
export async function initNavAuth() {
  const { data } = await supabase.auth.getSession();
  const session = data.session;

  const navLogin = document.getElementById("navLogin");
  const navUser = document.getElementById("navUser");
  const navDashboard = document.getElementById("navDashboard");
  const btnLogout = document.getElementById("btnLogout");

  if (!navLogin || !navUser || !btnLogout || !navDashboard) return;

  if (session?.user) {
    const user = session.user;
    const name =
      user.user_metadata?.full_name ||
      user.email.split("@")[0];

    // TAMPILAN LOGIN
    navLogin.classList.add("hidden");

    // USER INFO
    navUser.textContent = `Halo, ${name}`;
    navUser.classList.remove("hidden");

    // DASHBOARD LINK
    navDashboard.classList.remove("hidden");

    // LOGOUT
    btnLogout.classList.remove("hidden");

    // LOGOUT ACTION
    btnLogout.addEventListener("click", async () => {
      await supabase.auth.signOut();
      window.location.href = "login.html";
    });
  }
}

/* ===============================
   FOOTER
================================ */
export function footer() {
  const year = new Date().getFullYear();
  return `
  <footer class="border-t mt-16 bg-white">
    <div class="max-w-6xl mx-auto px-4 py-8 text-sm text-gray-600">
      © ${year} KursusKu — Belajar Bahasa Indonesia Online
    </div>
  </footer>`;
}

/* ===============================
   COURSE CARD
================================ */
export function courseCard(c) {
  const img =
    c.image_url ||
    "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=1200&auto=format&fit=crop";

  return `
  <div class="bg-white rounded-xl border overflow-hidden hover:shadow-sm transition">
    <img src="${img}" alt="${escapeHtml(c.title)}"
         class="h-44 w-full object-cover"/>

    <div class="p-4">
      <div class="flex items-center justify-between gap-2">
        <h3 class="font-semibold">${escapeHtml(c.title)}</h3>
        <span class="text-xs px-2 py-1 rounded-full bg-gray-100">
          ${escapeHtml(c.level)}
        </span>
      </div>

      <p class="text-sm text-gray-600 mt-2 line-clamp-2">
        ${escapeHtml(c.description)}
      </p>

      <div class="flex items-center justify-between mt-4">
        <span class="font-semibold">
          Rp${Number(c.price || 0).toLocaleString("id-ID")}
        </span>
        <a href="course.html?id=${c.id}"
           class="text-sm font-semibold text-blue-600 hover:underline">
          Detail
        </a>
      </div>
    </div>
  </div>`;
}

/* ===============================
   ESCAPE HTML
================================ */
export function escapeHtml(str) {
  return String(str || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
