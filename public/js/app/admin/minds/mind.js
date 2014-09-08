'use strict';

define(
	[
		'canjs',
		'core/appState'
	],

	function (can, appState) {

		return can.Control.extend({
			defaults: {
				mindForm: '.setMind',
				viewpath: 'app/minds/views/'
			}
		}, {
			init: function () {
				var options = this.options;

				this.element.html(can.view(options.viewpath + 'set.stache', {
					mind: options.mind
				}));
			},

			'{mindForm} submit': function (el, ev) {
				ev.preventDefault();

				var self = this,
					mindData = can.deparam(el.serialize()),
					mind = self.options.mind;

				if (!mindData.active) {
					mindData.active = false;
				}

				mind.attr(mindData);

				mind.save()
					.done(function() {
						can.route.attr({'entity_id': mind.attr('_id')});
						self.setNotification('success', 'Мысль "' + mind.name + '" успешно сохранена!')
					})
					.fail(function (mind) {
						console.error(mind);
						self.setNotification('error', 'Ошибка сохранения страницы "' + mind.name + '"!')
					});
			},

			setNotification: function (status, msg) {
				appState.attr('notification', {
					status: status,
					msg: msg
				});
			}
		});

	}
);