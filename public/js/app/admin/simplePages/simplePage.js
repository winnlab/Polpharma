'use strict';

define(
	[
		'canjs',
		'core/appState'
	],

	function (can, appState) {

		return can.Control.extend({
			defaults: {
				simplePageForm: '.setSimplePage',
				viewpath: 'app/simplePages/views/'
			}
		}, {
			init: function () {
				var options = this.options;

				this.element.html(can.view(options.viewpath + 'set.stache', {
					simplePage: options.simplePage
				}));
			},

			'{simplePageForm} submit': function (el, ev) {
				ev.preventDefault();

				var self = this,
					simplePageData = can.deparam(el.serialize()),
					simplePage = self.options.simplePage;

				if (!simplePageData.active) {
					simplePageData.active = false;
				}

				simplePage.attr(simplePageData);

				simplePage.save()
					.done(function() {
						can.route.attr({'entity_id': simplePage.attr('_id')});
						self.setNotification('success', 'Страница "' + simplePage.name + '" успешно сохранена!')
					})
					.fail(function (simplePage) {
						console.error(simplePage);
						self.setNotification('error', 'Ошибка сохранения страницы "' + simplePage.name + '"!')
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