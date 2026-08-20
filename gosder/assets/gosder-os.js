(function () {
  "use strict";

  // Prompt and signature copy buttons are owned by the shared
  // brand-therapy-os.js template (data-copy-target / data-copy-include-os).

  document.querySelectorAll("[data-confirm-links]").forEach(function (link) {
    link.addEventListener("click", function (event) {
      if (link.getAttribute("href") === "#") event.preventDefault();
    });
  });

  document.querySelectorAll("[data-image-gallery]").forEach(function (gallery) {
    var items = Array.from(gallery.querySelectorAll("[data-gallery-item]"));
    var collectionButtons = Array.from(gallery.querySelectorAll("[data-gallery-collection]"));
    var searchInput = gallery.querySelector("[data-gallery-search]");
    var subjectSelect = gallery.querySelector("[data-gallery-subject]");
    var orientationSelect = gallery.querySelector("[data-gallery-orientation]");
    var countOutput = gallery.querySelector("[data-gallery-count]");
    var resetButton = gallery.querySelector("[data-gallery-reset]");
    var emptyState = gallery.querySelector("[data-gallery-empty]");
    var dialog = gallery.querySelector("[data-gallery-dialog]");
    var dialogImage = dialog.querySelector("[data-gallery-dialog-image]");
    var dialogTitle = dialog.querySelector("[data-gallery-dialog-title]");
    var dialogCount = dialog.querySelector("[data-gallery-dialog-count]");
    var dialogLink = dialog.querySelector("[data-gallery-dialog-link]");
    var previousButton = dialog.querySelector("[data-gallery-prev]");
    var nextButton = dialog.querySelector("[data-gallery-next]");
    var closeButton = dialog.querySelector("[data-gallery-close]");
    var activeCollection = "all";
    var activeItem = null;
    var lastTrigger = null;
    var priorityFrame = 0;
    var requestedSubject = new URLSearchParams(window.location.search).get("subject");

    if (
      requestedSubject &&
      Array.from(subjectSelect.options).some(function (option) {
        return option.value === requestedSubject;
      })
    ) {
      subjectSelect.value = requestedSubject;
    }

    function visibleItems() {
      return items.filter(function (item) {
        return !item.hidden;
      });
    }

    function prioritizeVisibleImages() {
      var preloadMargin = window.innerHeight * 0.75;

      visibleItems().forEach(function (item) {
        var rect = item.getBoundingClientRect();
        if (rect.bottom < -preloadMargin || rect.top > window.innerHeight + preloadMargin) return;
        var image = item.querySelector("img[loading='lazy']");
        if (image) image.loading = "eager";
      });
    }

    function updateFilters() {
      var search = searchInput.value.trim().toLowerCase();
      var subject = subjectSelect.value;
      var orientation = orientationSelect.value;
      var count = 0;

      items.forEach(function (item) {
        var matchesCollection = activeCollection === "all" || item.dataset.collection === activeCollection;
        var matchesSubject = subject === "all" || item.dataset.subjects.split(" ").includes(subject);
        var matchesOrientation = orientation === "all" || item.dataset.orientation === orientation;
        var matchesSearch = !search || item.dataset.search.includes(search);
        var visible = matchesCollection && matchesSubject && matchesOrientation && matchesSearch;
        item.hidden = !visible;
        if (visible) count += 1;
      });

      if (priorityFrame) window.cancelAnimationFrame(priorityFrame);
      if (activeCollection !== "all" || subject !== "all" || orientation !== "all" || search) {
        priorityFrame = window.requestAnimationFrame(function () {
          priorityFrame = 0;
          prioritizeVisibleImages();
        });
      }

      countOutput.textContent = count + (count === 1 ? " image" : " images");
      emptyState.hidden = count !== 0;
      resetButton.hidden = activeCollection === "all" && subject === "all" && orientation === "all" && !search;
      if (dialog.open && activeItem && activeItem.hidden) dialog.close();
    }

    function showItem(item) {
      var currentItems = visibleItems();
      var index = currentItems.indexOf(item);
      if (index < 0) return;
      activeItem = item;
      dialogImage.src = item.dataset.src;
      dialogImage.alt = item.dataset.title;
      dialog.dataset.orientation = item.dataset.orientation;
      dialogTitle.textContent = item.dataset.title;
      dialogCount.textContent = index + 1 + " of " + currentItems.length;
      dialogLink.href = item.dataset.src;
      previousButton.disabled = currentItems.length < 2;
      nextButton.disabled = currentItems.length < 2;
    }

    function move(direction) {
      var currentItems = visibleItems();
      var index = currentItems.indexOf(activeItem);
      if (index < 0 || currentItems.length < 2) return;
      showItem(currentItems[(index + direction + currentItems.length) % currentItems.length]);
    }

    collectionButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        activeCollection = button.dataset.galleryCollection;
        collectionButtons.forEach(function (candidate) {
          candidate.setAttribute("aria-pressed", String(candidate === button));
        });
        updateFilters();
      });
    });

    searchInput.addEventListener("input", updateFilters);
    subjectSelect.addEventListener("change", updateFilters);
    orientationSelect.addEventListener("change", updateFilters);
    resetButton.addEventListener("click", function () {
      activeCollection = "all";
      searchInput.value = "";
      subjectSelect.value = "all";
      orientationSelect.value = "all";
      collectionButtons.forEach(function (button) {
        button.setAttribute("aria-pressed", String(button.dataset.galleryCollection === "all"));
      });
      updateFilters();
      searchInput.focus();
    });

    items.forEach(function (item) {
      var trigger = item.querySelector("[data-gallery-open]");
      trigger.addEventListener("click", function () {
        lastTrigger = trigger;
        showItem(item);
        dialog.showModal();
        closeButton.focus();
      });
    });

    previousButton.addEventListener("click", function () {
      move(-1);
    });
    nextButton.addEventListener("click", function () {
      move(1);
    });
    closeButton.addEventListener("click", function () {
      dialog.close();
    });
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        move(-1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        move(1);
      }
    });
    dialog.addEventListener("close", function () {
      if (lastTrigger && document.contains(lastTrigger)) lastTrigger.focus();
    });

    updateFilters();
  });
}());
