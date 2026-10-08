(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile menu
  var toggle = document.getElementById('menuToggle');
  var navLinks = document.getElementById('navLinks');

  function setMenu(open) {
    navLinks.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  }

  toggle.addEventListener('click', function () {
    setMenu(!navLinks.classList.contains('open'));
  });
  navLinks.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      setMenu(false);
      toggle.focus();
    }
  });

  // Header shrinks and gains a shadow once scrolled
  var header = document.getElementById('siteHeader');
  var progress = document.getElementById('scrollProgress');
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 60);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.setProperty('--progress', max > 0 ? Math.min(window.scrollY / max, 1) : 0);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Booking: Calendly calendar, switched by the consultation picker.
  // Paste Sue's Calendly event links between the quotes, e.g. 'https://calendly.com/sue-name/consultation'.
  // If she has a single Calendly link, use the same link for all four.
  // While a link is empty, visitors see a message pointing them to the contact form instead.
  var CALENDLY = {
    'Free Discovery Call': 'https://calendly.com/nutritionwithsusan/30min',
    'Initial Nutrition Assessment': 'https://calendly.com/nutritionwithsusan/new-meeting',
    '1:1 Coaching Package': 'https://calendly.com/nutritionwithsusan/1-1-coaching-package',
    'Group Programme': 'https://calendly.com/nutritionwithsusan/group-programme'
  };
  // Match the calendar to the site's colours; the cream background lets Calendly's card sit on the page.
  // hide_event_type_details removes Calendly's own details panel, since the consultation cards
  // and the "Pick a time for…" heading already show that information.
  var CALENDLY_STYLE = 'hide_event_type_details=1&primary_color=5c7a52&text_color=2c2c2a&background_color=f9f6f0';

  var options = document.querySelectorAll('.booking-option');
  var selectedLabel = document.getElementById('selectedService');
  var selectedMeta = document.getElementById('selectedMeta');
  var embed = document.getElementById('calendlyEmbed');
  var fallbackLink = document.getElementById('calendlyLink');
  var bookingCard = document.querySelector('.booking-calendar');
  var singleColumn = window.matchMedia('(max-width: 960px)');
  var calendlyRequested = false;
  var currentService = 'Free Discovery Call';

  function calendlyUrl(service) {
    var url = CALENDLY[service];
    return url + (url.indexOf('?') === -1 ? '?' : '&') + CALENDLY_STYLE;
  }

  var hasAnyCalendly = Object.keys(CALENDLY).some(function (k) { return CALENDLY[k]; });

  function showComingSoon() {
    embed.innerHTML =
      '<div class="calendly-soon">' +
        '<p class="calendly-soon-title">Online booking is coming soon</p>' +
        '<p>In the meantime, send a request and Sue will get back to you to arrange a time.</p>' +
        '<a href="#contact" class="btn-primary">Send a Request <span class="arrow">→</span></a>' +
      '</div>';
    fallbackLink.parentNode.hidden = true;
  }

  function showCalendar() {
    if (!CALENDLY[currentService]) return showComingSoon();
    fallbackLink.parentNode.hidden = false;
    var url = calendlyUrl(currentService);
    fallbackLink.href = CALENDLY[currentService];
    if (!window.Calendly) return; // Still loading; the script's onload will call this again
    embed.innerHTML = '';
    window.Calendly.initInlineWidget({ url: url, parentElement: embed });
  }

  // Load Calendly's script only when the booking section gets close, so it doesn't slow the page
  function loadCalendly() {
    if (calendlyRequested) return;
    calendlyRequested = true;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    document.head.appendChild(link);
    var script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.onload = showCalendar;
    script.onerror = function () {
      embed.innerHTML = '<p class="calendly-loading">The calendar couldn\'t load. Please use the link below.</p>';
    };
    document.head.appendChild(script);
  }

  if (!hasAnyCalendly) {
    showComingSoon();
  } else if ('IntersectionObserver' in window) {
    var bookingObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        loadCalendly();
        bookingObserver.disconnect();
      }
    }, { rootMargin: '600px 0px' });
    bookingObserver.observe(embed);
  } else {
    loadCalendly();
  }

  options.forEach(function (option) {
    option.addEventListener('click', function () {
      options.forEach(function (o) { o.setAttribute('aria-pressed', 'false'); });
      option.setAttribute('aria-pressed', 'true');
      currentService = option.getAttribute('data-name');
      selectedLabel.textContent = currentService;
      selectedMeta.textContent = option.querySelector('.booking-option-tag').textContent;
      if (hasAnyCalendly) loadCalendly();
      showCalendar();
      // On phones the calendar sits below the list, so bring it into view
      if (singleColumn.matches) {
        bookingCard.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      }
    });
  });

  // Forms: sent with EmailJS (https://www.emailjs.com), which emails each submission to Sue.
  // All three forms share one EmailJS template; see "Set up the forms" in README.md.
  // These values are designed to be public, so it is safe to keep them here.
  var EMAILJS = {
    publicKey: 'wQT8H7bAe3bszXXnZ',
    serviceId: 'service_gcu373b',
    templateId: 'template_tfzbd2m'
  };
  var FALLBACK = 'Sorry, something went wrong. Please try again, or email emuze.susan123@yahoo.com.';
  var SKIP_FIELDS = ['botcheck', 'consent'];

  // Turns the form into a readable list for the email, using each field's visible label
  function describeFields(form) {
    var lines = [];
    new FormData(form).forEach(function (value, name) {
      if (SKIP_FIELDS.indexOf(name) !== -1 || !String(value).trim()) return;
      var field = form.querySelector('[name="' + name + '"]');
      var label = field.id && form.querySelector('label[for="' + field.id + '"]');
      lines.push((field.getAttribute('data-label') || (label && label.textContent) || name) + ': ' + value);
    });
    return lines.join('\n');
  }

  function sendEmail(form) {
    var get = function (name) {
      var field = form.querySelector('[name="' + name + '"]');
      return field ? field.value.trim() : '';
    };
    var name = [get('first-name'), get('last-name')].join(' ').trim();

    return fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: EMAILJS.serviceId,
        template_id: EMAILJS.templateId,
        user_id: EMAILJS.publicKey,
        template_params: {
          subject: form.getAttribute('data-subject') + (name ? ' from ' + name : ''),
          from_name: name || 'Website visitor',
          name: name || 'Website visitor',
          time: new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/London' }),
          reply_to: get('email'),
          message: describeFields(form)
        }
      })
    }).then(function (res) {
      if (!res.ok) return res.text().then(function (text) { throw new Error(text || 'HTTP ' + res.status); });
    });
  }

  document.querySelectorAll('form.js-form').forEach(function (form) {
    var status = form.querySelector('.form-status');
    var button = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.className = 'form-status';
      status.textContent = 'Sending…';
      button.disabled = true;

      // Bots fill in the hidden checkbox; pretend it worked without sending anything
      var isBot = form.querySelector('[name="botcheck"]').checked;

      (isBot ? Promise.resolve() : sendEmail(form))
        .then(function () {
          status.classList.add('is-success');
          status.textContent = form.getAttribute('data-success');
          form.reset();
        })
        .catch(function (err) {
          console.error('Form submission failed:', err.message);
          status.classList.add('is-error');
          status.textContent = FALLBACK;
        })
        .then(function () {
          button.disabled = false;
        });
    });
  });

  document.getElementById('year').textContent = new Date().getFullYear();

  // Count numbers up from zero, e.g. "70%+"
  function countUp(el) {
    if (reduceMotion || el.dataset.counted) return;
    el.dataset.counted = 'true';
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var start = null;
    var duration = 1600;
    function step(ts) {
      if (start === null) start = ts;
      var t = Math.min((ts - start) / duration, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3))) + suffix;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Scroll reveal, staggering siblings (cards in a grid, hero lines)
  var revealEls = document.querySelectorAll('.reveal');

  revealEls.forEach(function (el) {
    var siblings = Array.prototype.filter.call(el.parentNode.children, function (c) {
      return c.classList.contains('reveal');
    });
    el.style.setProperty('--delay', (siblings.indexOf(el) * 0.12) + 's');
  });

  function reveal(el) {
    el.classList.add('is-visible');
    el.querySelectorAll('[data-count]').forEach(countUp);
    // Once it has arrived, hand control back to the element's own hover transitions
    var delay = parseFloat(el.style.getPropertyValue('--delay')) || 0;
    setTimeout(function () {
      el.classList.remove('reveal', 'is-visible');
      el.style.removeProperty('--delay');
    }, 1200 + delay * 1000);
  }

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.remove('reveal'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { observer.observe(el); });
  }
})();
