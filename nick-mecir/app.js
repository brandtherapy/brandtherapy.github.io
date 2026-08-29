(function () {
  "use strict";

  const contextPreview = document.getElementById("contextPreview");
  const copyAllButton = document.getElementById("copyAll");
  const status = document.getElementById("copyStatus");
  let contextMarkdown = "";

  const ARCHETYPE_MIX = {
    "schema_version": "brand-therapy-contract/v2",
    "media_base": "",
    "archetypes": [
      {
        "id": "outlaw",
        "name": "Outlaw",
        "promise": "Liberation and risk",
        "description": "Challenges conventions and gives people permission to break from what holds them back.",
        "weight": 8,
        "role": "trace"
      },
      {
        "id": "magician",
        "name": "Magician",
        "promise": "Charisma and inspiration",
        "description": "Transforms what feels impossible and helps people see a new possibility.",
        "weight": 0,
        "role": "none"
      },
      {
        "id": "hero",
        "name": "Hero",
        "promise": "Courage and strength",
        "description": "Proves progress through courage, mastery, and determined action.",
        "weight": 8,
        "role": "trace"
      },
      {
        "id": "lover",
        "name": "Lover",
        "promise": "Passion and intimacy",
        "description": "Builds desire and connection through intimacy, beauty, and devotion.",
        "weight": 0,
        "role": "none"
      },
      {
        "id": "jester",
        "name": "Jester",
        "promise": "Humor and delight",
        "description": "Uses play and surprise to make people feel lighter and more alive.",
        "weight": 0,
        "role": "none"
      },
      {
        "id": "friend",
        "name": "Friend",
        "promise": "Respect and belonging",
        "description": "Creates belonging through familiarity, equality, and everyday trust.",
        "weight": 12,
        "role": "supporting"
      },
      {
        "id": "caregiver",
        "name": "Caregiver",
        "promise": "Altruism and empathy",
        "description": "Protects and supports people through generosity, service, and reassurance.",
        "weight": 32,
        "role": "primary"
      },
      {
        "id": "ruler",
        "name": "Ruler",
        "promise": "Control and order",
        "description": "Creates confidence through leadership, standards, control, and dependable order.",
        "weight": 22,
        "role": "secondary"
      },
      {
        "id": "creator",
        "name": "Creator",
        "promise": "Creation and innovation",
        "description": "Turns imagination into original work and gives people tools for self-expression.",
        "weight": 0,
        "role": "none"
      },
      {
        "id": "innocent",
        "name": "Innocent",
        "promise": "Safety and honesty",
        "description": "Makes life feel simpler and safer through optimism, honesty, and clarity.",
        "weight": 4,
        "role": "trace"
      },
      {
        "id": "sage",
        "name": "Sage",
        "promise": "Wisdom and clarity",
        "description": "Helps people understand the world through knowledge, truth, and perspective.",
        "weight": 14,
        "role": "supporting"
      },
      {
        "id": "explorer",
        "name": "Explorer",
        "promise": "Freedom and adventure",
        "description": "Opens new paths and protects independence, discovery, and freedom.",
        "weight": 0,
        "role": "none"
      }
    ]
  };

  function announce(message, state) {
    if (!status) return;
    status.textContent = message;
    status.dataset.state = state || "success";
  }

  function fallbackCopy(text) {
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    const copied = document.execCommand("copy");
    field.remove();
    if (!copied) throw new Error("copy");
  }

  async function copyText(text) {
    if (!text.trim()) throw new Error("empty");
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
    fallbackCopy(text);
  }

  function textFromTarget(id) {
    const target = document.getElementById(id);
    if (!target) return "";
    return target.innerText.replace(/\n{3,}/g, "\n\n").trim();
  }

  async function loadContext() {
    if (!contextPreview) return;
    try {
      const response = await fetch("brand-context.md", { cache: "no-store" });
      if (!response.ok) throw new Error("load");
      contextMarkdown = await response.text();
      contextPreview.textContent = contextMarkdown;
    } catch (error) {
      contextPreview.textContent = "The context preview could not load here. Use the download link to get the same file.";
      announce("Context preview unavailable. The Markdown download still works.", "error");
    }
  }

  if (copyAllButton) {
    copyAllButton.addEventListener("click", async function () {
      const original = copyAllButton.textContent;
      copyAllButton.disabled = true;
      try {
        if (!contextMarkdown) await loadContext();
        await copyText(contextMarkdown);
        copyAllButton.textContent = "Copied";
        announce("Full brand context copied. Paste it into a new AI conversation.");
      } catch (error) {
        announce("Copy failed. Download the Markdown file instead.", "error");
      } finally {
        window.setTimeout(function () {
          copyAllButton.disabled = false;
          copyAllButton.textContent = original;
        }, 1800);
      }
    });
  }

  document.querySelectorAll("[data-copy-target]").forEach(function (button) {
    button.addEventListener("click", async function () {
      const original = button.textContent;
      const text = textFromTarget(button.dataset.copyTarget);
      button.disabled = true;
      try {
        await copyText(text);
        button.textContent = "Copied";
        announce("Copied to your clipboard.");
      } catch (error) {
        announce("Copy failed. Select the text and copy it manually.", "error");
      } finally {
        window.setTimeout(function () {
          button.disabled = false;
          button.textContent = original;
        }, 1600);
      }
    });
  });

  const links = Array.from(document.querySelectorAll("[data-nav]"));
  const sections = Array.from(document.querySelectorAll("[data-section]"));

  function setCurrent(id) {
    links.forEach(function (link) {
      if (link.dataset.nav === id) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    const observer = new IntersectionObserver(function (entries) {
      const visible = entries
        .filter(function (entry) { return entry.isIntersecting; })
        .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; });
      if (visible[0]) setCurrent(visible[0].target.dataset.section);
    }, { rootMargin: "-18% 0px -67% 0px", threshold: [0, 0.1, 0.25] });

    sections.forEach(function (section) { observer.observe(section); });
  }

  // Re-apply a deep link while the chart and images settle into their final height,
  // so a shared #linkedin or #identity link lands on the section and highlights it.
  const landingHash = decodeURIComponent((location.hash || "").slice(1));
  let landingCancelled = false;
  ["wheel", "touchstart", "keydown", "pointerdown"].forEach(function (type) {
    window.addEventListener(type, function () { landingCancelled = true; }, { passive: true, once: true });
  });
  function settleLanding() {
    if (landingCancelled || !landingHash) return;
    const target = document.getElementById(landingHash);
    if (!target) return;
    const margin = (parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0)
      + (parseFloat(getComputedStyle(target).scrollMarginTop) || 0);
    const offset = target.getBoundingClientRect().top - margin;
    if (Math.abs(offset) > 6) target.scrollIntoView({ block: "start" });
    setCurrent(target.dataset.section || landingHash);
  }
  if (landingHash) {
    [200, 700, 1600].forEach(function (delay) { window.setTimeout(settleLanding, delay); });
    window.addEventListener("load", function () { window.setTimeout(settleLanding, 100); });
  }

  const chart = document.getElementById("archetypeChart");
  if (chart && window.customElements) {
    customElements.whenDefined("bt-archetype-chart").then(function () {
      chart.data = ARCHETYPE_MIX;
    });
  }

  loadContext();
})();
