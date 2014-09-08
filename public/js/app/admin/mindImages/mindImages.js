'use strict';

define(
	[
		'canjs',
		'underscore',
		'app/mindImages/mindImage',
		'app/mindImages/mindImagesModel',
		'core/appState',
		'css!app/mindImages/css/mindImages'
	],

	function (can, _, MindImage, mindImagesModel, appState) {

		var ViewModel = can.Map.extend({
			define: {
				viewState: {
					value: 'list'
				}
			},
			reOrder: function (attr, key) {
				/*				key = key || 'position';
				 var list = this.attr(attr);
				 console.log(list);
				 list.sort(function (a, b) {
				 return a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0;
				 });*/
			},
			toList: function () {
				can.route.attr({
					module: 'mindImages',
					action: undefined,
					entity_id: undefined
				});
				this.attr('viewState', 'list');
			},
			toEntity: function (mindImage_id) {
				can.route.attr({
					entity_id: mindImage_id,
					action: 'set',
					module: 'mindImages'
				});
			}
		});

		return can.Control.extend({
			defaults: {
				viewpath: 'app/mindImages/views/',
				mindImagesModel: mindImagesModel
			}
		}, {
			init: function () {

				var self = this,
					route = can.route.attr();

				var viewModel = new ViewModel();

				viewModel.attr({
					'mindImages': new mindImagesModel.List({})
				});

				if (route.entity_id && route.action) {
					viewModel.attr('viewState', 'edit');
					can.when(
							viewModel.attr('mindImages')
						).then(function () {
							self.setMindImage(route.entity_id);
						});
				}

				self.element.html(can.view(self.options.viewpath + 'index.stache', viewModel));

				this.viewModel = viewModel;
			},

			/*
			 * Routes
			 */

			':module/:id route': function (data) {
				var viewModel = this.viewModel,
					viewState = viewModel.attr('viewState');

				if (data.module === 'mindImages' && viewState !== 'list') {
					viewModel.toList();
				}
			},

			':module/:action/:entity_id route': function (data) {
				if (data.module === 'mindImages') {
					this.setMindImage(data.entity_id);
				}
			},

			/*
			 * Set fragment functions
			 */

			'.addMindImage click': function () {
				this.viewModel.toEntity('0');
			},

			'.editMindImage click': function (el) {
				var mindImage = el.parents('.mindImage').data('mindImage');
				this.viewModel.toEntity(mindImage.attr('_id'));
			},

			setMindImage: function (id) {

				this.viewModel.attr({
					'id': Date.now(),
					'viewState': 'edit'
				});

				var self = this,
					formWrap = self.element.find('.setMindImageWrap'),
					mindImage = _.find(self.viewModel.attr('mindImages'), function (mindImage) {
						return mindImage && mindImage.attr('_id') === id;
					});

				new MindImage(formWrap, {
					mindImage: mindImage ? mindImage : new mindImagesModel()
				});
			},

			'.removeMindImage click': function (el) {
				var mindImage = el.parents('.mindImage').data('mindImage');

				if (confirm('Вы действительно хотите удалить запись картинки: "' + mindImage.attr('name') + '"?')) {
					mindImage.destroy().always(function (mindImage, status, def) {
						appState.attr('notification', {
							status: status,
							msg: mindImage.name + '. '+ def.responseJSON.message
						})
					});
				}
			},

			'{mindImagesModel} updated': function () {
				this.viewModel.reOrder('mindImages');
			},

			'{mindImagesModel} created': function (Model, ev, mindImage) {
				var self = this,
					mindImages = self.viewModel.attr('mindImages');

				mindImages.push(mindImage);
				this.viewModel.reOrder('mindImage');
			}
		});

	}
);