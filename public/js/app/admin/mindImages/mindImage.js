'use strict';

define(
	[
		'canjs',
		'core/appState'
	],

	function (can, appState) {

		return can.Control.extend({
			defaults: {
				mindImageForm: '.setMindImage',
				viewpath: 'app/mindImages/views/'
			}
		}, {
			init: function () {
				var options = this.options;

				this.element.html(can.view(options.viewpath + 'set.stache', {
					mindImage: options.mindImage
				}));
			},

			'{mindImageForm} submit': function (el, ev) {
				ev.preventDefault();

				var self = this,
					mindImageData = can.deparam(el.serialize()),
					mindImage = self.options.mindImage;

				if (!mindImageData.active) {
					mindImageData.active = false;
				}

				mindImage.attr(mindImageData);

				mindImage.save()
					.done(function() {
						can.route.attr({'entity_id': mindImage.attr('_id')});
						self.setNotification('success', 'Запись картинки "' + mindImage.name + '" успешно сохранена!')
					})
					.fail(function (mindImage) {
						console.error(mindImage);
						self.setNotification('error', 'Ошибка сохранения записи картинки "' + mindImage.name + '"!')
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