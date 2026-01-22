// frontend/js/dashboard-user.js
import { API_BASE } from "./config.js";
import { getAccessToken, getSession } from "./auth.js";

const session = await getSession();
if (!session) {
  window.location.href = "login.html";
}

const tbody = document.getElementById("myCourses");

async function loadMyCourses() {
  const token = await getAccessToken();

  const res = await fetch(`${API_BASE}/api/my-enrollments`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    tbody.innerHTML = `<tr><td colspan="3">Gagal memuat data</td></tr>`;
    return;
  }

  const data = await res.json();

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3">Belum mengikuti kursus</td></tr>`;
    return;
  }

  tbody.innerHTML = data.map(e => `
    <tr class="border-b">
      <td class="py-2">${e.course_title}</td>
      <td>
        <span class="px-2 py-1 rounded text-xs ${
          e.status === "lulus"
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700"
        }">
          ${e.status.toUpperCase()}
        </span>
      </td>
      <td>
        ${
          e.status === "lulus"
            ? `<button
                data-course="${e.course_id}"
                class="btnCert text-blue-600 font-semibold">
                Download
              </button>`
            : `<span class="text-gray-400 text-xs">
                Belum tersedia
              </span>`
        }
      </td>
    </tr>
  `).join("");

  // EVENT DOWNLOAD SERTIFIKAT
  document.querySelectorAll(".btnCert").forEach(btn => {
    btn.addEventListener("click", async () => {
      const courseId = btn.dataset.course;
      await openCertificate(courseId);
    });
  });
}

async function openCertificate(courseId) {
  const token = await getAccessToken();

  const res = await fetch(`${API_BASE}/api/certificates/${courseId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    alert("Sertifikat belum tersedia atau akses ditolak");
    return;
  }

  const blob = await res.blob();
  const blobUrl = URL.createObjectURL(blob);

  // 👉 BUKA DI TAB BARU (PREVIEW PDF)
  window.open(blobUrl, "_blank");
}

loadMyCourses();
