'use strict';

define([
	'canjs',
	'core/appState',
	'app/simplePage/simplePageModel',
	'underscore',
	'core/helpers/preloader',
	'velocity',
	'social/vk/vk_sdk',
	'social/fb/fb_sdk',
	'css!app/simplePage/css/simplePage.css'
],
	function (can, appState, SimplePageModel, _) {

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

				if ( el.find('.wrong').length == 0 ) {
					var formData = can.deparam(el.serialize());

					if ( appState.attr('user._id') != null ) {
						formData._id = appState.attr('user._id');
					} else if ( appState.attr('user.facebook') != null ) {
						formData.facebook = appState.attr('user.facebook').attr();
					} else if ( appState.attr('user.vk') != null) {
						formData.vk = appState.attr('user.vk').attr();
					} else if ( appState.attr('user.odnoklassniki') != null) {
						formData.odnoklassniki = appState.attr('user.odnoklassniki').attr();
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
				}
			},

			'.questionsForm submit': function (el, ev) {

				ev.preventDefault();

				var self = this;

				var formData = can.deparam(el.serialize());

				if ( appState.attr('user._id') != null ) {
					formData._id = appState.attr('user._id');
				} else if ( appState.attr('user.facebook') != null ) {
					formData.facebook = appState.attr('user.facebook').attr();
				} else if ( appState.attr('user.vk') != null) {
					formData.vk = appState.attr('user.vk').attr();
				} else if ( appState.attr('user.odnoklassniki') != null) {
					formData.odnoklassniki = appState.attr('user.odnoklassniki').attr();
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
			},

			'.sendEmail submit': function (el, ev) {
				ev.preventDefault();

				var formData = can.deparam(el.serialize());

				if ( appState.attr('user._id') != null ) {
					formData._id = appState.attr('user._id');
				}

				var simplePage = new SimplePageModel(formData);

				simplePage.save()
					.done(function(data) {
						appState.attr('user._id', data._id);
						can.route.attr({
							module: 'simplePage',
							id: 'personal-form'
						}, true);
					})
					.fail(function (data) {
						console.error(data);
					});
			},

			'.quesBtn click': function (el, ev) {
				var $parent = el.parents('.parentQuestion');

				if (el.hasClass('showChild')) {
					var $child = $parent.next();

					if ($child.hasClass('childQuestion')) {
						$child.velocity('slideDown');
					}
				} else if ($parent.find('.showChild').length > 0) {
					var $child = $parent.next();

					if ($child.hasClass('childQuestion')) {
						$child.velocity('slideUp');
					}
				}
			},

			'input keyup': function (el, ev) {
				if (el.val().length > 0) {
					el.parents('.question').find('.valid').removeClass('wrong').addClass('correct');
				} else if ( el.val().length == 0 ) {
					el.parents('.question').find('.valid').removeClass('correct').addClass('wrong');
				}
			},

			'input.city keyup': function (el, ev) {
				var text = el.val();

				if (text.length > 2) {
					var matches = _.filter(appState.attr('cities').attr(), function (city) {
						return city.name.toLowerCase().indexOf(text.toLowerCase()) > -1;
					});

					if (matches.length > 0) {
						appState.attr('cityMatches', matches);
					} else {
						appState.attr('cityMatches', null);
					}
				} else {
					appState.attr('cityMatches', null);
				}
			},

			'.cityMatchItem click': function (el, ev) {
				var _id = el.data('_id');

				var $wrapper = el.parents('.question');

				$wrapper.find('input[name=city]').val(el.html());
				$wrapper.find('input[name=city_id]').val(_id);

				appState.attr('cityMatches', null);
			},

			'input.network keyup': function (el, ev) {
				var text = el.val();

				if (text.length > 2) {
					var matches = _.filter(appState.attr('networks').attr(), function (network) {
						return network.name.toLowerCase().indexOf(text.toLowerCase()) > -1;
					});

					if (matches.length > 0) {
						appState.attr('networkMatches', matches);
					} else {
						appState.attr('networkMatches', null);
					}
				} else {
					appState.attr('networkMatches', null);
				}
			},

			'.networkMatchItem click': function (el, ev) {
				var _id = el.data('_id');

				var $wrapper = el.parents('.question');

				$wrapper.find('input[name=network]').val(el.html());
				$wrapper.find('input[name=network_id]').val(_id);

				appState.attr('networkMatches', null);
			},

			'input.switcher click': function (el, ev) {
				var $parent = el.parents('.questionContainer');
				var $child = $parent.next();

				var $otherBlocks = $child.find('.questionWrap').not('[data-question_value='+el.data('value')+']');
				var $blockToShow = $child.find('[data-question_value='+el.data('value')+']');

				if ($blockToShow.css('display') == 'none') {
					$otherBlocks.velocity('slideUp', function(){
						$blockToShow.velocity('slideDown');
					});
				}
			}
		});

	}
);