import { signIn, getSession } from "./auth.js";

// DAFTAR EMAIL ADMIN (HARUS SAMA DENGAN .env BACKEND)
const ADMIN_EMAILS = [
  "sitiitarogayah@gmail.com"
];

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);

  try {
    await signIn(fd.get("email"), fd.get("password"));

    const session = await getSession();
    const email = session.user.email.toLowerCase();

    alert("Login berhasil");

    if (ADMIN_EMAILS.includes(email)) {
      window.location.href = "dashboard-admin.html";
    } else {
      window.location.href = "dashboard-user.html";
    }

  } catch (err) {
    alert(err.message);
  }
});
