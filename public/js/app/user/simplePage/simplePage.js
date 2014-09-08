'use strict';

define([
	'canjs',
	'core/appState',
	'core/helpers/preloader',
	'social/vk/vk_sdk',
	'social/fb/fb_sdk',
	'css!app/simplePage/css/simplePage.css'
],
	function (can, appState, Preloader) {

		return can.Control.extend({
			defaults: {
				viewpath: 'app/simplePage/',
				alternateViewpath: 'app/simplePage/alternateViews/',

				loadingInterval: 15,
				vkLoginPermission: 4, //4 - photos
				facebookPermissions: ''
			}
		}, {
			init: function () {
				var self = this;

				var simplePage = self.getSimplePage();

				var viewfile =
					simplePage.alternate_view_path.length > 0 ?
					self.options.alternateViewpath + simplePage.alternate_view_path + '.stache' :
					self.options.viewpath + 'index.stache';

				self.element.html(
					can.view(viewfile, {
						simplePage: simplePage,
						appState: appState
					})
				);

				if (self.options.isReady) {

					if ( simplePage.name == 'loading') {
						new Preloader({
							images: [appState.attr('colorScheme')+'Can500.png'],
							folder: appState.attr('imgPath'),
							callback: function () {
								self.options.isReady.resolve();
							}
						});
					} else {
						self.options.isReady.resolve();
					}

					self.calculateSizes();
				}

				self.initCursor();
			},

			getSimplePage: function () {
				var id = this.options.data.id;
				return _.find(appState.attr('simplePages'), function(element) {
					return element.url == id;
				});
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

			initCursor: function () {

				var cursor;

				$('#cmd').click(function () {
					$('input').focus();
					cursor = window.setInterval(function () {
						if ($('#cursor').css('visibility') === 'visible') {
							$('#cursor').css({
								visibility: 'hidden'
							});
						} else {
							$('#cursor').css({
								visibility: 'visible'
							});
						}
					}, 500);

				});

				$('input').keyup(function () {
					$('#cmd span').text($(this).val());
				});

				$('input').blur(function () {
					clearInterval(cursor);
					$('#cursor').css({
						visibility: 'visible'
					});
				});
			},

			initLoadingCounter: function () {
				var self = this;

				var counterInterval = setInterval(function(){
					if (appState.attr('loadingCounter') < 100) {
						appState.attr('loadingCounter', appState.attr('loadingCounter') + 1 );
					} else {
						clearInterval(counterInterval);
						can.route.attr({
							module: 'mind'
						}, true);
					}
				}, self.options.loadingInterval);
			},

			'.discoverMyself submit': function (el, ev) {
				var self = this;

				ev.preventDefault();
				appState.attr('loadingCounter', 0);

				can.ajax({
					url: '/mind/getRandomMind',
					success: function (randomMind) {

						appState.attr('randomMind', randomMind.message.randomMind);

						can.route.attr({
							module: 'simplePage',
							id: 'loading'
						}, true);
						self.initLoadingCounter();
					}
				});
			},

			'.fbLogin click': function (el, ev) {
/*				window.location.href = 'auth/facebook';*/
				var self = this;

				FB.login(can.proxy(self.fbLoginResponse, self), {
					scope: self.options.facebookPermissions
				});
			},

			fbLoginResponse: function (response) {
				var self = this;

				if (response.status === 'connected') {

					FB.api('/me', function(userResponse) {

						FB.api("/me/picture?width=180&height=180",  function(imageResponse) {
							self.saveUser(userResponse.first_name, imageResponse.data.url, userResponse, null);
						});
					});

				} else if (response.status === 'not_authorized') {
					// The person is logged into Facebook, but not your app.
				} else {
					// The person is not logged into Facebook, so we're not sure if
					// they are logged into this app or not.
				}
			},

			'.vkLogin click': function (el, ev) {
				var self = this;

				VK.Auth.login(can.proxy(self.vkLoginResponse, self), self.options.vkLoginPermission);
			},

			vkLoginResponse: function (response) {
				var self = this;

				if (response.session) {

					VK.api("getProfiles", {
						uids: response.session.mid,
						fields: 'photo_200'
					}, function (profileData){

						if (profileData.response && profileData.response[0]){
							self.saveUser(profileData.response[0].first_name, profileData.response[0].photo_200, null, profileData.response[0]);
						}
					});

				} else {
					alert('not auth');
				}
			},

			saveUser: function (name, image, fbProfile, vkProfile) {
				appState.attr('user.facebook', fbProfile);
				appState.attr('user.vkontakte', vkProfile);
				appState.attr('user.username', name);
				appState.attr('user.image', image);

				can.route.attr({
					module: 'simplePage',
					id: 'hello-page'
				}, true);
			},

			'.buttons .next click': function (el, ev) {
				var currentScheme = appState.attr('colorScheme');
				var colorSchemeArray = appState.attr('colorSchemeArray').attr();

				var currentIndex = colorSchemeArray.indexOf(currentScheme);

				if ( currentIndex != -1 ) {
					if (colorSchemeArray[currentIndex+1]) {
						appState.attr('colorScheme', colorSchemeArray[currentIndex+1]);
					} else {
						appState.attr('colorScheme', colorSchemeArray[0]);
					}

					$('.colorSwitcherItem.active').removeClass('active');
					$('.colorSwitcherItem.'+appState.attr('colorScheme')).addClass('active');
				}
			},

			'.buttons .prev click': function (el, ev) {
				var currentScheme = appState.attr('colorScheme');
				var colorSchemeArray = appState.attr('colorSchemeArray');

				var currentIndex = colorSchemeArray.indexOf(currentScheme);

				if ( currentIndex != -1 ) {
					if (colorSchemeArray[currentIndex-1]) {
						appState.attr('colorScheme', colorSchemeArray[currentIndex-1]);
					} else {
						appState.attr('colorScheme', colorSchemeArray[colorSchemeArray.length-1]);
					}

					$('.colorSwitcherItem.active').removeClass('active');
					$('.colorSwitcherItem.'+appState.attr('colorScheme')).addClass('active');
				}
			}
		});

	}
);