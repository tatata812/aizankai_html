$(function () {
  const $button = $('.site-header__menu-btn');
  const $menu = $('.sp-menu');
  const $overlay = $('.sp-menu__overlay');
  const $slider = $('.mainvisual__slider');

  // メインビジュアルの中央寄せスライダー
  if ($slider.length && $.fn.slick) {
    $slider.slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      centerMode: true,
      centerPadding: '28%',
      autoplay: true,
      autoplaySpeed: 4500,
      speed: 700,
      arrows: false,
      dots: false,
      pauseOnHover: true,
      pauseOnFocus: true
    });
  }

  const $newsCategories = $('.news__category');
  const $newsItems = $('.news__item');
  const hasGsap = typeof window.gsap !== 'undefined';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // トップページの表示アニメーション
  if ($slider.length && hasGsap && !prefersReducedMotion) {
    gsap.timeline({ defaults: { ease: 'power2.out' } })
      .fromTo('.mainvisual__copy', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: .75 })
      .fromTo($slider, { autoAlpha: 0, y: 24, scale: .97 }, { autoAlpha: 1, y: 0, scale: 1, duration: .8, clearProps: 'opacity,visibility,transform' }, '-=.35');

    const sectionAnimations = {
      '.support-flow': '.support-flow__title, .support-flow__decoration, .support-flow__text, .support-flow__link',
      '.news': '.news__title, .news__decoration, .news__panel',
      '.activity-report': '.activity-report__title, .activity-report__decoration, .activity-report__card, .activity-report__more-wrap'
    };
    const sectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const elements = entry.target.querySelectorAll(sectionAnimations[`.${entry.target.classList[0]}`]);
        gsap.fromTo(elements, { autoAlpha: 0, y: 22 }, {
          autoAlpha: 1,
          y: 0,
          duration: .65,
          stagger: .1,
          ease: 'power2.out',
          clearProps: 'opacity,visibility,transform'
        });
        observer.unobserve(entry.target);
      });
    }, { threshold: .14 });

    Object.keys(sectionAnimations).forEach((selector) => {
      const section = document.querySelector(selector);
      if (section) sectionObserver.observe(section);
    });
  }

  if ($newsCategories.length) {
    const $initialCategory = $newsCategories.filter('.is-active');

    if (hasGsap) {
      gsap.fromTo($initialCategory, {
        backgroundColor: '#91b6fb',
        borderColor: 'transparent',
        color: '#fff'
      }, {
        backgroundColor: '#fff',
        borderColor: '#3478f6',
        color: '#333',
        duration: .5,
        delay: .2,
        ease: 'power2.out'
      });
      gsap.fromTo($initialCategory.find('.news__category-dot'), {
        scale: 0,
        opacity: 0,
        y: -8
      }, {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: .4,
        delay: .45,
        ease: 'back.out(1.7)'
      });
    }

    $newsCategories.on('click', function () {
      const $currentCategory = $(this);
      const category = $currentCategory.data('news-filter');
      const $visibleItems = category === 'all'
        ? $newsItems
        : $newsItems.filter(`[data-news-category="${category}"]`);

      $newsCategories.removeClass('is-active').attr('aria-pressed', 'false');
      $currentCategory.addClass('is-active').attr('aria-pressed', 'true');

      if (hasGsap) {
        gsap.to($newsCategories.not($currentCategory), {
          backgroundColor: '#91b6fb',
          borderColor: 'transparent',
          color: '#fff',
          duration: .25
        });
        gsap.to($currentCategory, {
          backgroundColor: '#fff',
          borderColor: '#3478f6',
          color: '#333',
          duration: .25
        });
        gsap.to($newsCategories.find('.news__category-dot'), {
          scale: 0,
          opacity: 0,
          y: -8,
          duration: .2
        });
        gsap.fromTo($currentCategory.find('.news__category-dot'), {
          scale: 0,
          opacity: 0,
          y: -8
        }, {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: .4,
          delay: .12,
          ease: 'back.out(1.7)'
        });
      }

      $newsItems.stop(true, true).hide();
      $visibleItems.each(function (index) {
        const item = this;
        $(item).css('opacity', 0).show();
        if (hasGsap) {
          gsap.to(item, { opacity: 1, duration: .3, delay: index * .05 });
        } else {
          $(item).animate({ opacity: 1 }, 250);
        }
      });
    });
  }

  if (!$button.length || !$menu.length || !$overlay.length) return;

  // SPメニューの開閉状態
  const setMenu = function (isOpen) {
    $button.attr({
      'aria-expanded': String(isOpen),
      'aria-label': isOpen ? 'メニューを閉じる' : 'メニューを開く'
    });
    $menu.attr('aria-hidden', String(!isOpen)).prop('inert', !isOpen);
    $overlay.attr('aria-hidden', String(!isOpen));
    $menu.toggleClass('is-open', isOpen);
    $overlay.toggleClass('is-open', isOpen);
    $('body').toggleClass('is-sp-menu-open', isOpen);
  };

  $button.on('click', function () {
    setMenu($button.attr('aria-expanded') !== 'true');
  });

  $overlay.on('click', function () {
    setMenu(false);
  });

  $menu.find('a').on('click', function () {
    setMenu(false);
  });

  $(document).on('keydown', function (event) {
    if (event.key === 'Escape' && $button.attr('aria-expanded') === 'true') {
      setMenu(false);
      $button.trigger('focus');
    }
  });

  $(window).on('resize', function () {
    if (window.innerWidth > 820) setMenu(false);
  });
});
