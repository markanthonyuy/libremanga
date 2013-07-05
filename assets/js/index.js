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
	var MANGA_API_URL = 'http://www.mangaeden.com/api/manga/',
		MANGA_CHAPTER_API_URL = 'http://www.mangaeden.com/api/chapter/';

	var $headerContent = $('#main_header'),
		$loader = $('.loader'),
		mangaCache = {}; // Cache manga


	var showMangaInfo = function(data) {
		$headerContent.append(_.template($('#manga_details').html(), data));
	};

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
			$fixedHeader = $('#manga_details_wrap h3');

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

	$content.bind('scroll', function() {
		console.log('scrolling');
		if(!didScroll) {
			didScroll = true;
			setTimeout(scrollPage, 250);
		}
	});

	$loader.hide(); // Hide loader on load page

	$('a.manga').on('click', function(e) {
		e.preventDefault();

		$headerContent.empty();
		$loader.show();

		var _this = $(this),
			mangaID = _this.data('id');

		_.each($('a.manga'), function(value, key, list) {
			if(list.hasClass('current')) {
				list.removeClass('current');
			}
		});	

		_this.addClass('current');

		// Check if manga is in cache, if TRUE load the cache and prevent from calling API again
		if(mangaID in mangaCache) {
			$loader.hide();
			showMangaInfo(mangaCache[mangaID]);
		} else {

			// Call API
			$.ajax({
				url 	: 'proxy.php?url=' + encodeURIComponent(MANGA_API_URL) + mangaID,
				type 	: 'GET',
				dataType: 'json',
				success : function(res) {
					mangaCache[mangaID] = res; // save to cache
				}
			}).done(function(data, status) {
				if(status == 'success') {
					$loader.hide();
					showMangaInfo(data);
					viewChapterClickEvent('manga_chapter');
				}
			});
		}
	});

}());