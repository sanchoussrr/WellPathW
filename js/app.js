/* ============================================
   WellPath — Main Application Script
   ============================================ */

(function () {
  'use strict';

  /* ========= i18n ENGINE ========= */
  var currentLang = 'en';

  function setLang(lang) {
    currentLang = lang;
    document.documentElement.lang = lang === 'ua' ? 'uk' : lang;
    var dict = T[lang] || T.en;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key]) el.textContent = dict[key];
    });
    document.querySelectorAll('.lang-btn').forEach(function (b) {
      b.classList.toggle('active', b.dataset.lang === lang);
    });
    try {
      localStorage.setItem('wellpath-lang', lang);
    } catch (e) { }
  }

  document.querySelectorAll('.lang-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      setLang(b.dataset.lang);
    });
  });

  // Restore saved language
  try {
    var saved = localStorage.getItem('wellpath-lang');
    if (saved && T[saved]) setLang(saved);
  } catch (e) { }

  /* ========= LOADER ========= */
  window.addEventListener('load', function () {
    setTimeout(function () {
      document.getElementById('loader').classList.add('done');
      document.body.style.overflow = 'auto';
    }, 2400);
  });

  /* ========= PARTICLES ========= */
  var pc = document.getElementById('pts');

  function createParticle() {
    var p = document.createElement('div');
    p.classList.add('pt');
    p.style.left = Math.random() * 100 + '%';
    p.style.top = '100%';
    var s = Math.random() * 2.5 + 1;
    p.style.width = s + 'px';
    p.style.height = s + 'px';
    p.style.animationDuration = Math.random() * 18 + 12 + 's';
    p.style.animationDelay = Math.random() * 4 + 's';
    pc.appendChild(p);
    setTimeout(function () {
      p.remove();
    }, 30000);
  }

  setInterval(createParticle, 800);
  for (var i = 0; i < 12; i++) setTimeout(createParticle, i * 300);

  /* ========= FLOATING SHAPES ========= */
  var fs = document.getElementById('floatShapes');

  function createShape() {
    var s = document.createElement('div');
    s.classList.add('float-shape');
    var size = Math.random() * 80 + 20;
    s.style.width = size + 'px';
    s.style.height = size + 'px';
    s.style.left = Math.random() * 100 + '%';
    s.style.top = '110%';
    s.style.animationDuration = Math.random() * 20 + 15 + 's';
    s.style.animationDelay = Math.random() * 5 + 's';
    if (Math.random() > .5) s.style.borderRadius = (Math.random() * 30 + 10) + '%';
    fs.appendChild(s);
    setTimeout(function () {
      s.remove();
    }, 35000);
  }

  setInterval(createShape, 3000);
  for (var j = 0; j < 5; j++) setTimeout(createShape, j * 600);

  /* ========= SCROLL REVEAL ========= */
  var ro = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('on');
      }
    });
  }, { threshold: .08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.rv,.rv-l,.rv-r,.rv-s,.rv-rot,.stagger-children').forEach(function (el) {
    ro.observe(el);
  });

  /* ========= NAV SCROLL ========= */
  window.addEventListener('scroll', function () {
    var nav = document.getElementById('nav');
    nav.classList.toggle('scrolled', window.scrollY > 80);
  });

  /* ========= COUNTERS ========= */
  var counterElements = document.querySelectorAll('.h-stat .n');
  var countersStarted = false;

  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        counterElements.forEach(function (el) {
          var target = parseInt(el.dataset.count);
          var prefix = el.dataset.prefix || '';
          var suffix = el.dataset.suffix || '';
          var duration = 2200;
          var start = performance.now();

          function update(timestamp) {
            var progress = Math.min((timestamp - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.floor(target * eased);
            el.textContent = prefix + (target >= 1000 ? current.toLocaleString() : current) + suffix;
            if (progress < 1) requestAnimationFrame(update);
          }

          requestAnimationFrame(update);
        });
      }
    });
  }, { threshold: .4 });

  counterElements.forEach(function (el) {
    counterObserver.observe(el);
  });

  /* ========= SMOOTH SCROLL NAV ========= */
  document.querySelectorAll('.nav-center a').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      document.getElementById('navLinks').classList.remove('mob-open');
    });
  });

  /* ========= HERO PARALLAX ========= */
  var heroSection = document.querySelector('.hero');
  heroSection.addEventListener('mousemove', function (e) {
    var rect = heroSection.getBoundingClientRect();
    var x = (e.clientX - rect.left) / rect.width - .5;
    var y = (e.clientY - rect.top) / rect.height - .5;
    var g1 = document.querySelector('.hero-g1');
    var g2 = document.querySelector('.hero-g2');
    var g3 = document.querySelector('.hero-g3');
    if (g1) g1.style.transform = 'translate(' + x * 40 + 'px,' + y * 40 + 'px)';
    if (g2) g2.style.transform = 'translate(' + x * -30 + 'px,' + y * -30 + 'px)';
    if (g3) g3.style.transform = 'translate(' + x * 20 + 'px,' + y * 20 + 'px)';
  });

  /* ========= 3D TILT CARDS ========= */
  document.querySelectorAll('.proj,.team-card,.value-card,.app-feat').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - .5;
      var y = (e.clientY - rect.top) / rect.height - .5;
      card.style.transform = 'perspective(1000px) rotateY(' + x * 4 + 'deg) rotateX(' + y * -4 + 'deg) translateY(-4px)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateY(0)';
    });
  });

  /* ========= MAGNETIC CTA ========= */
  document.querySelectorAll('.cta-b').forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      var rect = btn.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = 'translate(' + x * .18 + 'px,' + y * .18 + 'px) scale(1.06)';
    });
    btn.addEventListener('mouseleave', function () {
      btn.style.transform = 'translate(0,0) scale(1)';
    });
  });

  /* ========= TEXT SCRAMBLE ========= */
  function TextScramble(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}=+*^?#________';
    this.update = this.update.bind(this);
  }

  TextScramble.prototype.setText = function (newText) {
    var self = this;
    var oldText = this.el.innerText;
    var length = Math.max(oldText.length, newText.length);
    var promise = new Promise(function (resolve) {
      self.resolve = resolve;
    });

    this.queue = [];
    for (var i = 0; i < length; i++) {
      this.queue.push({
        from: oldText[i] || '',
        to: newText[i] || '',
        start: Math.floor(Math.random() * 40),
        end: Math.floor(Math.random() * 40) + Math.floor(Math.random() * 40)
      });
    }

    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  };

  TextScramble.prototype.update = function () {
    var self = this;
    var output = '';
    var complete = 0;

    for (var i = 0; i < this.queue.length; i++) {
      var q = this.queue[i];
      if (this.frame >= q.end) {
        complete++;
        output += q.to;
      } else if (this.frame >= q.start) {
        if (!q.char || Math.random() < .28) {
          q.char = this.chars[Math.floor(Math.random() * this.chars.length)];
        }
        output += '<span style="color:rgba(59,110,232,.3)">' + q.char + '</span>';
      } else {
        output += q.from;
      }
    }

    this.el.innerHTML = output;

    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  };

  document.querySelectorAll('.sec-lbl').forEach(function (label) {
    var originalText = label.textContent;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          new TextScramble(label).setText(originalText);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .5 });
    observer.observe(label);
  });

  /* ========= PROGRESS BAR ========= */
  var progressBar = document.getElementById('prog');
  window.addEventListener('scroll', function () {
    var scrollTop = document.documentElement.scrollTop;
    var scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    progressBar.style.width = (scrollTop / scrollHeight) * 100 + '%';
  });

  /* ========= PHONE PARALLAX ========= */
  var phoneFrame = document.querySelector('.phone-frame');
  if (phoneFrame) {
    var phoneSection = document.querySelector('.app-showcase');
    phoneSection.addEventListener('mousemove', function (e) {
      var rect = phoneSection.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - .5;
      var y = (e.clientY - rect.top) / rect.height - .5;
      phoneFrame.style.transform = 'perspective(1000px) rotateY(' + x * 12 + 'deg) rotateX(' + y * -8 + 'deg)';
    });
    phoneSection.addEventListener('mouseleave', function () {
      phoneFrame.style.transform = 'perspective(1000px) rotateY(0) rotateX(0)';
    });
  }

  /* ========= GLOW FOLLOW ========= */
  document.querySelectorAll('.proj').forEach(function (proj) {
    var glow = proj.querySelector('.glow');
    if (glow) {
      proj.addEventListener('mousemove', function (e) {
        var rect = proj.getBoundingClientRect();
        glow.style.left = (e.clientX - rect.left - 175) + 'px';
        glow.style.top = (e.clientY - rect.top - 175) + 'px';
      });
    }
  });

  /* ========= SMOOTH HOVER GLOW ON TECH TAGS ========= */
  document.querySelectorAll('.tech-t').forEach(function (tag) {
    tag.addEventListener('mousemove', function (e) {
      var rect = tag.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      tag.style.background = 'radial-gradient(circle at ' + x + 'px ' + y + 'px,rgba(59,110,232,.12),rgba(59,110,232,.04))';
    });
    tag.addEventListener('mouseleave', function () {
      tag.style.background = 'rgba(59,110,232,.04)';
    });
  });

})();
