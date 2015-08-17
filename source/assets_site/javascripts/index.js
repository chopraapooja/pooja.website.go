(function () {
  // bail on mobile
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return;
  }

  var skr = skrollr.init(),
    $cards = $('.cards'),
    $images = $cards.find('.images'),
    $window = $(window);

  var cachePosition = false;

  function reposition() {
    var cardTop = $cards.position().top,
      cardHeight = $cards.outerHeight();
      cardBottom = cardTop + cardHeight,
      singleCardHeight = $cards.find('.card').outerHeight(),
      $image = $images.find('img'),
      imageHeight = $image.height(),
      windowHeight = $window.height(),
      scrollTop = $window.scrollTop(),
      imageOffset = 0,
      percentageOfScreenWhenImageHasToStopScrolling = 0.5;

    if (scrollTop + windowHeight * percentageOfScreenWhenImageHasToStopScrolling + imageOffset < cardTop + singleCardHeight/2) { // above
      cachePosition = false;
      $images.css({
        position: 'absolute',
        top: singleCardHeight / 2 - imageHeight / 2,
        bottom: ''
      });
    } else if (scrollTop + windowHeight * percentageOfScreenWhenImageHasToStopScrolling + imageOffset > cardBottom - singleCardHeight/2) { // below
      cachePosition = false;
      $images.css({
        position: 'absolute',
        top: '',
        bottom: singleCardHeight / 2 - imageHeight / 2
      });
    } else { // between
      if (!cachePosition) {
        $images.css({
          position: 'fixed',
          top: windowHeight * percentageOfScreenWhenImageHasToStopScrolling - imageHeight/2 + imageOffset
        });

        cachePosition = true;
      }
    }
  }


  $('[data-component=jumpScoll]').on('click', function() {
    event.preventDefault();
    var $this = $(this),
      target = $this.data('target');
    if (!target) return;

    $('html body').animate({
      scrollTop: $(target).offset().top
    }, 600);
  });

  $window.on('scroll', function() {
    reposition();
  });

  $window.on('resize', function() {
    cachePosition = false;
    reposition();
  });
}());
