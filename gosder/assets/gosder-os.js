(function () {
  "use strict";

  document.querySelectorAll("[data-copy-target]").forEach(function (button) {
    button.addEventListener("click", async function () {
      const target = document.getElementById(button.dataset.copyTarget || "");
      const status = button.parentElement?.querySelector("[data-copy-result]");
      if (!target) return;

      try {
        await navigator.clipboard.writeText(target.textContent || "");
        button.textContent = "Copied";
        if (status) status.textContent = "Copied to clipboard.";
      } catch (_error) {
        if (status) status.textContent = "Select the text and copy it manually.";
      }
    });
  });

  document.querySelectorAll("[data-confirm-links]").forEach(function (link) {
    link.addEventListener("click", function (event) {
      if (link.getAttribute("href") === "#") event.preventDefault();
    });
  });
}());
