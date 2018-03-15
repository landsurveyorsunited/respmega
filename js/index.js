// Handles animationEnd prefixes
var animEndEventNames = {

	'WebkitAnimation' : 'webkitAnimationEnd',
	'OAnimation' : 'oAnimationEnd',
	'msAnimation' : 'MSAnimationEnd',
	'animation' : 'animationend'

};

var animEndEventName = animEndEventNames[Modernizr.prefixed('animation')];


var $mainNav		= $('ul.main-nav'),
	$mainNavTrigger	= $('button.main-nav-trigger'),
	$subnav 		= $('ul.subnav'),
	$subnavTrigger 	= $('a.has-subnav-link'),
	$subnavGoBack   = '<li class=\"go-back\"><a href=\"#\"><span class=\"ion-arrow-left-c\"></span> Back</a></li>';


enquire.register("(max-width: 989px)", {

	// Only insert the HTML when the MQ is matched
	// We'll hide/show it on resize to reduce performance hiccups
	setup: function() {

		// Toggle Nav
		$mainNavTrigger.on('click', function(e) {

			$(this).toggleClass('active');

			if ( !$('.main-nav').is(':visible') ) {

				$('.main-nav')
					.show()
					.addClass('active nav-in')
					.on(animEndEventName, function(){

						$(this)
							.removeClass('nav-in')
							.show();

					});

			} else {

				$('.main-nav')
					.removeClass('active')
					.addClass('nav-out')
					.on(animEndEventName, function(){

						$(this)
							.removeClass('nav-out')
							.hide();

						resetNav();

					});

			}

		});

		// Add the 'Back & View all links'
		// It's done in setup so it only does it once it matches
		$subnavTrigger.each(function() {

			var trigger		= $(this),
				viewAll 	= '',
				viewAllLoc	= trigger.attr('href'),
				viewAllText	= trigger.text();

				viewAll += '<li class=\"view-all\">'
				viewAll += '<a href=\"' + viewAllLoc + '\" class=\"subnav-header\">All ' + viewAllText + '</a>'
				viewAll += '</li>'

			trigger.next($subnav).prepend($subnavGoBack);
			trigger.next($subnav).find('li:not(.go-back):first').before(viewAll);

		});

	},
	match: function() {

		$subnav.addClass('is-hidden');

		$subnavTrigger.on('click', function(e) {

			e.preventDefault();

			var selected = $(this);

			// Show subnavs if their trigger was clicked
			if( selected.next($subnav).hasClass('is-hidden') ) {

				// Add Active class to parent then go to siblings and
				// hide their subnavs and remove active class from their has-subnav-links
				selected
					.addClass('selected')
					.next('.subnav')
					.removeClass('is-hidden')
					.end()
					.parent('.has-subnav')
					.parent('ul')
					.addClass('moves-in');

				// Add Active class to clicked link and show it's subnav
				selected
					.parent('.has-subnav')
					.siblings('.has-subnav')
					.children('ul')
					.addClass('is-hidden')
					.end()
					.children('a')
					.removeClass('selected');

			} else {

				selected
					.removeClass('selected')
					.next('ul')
					.addClass('is-hidden')
					.end()
					.parent('.has-subnav')
					.parent('ul').removeClass('moves-in');

			}

		});

		// Go Back
		$('.go-back').on('click', function(e){

			e.preventDefault();

			$(this)
				.parent('ul')
				.addClass('is-hidden')
				.parent('.has-subnav')
				.parent('ul')
				.removeClass('moves-in');

		});

	},
	unmatch: function() {

		$mainNav.show();
		resetNav();

	},
	deferSetup: true

})
.register("(min-width: 990px)", {

		match: function() {

			$subnavTrigger.off('click');

			// Probably do this once on setup instead of every match/unmatch
			$('.main-dropdown').each(function(){

				var subnav		= $(this).find('[data-nav]'),
					navCol 		= $(this).find('[data-col]');

					// iterates over X number of times navCol appears
					navCol.each(function() {

						var colNum = $(this).data('col').toString();

						$(this).children('.nav').append($(this).siblings('[data-nav=\"' + colNum + '\"]'));

					});

			});

			$('.main-nav > li.has-subnav').hover(

				// Mouse Enter
				function() {

					$(this).addClass('hover');

				},
				// Mouse Leave
				function() {

					$(this).removeClass('hover');

				}

			);

			$('.main-nav > li.has-subnav > a').on({

				'touchstart': function(e) {

					$('.main-nav > li.has-subnav').removeClass('hover');

					$(this).parent().addClass('hover');


					$('body').on({

						'touchstart': function() {

							$('li.has-subnav').removeClass('hover');

						}

					});

					return false;

				}

			});

			$('.subnav').removeClass('is-hidden');

		},
		unmatch: function() {

			$('.main-nav > li.has-subnav').off('mouseenter mouseleave');
			$('.main-nav > li.has-subnav > a').off('touchstart');

			$('.main-nav').hide();

			// Go through each dropdown and take the subnavs out
			// of the nav-col's to get the mobile menu
			$('.main-dropdown').each(function(){

				var subnav = $(this).find('[data-nav]');

				$(this).find('.nav-col:last').after(subnav);

			});

		}

	});

function resetNav () {

	$('.has-subnav-link').removeClass('selected');

	$('.main-nav-wrap').find('ul.moves-in').removeClass('moves-in');

	$('.subnav').addClass('is-hidden');

};