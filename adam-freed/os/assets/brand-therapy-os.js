(function () {
  "use strict";

  const body = document.body;
  const navigation = document.querySelector("#site-navigation");
  const openButton = document.querySelector("[data-menu-open]");
  const closeButton = document.querySelector("[data-menu-close]");
  const backdrop = document.querySelector("[data-menu-backdrop]");
  const mobileQuery = window.matchMedia("(max-width: 60rem)");
  const pageToc = document.querySelector("[data-page-toc]");

  if (pageToc && mobileQuery.matches) pageToc.open = false;

  function openNavigation() {
    if (!mobileQuery.matches || !navigation || !openButton || !backdrop) return;
    body.classList.add("nav-open");
    openButton.setAttribute("aria-expanded", "true");
    navigation.inert = false;
    navigation.removeAttribute("aria-hidden");
    backdrop.hidden = false;
    closeButton?.focus();
  }

  function closeNavigation(returnFocus) {
    body.classList.remove("nav-open");
    openButton?.setAttribute("aria-expanded", "false");
    if (backdrop) backdrop.hidden = true;
    if (navigation) {
      navigation.inert = mobileQuery.matches;
      if (mobileQuery.matches) navigation.setAttribute("aria-hidden", "true");
      else navigation.removeAttribute("aria-hidden");
    }
    if (returnFocus) openButton?.focus();
  }

  closeNavigation(false);

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

  const optionalGate = document.querySelector("[data-optional-gate]");
  const optionalContent = document.querySelector("[data-optional-content]");
  const optionalBanner = document.querySelector("[data-optional-banner]");
  const previewButton = document.querySelector("[data-optional-preview]");
  const resetButton = document.querySelector("[data-optional-reset]");
  const optionalKey = body.dataset.pageId ? `btos-preview-${body.dataset.pageId}` : "";

  function setOptionalPreview(showPreview, moveFocus) {
    if (!optionalGate || !optionalContent || !previewButton) return;
    optionalGate.hidden = showPreview;
    optionalContent.hidden = !showPreview;
    if (optionalBanner) optionalBanner.hidden = !showPreview;
    previewButton.setAttribute("aria-expanded", String(showPreview));
    if (optionalKey) {
      try {
        if (showPreview) sessionStorage.setItem(optionalKey, "true");
        else sessionStorage.removeItem(optionalKey);
      } catch (_error) {
        // The preview still works when session storage is unavailable.
      }
    }
    if (moveFocus) {
      if (showPreview) optionalBanner?.focus();
      else previewButton.focus();
    }
  }

  if (optionalGate && optionalContent && previewButton) {
    let storedPreview = false;
    try {
      storedPreview = optionalKey && sessionStorage.getItem(optionalKey) === "true";
    } catch (_error) {
      storedPreview = false;
    }
    setOptionalPreview(storedPreview, false);
    previewButton.addEventListener("click", function () { setOptionalPreview(true, true); });
    resetButton?.addEventListener("click", function () { setOptionalPreview(false, true); });
  }

  const copyButton = document.querySelector("[data-copy-button]");
  const copySource = document.querySelector("[data-copy-source]");
  const copyStatus = document.querySelector("[data-copy-status]");

  copyButton?.addEventListener("click", async function () {
    const value = copySource?.textContent || "";
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      if (copyStatus) copyStatus.textContent = "Prompt copied.";
      copyButton.textContent = "Copied";
    } catch (_error) {
      if (copyStatus) copyStatus.textContent = "Select the prompt and copy it manually.";
    }
  });

  const search = document.querySelector("[data-library-search]");
  const filters = Array.from(document.querySelectorAll("[data-library-filter]"));
  const items = Array.from(document.querySelectorAll("[data-library-item]"));
  const count = document.querySelector("[data-library-count]");
  const empty = document.querySelector("[data-library-empty]");
  const resetFilters = document.querySelector("[data-library-reset]");

  const requestedParams = new URLSearchParams(window.location.search);
  const requestedUse = requestedParams.get("use");
  const requestedType = requestedParams.get("type");
  const requestedQuery = requestedParams.get("q");
  const useFilter = filters.find(function (filter) {
    return filter.dataset.libraryFilter === "use";
  });
  const typeFilter = filters.find(function (filter) {
    return filter.dataset.libraryFilter === "type";
  });
  if (requestedUse && useFilter) {
    const validUse = Array.from(useFilter.options).some(function (option) {
      return option.value === requestedUse;
    });
    if (validUse) useFilter.value = requestedUse;
  }
  if (requestedType && typeFilter) {
    const validType = Array.from(typeFilter.options).some(function (option) {
      return option.value === requestedType;
    });
    if (validType) typeFilter.value = requestedType;
  }
  if (requestedQuery && search) search.value = requestedQuery;

  function syncLibraryUrl(query, selected) {
    if (!items.length || !window.history?.replaceState) return;
    const url = new URL(window.location.href);
    if (query) url.searchParams.set("q", query);
    else url.searchParams.delete("q");
    for (const key of ["use", "type"]) {
      const value = selected[key];
      if (value && value !== "all") url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
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
    syncLibraryUrl(query, selected);
    if (resetFilters) {
      const hasFilters = Boolean(query) || Object.values(selected).some(function (value) {
        return value && value !== "all";
      });
      resetFilters.disabled = !hasFilters;
    }
  }

  search?.addEventListener("input", updateLibrary);
  filters.forEach(function (filter) { filter.addEventListener("change", updateLibrary); });
  resetFilters?.addEventListener("click", function () {
    if (search) search.value = "";
    filters.forEach(function (filter) { filter.value = "all"; });
    updateLibrary();
    search?.focus();
  });
  updateLibrary();

  const focusStarFrame = document.querySelector("[data-focus-star-frame]");
  if (focusStarFrame) {
    let focusResizeObserver = null;
    let focusMutationObserver = null;
    let focusResizeTimer = 0;

    function focusDocument() {
      try {
        return focusStarFrame.contentDocument;
      } catch (_error) {
        return null;
      }
    }

    function fitFocusStar() {
      const documentInside = focusDocument();
      if (!documentInside?.body || !documentInside.getElementById("stage")) return false;
      if (focusStarFrame.getBoundingClientRect().width <= 820) {
        const height = Math.max(
          documentInside.body.scrollHeight,
          documentInside.documentElement.scrollHeight
        );
        const current = Number.parseFloat(focusStarFrame.style.height) || 0;
        if (height && Math.abs(height - current) > 4) {
          focusStarFrame.style.height = `${height}px`;
        }
      } else {
        focusStarFrame.style.height = "";
      }
      return true;
    }

    function scheduleFocusFit() {
      if (focusResizeTimer) return;
      focusResizeTimer = window.setTimeout(function () {
        focusResizeTimer = 0;
        fitFocusStar();
      }, 50);
    }

    function watchFocusStar() {
      const documentInside = focusDocument();
      if (!documentInside?.body || !documentInside.getElementById("stage")) return false;
      focusResizeObserver?.disconnect();
      focusMutationObserver?.disconnect();
      fitFocusStar();
      if (window.ResizeObserver) {
        focusResizeObserver = new ResizeObserver(scheduleFocusFit);
        focusResizeObserver.observe(documentInside.documentElement);
        focusResizeObserver.observe(documentInside.body);
      }
      if (window.MutationObserver) {
        focusMutationObserver = new MutationObserver(scheduleFocusFit);
        focusMutationObserver.observe(documentInside.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ["class"],
        });
      }
      return true;
    }

    focusStarFrame.addEventListener("load", watchFocusStar);
    let focusLoadAttempts = 0;
    const focusLoadPoll = window.setInterval(function () {
      focusLoadAttempts += 1;
      if (watchFocusStar() || focusLoadAttempts > 80) window.clearInterval(focusLoadPoll);
    }, 100);
    window.addEventListener("resize", scheduleFocusFit);
    window.addEventListener("orientationchange", function () {
      window.setTimeout(fitFocusStar, 350);
    });
  }
}());
