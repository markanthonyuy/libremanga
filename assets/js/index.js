(function() {
	'use strict'; // jslint

	// Namespace for libremanga
	/*var Lm = {
		Models : {},
		Views : {},
		Collection : {}
	};

	// Model
	Lm.Models.MangaList = Backbone.Model.extend({
		urlRoot : 'proxy.php?url=' + encodeURIComponent('http://www.mangaeden.com/api/list/0')
	});

	// Collection
	Lm.Collection.MangaList = Backbone.Collection.extend({
		url : 'proxy.php?url=' + encodeURIComponent('http://www.mangaeden.com/api/list/0'),
		parse : function(x, a) {
			console.log(x, a);
		}
	});

	// View
	Lm.Views.MangaList = Backbone.View.extend({

	});

	var manga = new Lm.Models.MangaList();
	manga.fetch();
	console.log(manga);
	var mangaList = new Lm.Collection.MangaList({});

	var mangaListView = new Lm.Views.MangaList({});

	var mangaList = {},
		mangaListContainer = $('#manga_list');*/

	/*$.ajax({
		url 	: 'proxy.php?url=' + encodeURIComponent('http://www.mangaeden.com/api/list/0'),
		type 	: 'GET',
		dataType : 'json',
		success : function(res) {
			mangaList = (res.manga.length > 0) ? res : null;
		}
	}).done(function() {

		// Save list to textfile for caching
		// Display list in Datatable
		$.each(mangaList.manga, function(i, val) {
			mangaListContainer.append('<li>' + val.t + '</li>');
		});
	});*/

	/*$('table').dataTable({
		sDom : ''
	});*/

	// Constant Variables
	var MANGA_API_URL = 'http://www.mangaeden.com/api/manga/',
		MANGA_CHAPTER_API_URL = 'http://www.mangaeden.com/api/chapter/';

	// PREFIX jQuery variables with $ (dollar sign)
	var $headerContent = $('#main_header'),
		$loader = $('.loader'),
		$mangaList = $('#manga_list'),
		mangaCache = {}; // Cache manga


	// Append manga info to the DOM
	var showMangaInfo = function(data) {
		$headerContent.append(_.template($('#manga_details').html(), data));
	};

	// TODO: Add image gallery
	
	var viewChapterClickEvent = function(classname) {
		$('a.' + classname).on('click', function(e) {
			e.preventDefault();

			var _this = $(this),
				chapterID = _this.data('id');

			$.ajax({
				url :  'proxy.php?url=' + encodeURIComponent(MANGA_CHAPTER_API_URL) + chapterID,
				type : 'GET',
				dataType : 'json',
				success : function(res) {
					console.log(res);
				}
			});
		});
	};

	// Inspired from codrops
	var didScroll = false,
		changeHeaderOn = 5,
		$content = $('#wrap');

	var scrollPage = function() {
		var sy = scrollY(),
			$fixedHeader = $('#manga_details_wrap header');
		console.log(sy);
		if (sy >= changeHeaderOn ) {
			$fixedHeader.addClass('fixed_top');
		}
		else {
			$fixedHeader.removeClass('fixed_top');
		}
		didScroll = false;
	};

	var scrollY = function() {
		return $content.scrollTop();
	};

	var processManga = function(manga, button) {
		$loader.hide(); 						// Hides loader
		$mangaList.removeClass('disable_dom');  // Disable the click/pointer event in mangaList
		button.removeClass('loading');			// Remove loading class
		showMangaInfo(manga);					// Show manga
	};

	var init = function() {

		// Bind scrolling event		
		$content.bind('scroll', function() {
			console.log('scrolling');
			if(!didScroll) {
				didScroll = true;
				scrollPage();
			}
		});

		$loader.hide(); // Hide loader on load page

		// DONE: Disabled sidebar or manga list link on ajax loading to prevent dom content stack up.
		// TODO: Image caching in localstorage or sessionstorage
		// TODO: Add latest release date on sidebar 
		// TODO: Store api on json text file
		// TODO: Integrage Backbone MVC
		
		// Add function to click event
		$('a.manga').on('click', function(e) {
			e.preventDefault();

			$headerContent.empty();
			$loader.show();
			$mangaList.addClass('disable_dom');

			var _this = $(this),			// Cache self
				mangaID = _this.data('id'); // Cache manga id

			// Remove class 'current' in all list
			_.each($('a.manga'), function(value, key, list) {
				if(list.hasClass('current')) {
					list.removeClass('current');
				}
			});	
			
			_this.addClass('current'); // Add class 'current' to self
			_this.addClass('loading'); // Add class 'loading' to self

			// Check if manga is in cache, if TRUE load the cache and prevent from calling API again
			if(mangaID in mangaCache) {
				processManga(mangaCache[mangaID], _this);	// Show manga from cache
				viewChapterClickEvent('manga_chapter');		// Add click event to chapters
			} else {

				// Call API
				$.ajax({
					url 	: 'proxy.php?url=' + encodeURIComponent(MANGA_API_URL) + mangaID,
					type 	: 'GET',
					dataType: 'json',
					success : function(res) {
						mangaCache[mangaID] = res; // save manga to cache object
					}
				}).done(function(data, status) {
					if(status == 'success') {
						processManga(data, _this);
						viewChapterClickEvent('manga_chapter');
					}
				});
			}
		});
	};

	init();

}());