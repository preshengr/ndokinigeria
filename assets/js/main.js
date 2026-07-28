// ============================================================
// NDOKI — shared site behaviour
// ============================================================
document.addEventListener("DOMContentLoaded", function () {
  /* ---------- Mobile nav ---------- */
  var hamburger = document.querySelector(".hamburger");
  var mobileNav = document.querySelector(".mobile-nav");
  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("is-open");
      hamburger.classList.toggle("is-active", open);
      hamburger.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function (e) {
        // allow submenu toggles to be handled separately
        if (a.classList.contains("mobile-collections-toggle")) return;
        mobileNav.classList.remove("is-open");
        hamburger.classList.remove("is-active");
        document.body.style.overflow = "";
      });
    });
  }

  var mobileToggle = document.querySelector(".mobile-collections-toggle");
  var mobileSub = document.querySelector(".mobile-sub");
  if (mobileToggle && mobileSub) {
    mobileToggle.addEventListener("click", function (e) {
      e.preventDefault();
      mobileSub.classList.toggle("is-open");
      mobileToggle.classList.toggle("is-open");
    });
  }

  /* ---------- Desktop Collections dropdown (click + hover + keyboard) ---------- */
  var dropdownParent = document.querySelector(".has-dropdown");
  if (dropdownParent) {
    var trigger = dropdownParent.querySelector(".nav-link");
    trigger.addEventListener("click", function (e) {
      e.preventDefault();
      dropdownParent.classList.toggle("is-open");
    });
    document.addEventListener("click", function (e) {
      if (!dropdownParent.contains(e.target)) {
        dropdownParent.classList.remove("is-open");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") dropdownParent.classList.remove("is-open");
    });
  }

  /* ---------- Hero slider ---------- */
  var slides = document.querySelectorAll(".hero-slide");
  var dots = document.querySelectorAll(".hero-dot");
  if (slides.length > 1) {
    var current = 0;
    var reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    var intervalTime = 6000;

    function showSlide(i) {
      slides.forEach(function (s, idx) {
        s.classList.toggle("is-active", idx === i);
      });
      dots.forEach(function (d, idx) {
        d.classList.toggle("is-active", idx === i);
      });
      current = i;
    }

    var timer;
    function startAuto() {
      if (reduceMotion) return;
      timer = setInterval(function () {
        showSlide((current + 1) % slides.length);
      }, intervalTime);
    }
    function stopAuto() {
      clearInterval(timer);
    }

    dots.forEach(function (d, idx) {
      d.addEventListener("click", function () {
        showSlide(idx);
        stopAuto();
        startAuto();
      });
    });

    showSlide(0);
    startAuto();
  }

  /* ---------- Newsletter / notify demo forms ---------- */
  document.querySelectorAll("[data-demo-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = form.parentElement.querySelector("[data-demo-msg]");
      if (msg) {
        msg.textContent = "Thank you — you're on the list. We'll be in touch.";
      }
      form.reset();
    });
  });

  /* ---------- Contact form demo ---------- */
  var contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = contactForm.querySelector(".form-msg");
      if (msg) {
        msg.textContent =
          "Thank you for reaching out. This is a preview form — connect it to your email service or backend to receive live messages. We'll reply within 2–3 business days.";
      }
      contactForm.reset();
    });
  }

  /* ---------- Header scroll shadow ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    window.addEventListener(
      "scroll",
      function () {
        header.style.boxShadow =
          window.scrollY > 10 ? "0 1px 0 rgba(0,0,0,.05)" : "none";
      },
      { passive: true },
    );
  }
});

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    const filter = this.getAttribute("data-filter");
    document
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("is-active"));
    this.classList.add("is-active");
    document.querySelectorAll(".post-card").forEach((card) => {
      const cat = card.getAttribute("data-category");
      card.style.display = filter === "all" || cat === filter ? "flex" : "none";
      if (card.style.display === "flex")
        card.style.animation = "fadeIn .4s ease";
    });
  });
});
