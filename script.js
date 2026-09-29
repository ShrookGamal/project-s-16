(function () {
  'use strict';

  var header = document.getElementById('header');
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  var overlay = document.getElementById('overlay');
  var navClose = document.getElementById('navClose');
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
  var rotator = document.getElementById('rotator');

  function openMenu() {
    nav.classList.add('open');
    overlay.classList.add('show');
    burger.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
  }

  function closeMenu() {
    nav.classList.remove('open');
    overlay.classList.remove('show');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  }

  burger.addEventListener('click', function () {
    if (nav.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navClose.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);

  links.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 1100) {
      closeMenu();
    }
  });

  var sections = links
    .map(function (link) {
      var id = link.getAttribute('href').slice(1);
      return { link: link, el: document.getElementById(id) };
    })
    .filter(function (item) {
      return item.el;
    });

  function updateOnScroll() {
    header.classList.toggle('scrolled', window.scrollY > 30);

    var probe = window.scrollY + window.innerHeight * 0.35;
    var current = sections.length ? sections[0] : null;

    sections.forEach(function (item) {
      if (item.el.offsetTop <= probe) {
        current = item;
      }
    });

    links.forEach(function (link) {
      link.classList.remove('active');
    });

    if (current) {
      current.link.classList.add('active');
    }
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateOnScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('load', updateOnScroll);
  updateOnScroll();

  var words = ['أفراح', 'حفلات', 'مناسبات', 'مؤتمرات', 'فعاليات'];
  var index = 0;

  if (rotator) {
    setInterval(function () {
      rotator.classList.add('out');
      setTimeout(function () {
        index = (index + 1) % words.length;
        rotator.textContent = words[index];
        rotator.classList.remove('out');
      }, 400);
    }, 2600);
  }
    var revealItems = document.querySelectorAll('.reveal');

  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var duration = 1800;
    var start = null;

    function step(ts) {
      if (!start) {
        start = ts;
      }
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('en-US');
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString('en-US');
      }
    }

    window.requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          var num = entry.target.querySelector('.stat__num');
          if (num && !num.dataset.done) {
            num.dataset.done = '1';
            animateCount(num);
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add('in');
      var num = item.querySelector('.stat__num');
      if (num) {
        num.textContent = num.getAttribute('data-count');
      }
    });
  }
    var faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach(function (item) {
    var btn = item.querySelector('.faq__q');

    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');

      faqItems.forEach(function (other) {
        other.classList.remove('is-open');
        other.querySelector('.faq__q').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
    var tstTrack = document.getElementById('tstTrack');

  if (tstTrack) {
    var tstCards = Array.prototype.slice.call(tstTrack.children);
    var tstDots = document.getElementById('tstDots');
    var tstPrev = document.getElementById('tstPrev');
    var tstNext = document.getElementById('tstNext');
    var tstTimer = null;
    var tstDotEls = [];

    tstCards.forEach(function (card, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'tst__dot';
      dot.setAttribute('aria-label', 'الرأي رقم ' + (i + 1));
      dot.addEventListener('click', function () {
        goTo(i);
        restartAuto();
      });
      tstDots.appendChild(dot);
      tstDotEls.push(dot);
    });

    function currentIndex() {
      var edge = tstTrack.getBoundingClientRect().right;
      var best = 0;
      var min = Infinity;
      tstCards.forEach(function (card, i) {
        var d = Math.abs(card.getBoundingClientRect().right - edge);
        if (d < min) {
          min = d;
          best = i;
        }
      });
      return best;
    }

    function goTo(i) {
      var max = tstCards.length - 1;
      i = Math.max(0, Math.min(i, max));
      var target = tstCards[i];
      var trackRect = tstTrack.getBoundingClientRect();
      var cardRect = target.getBoundingClientRect();
      tstTrack.scrollBy({ left: cardRect.right - trackRect.right + 4, behavior: 'smooth' });
    }

    function paintDots() {
      var idx = currentIndex();
      var atEnd = Math.abs(tstTrack.scrollLeft) + tstTrack.clientWidth >= tstTrack.scrollWidth - 4;
      if (atEnd) {
        idx = tstCards.length - 1;
      }
      tstDotEls.forEach(function (dot, i) {
        dot.classList.toggle('active', i === idx);
      });
    }

    function isAtEnd() {
      return Math.abs(tstTrack.scrollLeft) + tstTrack.clientWidth >= tstTrack.scrollWidth - 4;
    }

    function next() {
      if (isAtEnd()) {
        tstTrack.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        goTo(currentIndex() + 1);
      }
    }

    function prev() {
      if (Math.abs(tstTrack.scrollLeft) <= 4) {
        tstTrack.scrollTo({ left: -(tstTrack.scrollWidth), behavior: 'smooth' });
      } else {
        goTo(currentIndex() - 1);
      }
    }

    function startAuto() {
      tstTimer = setInterval(next, 5500);
    }

    function stopAuto() {
      clearInterval(tstTimer);
    }

    function restartAuto() {
      stopAuto();
      startAuto();
    }

    tstNext.addEventListener('click', function () {
      next();
      restartAuto();
    });
    tstPrev.addEventListener('click', function () {
      prev();
      restartAuto();
    });

    tstTrack.addEventListener('scroll', function () {
      window.requestAnimationFrame(paintDots);
    }, { passive: true });

    tstTrack.addEventListener('mouseenter', stopAuto);
    tstTrack.addEventListener('mouseleave', startAuto);
    tstTrack.addEventListener('touchstart', stopAuto, { passive: true });
    tstTrack.addEventListener('touchend', restartAuto, { passive: true });
    window.addEventListener('resize', paintDots);

    paintDots();
    startAuto();
  }
    var whyCards = document.querySelectorAll('.wcard');

  whyCards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
      card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
    });
  });
})();