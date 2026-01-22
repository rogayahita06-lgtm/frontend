import { signUp } from "./auth.js";

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);

  try {
    await signUp(
      fd.get("email"),
      fd.get("password"),
      fd.get("fullname")
    );
    alert("Register berhasil, silakan login");
    window.location.href = "login.html";
  } catch (err) {
    alert(err.message);
  }
});
