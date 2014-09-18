define([
	'canjs',
	'core/appState'
],
	function (can, appState) {

		can.mustache.registerHelper('isPrimitive', function (observer, primitive, options) {			
			return observer() === primitive ? options.fn() : options.inverse();
		});

		can.mustache.registerHelper('yearOptions', function (options) {
			var html = '';

			for (var i = 1940; i <= 2014; i++) {
				var selected = '';
				if ( appState.attr('user.birthday') && appState.attr('user.birthday').attr().length > 0) {
					if (appState.attr('user.birthday').attr()[2] == i) {
						selected = 'selected';
					}
				}
				html += '<option ' + selected + ' value="' + i + '">' + i + '</option>';
			}

			return html;
		});

		can.mustache.registerHelper('birthdayOptions', function (options) {
			var html = '';

			for (var i = 1; i <= 31; i++) {
				var selected = '';
				if ( appState.attr('user.birthday') && appState.attr('user.birthday').attr().length > 0) {
					if (appState.attr('user.birthday').attr()[0] == i) {
						selected = 'selected';
					}
				}
				html += '<option '+ selected +' value="' + i + '">' + i + '</option>';
			}

			return html;
		});

		can.mustache.registerHelper('monthOptions', function (options) {
			var html = '';
			var months = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];

			for (var i = 1; i <= 12; i++) {
				var selected = '';
				if ( appState.attr('user.birthday') && appState.attr('user.birthday').attr().length > 0) {
					if (appState.attr('user.birthday').attr()[1] == i) {
						selected = 'selected';
					}
				}
				html += '<option ' + selected + ' value="' + i + '">' + months[i-1] + '</option>'
			}

			return html;
		});

		can.mustache.registerHelper('checkInput', function(value) {
			var result = 'wrong';
			if ( value() && value().length > 0) {
				result = 'correct';
			}
			return result
		});
	}
);