(function($, Drupal, document) {
  Drupal.behaviors.bene = {
    attach: function(context, settings) {
      $(document).ready(function() {

        // Toggle subnav
        var toggleSubnav = function() {
          var el = $('#block-benesubnavigation'),
              isMobile;
          el.css('z-index') >= 10 ? isMobile = true : isMobile = false;
          if (isMobile) {
            if (! el.find('ul ul li').hasClass('menu-item--active-trail')) {
              el.find('> ul > li > a').once().click(function(e){
                e.preventDefault();e.stopPropagation();
                el.find('ul ul').slideToggle();
              });
            }
          }
        };
        toggleSubnav();

        // Wrap home page block in text element and reorder
        var arrangeHomeHero = function() {
          $('#block-benehomepagefeature').append('<div class="text"><div class="inner-text"></div></div>');
          $('#block-benehomepagefeature .text .inner-text').append($('#block-benehomepagefeature .field--name-bene-title'));
          $('#block-benehomepagefeature .text .inner-text').append($('#block-benehomepagefeature .field--name-bene-lead'));
          $('#block-benehomepagefeature .field--name-bene-lead').append($('#block-benehomepagefeature .field--name-bene-link a'));
          $('#block-benehomepagefeature .field--name-bene-link').remove();
        };
        arrangeHomeHero();

        // Rearrange footer block
        var arrangeFooter = function() {
          $('#block-benefooter', context)
            .prepend('<div class="right-column"></div>')
            .prepend('<div class="left-column"></div>');

          $('.left-column')
            .append($('#block-benefooter .menu'))
            .append($('#block-benefooter .social-links'));
          $('.right-column').append($('#block-benefooter .contact-links'));

          $('.additional-footer').remove();
        };
        arrangeFooter();

        var getHeight = function (el, i) {
          return $(el).height();
        }

        var splitTileGroups = function (tiles) {
          // we want to group 'tiles' in groups of 3
          return $.map(tiles, function (val, i) {
            if ((i + 1) % 3 === 0) {
              slice = tiles.slice(i - 2, i + 1);
              return slice;
            }
          });
        }

        // Equal heights for titles
        var equalHeights = function() {
          var tiles = $('.paragraph--type--tiles .paragraph--type--tile .tile-text');
          var groups = splitTileGroups($(tiles));
          // once we have our groups of 3, set maxHeights for that group only
          $.each(groups, function (group) {
            var group = $.makeArray($(this));
            var heights = $.map(group, getHeight);
            var maxHeight = Math.max(...heights);
            $(this).height(maxHeight);
          });
        };
        equalHeights();

        $(window).resize(function() {
            clearTimeout(window.resizedFinished);
            window.resizedFinished = setTimeout(function(){
              $('.paragraph--type--tile .tile-text').height('auto');
              equalHeights();
            }, 250);
        });

        $('.tile-text').once().each(function(){
          $(this).find('p.text-align-center').parent().parent().addClass('center');
          $(this).find('p.text-align-right').parent().parent().addClass('right');
        });

        $('figure .view-mode-embedded-half').parent().parent().addClass('embedded-half');

      }); // Document ready
    } // Attach
  }; // Drupal behaviors
})(jQuery, Drupal, document);
