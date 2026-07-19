const menuButton = document.querySelector("[data-menu-button]");
const nav = document.querySelector("[data-nav]");
const navLinks = [...document.querySelectorAll(".site-nav a")];

function closeMenu() {
  if (!menuButton || !nav) return;
  menuButton.setAttribute("aria-expanded", "false");
  nav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}

menuButton?.addEventListener("click", () => {
  const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(willOpen));
  nav?.classList.toggle("is-open", willOpen);
  document.body.classList.toggle("menu-open", willOpen);
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;

    navLinks.forEach((link) => {
      const isCurrent = link.getAttribute("href") === `#${visible.target.id}`;
      if (isCurrent) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  },
  { rootMargin: "-25% 0px -60%", threshold: [0.05, 0.25, 0.5] },
);

sections.forEach((section) => sectionObserver.observe(section));

const aboutSection = document.querySelector("#about");

window.addEventListener(
  "scroll",
  () => {
    if (!aboutSection) return;
    const beforeFirstSection = window.scrollY < aboutSection.offsetTop - window.innerHeight * 0.4;
    if (beforeFirstSection) navLinks.forEach((link) => link.removeAttribute("aria-current"));
  },
  { passive: true },
);
