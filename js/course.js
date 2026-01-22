import { nav, footer, escapeHtml } from "./ui.js";
import { api } from "./api.js";
import { getAccessToken } from "./auth.js";

const app = document.getElementById("app");
const params = new URLSearchParams(location.search);
const id = params.get("id");

if (!id) {
  app.innerHTML = `${nav("courses")}<main class="max-w-6xl mx-auto px-4 pt-10">ID tidak ditemukan.</main>${footer()}`;
} else {
  const c = await api.getCourse(id);

  app.innerHTML = `
    ${nav("courses")}
    <main class="max-w-6xl mx-auto px-4 pt-10">
      <div class="bg-white border rounded-2xl overflow-hidden">
        <div class="p-6">
          <div class="text-sm text-gray-500">${escapeHtml(c.level)}</div>
          <h1 class="text-2xl font-bold mt-1">${escapeHtml(c.title)}</h1>
          <p class="text-gray-700 mt-3">${escapeHtml(c.description)}</p>

          <div class="mt-6 flex gap-3 flex-wrap">
            <a href="courses.html" class="border px-4 py-2 rounded-lg font-semibold">Kembali</a>
            <button id="btnCert" class="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold">
              Download Sertifikat (PDF)
            </button>
          </div>

          <p class="text-sm text-gray-500 mt-3">
            *Untuk download sertifikat Anda harus login.
          </p>
        </div>
      </div>
    </main>
    ${footer()}
  `;

  document.getElementById("btnCert").addEventListener("click", async () => {
    const token = await getAccessToken();
    if (!token) {
      alert("Silakan login dulu.");
      location.href = "login.html";
      return;
    }

    // fetch PDF as blob
    const res = await fetch(api.certificateUrl(id), {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
      alert("Gagal membuat sertifikat. Pastikan backend jalan.");
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  });
}
