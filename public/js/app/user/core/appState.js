define([
	'canjs'
],
	function (can) {

		var AppState = can.Map.extend({

				//Settings
				imgPath: '/img/user/',
				uploadPath: '/uploads/',

				fontSize: function () {
					return Number($('body').css('font-size').replace(/px$/, ""));
				},

				loadingCounter: 0,
				colorScheme: 'mint',
				colorSchemeArray: ['ginger', 'cola', 'mint'],

				// Data
				locale: data && data.locale ? data.locale : false,
				lang: data && data.lang ? '/' + data.lang + '/' : '/',
				langs: data && data.langs ? data.langs : false,
				simplePages: data && data.simplePages ? data.simplePages : false,
				user: data && data.user ? data.user : {
					username: '',
					image: ''
				},
				socialConfig: data && data.socialConfig ? data.socialConfig : false

			}),
			appState = new AppState();

		window['appState'] = appState;
		// delete window.data;

		return appState;
	}
);