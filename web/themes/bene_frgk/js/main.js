(function($, Drupal, document) {
  Drupal.behaviors.bene = {
    attach: function() {
      $(document).ready(function() {
        // Add button to mobile menu
        $('.mobile-nav .menu--main .menu li:last-of-type a').clone().addClass('mobile-button').appendTo($('.site-header'));

        function windowWidth() {
          var ww = $(window).width();
          $(window).resize(function() {
            var ww = $(window).width();
            return ww;
          });
          return ww;
        };

        // Toggle subnav
        var subnavToggle = $('#block-benesubnavigation ul.menu > li.menu-item--expanded.menu-item--active-trail > a');
        var subnavTarget = $('#block-benesubnavigation ul.menu ul.menu');
        subnavToggle.unbind('click').on('click', function(e) {
          // Get the window width everytime so this toggles only on mobile
          if (windowWidth() < 415) {
            e.preventDefault();
            subnavTarget.slideToggle();
          }
        });
      });
    }
  };
})(jQuery, Drupal, document);
