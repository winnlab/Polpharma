define([
	'canjs'
],
	function (can) {

		can.mustache.registerHelper('isPrimitive', function (observer, primitive, options) {			
			return observer() === primitive ? options.fn() : options.inverse();
		});

		can.mustache.registerHelper('yearOptions', function (options) {
			var html = '';

			for (var i = 1940; i <= 2014; i++) {
				html += '<option value="' + i + '">' + i + '</option>';
			}

			return html;
		});

		can.mustache.registerHelper('birthdayOptions', function (options) {
			var html = '';

			for (var i = 1; i <= 31; i++) {
				html += '<option value="' + i + '">' + i + '</option>';
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