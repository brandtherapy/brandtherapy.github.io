(function () {
  "use strict";

  const body = document.body;
  const navigation = document.querySelector("#site-navigation");
  const openButton = document.querySelector("[data-menu-open]");
  const closeButton = document.querySelector("[data-menu-close]");
  const backdrop = document.querySelector("[data-menu-backdrop]");
  const mobileQuery = window.matchMedia("(max-width: 56rem)");
  const pageToc = document.querySelector("[data-page-toc]");

  if (pageToc && mobileQuery.matches) pageToc.open = false;

  function openNavigation() {
    if (!mobileQuery.matches || !navigation || !openButton || !backdrop) return;
    body.classList.add("nav-open");
    openButton.setAttribute("aria-expanded", "true");
    backdrop.hidden = false;
    closeButton?.focus();
  }

  function closeNavigation(returnFocus) {
    body.classList.remove("nav-open");
    openButton?.setAttribute("aria-expanded", "false");
    if (backdrop) backdrop.hidden = true;
    if (returnFocus) openButton?.focus();
  }

  openButton?.addEventListener("click", openNavigation);
  closeButton?.addEventListener("click", function () { closeNavigation(true); });
  backdrop?.addEventListener("click", function () { closeNavigation(true); });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && body.classList.contains("nav-open")) {
      closeNavigation(true);
    }
  });

  navigation?.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      if (mobileQuery.matches) closeNavigation(false);
    });
  });

  mobileQuery.addEventListener("change", function (event) {
    closeNavigation(false);
    if (pageToc) pageToc.open = !event.matches;
  });

  const search = document.querySelector("[data-library-search]");
  const filters = Array.from(document.querySelectorAll("[data-library-filter]"));
  const items = Array.from(document.querySelectorAll("[data-library-item]"));
  const count = document.querySelector("[data-library-count]");
  const empty = document.querySelector("[data-library-empty]");

  const requestedUse = new URLSearchParams(window.location.search).get("use");
  const useFilter = filters.find(function (filter) {
    return filter.dataset.libraryFilter === "use";
  });
  if (requestedUse && useFilter) {
    const validUse = Array.from(useFilter.options).some(function (option) {
      return option.value === requestedUse;
    });
    if (validUse) useFilter.value = requestedUse;
  }

  function updateLibrary() {
    if (!items.length) return;
    const query = (search?.value || "").trim().toLowerCase();
    const selected = Object.fromEntries(filters.map(function (filter) {
      return [filter.dataset.libraryFilter, filter.value];
    }));
    let visible = 0;

    items.forEach(function (item) {
      const matchesText = !query || item.textContent.toLowerCase().includes(query);
      const matchesUse = !selected.use || selected.use === "all" || item.dataset.use === selected.use;
      const matchesType = !selected.type || selected.type === "all" || item.dataset.type === selected.type;
      const show = matchesText && matchesUse && matchesType;
      item.hidden = !show;
      if (show) visible += 1;
    });

    if (count) count.textContent = String(visible);
    if (empty) empty.hidden = visible !== 0;
  }

  search?.addEventListener("input", updateLibrary);
  filters.forEach(function (filter) { filter.addEventListener("change", updateLibrary); });
  updateLibrary();
}());
