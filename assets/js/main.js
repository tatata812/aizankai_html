$(function () {
  const $button = $('.site-header__menu-btn');
  const $menu = $('.sp-menu');
  const $overlay = $('.sp-menu__overlay');

  if (!$button.length || !$menu.length || !$overlay.length || typeof gsap === 'undefined') return;

  const menuAnimation = gsap.timeline({ paused: true });
  menuAnimation
    .to($overlay, { autoAlpha: 1, duration: 0.25, ease: 'power2.out' }, 0)
    .to($menu, { xPercent: 0, duration: 0.35, ease: 'power3.out' }, 0);
  menuAnimation.eventCallback('onReverseComplete', function () {
    $menu.removeClass('is-open');
    $overlay.removeClass('is-open');
  });

  gsap.set($menu, { xPercent: 100 });
  gsap.set($overlay, { autoAlpha: 0 });

  const setMenu = (isOpen) => {
    $button.attr({
      'aria-expanded': String(isOpen),
      'aria-label': isOpen ? 'メニューを閉じる' : 'メニューを開く'
    });
    $menu.attr('aria-hidden', String(!isOpen)).prop('inert', !isOpen);
    if (isOpen) {
      $menu.addClass('is-open');
      $overlay.addClass('is-open');
    }
    $('body').toggleClass('is-sp-menu-open', isOpen);
    menuAnimation.reversed(!isOpen).play();
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
    if (window.innerWidth > 767) setMenu(false);
  });
});
