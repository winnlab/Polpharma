define({
	router: {
		base: '/admin/',
		modulesContainer: '#moduleContent',
		routes: [{
			route: ':module',
			defaults: {
				module: 'dashboard'
			}
		}],
		modules: [{
			name: 'dashboard',
			path: 'app/dashboard/dashboard',
			title: ''
		}, {
			name: 'simplePages',
			path: 'app/simplePages/simplePages',
			title: ''
		}, {
			name: 'visitors',
			path: 'app/visitors/visitors',
			title: ''
		}]
	}
});