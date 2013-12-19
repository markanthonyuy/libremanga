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

	// Constant Variables
	var MANGA_API_URL 			= 'http://www.mangaeden.com/api/manga/',
		MANGA_CHAPTER_API_URL 	= 'http://www.mangaeden.com/api/chapter/',
		MANGA_CHAPTER_IMAGE_URL = 'http://cdn.mangaeden.com/mangasimg/';

	// PREFIX jQuery variables with $ (dollar sign)
	var $headerContent	= $('#main_header'),
		$content		= $('#wrap'),		// For scroll fixed
		$loader			= $('.loader'),
		$mangaList		= $('#manga_list');

	var	mangaCache = {},				// Cache manga
		mangaChapterCache = {};			// Cache manga chapter

	var shareURL = function() {
		$('.share_fb').on('click', function() {
			window.open(
				'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(location.href), 
				'facebook-share-dialog', 
				'width=626,height=436'
			); 
			return false;
		});

		$('.share_twitter').on('click', function() {
			window.open(
				'https://twitter.com/share?url=http%3A%2F%2Flibremanga.com', 
				'twitter-tweet-dialog', 
				'width=626,height=436'
			); 
			return false;
		});

		$('.share_gplus').on('click', function() {
			window.open(
				'https://plus.google.com/share?url=http%3A%2F%2Flibremanga.com', 
				'google-share-dialog', 
				'width=626,height=436'
			); 
			return false;
		});
	};

	// Inspired from codrops
	var didScroll = false,
		changeHeaderOn = 5;

	var scrollPage = function() {
		var sy = scrollY(),
			$fixedHeader = $('#manga_details_wrap header');
		//console.log(sy);
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

	// Append manga info to the DOM
	var showMangaInfo = function(data) {
		$headerContent.append(_.template($('#manga_details').html(), data));
	};

	// Append manga chapter image to the image gallery
	var showMangaChapterImage = function(data) {
		$headerContent.append(_.template($('#manga_chapter_view').html(), data));
	};

	var processMangaChapter = function(data, modal, button, parent) {
		button.removeClass('loading');			// Removes fallback loading state to the link
		parent.removeClass('disable_dom');		// Enable all manga chapter list links
		$mangaList.removeClass('disable_dom');	// Enable sidebar manga list links
		showMangaChapterImage(data);			// Call showMangaChapterImage function 
		$(modal).modal('show');					// Show modal with manga chapter images
		$('#custom_backdrop').remove();			// Removes custom bootstrap backdrop
	};

	// TODO: Add image gallery
	// TODO: loading message on click chapters

	var viewChapterClickEvent = function(classname) {
		$('a.' + classname).on('click', function(e) {
			e.preventDefault();

			var _this				= $(this),
				chapterNum			= _this.data('chapter'),
				chapterID			= _this.data('id'),
				mangaTitle			= _this.data('manga-title'),
				modalID				= '#manga_chapter' + chapterID,
				$mangaChapterList	= $('#manga_chapters_list'),
				custom_backdrop		= '<div id="custom_backdrop" class="modal-backdrop"><div class="loader"><div class="spinner"></div><span class="dark">loading...</span></div></div>';

			_this.addClass('loading');					// Add fallback loading state to the link
			$mangaChapterList.addClass('disable_dom');	// Disable all manga chapter list links to prevent api call stack up
			$mangaList.addClass('disable_dom');			// Disable sidebar manga list links to prevent api call stack up
			$(custom_backdrop).appendTo(document.body); // Implements custom bootstrap backdrop

			if(chapterID in mangaChapterCache) {
				processMangaChapter(mangaChapterCache[chapterID], modalID, _this, $mangaChapterList);
			} else {
				$.ajax({
					url :  'proxy.php?url=' + encodeURIComponent(MANGA_CHAPTER_API_URL) + chapterID,
					type : 'GET',
					dataType : 'json',
					success : function(res) {
						res['id'] 			= chapterID;	// Hooks chapter ID to the response
						res['num'] 			= chapterNum;	// Hooks chapter number to the response
						res['manga_title'] 	= mangaTitle;	// Hooks manga title to the response
						mangaChapterCache[chapterID] = res; // save manga chapter to cache
					}
				}).done(function(data, status) {
					if(status == 'success') {
						processMangaChapter(data, modalID, _this, $mangaChapterList);
					} else {
						console.log(data, status);
					}
				});
			}
		});
	};

	var processManga = function(manga, button) {
		$loader.hide();							// Hides loader
		$mangaList.removeClass('disable_dom');  // Disable the click/pointer event in mangaList
		button.removeClass('loading');			// Remove loading class
		showMangaInfo(manga);					// Show manga
		shareURL();
	};

	var init = function() {

		// Bind scrolling event		
		$content.bind('scroll', function() {
			//console.log('scrolling');
			if(!didScroll) {
				didScroll = true;
				scrollPage();
			}
		});

		$loader.hide(); // Hide loader on load page

		// DONE: Disabled sidebar or manga list link on ajax loading to prevent dom content stack up.
		// TODO: Image caching in localstorage or sessionstorage
		// TODO: Store API response to json text file
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
					//url 	: 'proxy.php?url=' + encodeURIComponent(MANGA_API_URL) + mangaID,
					url 	: window.location.origin + '/assets/json/' + mangaID + '/manga.json',
					//type 	: 'GET',
					dataType: 'json',
					success : function(res) {
						mangaCache[mangaID] = res; // save manga to cache object
					}
				}).done(function(data, status) {
					if(status == 'success') {
						processManga(data, _this);
						viewChapterClickEvent('manga_chapter');
					} else {
						console.log(data, status);
					}
				});
			}
		});

		shareURL();
	};

	init();

}());