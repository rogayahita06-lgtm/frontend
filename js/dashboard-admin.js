// frontend/js/dashboard-admin.js
import { nav, footer, escapeHtml, initNavAuth } from "./ui.js";
import { api } from "./api.js";
import { getSession, getUser } from "./auth.js";
import { initEnrollmentAdmin } from "./enrollment-admin.js";

/* ===============================
   PROTEKSI ADMIN
================================ */
const ADMIN_EMAILS = ["sitiitarogayah@gmail.com"];

const session = await getSession();
if (!session) window.location.href = "login.html";

const user = await getUser();
if (!ADMIN_EMAILS.includes(user.email.toLowerCase())) {
  alert("Akses ditolak. Halaman ini hanya untuk admin.");
  window.location.href = "dashboard-user.html";
}

/* ===============================
   STATE
================================ */
const app = document.getElementById("app");
let courses = [];

/* ===============================
   RENDER
================================ */
function render() {
  app.innerHTML = `
    ${nav("dashboard")}

    <main class="max-w-6xl mx-auto px-4 pt-10">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-2xl font-bold">Dashboard Admin</h1>
          <p class="text-sm text-gray-600 mt-1">
            Login sebagai:
            <span class="font-semibold">${escapeHtml(user.email)}</span>
          </p>
          <p class="text-xs text-gray-500 mt-1">
            *CRUD hanya bisa dilakukan oleh admin.
          </p>
        </div>
        <a class="border px-4 py-2 rounded-lg font-semibold" href="courses.html">
          Lihat Halaman Kursus
        </a>
      </div>

      <div class="grid md:grid-cols-2 gap-6 mt-8">
        <!-- FORM -->
        <div class="bg-white border rounded-2xl p-6">
          <h2 class="text-lg font-bold">Tambah / Edit Kursus</h2>
          <form id="form" class="mt-4 space-y-3">
            <input type="hidden" name="id" />
            <input class="border rounded-lg px-3 py-2 w-full"
                  name="title" placeholder="Judul" required />
            <textarea class="border rounded-lg px-3 py-2 w-full"
                      name="description"
                      placeholder="Deskripsi"
                      rows="4" required></textarea>

            <div class="grid grid-cols-2 gap-2">
              <select class="border rounded-lg px-3 py-2 w-full" name="level">
                <option>Pemula</option>
                <option>Menengah</option>
                <option>Mahir</option>
              </select>
              <input class="border rounded-lg px-3 py-2 w-full"
                    name="price" placeholder="Harga" value="0" />
            </div>

            <input class="border rounded-lg px-3 py-2 w-full"
                  name="image_url"
                  placeholder="Image URL (optional)" />

            <div class="flex gap-2">
              <button id="btnSave" type="submit"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold">
                Simpan
              </button>
              <button id="btnReset" type="button"
                class="border px-4 py-2 rounded-lg font-semibold">
                Reset
              </button>
            </div>
          </form>
        </div>

        <!-- TABLE -->
        <div class="bg-white border rounded-2xl p-6">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-bold">Daftar Kursus</h2>
            <button id="btnRefresh"
              class="border px-4 py-2 rounded-lg font-semibold">
              Refresh
            </button>
          </div>

          <div class="overflow-auto mt-4">
            <table class="w-full text-sm">
              <thead class="text-left text-gray-600">
                <tr>
                  <th class="pb-2 pr-3">Judul</th>
                  <th class="pb-2 pr-3">Level</th>
                  <th class="pb-2 pr-3">Harga</th>
                  <th class="pb-2 pr-3">Deskripsi</th>
                  <th class="pb-2 pr-3">Aksi</th>
                </tr>
              </thead>
              <tbody id="tbody"></tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- VERIFIKASI -->
      <section class="bg-white border rounded-2xl p-6 mt-8">
        <h3 class="text-lg font-bold mb-4">✅ Verifikasi Peserta Kursus</h3>
        <table class="w-full text-sm">
          <thead class="border-b text-gray-500">
            <tr>
              <th class="text-left py-2">Email</th>
              <th>Kursus</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody id="enrollmentTable"></tbody>
        </table>
      </section>
    </main>

    ${footer()}
  `;

  // aktifkan navbar auth (hide login, show halo+logout)
  initNavAuth();

  // setelah UI ada, render tabel kursus dan init verifikasi
  renderCourseTable();
  initEnrollmentAdmin();

  // bind form handlers
  bindHandlers();
}

function renderCourseTable() {
  const tbody = document.getElementById("tbody");
  if (!tbody) return;

  if (!courses.length) {
    tbody.innerHTML = `
      <tr>
        <td class="py-4 text-gray-600" colspan="5">Belum ada kursus.</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = courses.map(c => `
    <tr class="border-t">
      <td class="py-2 pr-3 font-semibold">${escapeHtml(c.title)}</td>
      <td class="py-2 pr-3 text-sm text-gray-600">${escapeHtml(c.level)}</td>
      <td class="py-2 pr-3 text-sm">Rp${Number(c.price||0).toLocaleString("id-ID")}</td>
      <td class="py-2 pr-3 text-sm text-gray-600 line-clamp-1 max-w-[320px]">${escapeHtml(c.description)}</td>
      <td class="py-2 pr-3 text-sm flex gap-2">
        <button data-edit="${c.id}" class="btnEdit border px-3 py-1 rounded-lg font-semibold">Edit</button>
        <button data-del="${c.id}" class="btnDel bg-red-600 text-white px-3 py-1 rounded-lg font-semibold">Hapus</button>
      </td>
    </tr>
  `).join("");
}

async function refreshCourses() {
  courses = await api.listCourses();
  renderCourseTable();
}

function bindHandlers() {
  const form = document.getElementById("form");
  const btnReset = document.getElementById("btnReset");
  const btnRefresh = document.getElementById("btnRefresh");

  btnRefresh.addEventListener("click", refreshCourses);

  btnReset.addEventListener("click", () => fillForm(null));

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      title: form.title.value,
      description: form.description.value,
      level: form.level.value,
      price: Number(form.price.value || 0),
      image_url: form.image_url.value || null
    };

    try {
      if (form.id.value) {
        await api.updateCourse(form.id.value, payload);
        alert("Update berhasil");
      } else {
        await api.createCourse(payload);
        alert("Tambah berhasil");
      }
      fillForm(null);
      await refreshCourses();
    } catch (err) {
      alert(err.message);
    }
  });

  // EVENT DELEGATION untuk Edit/Hapus (biar tidak mati walau re-render)
  app.addEventListener("click", async (e) => {
    const editId = e.target?.getAttribute?.("data-edit");
    const delId = e.target?.getAttribute?.("data-del");

    if (editId) {
      const c = courses.find(x => x.id === editId);
      fillForm(c);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (delId) {
      const ok = confirm("Yakin hapus kursus ini?");
      if (!ok) return;
      try {
        await api.deleteCourse(delId);
        alert("Hapus berhasil");
        await refreshCourses();
      } catch (err) {
        alert(err.message);
      }
    }
  });
}

function fillForm(course) {
  const form = document.getElementById("form");
  form.id.value = course?.id || "";
  form.title.value = course?.title || "";
  form.description.value = course?.description || "";
  form.level.value = course?.level || "Pemula";
  form.price.value = course?.price ?? 0;
  form.image_url.value = course?.image_url || "";
}

/* ===============================
   INIT
================================ */
await refreshCourses();
render();
