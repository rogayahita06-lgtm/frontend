// frontend/js/logout.js
import { signOut } from "./auth.js";

const btn = document.getElementById("btnLogout");

if (btn) {
  btn.addEventListener("click", async () => {
    if (!confirm("Yakin ingin logout?")) return;

    try {
      await signOut();
      alert("Logout berhasil");
      window.location.href = "login.html";
    } catch (err) {
      alert(err.message);
    }
  });
}
