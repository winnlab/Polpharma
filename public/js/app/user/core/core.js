require.config({
	baseUrl: '/js/lib',
	paths: {
		app: '../app/user',
		core: '../app/user/core',
		can: 'canjs/amd/can/',
		canjs: 'canjs/amd/can',
		jquery: 'jquery/dist/jquery',
		underscore: 'underscore/underscore',
		managers: '../app/user/managers',

		Class: 'jsOOP/Class',
		baseClass: 'jsOOP/baseClass',
		three: 'three.r60',
		TweenLite: 'greensock/TweenLite',
		CSSPlugin: 'greensock/CSSPlugin',
		Ease: 'greensock/EasePack',
		ScrollToPlugin: 'greensock/ScrollToPlugin',
        velocity: 'velocity/velocity.min',
		velocity_ui: 'velocity/velocity.ui'
	},
	map: {
		'*': {
			'css': 'require-css/css'
		}
	},
	shim: {
		'jquery': {
			deps: ['requestAnimationFrame'],
			exports: '$'
		},
		'underscore': {
			exports: '_'
		},
		'canjs': {
			deps: ['jquery', 'can/route/pushstate', 'can/map/define', 'can/map/delegate', 'can/list/promise']
		},
		'three': {
            exports: 'THREE'
        },
        TweenLite: {
            deps: ['CSSPlugin', 'Ease', 'ScrollToPlugin']
        },
		'velocity_ui': {
			deps: ['velocity']
		}
	},

	waitSeconds: 15
});

require([
		'core/router',
		'core/config',
		'core/appState',
		'app/global/global',
		'core/helpers/preloader',
		'core/helpers/viewHelpers',

		'css!core/css/reset.css',
		'css!core/css/global.css'
	],
	function (
		Router,
		config,
		appState,
		Global,
		Preloader
	) {
		var body = $('body');

		new Router(body, config.router);

		new Global(body);
	}
);