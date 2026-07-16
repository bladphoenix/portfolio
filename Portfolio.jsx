import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";
import { SKILL_GROUPS, PORTFOLIO_ITEMS, CLIENTS, TAG_LABELS, cld } from "./src/data.js";
import { UI } from "./src/i18n.js";

// localStorage can throw (blocked cookies / private mode); fall back gracefully.
const storage = {
  get(k) { try { return window.localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { window.localStorage.setItem(k, v); } catch { /* storage blocked */ } },
};

// ─── LANGUAGE ────────────────────────────────────────────────────────────────

const LangContext = createContext(null);
const useLang = () => useContext(LangContext);

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

    const drawOrbs = () => {
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
    };

    const draw = () => {
      drawOrbs();
      particles.forEach((p) => { p.update(); p.draw(); });
      animFrameRef.current = requestAnimationFrame(draw);
    };

    // Respect reduced-motion (static frame only) and pause the loop while
    // the tab is hidden so the animation never burns CPU in the background.
    // The media query is watched live so an OS-level toggle applies without a reload.
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");

    const onVisibility = () => {
      cancelAnimationFrame(animFrameRef.current);
      if (!document.hidden) draw();
    };

    const stopMode = () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", drawOrbs);
      document.removeEventListener("visibilitychange", onVisibility);
    };

    const startMode = () => {
      stopMode();
      if (mql.matches) {
        drawOrbs();
        window.addEventListener("resize", drawOrbs);
      } else {
        draw();
        document.addEventListener("visibilitychange", onVisibility);
      }
    };

    startMode();
    mql.addEventListener("change", startMode);

    return () => {
      window.removeEventListener("resize", resize);
      mql.removeEventListener("change", startMode);
      stopMode();
    };
  }, []);

  return <canvas ref={canvasRef} id="bg-canvas" />;
}

function Navbar({ isDark, toggleTheme }) {
  const { t, lang, setLang } = useLang();
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
    { href: "#home", label: t.nav.home },
    { href: "#about", label: t.nav.about },
    { href: "#portfolio", label: t.nav.portfolio },
    { href: "#skills", label: t.nav.skills },
    { href: "#clients", label: t.nav.clients },
    { href: "resume/resume.pdf", label: t.nav.resume, target: "_blank" },
  ];

  return (
    <>
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        <div className="nav-inner">
          <a href="#home" className="nav-logo">Gigih<span>Ling</span></a>
          <ul className="nav-links">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} target={l.target} rel={l.target ? "noreferrer" : undefined}>{l.label}</a>
              </li>
            ))}
          </ul>
          <div className="nav-controls">
            <button
              className="lang-switch"
              onClick={() => setLang(lang === "en" ? "id" : "en")}
              aria-label={t.a11y.langSwitch}
              lang={lang === "en" ? "id" : "en"}
            >
              {lang === "en" ? "ID" : "EN"}
            </button>
            <button className="theme-switch" onClick={toggleTheme} aria-label={isDark ? t.a11y.themeToLight : t.a11y.themeToDark}>
              {isDark ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
            <a href="#contact" className="nav-cta">{t.nav.contactCta}</a>
            <button
              className={`hamburger${menuOpen ? " open" : ""}`}
              onClick={toggleMenu}
              aria-label={t.a11y.toggleNav}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <span/><span/><span/>
            </button>
          </div>
        </div>
      </nav>

      <div id="mobile-menu" className={`mobile-menu${menuOpen ? " open" : ""}`}>
        {[...navLinks, { href: "#contact", label: t.nav.contact }].map((l) => (
          <a key={l.href} href={l.href} target={l.target} rel={l.target ? "noreferrer" : undefined} onClick={closeMenu}>{l.label}</a>
        ))}
      </div>
    </>
  );
}

function Hero() {
  const { t } = useLang();
  return (
    <section id="home">
      <div className="container">
        <div className="hero-grid">
          <div>
            <div className="hero-badge reveal">
              <div className="hero-badge-dot" />
              {t.hero.badge}
            </div>
            <p className="hero-role reveal reveal-delay-1">{t.hero.role}</p>
            <h1 className="hero-name reveal reveal-delay-1">
              {t.hero.greeting}<br /><span className="green">Gigih Ling</span>
            </h1>
            <p className="hero-desc reveal reveal-delay-2">
              {t.hero.desc}
            </p>
            <div className="hero-actions reveal reveal-delay-3">
              <a href="https://t.me/LingLtd" target="_blank" className="btn-primary" rel="noreferrer">
                {t.hero.ctaPrimary}
              </a>
              <a href="#portfolio" className="btn-outline">{t.hero.ctaSecondary}</a>
            </div>
          </div>
          <div className="hero-visual reveal reveal-delay-2">
            <div className="hero-avatar-ring">
              <div className="orbit-dot" />
              <div className="hero-avatar-inner">
                <img
                  src={cld("https://res.cloudinary.com/dmis60dxy/image/upload/v1777565586/meling_uqultt.png", 640)}
                  alt="Gigih Ling"
                  width="300"
                  height="300"
                  fetchpriority="high"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  const { t } = useLang();
  const stats = [
    { num: "5", suffix: "+", label: t.stats.years },
    { num: "9", suffix: "+", label: t.stats.clients },
    { num: "11", suffix: "+", label: t.stats.projects },
    { num: "30", suffix: "+", label: t.stats.skills },
  ];
  return (
    <div className="stats-bar">
      <div className="container">
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div key={i} className={`stat-item reveal${i ? ` reveal-delay-${i}` : ""}`}>
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
  const { t } = useLang();
  const socials = [
    {
      href: "https://www.youtube.com/@whatever-inc", title: "YouTube",
      icon: <svg width="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
    },
    {
      href: "https://www.instagram.com/gigih_id/", title: "Instagram",
      icon: <svg width="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/></svg>,
    },
    {
      href: "https://www.linkedin.com/in/gigih-wijaya-5b645118b/", title: "LinkedIn",
      icon: <svg width="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
    },
    {
      href: "https://github.com/bladphoenix/", title: "GitHub",
      icon: <svg width="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>,
    },
    {
      href: "https://maps.app.goo.gl/AQe1npft45eibBY67", title: t.a11y.location,
      icon: <svg width="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>,
    },
  ];

  return (
    <section id="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-left">
            <div className="tag reveal">{t.about.tag}</div>
            <h2 className="section-title reveal reveal-delay-1">{t.about.title}</h2>
            <p className="reveal reveal-delay-2">
              {t.about.p1}
            </p>
            <p className="reveal reveal-delay-2">
              {t.about.p2}
            </p>
            <div className="social-links reveal reveal-delay-3">
              {socials.map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noreferrer" className="social-btn" title={s.title} aria-label={s.title}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
          <div className="about-right">
            {t.about.experiences.map((e, i) => (
              <div key={i} className={`experience-card reveal${i ? ` reveal-delay-${i}` : ""}`}>
                <div className="exp-year">{e.year}</div>
                <h3 className="exp-title">{e.title}</h3>
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
  const { t, lang } = useLang();
  const [showAll, setShowAll] = useState(false);
  const visibleItems = showAll ? PORTFOLIO_ITEMS : PORTFOLIO_ITEMS.filter((p) => !p.hidden);

  return (
    <section id="portfolio">
      <div className="container">
        <div className="portfolio-header reveal">
          <div className="tag">{t.portfolio.tag}</div>
          <h2 className="section-title">{t.portfolio.title}</h2>
          <p>{t.portfolio.subtitle}</p>
        </div>
        <div className="portfolio-grid">
          {visibleItems.map((p) => (
            <div key={p.id} className={`portfolio-card reveal${p.featured ? " featured" : ""}`}>
              <div className="port-thumb">
                <div className="port-thumb-bg" style={{ background: p.bg }} />
                <div className="port-emoji">
                  <button
                    type="button"
                    className="port-zoom"
                    onClick={() => onImageClick(p.img)}
                    aria-label={t.portfolio.zoomAria.replace("{title}", p.title)}
                  >
                    <img src={cld(p.img, 800)} alt={p.alt} width="800" height="450" loading="lazy" decoding="async" />
                  </button>
                </div>
              </div>
              <div className="port-body">
                <div className="port-tags">
                  {p.tags.map((tag) => (
                    <span key={tag} className="port-tag">{TAG_LABELS[tag]?.[lang] ?? tag}</span>
                  ))}
                </div>
                <h3 className="port-title">{p.title}</h3>
                <div className="port-desc">{p.desc[lang]}</div>
                {p.link && p.link !== "#" && (
                  <a href={p.link} target="_blank" rel="noreferrer" className="port-link">
                    {t.portfolio.view}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        {!showAll && (
          <div className="load-more-container reveal">
            <button className="btn-load" onClick={() => setShowAll(true)}>
              {t.portfolio.loadMore}
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
  const { t, lang } = useLang();
  const [openGroup, setOpenGroup] = useState(0);

  const toggle = (i) => setOpenGroup((prev) => (prev === i ? -1 : i));

  return (
    <section id="skills">
      <div className="container">
        <div className="skills-header reveal">
          <div className="tag">{t.skills.tag}</div>
          <h2 className="section-title">{t.skills.title}</h2>
          <p>{t.skills.subtitle}</p>
        </div>
        <div className="skills-accordion-grid reveal">
          {SKILL_GROUPS.map((g, gi) => {
            const isOpen = openGroup === gi;
            return (
              <div key={g.id} className={`skill-group${isOpen ? " open" : ""}`}>
                <h3 className="skill-group-heading">
                  <button
                    type="button"
                    id={`skill-header-${g.id}`}
                    className="skill-group-header"
                    aria-expanded={isOpen}
                    aria-controls={`skill-panel-${g.id}`}
                    onClick={() => toggle(gi)}
                  >
                    <span className="skill-group-icon">{g.icon}</span>
                    <span className="skill-group-meta">
                      <span className="skill-group-name">{g.name[lang]}</span>
                      <span className="skill-group-sub">{g.sub[lang]}</span>
                    </span>
                    <span className="skill-group-chevron">
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </button>
                </h3>
                <div id={`skill-panel-${g.id}`} role="region" aria-labelledby={`skill-header-${g.id}`} className="skill-group-body">
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
  const { t } = useLang();
  const [paused, setPaused] = useState(false);
  const tripled = [...CLIENTS, ...CLIENTS, ...CLIENTS];
  return (
    <section id="clients">
      <div className="container">
        <div className="clients-header reveal">
          <div className="tag">{t.clients.tag}</div>
          <h2 className="section-title">{t.clients.title}</h2>
          <p>{t.clients.subtitle}</p>
          <button
            type="button"
            className="marquee-toggle"
            aria-pressed={paused}
            onClick={() => setPaused((p) => !p)}
          >
            {paused ? t.clients.play : t.clients.pause}
          </button>
        </div>
      </div>
      <div className="marquee-wrap reveal">
        <div className="marquee-track" style={paused ? { animationPlayState: "paused" } : undefined}>
          {tripled.map((c, i) => (
            <div key={i} className="client-card" aria-hidden={i >= CLIENTS.length || undefined}>
              <img src={cld(c.src, 320)} alt={c.alt} className="client-logo" width="140" height="45" loading="lazy" decoding="async" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const { t } = useLang();
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("https://formsubmit.co/ajax/gigih124ik3@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...form, _captcha: "false" }),
      });
      if (!res.ok) throw new Error(`FormSubmit responded with ${res.status}`);
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch (_) {
      setStatus("error");
    }
  };

  return (
    <section id="contact">
      <div className="container">
        <div className="contact-grid">
          <div className="contact-left">
            <div className="tag reveal">{t.contact.tag}</div>
            <h2 className="section-title reveal reveal-delay-1">{t.contact.title}</h2>
            <p className="reveal reveal-delay-2">
              {t.contact.p}
            </p>
            <div className="reveal reveal-delay-2">
              <div className="contact-info-item">
                <div className="contact-info-icon">💬</div>
                <div>
                  <div className="contact-info-label">{t.contact.telegramLabel}</div>
                  <div className="contact-info-val">@LingLtd</div>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-icon">📍</div>
                <div>
                  <div className="contact-info-label">{t.contact.locationLabel}</div>
                  <div className="contact-info-val">{t.contact.locationValue}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="reveal reveal-delay-1">
            {status === "sent" ? (
              <div className="form-success" role="status" tabIndex={-1} ref={(el) => el?.focus()}>
                {t.contact.success}
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                {status === "error" && (
                  <div className="form-error" role="alert">
                    {t.contact.errBefore}
                    <a href="https://t.me/LingLtd" target="_blank" rel="noreferrer">{t.contact.errLink}</a>
                    {t.contact.errAfter}
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-name">{t.contact.nameLabel}</label>
                  <input id="contact-name" type="text" name="name" className="form-input" placeholder={t.contact.namePh} value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-email">{t.contact.emailLabel}</label>
                  <input id="contact-email" type="email" name="email" className="form-input" placeholder={t.contact.emailPh} value={form.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-message">{t.contact.messageLabel}</label>
                  <textarea id="contact-message" name="message" className="form-textarea" placeholder={t.contact.messagePh} value={form.message} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn-send" disabled={status === "sending"}>
                  {status === "sending" ? t.contact.sending : t.contact.send}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ImageModal({ src, onClose }) {
  const { t } = useLang();
  const closeRef = useRef(null);

  useEffect(() => {
    if (!src) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      // The close button is the dialog's only focusable element, so trapping
      // Tab on it keeps focus inside the aria-modal dialog.
      else if (e.key === "Tab") { e.preventDefault(); closeRef.current?.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [src, onClose]);

  useEffect(() => {
    document.body.style.overflow = src ? "hidden" : "";
    if (!src) return () => { document.body.style.overflow = ""; };
    const opener = document.activeElement;
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
      if (opener instanceof HTMLElement) opener.focus();
    };
  }, [src]);

  if (!src) return null;

  return (
    <div
      className="image-modal show"
      role="dialog"
      aria-modal="true"
      aria-label={t.a11y.dialog}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <button ref={closeRef} className="close-modal" onClick={onClose} aria-label={t.a11y.closeImage}>×</button>
      <img className="modal-content" src={cld(src, 1600)} alt={t.a11y.dialog} />
    </div>
  );
}

function BackToTop() {
  const { t } = useLang();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a href="#home" id="back-top" className={show ? "show" : ""} aria-label={t.a11y.backTop}>↑</a>
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
  const [isDark, setIsDark] = useState(() => storage.get("theme") !== "light");
  const [lang, setLang] = useState(() => {
    const saved = storage.get("lang");
    if (saved === "en" || saved === "id") return saved;
    return navigator.language?.toLowerCase().startsWith("id") ? "id" : "en";
  });
  const [modalSrc, setModalSrc] = useState(null);

  useScrollReveal();

  useEffect(() => {
    storage.set("lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    if (isDark) {
      document.body.classList.remove("light-mode");
      storage.set("theme", "dark");
    } else {
      document.body.classList.add("light-mode");
      storage.set("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = useCallback(() => setIsDark((p) => !p), []);
  const openModal = useCallback((src) => setModalSrc(src), []);
  const closeModal = useCallback(() => setModalSrc(null), []);

  const t = UI[lang];

  return (
    <LangContext.Provider value={{ t, lang, setLang }}>
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
              © {new Date().getFullYear()} Gigihling — {t.footer.made}{" "}
              <a href="https://react.dev" target="_blank" rel="noreferrer">React</a>
            </p>
          </div>
        </div>
      </footer>
      <BackToTop />
      <ImageModal src={modalSrc} onClose={closeModal} />
    </LangContext.Provider>
  );
}
