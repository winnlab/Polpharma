'use strict';

define(
	[
		'canjs',
		'core/appState'
	],

	function (can, appState) {

		return can.Control.extend({
			defaults: {
				visitorForm: '.setVisitor',
				viewpath: 'app/visitors/views/'
			}
		}, {
			init: function () {
				var options = this.options;

				this.element.html(can.view(options.viewpath + 'set.stache', {
					visitor: options.visitor
				}));
			},

			'{visitorForm} submit': function (el, ev) {
				ev.preventDefault();

				var self = this,
					visitorData = can.deparam(el.serialize()),
					visitor = self.options.visitor;

				if (!visitorData.active) {
					visitorData.active = false;
				}

				visitor.attr(visitorData);

				visitor.save()
					.done(function() {
						can.route.attr({'entity_id': visitor.attr('_id')});
						self.setNotification('success', 'Посетитель "' + visitor.name + '" успешно сохранен!')
					})
					.fail(function (visitor) {
						console.error(visitor);
						self.setNotification('error', 'Ошибка сохранения посетителя "' + visitor.name + '"!')
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