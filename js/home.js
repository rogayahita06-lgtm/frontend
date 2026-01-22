import { nav, footer } from "./ui.js";
import { api } from "./api.js";

const app = document.getElementById("app");

const courses = await api.listCourses().catch(() => []);

app.innerHTML = `
  ${nav("home")}
  <header class="max-w-6xl mx-auto px-4 pt-10">
    <div class="bg-white border rounded-2xl p-8">
      <h1 class="text-3xl font-bold">Belajar Bahasa Indonesia Online</h1>
      <p class="text-gray-600 mt-2 max-w-2xl">
        KursusKu membantu Anda belajar Bahasa Indonesia dari level pemula sampai mahir.
      </p>
      <div class="mt-6 flex gap-3">
        <a href="courses.html" class="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold">Lihat Kursus</a>
        <a href="login.html" class="border px-4 py-2 rounded-lg font-semibold">Login</a>
      </div>
    </div>
  </header>

  <main class="max-w-6xl mx-auto px-4 mt-10">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold">Kursus Terbaru</h2>
      <a href="courses.html" class="text-sm font-semibold text-blue-600 hover:underline">Lihat semua</a>
    </div>
    <div class="grid md:grid-cols-3 gap-4 mt-4">
      ${
        courses.slice(0, 3).map(c => `
          <div class="bg-white border rounded-xl p-4">
            <div class="text-sm text-gray-500">${c.level}</div>
            <div class="font-bold mt-1">${c.title}</div>
            <div class="text-sm text-gray-600 mt-2 line-clamp-2">${c.description}</div>
            <a class="inline-block mt-4 text-sm font-semibold text-blue-600 hover:underline"
              href="course.html?id=${c.id}">Detail</a>
          </div>
        `).join("")
      }
    </div>
  </main>

  ${footer()}
`;
