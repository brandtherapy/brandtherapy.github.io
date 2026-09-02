(function () {
  "use strict";

  const contextPreview = document.getElementById("contextPreview");
  const copyAllButton = document.getElementById("copyAll");
  const status = document.getElementById("copyStatus");
  let contextMarkdown = "";

  const ARCHETYPE_MIX = {
    "schema_version": "brand-therapy-contract/v2",
    "media_base": "assets/archetype-chart/portraits/male",
    "archetypes": [
      {
        "id": "outlaw",
        "name": "Outlaw",
        "promise": "Liberation and risk",
        "description": "Challenges conventions and gives people permission to break from what holds them back.",
        "weight": 0,
        "role": "none"
      },
      {
        "id": "magician",
        "name": "Magician",
        "promise": "Transformation and vision",
        "description": "Makes the seemingly impossible happen by seeing patterns and possibilities others miss.",
        "weight": 21,
        "role": "secondary"
      },
      {
        "id": "hero",
        "name": "Hero",
        "promise": "Courage and strength",
        "description": "Proves progress through courage, mastery, and determined action.",
        "weight": 27,
        "role": "secondary"
      },
      {
        "id": "lover",
        "name": "Lover",
        "promise": "Intimacy and connection",
        "description": "Creates closeness through passion, commitment, and appreciation of beauty.",
        "weight": 0,
        "role": "none"
      },
      {
        "id": "jester",
        "name": "Jester",
        "promise": "Joy and levity",
        "description": "Brings lightness and perspective through humor and playful truth-telling.",
        "weight": 2,
        "role": "trace"
      },
      {
        "id": "friend",
        "name": "Friend",
        "promise": "Belonging and warmth",
        "description": "Builds trust through reliability, down to earth honesty, and shared experience.",
        "weight": 0,
        "role": "none"
      },
      {
        "id": "caregiver",
        "name": "Caregiver",
        "promise": "Altruism and empathy",
        "description": "Protects and supports people through generosity, service, and reassurance.",
        "weight": 6,
        "role": "trace"
      },
      {
        "id": "ruler",
        "name": "Ruler",
        "promise": "Control and order",
        "description": "Creates confidence through leadership, standards, control, and dependable order.",
        "weight": 32,
        "role": "primary"
      },
      {
        "id": "creator",
        "name": "Creator",
        "promise": "Imagination and craft",
        "description": "Builds something original and enduring through vision and skilled craft.",
        "weight": 0,
        "role": "none"
      },
      {
        "id": "innocent",
        "name": "Innocent",
        "promise": "Optimism and simplicity",
        "description": "Offers a simple, honest, and hopeful way to see the world.",
        "weight": 0,
        "role": "none"
      },
      {
        "id": "sage",
        "name": "Sage",
        "promise": "Wisdom and insight",
        "description": "Guides through expertise, understanding, and clear eyed analysis.",
        "weight": 12,
        "role": "supporting"
      },
      {
        "id": "explorer",
        "name": "Explorer",
        "promise": "Freedom and discovery",
        "description": "Invites discovery through independence, curiosity, and new frontiers.",
        "weight": 0,
        "role": "none"
      }
    ],
    "media_variant": "with_background"
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
