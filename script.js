// Enable scroll-reveal styling only when JS runs, so content stays
// visible if this script ever fails to load.
document.documentElement.classList.add('js');

// Category filter for the work grid
document.querySelectorAll('.filter-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.filter-btn').forEach(function (b) {
      b.classList.remove('active');
    });
    btn.classList.add('active');
    var filter = btn.getAttribute('data-filter');
    document.querySelectorAll('.card').forEach(function (card) {
      var show = filter === 'all' || card.getAttribute('data-cat') === filter;
      card.style.display = show ? '' : 'none';
    });
  });
});

// Pause other videos when one starts playing
document.querySelectorAll('.card video').forEach(function (video) {
  video.addEventListener('play', function () {
    document.querySelectorAll('.card video').forEach(function (other) {
      if (other !== video && !other.paused) {
        other.pause();
      }
    });
  });
});

// Hover preview: play a card video muted on hover, restore on leave.
// A click on the video hands control to the viewer, so leaving then
// does not reset it.
document.querySelectorAll('.card video').forEach(function (video) {
  video.addEventListener('mouseenter', function () {
    if (video.paused && !video.dataset.userPlay) {
      video.muted = true;
      video.dataset.hover = '1';
      var p = video.play();
      if (p && p.catch) { p.catch(function () {}); }
    }
  });
  video.addEventListener('mouseleave', function () {
    if (video.dataset.hover) {
      video.pause();
      video.currentTime = 0;
      delete video.dataset.hover;
    }
  });
  video.addEventListener('click', function () {
    video.dataset.userPlay = '1';
    delete video.dataset.hover;
  });
});

// Reveal sections and cards as they scroll into view
var revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(function (el) {
  revealObserver.observe(el);
});

// Blog post expand/collapse
document.querySelectorAll('.blog-toggle').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var card = btn.closest('.blog-card');
    var open = card.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.textContent = open ? 'Close post ↑' : 'Read post ↓';
  });
});

// Highlight the nav link for the section currently in view
var navLinks = document.querySelectorAll('.nav nav a:not(.nav-cta)');
var spyObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      var id = entry.target.getAttribute('id');
      navLinks.forEach(function (link) {
        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

['work', 'services', 'tools', 'about', 'contact'].forEach(function (id) {
  var section = document.getElementById(id);
  if (section) {
    spyObserver.observe(section);
  }
});
