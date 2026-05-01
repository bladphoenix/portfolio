# Gigih Ling — Portfolio (React JS)

## 🗂️ Struktur Proyek

```
├── index.html            ← Entry HTML (Vite)
├── vite.config.js        ← Konfigurasi Vite + React plugin
├── package.json          ← Dependensi & scripts
├── Portfolio.jsx         ← Komponen utama (semua section)
└── src/
    └── main.jsx          ← Mount React ke DOM
```

## 🚀 Cara Menjalankan

### 1. Install dependensi
```bash
npm install
```

### 2. Jalankan development server
```bash
npm run dev
```
Buka browser di `http://localhost:5173`

### 3. Build untuk production
```bash
npm run build
```
Output ada di folder `dist/`

### 4. Preview hasil build
```bash
npm run preview
```

---

## ✅ Fitur yang Dikonversi

| Fitur | Status |
|---|---|
| Dark / Light Mode (dengan localStorage) | ✅ |
| Canvas particle animation | ✅ |
| Navbar scroll + hamburger mobile menu | ✅ |
| Hero section + animasi orbit avatar | ✅ |
| Stats bar | ✅ |
| About + experience cards | ✅ |
| Portfolio grid + Load More | ✅ |
| Image lightbox (klik gambar → modal) | ✅ |
| Skills accordion + progress bar animasi | ✅ |
| Clients marquee (auto-scroll) | ✅ |
| Contact form (FormSubmit AJAX) | ✅ |
| Scroll Reveal (IntersectionObserver) | ✅ |
| Back to top button | ✅ |
| Footer | ✅ |

---

## 🧩 Arsitektur Komponen React

```
<App>                     ← Root: state isDark, modalSrc
  ├── <BgCanvas>          ← Canvas particles (useEffect + requestAnimationFrame)
  ├── <Navbar>            ← Fixed nav, theme toggle, hamburger menu
  ├── <Hero>              ← Intro section
  ├── <StatsBar>          ← Angka statistik
  ├── <About>             ← Bio + social links + experience cards
  ├── <Portfolio>         ← Grid proyek + Load More
  ├── <Skills>            ← Accordion + animated progress bar
  ├── <Clients>           ← Marquee logo
  ├── <Contact>           ← Form AJAX ke FormSubmit
  ├── <footer>            ← Footer
  ├── <BackToTop>         ← Tombol scroll ke atas
  └── <ImageModal>        ← Lightbox gambar portfolio
```

---

## 📦 Teknologi

- **React 18** — UI library
- **Vite 5** — Build tool & dev server
- **Google Fonts** — Playfair Display, DM Sans, Space Mono
- **FormSubmit** — Form submission tanpa backend
- **Cloudinary** — CDN untuk gambar & logo

---

## 🎨 Kustomisasi

Semua data (portfolio, skills, clients, dll.) berada di bagian atas `Portfolio.jsx` dalam bentuk konstanta array:

```js
const SKILL_GROUPS = [ ... ]   // Data skills
const PORTFOLIO_ITEMS = [ ... ] // Data proyek
const CLIENTS = [ ... ]        // Logo klien
```

Ubah data di sana untuk menyesuaikan konten tanpa menyentuh logika komponen.
