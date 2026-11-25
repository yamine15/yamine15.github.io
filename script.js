(() => {
  const progress = document.getElementById("progress");
  const year = document.getElementById("year");
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");

  if (year) year.textContent = new Date().getFullYear();

  const updateProgress = () => {
    if (!progress) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const amount = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progress.style.width = `${Math.min(100, Math.max(0, amount))}%`;
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  if (menuToggle && nav) {
    const closeMenu = () => {
      nav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
    };
    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });
    document.addEventListener("click", event => {
      if (!nav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
    });
  }

  const filterButtons = document.querySelectorAll(".filter-btn");
  const publications = document.querySelectorAll(".publication[data-year]");
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      filterButtons.forEach(item => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      publications.forEach(item => {
        item.hidden = filter !== "all" && item.dataset.year !== filter;
      });
    });
  });

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }
})();
