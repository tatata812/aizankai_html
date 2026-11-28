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
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .fromTo('.mainvisual__copy', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: .9 })
      .fromTo($slider, { autoAlpha: 0, y: 34, scale: .96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 1, clearProps: 'opacity,visibility,transform' }, '-=.42');

    const sectionAnimations = {
      '.support-flow': '.support-flow__text, .support-flow__link',
      '.news': '.news__panel',
      '.activity-report': '.activity-report__card, .activity-report__more-wrap'
    };
    const sectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const elements = entry.target.querySelectorAll(sectionAnimations[`.${entry.target.classList[0]}`]);
        gsap.fromTo(elements, { autoAlpha: 0, y: 28, scale: .985 }, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: .78,
          stagger: .12,
          ease: 'power3.out',
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

  // セクションタイトルとカラーデコレーションを連動して表示
  const sectionTitleSelector = [
    '.support-flow__title',
    '.news__title',
    '.activity-report__title',
    '.foundation-intro__title',
    '.foundation-greeting__title',
    '.grant-guideline__title',
    '.grant-details__heading',
    '.grant-organization-list__title'
  ].join(',');

  if (hasGsap && !prefersReducedMotion) {
    const titleObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const title = entry.target;
        const section = title.closest('.support-flow, .news, .activity-report, .foundation-intro, .foundation-greeting, .grant-guideline, .grant-details__block, .grant-organization-list');
        const decoration = section?.querySelector('.support-flow__decoration, .news__decoration, .activity-report__decoration, .foundation-intro__decoration, .foundation-greeting__decoration, .grant-guideline__decoration');
        const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

        timeline.fromTo(title, { autoAlpha: 0, y: 22, scale: .94, filter: 'blur(5px)' }, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: .72,
          clearProps: 'opacity,visibility,transform,filter'
        });

        if (decoration) {
          timeline.fromTo(decoration, { autoAlpha: 0, scaleX: .2, y: 8 }, {
            autoAlpha: 1,
            scaleX: 1,
            y: 0,
            duration: .68,
            ease: 'power2.out',
            transformOrigin: 'center center',
            clearProps: 'opacity,visibility,transform'
          }, '-=.38');
        }

        observer.unobserve(title);
      });
    }, { threshold: .2, rootMargin: '0px 0px -24px 0px' });

    document.querySelectorAll(sectionTitleSelector).forEach((title) => titleObserver.observe(title));
  }

  // 下層ページのメインビジュアルを順番に表示
  const $subpageHero = $('.about-hero');
  if ($subpageHero.length && hasGsap && !prefersReducedMotion) {
    const $heroNavList = $subpageHero.find('.about-hero__nav-list');
    const $heroNavItems = $heroNavList.children('li');
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .fromTo($subpageHero.find('.mainvisual__copy'), { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: .72 })
      .fromTo($subpageHero.find('.about-hero__title'), { autoAlpha: 0, y: 26, scale: .96 }, { autoAlpha: 1, y: 0, scale: 1, duration: .72, clearProps: 'opacity,visibility,transform' }, '-=.32')
      .fromTo($heroNavList, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: .68, ease: 'power2.inOut', clearProps: 'clipPath' }, '-=.28')
      .fromTo($heroNavItems, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .42, stagger: .12, clearProps: 'opacity,visibility,transform' }, '-=.48');
  }

  // 下層ページのスクロール表示アニメーション
  const pageRevealSelector = [
    '.foundation-intro__text',
    '.foundation-intro__figure',
    '.foundation-greeting__panel',
    '.grant-guideline__lead',
    '.grant-details__block',
    '.grant-documents__note',
    '.grant-document',
    '.grant-organization-list__panel',
    '.contact-section__methods',
    '.contact-section__faq-lead',
    '.contact-section__faq-button',
    '.faq-list__item'
  ].join(',');

  if (hasGsap && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);
      if (!visibleEntries.length) return;

      visibleEntries.forEach((entry) => observer.unobserve(entry.target));
      gsap.fromTo(visibleEntries.map((entry) => entry.target), { autoAlpha: 0, y: 26, scale: .985 }, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: .78,
          stagger: .1,
          ease: 'power3.out',
          clearProps: 'opacity,visibility,transform'
        });
    }, { threshold: .12, rootMargin: '0px 0px -36px 0px' });

    document.querySelectorAll(pageRevealSelector).forEach((element) => {
      revealObserver.observe(element);
    });

    // 背景の水玉をゆっくり漂わせる
    gsap.utils.toArray('.foundation-intro__background, .activity-report__background, .support-flow__background, .grant-guideline__background').forEach((element, index) => {
      gsap.to(element, {
        y: index % 2 ? -12 : 12,
        duration: 5.5 + (index % 3) * .7,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    });

    // ボタンやカード内の矢印に小さな反応をつける
    $(document).on('mouseenter focusin', '.button, .activity-report__card, .grant-document__download', function () {
      gsap.to($(this).find('.button__arrow'), { x: 4, duration: .24, ease: 'power2.out' });
      gsap.to($(this).find('img').not('.activity-report__image'), { x: 2, duration: .24, ease: 'power2.out' });
    });
    $(document).on('mouseleave focusout', '.button, .activity-report__card, .grant-document__download', function () {
      gsap.to($(this).find('.button__arrow, img').not('.activity-report__image'), { x: 0, duration: .24, ease: 'power2.out' });
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
