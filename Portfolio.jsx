import { useState, useEffect, useRef, useCallback } from "react";

// ─── DATA ───────────────────────────────────────────────────────────────────

const SKILL_GROUPS = [
  {
    id: "code", icon: "{ }", name: "Code & Development", sub: "More than 6 years",
    skills: [
      { icon: "⚡", name: "JavaScript", pct: 82 },
      { icon: "🐘", name: "PHP", pct: 78 },
      { icon: "🐍", name: "Python", pct: 68 },
      { icon: "🟢", name: "Node.js", pct: 72 },
      { icon: "🔴", name: "Laravel", pct: 80 },
      { icon: "⚛️", name: "React JS", pct: 85 },
      { icon: "▲", name: "Next.js", pct: 78 },
      { icon: "🌊", name: "Tailwind CSS", pct: 87 },
    ],
  },
  {
    id: "design", icon: "✦", name: "Design & Creative", sub: "More than 5 years",
    skills: [
      { icon: "✏️", name: "Figma", pct: 88 },
      { icon: "🖌️", name: "Illustrator", pct: 82 },
      { icon: "🖼️", name: "Photoshop", pct: 80 },
      { icon: "📐", name: "SketchUp", pct: 65 },
      { icon: "🎨", name: "Canva", pct: 92 },
    ],
  },
  {
    id: "seo", icon: "↗", name: "SEO & Marketing", sub: "More than 4 years",
    skills: [
      { icon: "📈", name: "Google Ads", pct: 85 },
      { icon: "📘", name: "Meta Pixel", pct: 80 },
      { icon: "📊", name: "Google Analytics", pct: 90 },
      { icon: "🔍", name: "Search Console", pct: 88 },
      { icon: "🔗", name: "Ahrefs", pct: 80 },
      { icon: "📱", name: "Social Media", pct: 85 },
    ],
  },
  {
    id: "cloud", icon: "☁", name: "Cloud & Infrastructure", sub: "More than 3 years",
    skills: [
      { icon: "🌩️", name: "Cloudflare", pct: 85 },
      { icon: "🔥", name: "Firebase", pct: 75 },
      { icon: "🔵", name: "DigitalOcean", pct: 80 },
      { icon: "🖼️", name: "Cloudinary", pct: 75 },
      { icon: "🛡️", name: "Nginx", pct: 76 },
      { icon: "🐧", name: "Linux", pct: 78 },
      { icon: "🐙", name: "Git", pct: 82 },
    ],
  },
];

const PORTFOLIO_ITEMS = [
  {
    id: 1, featured: true,
    bg: "linear-gradient(135deg, #3b82f6, #1e3a8a)",
    img: "https://res.cloudinary.com/dmis60dxy/image/upload/v1777564895/Screenshot11_i4ukyg.png",
    alt: "Whitebox.asia",
    tags: ["Cloud Infra", "Web Perf", "SEO"],
    title: "Whitebox.asia",
    desc: "A specialist platform focusing on high-performance websites, SEO optimization, and secure, scalable cloud infrastructure management.",
    link: "https://whitebox.asia",
  },
  {
    id: 2,
    bg: "linear-gradient(135deg, #f59e0b, #92400e)",
    img: "https://res.cloudinary.com/dmis60dxy/image/upload/v1777564896/Screenshot10_gvajvn.png",
    alt: "Bali Sunday Tour",
    tags: ["Web Design", "Travel & Tour"],
    title: "Bali Sunday Tour",
    desc: "A premium travel platform offering luxury tours to experience hidden treasures and new adventures across Bali.",
    link: "https://balisundaytour.com",
  },
  {
    id: 3,
    bg: "linear-gradient(135deg, #1e3a8a, #16a34a)",
    img: "https://res.cloudinary.com/dmis60dxy/image/upload/v1777564893/Screenshot8_dpggsk.png",
    alt: "Flower Pool Bali",
    tags: ["Web Design", "Booking System"],
    title: "Flower Pool Bali",
    desc: "An elegant service booking platform offering custom flower pools, villa decorations, and surprise proposal setups in Bali.",
    link: "https://flowerpoolbali.com",
  },
  {
    id: 4,
    bg: "linear-gradient(135deg, #f97316, #ea580c)",
    img: "https://res.cloudinary.com/dmis60dxy/image/upload/v1777564902/portfolio6_bltawa.png",
    alt: "React Movie",
    tags: ["React JS", "API"],
    title: "React Movie",
    desc: "Film website built with React JS using a third-party movie API.",
    link: "#",
  },
  {
    id: 5,
    bg: "linear-gradient(135deg, #f59e0b, #d97706)",
    img: "https://res.cloudinary.com/dmis60dxy/image/upload/v1777564895/portfolio2_jeezyp.png",
    alt: "Malang Strudel",
    tags: ["Web Design"],
    title: "Malang Strudel",
    desc: "Creation of the Abimanyu Strudel brand website.",
    link: "#",
  },
  {
    id: 6,
    bg: "linear-gradient(135deg, #6366f1, #4f46e5)",
    img: "https://res.cloudinary.com/dmis60dxy/image/upload/v1777564907/portfolio3_em9eii.png",
    alt: "Personal Blog",
    tags: ["Materialize CSS"],
    title: "Personal Blog",
    desc: "Personal website built with Materialize CSS framework.",
    link: "#",
  },
  {
    id: 7, hidden: true,
    bg: "linear-gradient(135deg, #22c55e, #16a34a)",
    img: "https://res.cloudinary.com/dmis60dxy/image/upload/v1777564897/portfolio1_nc29f0.png",
    alt: "Malang News",
    tags: ["WordPress", "SEO"],
    title: "Malang News",
    desc: "A comprehensive news website dedicated to covering stories about the city of Malang.",
    link: "#",
  },
  {
    id: 8, hidden: true,
    bg: "linear-gradient(135deg, #14b8a6, #0f766e)",
    img: "https://res.cloudinary.com/dmis60dxy/image/upload/v1777564904/portfolio5_wn0hpj.png",
    alt: "PSHT Singosari",
    tags: ["Laravel"],
    title: "PSHT Singosari",
    desc: "Organization website built using the Laravel framework.",
    link: "#",
  },
  {
    id: 9, hidden: true,
    bg: "linear-gradient(135deg, #ec4899, #be185d)",
    img: "https://res.cloudinary.com/dmis60dxy/image/upload/v1777564894/portfolio4_xyeysz.png",
    alt: "Beautiful News",
    tags: ["WordPress"],
    title: "Beautiful News",
    desc: "Simple elegant news website using WordPress.",
    link: "#",
  },
  {
    id: 10, hidden: true,
    bg: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
    img: "https://res.cloudinary.com/dmis60dxy/image/upload/v1777564905/portfolio9_tz6cbp.png",
    alt: "PSHT Data Management",
    tags: ["Laravel", "Web App"],
    title: "PSHT Data Management",
    desc: "Data storage and management web application built on Laravel.",
    link: "#",
  },
  {
    id: 11, hidden: true,
    bg: "linear-gradient(135deg, #0ea5e9, #0284c7)",
    img: "https://res.cloudinary.com/dmis60dxy/image/upload/v1777564910/portfolio8_kb51cu.png",
    alt: "Barenlitbang Info System",
    tags: ["Government", "Web App"],
    title: "Barenlitbang Info System",
    desc: "Malang City Information System for the Barenlitbang department.",
    link: "#",
  },
];

const CLIENTS = [
  { src: "https://res.cloudinary.com/dmis60dxy/image/upload/v1777565627/abimanyu_qipuf7.png", alt: "Abimanyu Travel" },
  { src: "https://res.cloudinary.com/dmis60dxy/image/upload/v1777565628/abimanyukoi_jkkge3.png", alt: "Abimanyu Koi" },
  { src: "https://res.cloudinary.com/dmis60dxy/image/upload/v1777565630/pertamina_a3zmnz.png", alt: "Pertamina" },
  { src: "https://res.cloudinary.com/dmis60dxy/image/upload/v1777565634/wikawh_empdg6.png", alt: "Wika Water Heater" },
  { src: "https://res.cloudinary.com/dmis60dxy/image/upload/v1777565628/beautiful_tzbfaj.png", alt: "Beautiful Malang" },
  { src: "https://res.cloudinary.com/dmis60dxy/image/upload/v1777565631/Seohost_medrir.png", alt: "SEO Webhosting" },
  { src: "https://res.cloudinary.com/dmis60dxy/image/upload/v1777565631/lambda_v4mrl1.png", alt: "Lambda Consulting" },
  { src: "https://res.cloudinary.com/dmis60dxy/image/upload/v1777565633/matahari_q8bifi.png", alt: "Meubel Matahari" },
  { src: "https://res.cloudinary.com/dmis60dxy/image/upload/v1777565634/suryabaru_juvm88.png", alt: "CV Surya Baru" },
];

// ─── GLOBAL CSS ──────────────────────────────────────────────────────────────

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; }

  :root {
    --green: #22c55e;
    --green-dark: #16a34a;
    --green-dim: rgba(34,197,94,0.12);
    --bg: #080c0e;
    --bg2: #0f1518;
    --bg3: #141c20;
    --card: rgba(255,255,255,0.04);
    --border: rgba(255,255,255,0.08);
    --text: #e8edf0;
    --muted: #7a8a92;
    --white: #ffffff;
    --nav-bg: rgba(8,12,14,0.9);
    --mob-menu-bg: rgba(8,12,14,0.97);
    --modal-bg: rgba(8,12,14,0.95);
    --noise-op: 0.5;
    --radius: 16px;
    --transition: 0.4s cubic-bezier(0.23,1,0.32,1);
  }

  body.light-mode {
    --bg: #ffffff;
    --bg2: #f8fafc;
    --bg3: #f1f5f9;
    --card: rgba(0,0,0,0.03);
    --border: rgba(0,0,0,0.08);
    --text: #334155;
    --muted: #64748b;
    --white: #0f172a;
    --nav-bg: rgba(255,255,255,0.9);
    --mob-menu-bg: rgba(255,255,255,0.97);
    --modal-bg: rgba(255,255,255,0.95);
    --noise-op: 0.15;
  }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: var(--text);
    line-height: 1.7;
    overflow-x: hidden;
    transition: background-color var(--transition), color var(--transition);
  }

  body::before {
    content: '';
    position: fixed;
    inset: 0;
    z-index: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    opacity: var(--noise-op);
    transition: opacity var(--transition);
  }

  #bg-canvas {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    opacity: 0.55;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    position: relative;
    z-index: 2;
  }

  section { position: relative; }

  .tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--green);
    margin-bottom: 16px;
  }
  .tag::before {
    content: '';
    display: block;
    width: 24px;
    height: 1px;
    background: var(--green);
  }

  h2.section-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 700;
    color: var(--white);
    line-height: 1.15;
  }

  /* NAVBAR */
  nav.navbar {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    padding: 0 32px;
    transition: background var(--transition), box-shadow var(--transition);
  }
  nav.navbar.scrolled {
    background: var(--nav-bg);
    backdrop-filter: blur(20px);
    box-shadow: 0 1px 0 var(--border);
  }
  .nav-inner {
    max-width: 1200px;
    margin: 0 auto;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .nav-logo {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 900;
    color: var(--white);
    text-decoration: none;
    letter-spacing: -0.02em;
  }
  .nav-logo span { color: var(--green); }
  .nav-links {
    display: flex;
    align-items: center;
    gap: 40px;
    list-style: none;
  }
  .nav-links a {
    font-size: 14px;
    font-weight: 500;
    color: var(--muted);
    text-decoration: none;
    transition: color 0.3s;
    position: relative;
  }
  .nav-links a::after {
    content: '';
    position: absolute;
    left: 0; bottom: -4px;
    width: 0; height: 1px;
    background: var(--green);
    transition: width 0.3s;
  }
  .nav-links a:hover { color: var(--white); }
  .nav-links a:hover::after { width: 100%; }
  .nav-cta {
    padding: 10px 24px;
    background: var(--green);
    color: #000 !important;
    border-radius: 100px;
    font-weight: 600 !important;
    font-size: 14px !important;
    text-decoration: none;
    transition: opacity 0.3s, transform 0.3s;
  }
  .nav-cta:hover { opacity: 0.85; transform: translateY(-1px); }
  .nav-cta::after { display: none !important; }
  @media (max-width: 900px) { .nav-cta { display: none !important; } }

  .nav-controls { display: flex; align-items: center; gap: 16px; }

  .theme-switch {
    background: none;
    border: none;
    color: var(--white);
    cursor: pointer;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background 0.3s, color 0.3s;
  }
  .theme-switch:hover { background: var(--card); color: var(--green); }
  .theme-switch svg { width: 20px; height: 20px; }

  .hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px;
  }
  .hamburger span {
    display: block;
    width: 24px; height: 2px;
    background: var(--white);
    border-radius: 2px;
    transition: var(--transition);
  }
  .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .hamburger.open span:nth-child(2) { opacity: 0; }
  .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

  .mobile-menu {
    display: none;
    position: fixed;
    inset: 72px 0 0 0;
    background: var(--mob-menu-bg);
    backdrop-filter: blur(24px);
    z-index: 99;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 36px;
    padding: 40px;
  }
  .mobile-menu.open { display: flex; }
  .mobile-menu a {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    font-weight: 700;
    color: var(--text);
    text-decoration: none;
    transition: color 0.3s;
  }
  .mobile-menu a:hover { color: var(--green); }

  /* HERO */
  #home {
    min-height: 100vh;
    display: flex;
    align-items: center;
    padding: 120px 0 80px;
  }
  .hero-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
  }
  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 16px 6px 6px;
    border: 1px solid var(--border);
    border-radius: 100px;
    background: var(--card);
    backdrop-filter: blur(12px);
    margin-bottom: 28px;
    font-size: 13px;
    color: var(--muted);
  }
  .hero-badge-dot {
    width: 24px; height: 24px;
    border-radius: 50%;
    background: var(--green-dim);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .hero-badge-dot::after {
    content: '';
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--green);
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.4); opacity: 0.6; }
  }
  .hero-name {
    font-family: 'Playfair Display', serif;
    font-size: clamp(3rem, 7vw, 5.5rem);
    font-weight: 900;
    line-height: 1.0;
    color: var(--white);
    letter-spacing: -0.03em;
    margin-bottom: 8px;
  }
  .hero-name .green { color: var(--green); }
  .hero-role {
    font-family: 'Space Mono', monospace;
    font-size: 14px;
    color: var(--green);
    letter-spacing: 0.1em;
    margin-bottom: 20px;
  }
  .hero-desc {
    font-size: 17px;
    color: var(--muted);
    max-width: 440px;
    margin-bottom: 40px;
    line-height: 1.75;
  }
  .hero-actions { display: flex; gap: 16px; flex-wrap: wrap; }
  .btn-primary {
    padding: 14px 32px;
    background: var(--green);
    color: #000;
    border-radius: 100px;
    font-weight: 700;
    font-size: 15px;
    text-decoration: none;
    transition: transform 0.3s, box-shadow 0.3s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(34,197,94,0.35); }
  .btn-outline {
    padding: 14px 32px;
    border: 1px solid var(--border);
    color: var(--text);
    border-radius: 100px;
    font-weight: 500;
    font-size: 15px;
    text-decoration: none;
    transition: border-color 0.3s, background 0.3s;
    background: var(--card);
    backdrop-filter: blur(12px);
  }
  .btn-outline:hover { border-color: var(--green); color: var(--green); }

  .hero-visual {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  .hero-avatar-ring {
    width: 380px; height: 380px;
    border-radius: 50%;
    border: 1px solid var(--green-dim);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    animation: rotateRing 12s linear infinite;
  }
  @keyframes rotateRing { to { transform: rotate(360deg); } }
  .hero-avatar-ring::before {
    content: '';
    position: absolute;
    inset: 20px;
    border-radius: 50%;
    border: 1px dashed rgba(34,197,94,0.2);
  }
  .hero-avatar-inner {
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle at 40% 35%, rgba(34,197,94,0.18), transparent 60%), var(--bg3);
    display: flex;
    align-items: center;
    justify-content: center;
    animation: rotateRing 12s linear infinite reverse;
    border: 1px solid var(--border);
    overflow: hidden;
  }
  .hero-avatar-inner img { width: 100%; height: 100%; object-fit: cover; }
  .orbit-dot {
    position: absolute;
    width: 10px; height: 10px;
    border-radius: 50%;
    background: var(--green);
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    box-shadow: 0 0 12px var(--green);
  }

  /* STATS */
  .stats-bar {
    padding: 48px 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    background: var(--bg2);
  }
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }
  .stat-item {
    text-align: center;
    padding: 20px;
    border-right: 1px solid var(--border);
  }
  .stat-item:last-child { border-right: none; }
  .stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 42px;
    font-weight: 900;
    color: var(--white);
    line-height: 1;
  }
  .stat-num span { color: var(--green); }
  .stat-label { font-size: 13px; color: var(--muted); margin-top: 6px; letter-spacing: 0.05em; }

  /* ABOUT */
  #about { padding: 120px 0; background: var(--bg); }
  .about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
  }
  .about-left h2 { margin-bottom: 24px; }
  .about-left p { font-size: 17px; color: var(--muted); line-height: 1.8; margin-bottom: 20px; }
  .social-links { display: flex; gap: 12px; margin-top: 36px; flex-wrap: wrap; }
  .social-btn {
    width: 44px; height: 44px;
    border-radius: 12px;
    border: 1px solid var(--border);
    background: var(--card);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--muted);
    text-decoration: none;
    transition: border-color 0.3s, color 0.3s, background 0.3s, transform 0.3s;
  }
  .social-btn:hover {
    border-color: var(--green);
    color: var(--green);
    background: var(--green-dim);
    transform: translateY(-3px);
  }
  .experience-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 32px;
    backdrop-filter: blur(20px);
    margin-bottom: 20px;
    transition: border-color var(--transition), transform var(--transition);
  }
  .experience-card:hover { border-color: rgba(34,197,94,0.3); transform: translateX(6px); }
  .exp-year { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--green); letter-spacing: 0.15em; margin-bottom: 8px; }
  .exp-title { font-size: 16px; font-weight: 600; color: var(--white); margin-bottom: 6px; }
  .exp-desc { font-size: 14px; color: var(--muted); }

  /* PORTFOLIO */
  #portfolio { padding: 120px 0; background: var(--bg2); }
  .portfolio-header { margin-bottom: 64px; }
  .portfolio-header h2 { margin-bottom: 12px; }
  .portfolio-header p { color: var(--muted); font-size: 16px; }
  .portfolio-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
  .portfolio-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    transition: border-color var(--transition), transform var(--transition), box-shadow var(--transition);
    cursor: pointer;
    display: flex;
    flex-direction: column;
  }
  .portfolio-card:hover {
    border-color: rgba(34,197,94,0.4);
    transform: translateY(-6px);
    box-shadow: 0 24px 60px rgba(0,0,0,0.4);
  }
  .portfolio-card.featured {
    grid-column: span 2;
    grid-row: span 2;
  }
  .portfolio-card.featured .port-thumb {
    height: 100%;
    aspect-ratio: auto;
  }
  .port-thumb {
    width: 100%;
    aspect-ratio: 16/9;
    background: var(--bg3);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }
  .port-thumb-bg {
    position: absolute;
    inset: 0;
    opacity: 0.15;
    transition: opacity 0.4s;
  }
  .portfolio-card:hover .port-thumb-bg { opacity: 0.25; }
  .port-emoji {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
  }
  .port-emoji img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
    cursor: zoom-in;
  }
  .port-body {
    padding: 24px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
  .port-tags { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
  .port-tag {
    padding: 3px 10px;
    background: var(--green-dim);
    color: var(--green);
    border-radius: 100px;
    font-size: 11px;
    font-family: 'Space Mono', monospace;
    letter-spacing: 0.05em;
  }
  .port-title { font-size: 16px; font-weight: 600; color: var(--white); margin-bottom: 6px; }
  .port-desc { font-size: 13px; color: var(--muted); }
  .port-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-top: auto;
    padding-top: 12px;
    font-size: 13px;
    color: var(--green);
    font-weight: 600;
    text-decoration: none;
    opacity: 0;
    transform: translateY(4px);
    transition: opacity 0.3s, transform 0.3s;
  }
  .portfolio-card:hover .port-link { opacity: 1; transform: translateY(0); }
  .load-more-container { display: flex; justify-content: center; margin-top: 48px; width: 100%; }
  .btn-load {
    padding: 14px 32px;
    border: 1px solid var(--border);
    color: var(--text);
    border-radius: 100px;
    font-weight: 500;
    font-size: 15px;
    cursor: pointer;
    transition: border-color 0.3s, background 0.3s, color 0.3s;
    background: var(--card);
    backdrop-filter: blur(12px);
    font-family: 'DM Sans', sans-serif;
  }
  .btn-load:hover { border-color: var(--green); color: var(--green); }

  /* SKILLS */
  #skills { padding: 120px 0; background: var(--bg); }
  .skills-header { text-align: center; margin-bottom: 64px; }
  .skills-header p { font-size: 16px; color: var(--muted); max-width: 520px; margin: 16px auto 0; }
  .skills-accordion-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    align-items: start;
  }
  .skill-group {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    transition: border-color 0.3s;
  }
  .skill-group:hover { border-color: rgba(34,197,94,0.25); }
  .skill-group-header {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 20px 24px;
    cursor: pointer;
    user-select: none;
    transition: background 0.25s;
  }
  .skill-group-header:hover { background: var(--green-dim); }
  .skill-group-icon {
    width: 42px; height: 42px;
    border-radius: 10px;
    background: var(--green-dim);
    border: 1px solid rgba(34,197,94,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }
  .skill-group-meta { flex: 1; min-width: 0; }
  .skill-group-name { font-size: 15px; font-weight: 600; color: var(--white); line-height: 1.2; }
  .skill-group-sub { font-size: 12px; color: var(--muted); margin-top: 2px; font-family: 'Space Mono', monospace; letter-spacing: 0.04em; }
  .skill-group-chevron {
    width: 28px; height: 28px;
    border-radius: 50%;
    border: 1px solid var(--border);
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 0.25s, transform 0.35s, border-color 0.25s;
    color: var(--muted);
  }
  .skill-group.open .skill-group-chevron {
    transform: rotate(180deg);
    background: var(--green-dim);
    border-color: rgba(34,197,94,0.35);
    color: var(--green);
  }
  .skill-group-chevron svg { width: 14px; height: 14px; stroke: currentColor; }
  .skill-group-body {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.45s cubic-bezier(0.23,1,0.32,1);
  }
  .skill-group.open .skill-group-body { max-height: 800px; }
  .skill-group-inner {
    padding: 4px 24px 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    border-top: 1px solid var(--border);
  }
  .skill-row { display: flex; flex-direction: column; gap: 6px; }
  .skill-row-top { display: flex; justify-content: space-between; align-items: center; }
  .skill-row-name {
    font-size: 13px; font-weight: 500;
    color: var(--text);
    display: flex; align-items: center; gap: 7px;
  }
  .skill-row-pct { font-family: 'Space Mono', monospace; font-size: 12px; color: var(--green); font-weight: 700; }
  .skill-bar-track { width: 100%; height: 4px; background: var(--border); border-radius: 99px; overflow: hidden; }
  .skill-bar-fill {
    height: 100%;
    border-radius: 99px;
    background: linear-gradient(90deg, var(--green-dark), var(--green));
    transition: width 0.9s cubic-bezier(0.23,1,0.32,1);
  }

  /* CLIENTS */
  #clients { padding: 120px 0; background: var(--bg2); overflow: hidden; }
  .clients-header { text-align: center; margin-bottom: 60px; }
  .clients-header h2 { margin-bottom: 12px; }
  .clients-header p { color: var(--muted); font-size: 16px; }
  .marquee-wrap { overflow: hidden; }
  .marquee-track {
    display: flex;
    gap: 24px;
    animation: marquee 22s linear infinite;
    width: max-content;
  }
  .marquee-track:hover { animation-play-state: paused; }
  @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-33.333%); } }
  .client-card {
    flex-shrink: 0;
    padding: 0 40px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.3s;
    height: 100px;
    min-width: 220px;
  }
  .client-card:hover { border-color: rgba(34,197,94,0.3); }
  .client-logo {
    max-width: 140px;
    max-height: 45px;
    object-fit: contain;
    filter: grayscale(100%) opacity(0.6);
    transition: filter 0.4s ease, transform 0.4s ease;
  }
  .client-card:hover .client-logo { filter: grayscale(0%) opacity(1); transform: scale(1.05); }

  /* CONTACT */
  #contact { padding: 120px 0; background: var(--bg); }
  .contact-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: start;
  }
  .contact-left h2 { margin-bottom: 20px; }
  .contact-left p { font-size: 17px; color: var(--muted); line-height: 1.8; margin-bottom: 40px; }
  .contact-info-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 0;
    border-bottom: 1px solid var(--border);
  }
  .contact-info-icon {
    width: 40px; height: 40px;
    border-radius: 10px;
    background: var(--green-dim);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }
  .contact-info-label { font-size: 12px; color: var(--muted); letter-spacing: 0.08em; }
  .contact-info-val { font-size: 15px; color: var(--white); font-weight: 500; margin-top: 2px; }
  .contact-form { display: flex; flex-direction: column; gap: 20px; }
  .form-group { display: flex; flex-direction: column; gap: 8px; }
  .form-label { font-size: 13px; font-weight: 600; color: var(--text); letter-spacing: 0.05em; }
  .form-input, .form-textarea {
    width: 100%;
    padding: 14px 18px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    outline: none;
    transition: border-color 0.3s, box-shadow 0.3s;
    backdrop-filter: blur(12px);
  }
  .form-input:focus, .form-textarea:focus {
    border-color: var(--green);
    box-shadow: 0 0 0 3px rgba(34,197,94,0.12);
  }
  .form-textarea { height: 140px; resize: vertical; }
  .form-input::placeholder, .form-textarea::placeholder { color: var(--muted); }
  .btn-send {
    padding: 16px 36px;
    background: var(--green);
    color: #000;
    border: none;
    border-radius: 100px;
    font-weight: 700;
    font-size: 15px;
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s, opacity 0.3s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: 'DM Sans', sans-serif;
  }
  .btn-send:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(34,197,94,0.35); }
  .btn-send:active { transform: translateY(0); opacity: 0.85; }
  .form-success {
    padding: 16px 20px;
    background: rgba(34,197,94,0.1);
    border: 1px solid rgba(34,197,94,0.3);
    border-radius: 12px;
    color: var(--green);
    font-size: 14px;
    font-weight: 500;
  }

  /* FOOTER */
  footer {
    background: var(--bg2);
    border-top: 1px solid var(--border);
    padding: 40px 0;
    position: relative;
    z-index: 2;
  }
  .footer-inner { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
  .footer-logo { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; color: var(--white); text-decoration: none; }
  .footer-logo span { color: var(--green); }
  .footer-copy { font-size: 13px; color: var(--muted); }
  .footer-copy a { color: var(--green); text-decoration: none; }

  /* BACK TO TOP */
  #back-top {
    position: fixed;
    bottom: 32px; right: 32px;
    width: 48px; height: 48px;
    background: var(--green);
    color: #000;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    text-decoration: none;
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.4s, transform 0.4s;
    z-index: 99;
    box-shadow: 0 8px 24px rgba(34,197,94,0.3);
    pointer-events: none;
  }
  #back-top.show { opacity: 1; transform: translateY(0); pointer-events: auto; }
  #back-top:hover { box-shadow: 0 12px 36px rgba(34,197,94,0.5); }

  /* IMAGE MODAL */
  .image-modal {
    display: none;
    position: fixed;
    z-index: 99999;
    left: 0; top: 0;
    width: 100%; height: 100%;
    background-color: var(--modal-bg);
    backdrop-filter: blur(10px);
    opacity: 0;
    transition: opacity 0.3s ease;
    align-items: center;
    justify-content: center;
  }
  .image-modal.show { display: flex; opacity: 1; }
  .modal-content {
    max-width: 90%;
    max-height: 90vh;
    object-fit: contain;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    transform: scale(0.95);
    transition: transform 0.3s cubic-bezier(0.23,1,0.32,1);
  }
  .image-modal.show .modal-content { transform: scale(1); }
  .close-modal {
    position: absolute;
    top: 24px; right: 32px;
    color: var(--muted);
    font-size: 40px;
    font-weight: 300;
    cursor: pointer;
    transition: color 0.3s, transform 0.3s;
    line-height: 1;
    background: none;
    border: none;
  }
  .close-modal:hover { color: var(--green); transform: scale(1.1); }

  /* SCROLL REVEAL */
  .reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.7s cubic-bezier(0.23,1,0.32,1), transform 0.7s cubic-bezier(0.23,1,0.32,1);
  }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  .reveal-delay-1 { transition-delay: 0.1s; }
  .reveal-delay-2 { transition-delay: 0.2s; }
  .reveal-delay-3 { transition-delay: 0.3s; }

  /* RESPONSIVE */
  @media (max-width: 900px) {
    .hero-grid { grid-template-columns: 1fr; text-align: center; }
    .hero-desc { margin: 0 auto 32px; }
    .hero-actions { justify-content: center; }
    .hero-visual { margin-top: 40px; }
    .hero-avatar-ring { width: 280px; height: 280px; }
    .hero-avatar-inner { width: 220px; height: 220px; }
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .stat-item:nth-child(2) { border-right: none; }
    .about-grid { grid-template-columns: 1fr; gap: 48px; }
    .portfolio-grid { grid-template-columns: 1fr; }
    .portfolio-card.featured { grid-column: span 1; grid-row: span 1; }
    .portfolio-card.featured .port-thumb { aspect-ratio: 16/9; height: auto; }
    .contact-grid { grid-template-columns: 1fr; gap: 48px; }
    .nav-links { display: none; }
    .hamburger { display: flex; }
    .skills-accordion-grid { grid-template-columns: 1fr; }
  }

  @media (max-width: 540px) {
    .stats-grid { grid-template-columns: 1fr 1fr; }
    .portfolio-grid { grid-template-columns: 1fr; }
  }
`;

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function BgCanvas() {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W, H, particles = [];

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.r = Math.random() * 1.5 + 0.4;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.life = Math.random();
        this.maxLife = Math.random() * 0.006 + 0.002;
        this.growing = true;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.growing) {
          this.life += this.maxLife;
          if (this.life >= 1) this.growing = false;
        } else {
          this.life -= this.maxLife;
          if (this.life <= 0) this.reset();
        }
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.life * 0.5;
        ctx.fillStyle = "rgba(34,197,94,1)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < 120; i++) particles.push(new Particle());

    const orbs = [
      { x: 0.15, y: 0.2, r: 300, c: "rgba(34,197,94,0.08)" },
      { x: 0.85, y: 0.7, r: 250, c: "rgba(34,197,94,0.06)" },
      { x: 0.5,  y: 0.5, r: 200, c: "rgba(34,197,94,0.04)" },
    ];

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      orbs.forEach((o) => {
        const g = ctx.createRadialGradient(o.x * W, o.y * H, 0, o.x * W, o.y * H, o.r);
        g.addColorStop(0, o.c);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(o.x * W, o.y * H, o.r, 0, Math.PI * 2);
        ctx.fill();
      });
      particles.forEach((p) => { p.update(); p.draw(); });
      animFrameRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} id="bg-canvas" />;
}

function Navbar({ isDark, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.style.overflow = "";
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => {
      document.body.style.overflow = !prev ? "hidden" : "";
      return !prev;
    });
  };

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#portfolio", label: "Portfolio" },
    { href: "#skills", label: "Skills" },
    { href: "#clients", label: "Clients" },
    { href: "resume/resume.pdf", label: "Resume", target: "_blank" },
  ];

  return (
    <>
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        <div className="nav-inner">
          <a href="#home" className="nav-logo">Gigih<span>Ling</span></a>
          <ul className="nav-links">
            {navLinks.map((l) => (
              <li key={l.label}>
                <a href={l.href} target={l.target}>{l.label}</a>
              </li>
            ))}
          </ul>
          <div className="nav-controls">
            <button className="theme-switch" onClick={toggleTheme} aria-label="Toggle Theme">
              {isDark ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
            <a href="#contact" className="nav-cta">Contact Me</a>
            <button className={`hamburger${menuOpen ? " open" : ""}`} onClick={toggleMenu} aria-label="Menu">
              <span/><span/><span/>
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        {[...navLinks, { href: "#contact", label: "Contact" }].map((l) => (
          <a key={l.label} href={l.href} target={l.target} onClick={closeMenu}>{l.label}</a>
        ))}
      </div>
    </>
  );
}

function Hero() {
  return (
    <section id="home">
      <div className="container">
        <div className="hero-grid">
          <div>
            <div className="hero-badge reveal">
              <div className="hero-badge-dot" />
              Available for new projects
            </div>
            <p className="hero-role reveal reveal-delay-1">SEO Specialist &amp; Web Designer</p>
            <h1 className="hero-name reveal reveal-delay-1">
              Hello, I'm<br /><span className="green">Gigih Ling</span>
            </h1>
            <p className="hero-desc reveal reveal-delay-2">
              I bring boring ads to life and craft digital experiences that resonate.
              Specializing in SEO, web design, and digital marketing.
            </p>
            <div className="hero-actions reveal reveal-delay-3">
              <a href="https://t.me/LingLtd" target="_blank" className="btn-primary" rel="noreferrer">
                Get in Touch
              </a>
              <a href="#portfolio" className="btn-outline">View Work</a>
            </div>
          </div>
          <div className="hero-visual reveal reveal-delay-2">
            <div className="hero-avatar-ring">
              <div className="orbit-dot" />
              <div className="hero-avatar-inner">
                <img src="https://res.cloudinary.com/dmis60dxy/image/upload/v1777565586/meling_uqultt.png" alt="Gigih Ling" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  const stats = [
    { num: "5", suffix: "+", label: "Years Experience" },
    { num: "9", suffix: "+", label: "Clients Served" },
    { num: "11", suffix: "+", label: "Projects Done" },
    { num: "30", suffix: "+", label: "Tech Skills" },
  ];
  return (
    <div className="stats-bar">
      <div className="container">
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div key={s.label} className={`stat-item reveal${i ? ` reveal-delay-${i}` : ""}`}>
              <div className="stat-num">{s.num}<span>{s.suffix}</span></div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function About() {
  const socials = [
    {
      href: "https://www.youtube.com/@whatever-inc", title: "YouTube",
      icon: <svg width="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
    },
    {
      href: "https://www.instagram.com/gigih_id/", title: "Instagram",
      icon: <svg width="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/></svg>,
    },
    {
      href: "https://www.linkedin.com/in/gigih-wijaya-5b645118b/", title: "LinkedIn",
      icon: <svg width="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
    },
    {
      href: "https://github.com/bladphoenix/", title: "GitHub",
      icon: <svg width="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>,
    },
    {
      href: "https://maps.app.goo.gl/AQe1npft45eibBY67", title: "Location",
      icon: <svg width="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>,
    },
  ];

  const experiences = [
    { year: "2020 — PRESENT", title: "SEO Specialist & Digital Marketer", desc: "Google Ads, Meta Pixel, Analytics, Search Console, Ahrefs — full-stack SEO strategy and execution." },
    { year: "2019 — PRESENT", title: "Full-Stack Web Developer", desc: "Building with Laravel, React, Next.js, Node.js and deploying on DigitalOcean, Tencent Cloud, Cloudflare." },
    { year: "2018 — PRESENT", title: "UI/UX & Graphic Designer", desc: "Figma, Adobe Illustrator, Photoshop, Canva — from wireframe to pixel-perfect production." },
  ];

  return (
    <section id="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-left">
            <div className="tag reveal">About Me</div>
            <h2 className="section-title reveal reveal-delay-1">Welcome to the world of SEO</h2>
            <p className="reveal reveal-delay-2">
              Search Engine Optimization is not just an acronym — it's a craft. I combine technical SEO
              expertise with creative web design to help businesses stand out in the digital landscape.
            </p>
            <p className="reveal reveal-delay-2">
              Based in Malang, Indonesia. Open to remote collaborations worldwide. Let's build something great together.
            </p>
            <div className="social-links reveal reveal-delay-3">
              {socials.map((s) => (
                <a key={s.title} href={s.href} target="_blank" rel="noreferrer" className="social-btn" title={s.title}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
          <div className="about-right">
            {experiences.map((e, i) => (
              <div key={e.year} className={`experience-card reveal${i ? ` reveal-delay-${i}` : ""}`}>
                <div className="exp-year">{e.year}</div>
                <div className="exp-title">{e.title}</div>
                <div className="exp-desc">{e.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PortfolioSection({ onImageClick }) {
  const [showAll, setShowAll] = useState(false);
  const visibleItems = showAll ? PORTFOLIO_ITEMS : PORTFOLIO_ITEMS.filter((p) => !p.hidden);

  return (
    <section id="portfolio">
      <div className="container">
        <div className="portfolio-header reveal">
          <div className="tag">Portfolio</div>
          <h2 className="section-title">Latest Projects</h2>
          <p>Revolutionizing collaboration in the digital workspace.</p>
        </div>
        <div className="portfolio-grid">
          {visibleItems.map((p) => (
            <div key={p.id} className={`portfolio-card reveal${p.featured ? " featured" : ""}`}>
              <div className="port-thumb">
                <div className="port-thumb-bg" style={{ background: p.bg }} />
                <div className="port-emoji">
                  <img src={p.img} alt={p.alt} onClick={() => onImageClick(p.img)} />
                </div>
              </div>
              <div className="port-body">
                <div className="port-tags">
                  {p.tags.map((t) => <span key={t} className="port-tag">{t}</span>)}
                </div>
                <div className="port-title">{p.title}</div>
                <div className="port-desc">{p.desc}</div>
                <a href={p.link} target={p.link !== "#" ? "_blank" : undefined} rel="noreferrer" className="port-link">
                  View Project →
                </a>
              </div>
            </div>
          ))}
        </div>
        {!showAll && (
          <div className="load-more-container reveal">
            <button className="btn-load" onClick={() => setShowAll(true)}>
              Load More Projects ↓
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function SkillBar({ pct, isOpen }) {
  const [width, setWidth] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    clearTimeout(timerRef.current);
    if (isOpen) {
      setWidth(0);
      timerRef.current = setTimeout(() => setWidth(pct), 100);
    } else {
      setWidth(0);
    }
    return () => clearTimeout(timerRef.current);
  }, [isOpen, pct]);

  return (
    <div className="skill-bar-track">
      <div className="skill-bar-fill" style={{ width: `${width}%` }} />
    </div>
  );
}

function Skills() {
  const [openGroup, setOpenGroup] = useState(0);

  const toggle = (i) => setOpenGroup((prev) => (prev === i ? -1 : i));

  return (
    <section id="skills">
      <div className="container">
        <div className="skills-header reveal">
          <div className="tag">Tech Skills</div>
          <h2 className="section-title">Programming, Design &amp; SEO Tools</h2>
          <p>A full arsenal of modern tools and technologies to bring any vision to life.</p>
        </div>
        <div className="skills-accordion-grid reveal">
          {SKILL_GROUPS.map((g, gi) => {
            const isOpen = openGroup === gi;
            return (
              <div key={g.id} className={`skill-group${isOpen ? " open" : ""}`}>
                <div className="skill-group-header" onClick={() => toggle(gi)}>
                  <div className="skill-group-icon">{g.icon}</div>
                  <div className="skill-group-meta">
                    <div className="skill-group-name">{g.name}</div>
                    <div className="skill-group-sub">{g.sub}</div>
                  </div>
                  <div className="skill-group-chevron">
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>
                <div className="skill-group-body">
                  <div className="skill-group-inner">
                    {g.skills.map((s) => (
                      <div key={s.name} className="skill-row">
                        <div className="skill-row-top">
                          <span className="skill-row-name"><span className="s-icon">{s.icon}</span>{s.name}</span>
                          <span className="skill-row-pct">{s.pct}%</span>
                        </div>
                        <SkillBar pct={s.pct} isOpen={isOpen} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Clients() {
  const tripled = [...CLIENTS, ...CLIENTS, ...CLIENTS];
  return (
    <section id="clients">
      <div className="container">
        <div className="clients-header reveal">
          <div className="tag">Clients</div>
          <h2 className="section-title">Companies That Went Beyond Their Goals</h2>
          <p>Trusted by local businesses and national brands across Indonesia.</p>
        </div>
      </div>
      <div className="marquee-wrap reveal">
        <div className="marquee-track">
          {tripled.map((c, i) => (
            <div key={i} className="client-card">
              <img src={c.src} alt={c.alt} className="client-logo" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch("https://formsubmit.co/ajax/gigih124ik3@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...form, _captcha: "false" }),
      });
      setSent(true);
      setForm({ name: "", email: "", message: "" });
    } catch (_) {
      setSent(true);
    }
  };

  return (
    <section id="contact">
      <div className="container">
        <div className="contact-grid">
          <div className="contact-left">
            <div className="tag reveal">Contact</div>
            <h2 className="section-title reveal reveal-delay-1">Let's Work Together</h2>
            <p className="reveal reveal-delay-2">
              Have a project in mind or just want to say hello? I'd love to hear from you. Let's create something amazing.
            </p>
            <div className="reveal reveal-delay-2">
              <div className="contact-info-item">
                <div className="contact-info-icon">💬</div>
                <div>
                  <div className="contact-info-label">TELEGRAM</div>
                  <div className="contact-info-val">@LingLtd</div>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-icon">📍</div>
                <div>
                  <div className="contact-info-label">LOCATION</div>
                  <div className="contact-info-val">Taman Sari, West Jakarta City, Indonesia</div>
                </div>
              </div>
            </div>
          </div>

          <div className="reveal reveal-delay-1">
            {sent ? (
              <div className="form-success">
                ✅ Message sent! I'll get back to you soon.
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">NAME</label>
                  <input type="text" name="name" className="form-input" placeholder="Your full name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">EMAIL</label>
                  <input type="email" name="email" className="form-input" placeholder="your@email.com" value={form.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">MESSAGE</label>
                  <textarea name="message" className="form-textarea" placeholder="Tell me about your project..." value={form.message} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn-send">Send Message</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ImageModal({ src, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = src ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [src]);

  if (!src) return null;

  return (
    <div className={`image-modal${src ? " show" : ""}`} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <button className="close-modal" onClick={onClose}>×</button>
      <img className="modal-content" src={src} alt="Portfolio Full View" />
    </div>
  );
}

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a href="#home" id="back-top" className={show ? "show" : ""}>↑</a>
  );
}

// ─── SCROLL REVEAL HOOK ──────────────────────────────────────────────────────

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    const observe = () => {
      document.querySelectorAll(".reveal:not(.visible)").forEach((el) => observer.observe(el));
    };

    observe();
    // Re-observe after DOM changes (load more, etc.)
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => { observer.disconnect(); mo.disconnect(); };
  }, []);
}

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function Portfolio() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") !== "light");
  const [modalSrc, setModalSrc] = useState(null);

  useScrollReveal();

  useEffect(() => {
    if (isDark) {
      document.body.classList.remove("light-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.add("light-mode");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = useCallback(() => setIsDark((p) => !p), []);
  const openModal = useCallback((src) => setModalSrc(src), []);
  const closeModal = useCallback(() => setModalSrc(null), []);

  return (
    <>
      <style>{CSS}</style>
      <BgCanvas />
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />
      <Hero />
      <StatsBar />
      <About />
      <PortfolioSection onImageClick={openModal} />
      <Skills />
      <Clients />
      <Contact />
      <footer>
        <div className="container">
          <div className="footer-inner">
            <a href="#home" className="footer-logo">Gigih<span>Ling</span></a>
            <p className="footer-copy">
              © 2024 Gigihling — Built with ♥ using{" "}
              <a href="https://react.dev" target="_blank" rel="noreferrer">React</a>
            </p>
          </div>
        </div>
      </footer>
      <BackToTop />
      <ImageModal src={modalSrc} onClose={closeModal} />
    </>
  );
}
