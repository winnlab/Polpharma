'use strict';

define([
	'canjs',
	'core/appState',
	'core/helpers/preloader',
	'social/vk/vk_sdk',
	'social/fb/fb_sdk',
	'social/vk/share',
	'css!app/mind/css/mind.css'
],
	function (can, appState, Preloader) {

		return can.Control.extend({
			defaults: {
				viewpath: 'app/mind/'
			}
		}, {
			init: function () {
				var self = this;

				if (appState.attr('randomMind') == null) {
					self.getRandomMind();
				} else {
					self.renderMind();
				}
			},

			getRandomMind: function () {
				var self = this;

				can.ajax({
					url: '/mind/getRandomMind',
					success: function (randomMind) {
						appState.attr('randomMind', randomMind.message.data);
						self.renderMind();
					}
				});
			},

			renderMind: function () {
				var self = this;

				self.element.html(
					can.view(self.options.viewpath + 'index.stache', {
						appState: appState
					})
				);

				if (self.options.isReady) {

					if ( appState.attr('randomMind.image.image') ) {
						new Preloader({
							images: [appState.attr('randomMind.image.image')],
							callback: function () {
								self.options.isReady.resolve();
								self.calculateSizes();
							}
						});
					} else {
						self.options.isReady.resolve();
						self.calculateSizes();
					}
				}
			},

			calculateSizes: function () {
				var self = this;

				self.calculateCircleContent();
			},

			calculateCircleContent: function () {
				var self = this;

				var $contentCircle = $('.contentCircle', self.element);

				if ($contentCircle.length > 0) {
					var $windowHeight = $(window).height() * 0.9;

					$contentCircle.css({
						width: $windowHeight,
						height: $windowHeight,
						'margin-left': -$windowHeight/2,
						'margin-top': -$windowHeight/2
					});
				}
			},

			'.repeatExperience click': function (el, ev) {
				var $form = $('#discoverMyself');
				if ($form.length > 0) {
					$form.find('#cmd span').html('');
					$form.find("input[type=text], textarea").val("");
				}
			},

			'.shareButton click': function (el, ev) {
				var self = this;

				if (appState.attr('user.facebook') != null && appState.attr('user.facebook.id').length > 0) {
					self.fbShare();
				} else if (appState.attr('user.vkontakte') != null) {
					self.vkShare();
				}
			},

			fbShare: function () {
				FB.ui({
					method: 'feed',
					name: 'Mojo',
					link: window.location.origin,
					picture: '' + window.location.origin + appState.attr('uploadPath') + appState.attr('randomMind.image.image') + '',
					caption: 'Mojo mindreader test website',
					description: appState.attr('randomMind.mind.content'),
					message: 'test'
				});
			},

			vkShare: function () {
				var self = this;

				document.getElementById('vkShareWrapper').innerHTML = VK.Share.button({
					url: window.location.origin,
					title: 'Mojo',
					description: 'Mojo mindreader test website',
					image: '' + window.location.origin + appState.attr('uploadPath') + appState.attr('randomMind.image.image') + '',
					noparse: true
				});

				self.triggerVkShare();
			},

			triggerVkShare: function () {
				var $a = $('#vkShareWrapper').find('a:first');
				VK.Share.click(0, $a);
			}
		});

	}
);