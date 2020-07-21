jQuery(document).ready(function() {
	// Create the dropdown base
	jQuery("<select />").appendTo("#mobilemenu");
	var mobileMenuTitle = jQuery("#mobilemenu").attr("title");
	// Create default option "Go to..."
	jQuery("<option />", {
		"selected": "selected",
		"value": "",
		"text": mobileMenuTitle
	}).appendTo("#mobilemenu select");

	// Populate dropdown with menu items
	jQuery("#nav ul.menu>li>a, #nav ul.menu>li>span.mainlevel,#nav ul.menu>li>span.separator").each(function() {
		var el = jQuery(this);
		jQuery("<option />", {
			"value": el.attr("href"),
			"text": el.text()
		}).appendTo("#mobilemenu select");
		getSubMenu(el);
	});

	function getSubMenu(el) {
		var subMenu = jQuery('~ ul>li>a', el);
		var tab = "- ";
		if (!(subMenu.length === 0)) {
			subMenu.each(function() {
				var sel = jQuery(this);
				var nodeval = tab + sel.text();
				jQuery("<option />", {
					"value": sel.attr("href"),
					"text": nodeval

				}).appendTo("#mobilemenu select");
				getSubMenu(sel);
			});
		}
	}
	// To make dropdown actually work
	// To make more unobtrusive: http://css-tricks.com/4064-unobtrusive-page-changer/
	jQuery("#mobilemenu select").change(function() {
		window.location = jQuery(this).find("option:selected").val();
	});

	jQuery("ul li:first-child").addClass("first-child");
	jQuery("ul li:last-child").addClass("last-child");
	jQuery("ul li:nth-child(2n+1)").addClass("odd");
	jQuery("ul li:nth-child(2n+2)").addClass("even");


	var img = jQuery('.article .jbintrotext img:first-child');
	var catimg = jQuery('#mainContent img.catimage');

	if ((img.length > 0) || (catimg.length > 0)) {
		jQuery("body").addClass("hasimg");
		jQuery('.article .jbintrotext img:first-child').addClass('catimage');
	}

	// Equal Heights Script
	var equalcols = false;

	function equalHeight(group) {
		var tallest = 0;
		var thisHeight = 0;

		group.each(function() {
			jQuery(this).css('height', '');
			thisHeight = jQuery(this).height();
			if (thisHeight > tallest) {
				tallest = thisHeight;
			}
		});
		group.css('height', tallest);
	}

	function calculateEQ() {
		jQuery("#left").css("height", "auto");
		jQuery("#right").css("height", "auto");
		jQuery("#midCol").css("height", "auto");
		equalHeight(jQuery("#midCol, .sidebar"));
	}

	/**
	 * Execute a callback after all images, filtered by selector, be loaded
	 *
	 * @param  string    selector    Image selectors to look for
	 * @param  function  callback    Callback to be called. The images are sent as a parameter
	 * @param  integer   timerLimit  Limit of time to wait for
	 */
	function waitForAsyncImages(selector, callback, timerLimit) {
		var timerStep = 250;
		var loadedImages = [];
		var time = 0;

		// Default: 10 seconds
		if (!timerLimit) {
			timerLimit = 10 * 1000;
		}

		// Wait for images
		var interval = setInterval(function() {
			var elements = jQuery(selector);
			if (loadedImages.length > 0) {
				loadedImages = elements.imagesLoaded();
				loadedImages.done(function() {
					if (callback) {
						callback(elements);
					}

					clearInterval(interval);
				});
			}
			else
			{
				loadedImages = elements;
			}

			if (time >= timerLimit) {
				clearInterval(interval);
				return;
			}
			time += timerStep;
		}, timerStep);
	}

	function calculateEQAfterFlicker() {
		// Is there flicker module? Trigger equal columns
		if (jQuery('.gallery-flickr')) {
			waitForAsyncImages('.gallery-flickr img', function($imgs) {
				calculateEQ();
			});
		}
	}


	var images = jQuery('#main img').imagesLoaded();


	// Take 70px off the sidebar values so we can cater for padding, margins or close calls
	var rightCol = jQuery("#right").height() - 70;
	var midCol = jQuery("#midCol").height();
	var leftCol = jQuery("#left").height() - 70;

	if (jQuery("body").hasClass("hasimg")) {

		if (midCol > (rightCol || leftCol)) {
			equalcols = true;
		}
	}



	// --------------
	// Breakpoints
	// --------------
	jQuery(window).setBreakpoints({
		// use only largest available vs use all available
		distinct: true,
		// array of widths in pixels where breakpoints
		// should be triggered
		breakpoints: [
			600,
			767,
			1000
		]
	});

	jQuery(window).bind('enterBreakpoint1000', function() {
		var navheight = jQuery("#navwrap").height();

		if (jQuery("#nav ul").height() > navheight) {
			jQuery("#nav").css({
				"visibility": "hidden"
			});
			jQuery("#togglemenu").show();
		}

		if (jQuery("#nav ul").height() < navheight) {
			jQuery("#nav").css({
				"visibility": "visible"
			});
			jQuery("#togglemenu").hide();
		}

		if (equalcols) {

			// Trigger equal columns on load
			calculateEQ();

			// Then again once images have loaded
			images.done(function($images) {
				calculateEQ();
			});

			// Is there flicker module? Trigger equal
			calculateEQAfterFlicker();

			jQuery('ul.jbtabs li,.moduletable-panelmenu span.mainlevel,a,span').click(function() {
				setTimeout(calculateEQ, 400);
			});
		}


		// Code to make the mid column cover any images if the image is taller than the content
		var imgheight = jQuery('img.catimage').height();
		var midColHeight = jQuery('#midCol').height();

		if(midColHeight < imgheight) {
			 h = (jQuery("#midCol").css("margin-top").replace("px", "")) * 1.5;
			 jQuery('#midCol').css({"min-height": (imgheight - (h / 1.5)) + 'px'});
		}
	});

	jQuery(window).bind('enterBreakpoint767', function() {
		if (equalcols) {
			// Trigger equal columns on load
			calculateEQ();

			// Then again once images have loaded
			images.done(function($images) {
				calculateEQ();
			});

			// Is there flicker module? Trigger equal
			calculateEQAfterFlicker();

			jQuery('ul.jbtabs li,.moduletable-panelmenu span.mainlevel,a,span').click(function() {
				setTimeout(calculateEQ, 400);
			});

			// Code to make the mid column cover any images if the image is taller than the content
			var imgheight = jQuery('img.catimage').height();
			var midColHeight = jQuery('#midCol').height();

			if(midColHeight < imgheight) {
				 h = (jQuery("#midCol").css("margin-top")) * 1.5;
				 alert(h);
				jQuery('#midCol').css({"height": (imgheight - (h / 1.5)) + 'px'});
			}
		}

		jQuery("#togglemenu").show();
	});

	jQuery(window).bind('enterBreakpoint600', function() {
		jQuery("#left").css("height", "auto");
		jQuery("#right").css("height", "auto");
		jQuery("#midCol").css("height", "auto");
		jQuery("#togglemenu").show();
	});
});
