import { nav, footer, courseCard } from "./ui.js";
import { api } from "./api.js";

const app = document.getElementById("app");
const courses = await api.listCourses();

app.innerHTML = `
  ${nav("courses")}
  <main class="max-w-6xl mx-auto px-4 pt-10">
    <div class="flex items-end justify-between gap-4 flex-wrap">
      <div>
        <h1 class="text-2xl font-bold">Daftar Kursus</h1>
        <p class="text-gray-600 text-sm mt-1">Pilih kursus sesuai kebutuhan Anda.</p>
      </div>

      <div class="flex gap-2">
        <input id="q" class="border rounded-lg px-3 py-2 text-sm" placeholder="Cari kursus..."/>
        <select id="level" class="border rounded-lg px-3 py-2 text-sm">
          <option value="">Semua Level</option>
          <option>Pemula</option>
          <option>Menengah</option>
          <option>Mahir</option>
        </select>
      </div>
    </div>

    <div id="grid" class="grid md:grid-cols-3 gap-4 mt-6"></div>
  </main>
  ${footer()}
`;

const grid = document.getElementById("grid");
const q = document.getElementById("q");
const level = document.getElementById("level");

function render() {
  const key = q.value.toLowerCase().trim();
  const lv = level.value;

  const filtered = courses.filter(c => {
    const okKey = !key || (c.title + " " + c.description).toLowerCase().includes(key);
    const okLv = !lv || c.level === lv;
    return okKey && okLv;
  });

  grid.innerHTML = filtered.map(courseCard).join("") || `
    <div class="text-gray-600">Tidak ada kursus.</div>
  `;
}

q.addEventListener("input", render);
level.addEventListener("change", render);

render();
