// scroll-optimized.js
AOS.init({
  duration: 800,
  easing: 'slide'
});

(function($) {
  "use strict";

  var $win    = $(window),
      isMobile = $win.width() < 768,
      throttleTimeout;

  // 1. Loader
  setTimeout(function() {
    $('#ftco-loader').removeClass('show');
  }, 1);

  // 2. Parallax & Scrollax (desktop only)
  if (!isMobile) {
    $win.stellar({
      responsive: true,
      parallaxBackgrounds: true,
      parallaxElements: true,
      horizontalScrolling: false,
      hideDistantElements: false,
      scrollProperty: 'scroll'
    });
    $.Scrollax();
  }

  // 3. Burger menu toggle
  $('body').on('click', '.js-fh5co-nav-toggle', function(e) {
    e.preventDefault();
    $(this).toggleClass('active');
  });

  // 4. Smooth one-page nav
  $(document).on('click', '#ftco-nav a[href^="#"], #navi a[href^="#"]', function(e) {
    e.preventDefault();
    var target = $(this).attr('href');
    $('html, body').animate({
      scrollTop: $(target).offset().top - (isMobile ? 50 : 70)
    }, 500);
    if (history.pushState) {
      history.pushState(null, null, target);
    } else {
      location.hash = target;
    }
  });

  // 5. Swiper slider
  new Swiper(".swiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    coverflowEffect: { rotate:0, stretch:0, depth:100, modifier:2, slideShadows:true },
    spaceBetween:60,
    loop:true,
    speed:1000,
    autoplay:{ delay:2000, disableOnInteraction:false },
    pagination:{ el:".swiper-pagination", clickable:true }
  });

  // 6. Owl carousel
  $('.home-slider').owlCarousel({
    loop:true, autoplay:true, margin:0,
    animateOut:'fadeOut', animateIn:'fadeIn',
    nav:false, autoplayHoverPause:false, items:1
  });

  // 7. Navbar hover dropdown
  $('nav .dropdown').hover(
    function() {
      $(this).addClass('show')
             .find('> a').attr('aria-expanded', true)
             .siblings('.dropdown-menu').addClass('show');
    },
    function() {
      $(this).removeClass('show')
             .find('> a').attr('aria-expanded', false)
             .siblings('.dropdown-menu').removeClass('show');
    }
  );

  // 8. Throttled scroll handler for navbar classes
  function onScroll() {
    var st     = $win.scrollTop(),
        navbar = $('.ftco_navbar'),
        wrap   = $('.js-scroll-wrap');

    // scrolled class
    navbar.toggleClass('scrolled', st > 150);

    // awake / sleep classes
    if (st > 350) {
      navbar.addClass('awake');
      wrap.addClass('sleep');
    } else {
      navbar.removeClass('awake').addClass('sleep');
      wrap.removeClass('sleep');
    }
  }

  $win.on('scroll', function() {
    if (!throttleTimeout) {
      throttleTimeout = setTimeout(function() {
        throttleTimeout = null;
        onScroll();
      }, 100);
    }
  });

  // 9. Counter animation via waypoint
  $('#section-counter, .hero-wrap, .ftco-counter, .ftco-about').waypoint(function(dir) {
    if (dir === 'down' && !$(this.element).hasClass('ftco-animated')) {
      var numStep = $.animateNumber.numberStepFactories.separator(',');
      $('.number').each(function() {
        $(this).animateNumber({ number: $(this).data('number'), numberStep: numStep }, 7000);
      });
      $(this.element).addClass('ftco-animated');
    }
  }, { offset: '95%' });

  // 10. Content animations via waypoint
  $('.ftco-animate').waypoint(function(dir) {
    if (dir === 'down' && !$(this.element).hasClass('ftco-animated')) {
      $(this.element).addClass('item-animate');
      setTimeout(function() {
        $('body .ftco-animate.item-animate').each(function(k) {
          var el = $(this),
              effect = el.data('animate-effect') || 'fadeInUp';
          setTimeout(function() {
            el.addClass(effect + ' ftco-animated').removeClass('item-animate');
          }, k * 50);
        });
      }, 100);
    }
  }, { offset: '95%' });

  // 11. Magnific Popup
  $('.image-popup').magnificPopup({
    type: 'image',
    closeOnContentClick: true,
    fixedContentPos: true,
    mainClass: 'mfp-no-margins mfp-with-zoom',
    gallery: { enabled:true, navigateByImgClick:true, preload:[0,1] },
    zoom: { enabled:true, duration:300 }
  });
  $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
    disableOn:700, type:'iframe', mainClass:'mfp-fade',
    removalDelay:160, preloader:false, fixedContentPos:false
  });

  // 12. “Go here” click
  $('.mouse-icon').click(function(e) {
    e.preventDefault();
    $('html, body').animate({
      scrollTop: $('.goto-here').offset().top
    }, 500, 'easeInOutExpo');
  });

  // 13. Rotating Text
  function TxtRotate(el, toRotate, period) {
    this.toRotate = toRotate; this.el = el; this.loopNum = 0;
    this.period = parseInt(period,10) || 2000; this.txt = '';
    this.tick(); this.isDeleting = false;
  }
  TxtRotate.prototype.tick = function() {
    var i = this.loopNum % this.toRotate.length,
        full = this.toRotate[i];
    this.txt = this.isDeleting
      ? full.substring(0, this.txt.length-1)
      : full.substring(0, this.txt.length+1);
    this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';
    var delta = this.isDeleting ? 100/2 : 100;
    if (!this.isDeleting && this.txt === full) { delta = this.period; this.isDeleting = true; }
    else if (this.isDeleting && this.txt === '') { this.isDeleting = false; this.loopNum++; delta = 500; }
    setTimeout(this.tick.bind(this), delta);
  };
  window.onload = function() {
    Array.from(document.getElementsByClassName('txt-rotate')).forEach(function(el) {
      var toRotate = el.getAttribute('data-rotate'),
          period   = el.getAttribute('data-period');
      if (toRotate) new TxtRotate(el, JSON.parse(toRotate), period);
    });
    // inject cursor CSS
    var css = document.createElement("style");
    css.innerHTML = ".txt-rotate > .wrap { border-right:0.08em solid #666; color:#8c52ff; }";
    document.body.appendChild(css);
  };

  // 14. Scrollspy
  (function() {
    var sections = [], current = null,
        $links   = $('#navi a');
    $links.each(function() {
      var $sec = $($(this).attr('href'));
      if ($sec.length) sections.push($sec);
    });
    $win.on('scroll', function() {
      var pos = $win.scrollTop() + $win.height()/2,
          id  = null;
      sections.forEach(function(sec) {
        if (pos > sec.offset().top) id = sec.attr('id');
      });
      if (id !== current) {
        current = id;
        $links.removeClass('current')
              .filter('[href="#'+id+'"]').addClass('current');
      }
    });
  })();

  // 15. Circular progress bars
  $(".progress").each(function(){
    var val = +$(this).data('value'),
        left  = $(this).find('.progress-left .progress-bar'),
        right = $(this).find('.progress-right .progress-bar');
    function deg(p){ return p/100*360; }
    if (val>0) {
      if (val<=50) right.css('transform','rotate('+deg(val)+'deg)');
      else {
        right.css('transform','rotate(180deg)');
        left.css('transform','rotate('+deg(val-50)+'deg)');
      }
    }
  });

  // 16. AJAX Contact Form
  document.getElementById("contact-form")
    .addEventListener("submit", function(e) {
      e.preventDefault();
      var fd = new FormData(this),
          xhr = new XMLHttpRequest();
      xhr.open("POST","process_form.php",true);
      xhr.setRequestHeader("X-Requested-With","XMLHttpRequest");
      xhr.onload = function(){
        var res = JSON.parse(xhr.responseText);
        alert(res.success ? "Thank you! Your message has been sent." : "Oops! Something went wrong.");
        if (res.success) document.getElementById("contact-form").reset();
      };
      xhr.onerror = xhr.onload;
      xhr.send(fd);
    });

})(jQuery);
