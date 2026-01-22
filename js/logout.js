import { signOut } from "./auth.js";

document.getElementById("btnLogout").addEventListener("click", async () => {
  if (!confirm("Yakin ingin logout?")) return;

  try {
    await signOut();
    alert("Logout berhasil");
    window.location.href = "login.html";
  } catch (err) {
    alert(err.message);
  }
});
