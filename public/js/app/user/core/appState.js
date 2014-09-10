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

				// Data
				locale: data && data.locale ? data.locale : false,
				lang: data && data.lang ? '/' + data.lang + '/' : '/',
				langs: data && data.langs ? data.langs : false,
				simplePages: data && data.simplePages ? data.simplePages : false,
				networks: data && data.networks ? data.networks : false,
				cities: data && data.cities ? data.cities: false,
				user: data && data.user ? data.user : {
					_id: null,
					username: '',
					image: ''
				},
				socialConfig: data && data.socialConfig ? data.socialConfig : false,
				cityMatches: null,
				networkMatches: null

			}),
			appState = new AppState();

		window['appState'] = appState;
		// delete window.data;

		return appState;
	}
);