define([
	'canjs',
	'core/appState',
	'social/vk/vk_sdk',
	'social/fb/fb_sdk',
	'velocity',
	'velocity_ui',
	
	'css!app/global/css/global.css'
],
	function (can, appState) {

		return can.Control.extend({
			defaults: {
				viewpath: 'app/global/'
			}
		}, {

			init: function () {
				var self = this,
					html = can.view(self.options.viewpath + 'index.stache', {
						appState: appState
					});

				self.element.append(html);
				self.initVkSDK();
				self.initFbSDK();
			},

			initVkSDK: function () {
				VK.init({
					apiId: appState.attr('socialConfig.vk.apiId')
				})
			},

			initFbSDK: function () {

				FB.init({
					appId: appState.attr('socialConfig.facebook.clientID'),
					cookie: true,
					xfbml: true,
					version: 'v2.1'
				});
			}

		});
	}
);