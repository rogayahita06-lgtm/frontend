// frontend/js/enrollment-admin.js
import { api } from "./api.js";

/**
 * Dipanggil SETELAH dashboard-admin.js render HTML
 */
export async function initEnrollmentAdmin() {
  const table = document.getElementById("enrollmentTable");

  if (!table) {
    console.warn("Tabel enrollment tidak ditemukan");
    return;
  }

  async function loadEnrollments() {
    try {
      const data = await api.adminEnrollments();

      if (!data.length) {
        table.innerHTML = `
          <tr>
            <td colspan="4" class="py-4 text-gray-500 text-center">
              Belum ada peserta terdaftar
            </td>
          </tr>
        `;
        return;
      }

      table.innerHTML = data.map(e => `
        <tr class="border-b">
          <td class="py-2">${e.user_email}</td>
          <td>${e.course_title}</td>
          <td class="font-semibold">${e.status.toUpperCase()}</td>
          <td>
            <select data-id="${e.id}"
              class="statusSelect border px-2 py-1 rounded text-sm">
              <option value="terdaftar" ${e.status === "terdaftar" ? "selected" : ""}>TERDAFTAR</option>
              <option value="selesai" ${e.status === "selesai" ? "selected" : ""}>SELESAI</option>
              <option value="lulus" ${e.status === "lulus" ? "selected" : ""}>LULUS</option>
            </select>
          </td>
        </tr>
      `).join("");
    } catch (err) {
      table.innerHTML = `
        <tr>
          <td colspan="4" class="text-red-600 py-4 text-center">
            Gagal memuat data
          </td>
        </tr>
      `;
    }
  }

  // update status
  document.addEventListener("change", async (e) => {
    if (!e.target.classList.contains("statusSelect")) return;

    const id = e.target.dataset.id;
    const status = e.target.value;

    try {
      await api.updateEnrollment(id, status);
      alert("Status diperbarui");
      loadEnrollments();
    } catch {
      alert("Gagal update status");
    }
  });

  loadEnrollments();
}
