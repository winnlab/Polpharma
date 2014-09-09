'use strict';

define([
	'canjs',
	'core/appState',
	'app/simplePage/simplePageModel',
	'core/helpers/preloader',
	'social/vk/vk_sdk',
	'social/fb/fb_sdk',
	'css!app/simplePage/css/simplePage.css'
],
	function (can, appState, SimplePageModel) {

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
					self.options.isReady.resolve();
				}
			},

			getSimplePage: function () {
				var id = this.options.data.id;
				return _.find(appState.attr('simplePages'), function(element) {
					return element.url == id;
				});
			},

			'.socNets.fb click': function (el, ev) {
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

			'.socNets.vk click': function (el, ev) {
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
				appState.attr('user.vk', vkProfile);
				appState.attr('user.username', name);
				appState.attr('user.image', image);

				can.route.attr({
					module: 'simplePage',
					id: 'personal-form'
				}, true);
			},

			'.radioButton click': function (el, ev) {
				if (!el.hasClass('activeBtn')) {
					var $wrapper = el.parents('.radioWrapper');
					var $active = $wrapper.find('.activeBtn');
					var activeValue = $active.data('value');
					var $activeInput = $wrapper.find('input[value='+activeValue+']');

					$activeInput.attr('checked', false);
					$active.removeClass('activeBtn');

					var newActiveValue = el.data('value');
					var $newActiveInput = $wrapper.find('input[value='+newActiveValue+']');

					$newActiveInput.attr('checked', true);
					el.addClass('activeBtn');
				}
			},

			'.checkboxButton click': function (el, ev) {

				var $wrapper = el.parents('.checkboxWrapper');
				var buttonValue = el.data('value');
				var $checkboxInput = $wrapper.find('input[value='+buttonValue+']');

				if (el.hasClass('activeBtn')) {
					$checkboxInput.attr('checked', false);
					el.removeClass('activeBtn');
				} else {
					$checkboxInput.attr('checked', true);
					el.addClass('activeBtn');
				}
			},

			'.personalData submit': function (el, ev) {
				ev.preventDefault();

				var self = this;

				var formData = can.deparam(el.serialize());

				if ( appState.attr('user.facebook') != null ) {
					formData.facebook = {};
					formData.facebook.id = appState.attr('user.facebook.id');
				} else if ( appState.attr('user.vk') != null) {
					formData.vk = {};
					formData.vk.id = appState.attr('user.vk.uid');
				}

				var simplePage = new SimplePageModel(formData);

				simplePage.save()
					.done(function() {
						can.route.attr({
							module: 'simplePage',
							id: 'questions-form'
						}, true);
					})
					.fail(function (data) {
						console.error(data);
					});
			},

			'.questionsForm submit': function (el, ev) {

				ev.preventDefault();

				var self = this;

				var formData = can.deparam(el.serialize());

				if ( appState.attr('user.facebook') != null ) {
					formData.facebook = {};
					formData.facebook.id = appState.attr('user.facebook.id');
				} else if ( appState.attr('user.vk') != null) {
					formData.vk = {};
					formData.vk.id = appState.attr('user.vk.uid');
				}

				var simplePage = new SimplePageModel(formData);

				simplePage.save()
					.done(function() {
						can.route.attr({
							module: 'simplePage',
							id: 'gratitude'
						}, true);
					})
					.fail(function (data) {
						console.error(data);
					});
			}
		});

	}
);