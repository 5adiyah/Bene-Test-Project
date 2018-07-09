(function($, Drupal, document) {
  Drupal.behaviors.bene = {
    attach: function() {
      $(document).ready(function() {
        // Add button to mobile menu
        $('.mobile-nav .menu--main .menu li:last-of-type a').clone().addClass('mobile-button').appendTo($('.site-header'));

        // Toggle subnav
        var el = $('#block-benesubnavigation'),
            isMobile = false;
        el.css('z-index') == 10 ? isMobile = true : isMobile = false;
        if (isMobile) {
          var subnavToggle = el.find('ul.menu > li.menu-item--active-trail > a');
          var subnavTarget = el.find('ul.menu ul.menu');
          subnavToggle.once().on('click', function(e) {
            e.preventDefault();e.stopPropagation();
            subnavTarget.slideToggle();
          });
        };
      });
    }
  };
})(jQuery, Drupal, document);
