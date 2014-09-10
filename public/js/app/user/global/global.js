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
/*				self.initOdSDK();*/
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
			},

			initOdSDK: function () {

				var FAPI_Params = Object(FAPI.Util.getRequestParameters());
				FAPI.init(FAPI_Params['api_server'], FAPI_Params['apiconnection'], function()
					{
						console.log('success');
					}
					, function()
					{
						console.log('fail');
					}
				);

/*				var rParams = FAPI.Util.getRequestParameters();

				FAPI.init(rParams["api_server"], rParams["apiconnection"],

					function() {
						console.log('success');
					},

					function(error){
						console.error(error);
					}
				);*/
			}
		});
	}
);