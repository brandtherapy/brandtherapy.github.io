(function () {
  "use strict";

  // Prompt and signature copy buttons are owned by the shared
  // brand-therapy-os.js template (data-copy-target / data-copy-include-os).

  document.querySelectorAll("[data-confirm-links]").forEach(function (link) {
    link.addEventListener("click", function (event) {
      if (link.getAttribute("href") === "#") event.preventDefault();
    });
  });
}());
