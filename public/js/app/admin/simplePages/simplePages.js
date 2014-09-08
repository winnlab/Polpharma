'use strict';

define(
	[
		'canjs',
		'underscore',
		'app/simplePages/simplePage',
		'app/simplePages/simplePagesModel',
		'core/appState',
		'css!app/simplePages/css/simplePages'
	],

	function (can, _, SimplePage, simplePagesModel, appState) {

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
					module: 'simplePages',
					action: undefined,
					entity_id: undefined
				});
				this.attr('viewState', 'list');
			},
			toEntity: function (simplePage_id) {
				can.route.attr({
					entity_id: simplePage_id,
					action: 'set',
					module: 'simplePages'
				});
			}
		});

		return can.Control.extend({
			defaults: {
				viewpath: 'app/simplePages/views/',
				simplePagesModel: simplePagesModel
			}
		}, {
			init: function () {

				var self = this,
					route = can.route.attr();

				var viewModel = new ViewModel();

				viewModel.attr({
					'simplePages': new simplePagesModel.List({})
				});

				if (route.entity_id && route.action) {
					viewModel.attr('viewState', 'edit');
					can.when(
							viewModel.attr('simplePages')
						).then(function () {
							self.setSimplePage(route.entity_id);
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

				if (data.module === 'simplePages' && viewState !== 'list') {
					viewModel.toList();
				}
			},

			':module/:action/:entity_id route': function (data) {
				if (data.module === 'simplePages') {
					this.setSimplePage(data.entity_id);
				}
			},

			/*
			 * Set fragment functions
			 */

			'.addSimplePage click': function () {
				this.viewModel.toEntity('0');
			},

			'.editSimplePage click': function (el) {
				var simplePage = el.parents('.simplePage').data('simplePage');
				this.viewModel.toEntity(simplePage.attr('_id'));
			},

			setSimplePage: function (id) {

				this.viewModel.attr({
					'id': Date.now(),
					'viewState': 'edit'
				});

				var self = this,
					formWrap = self.element.find('.setSimplePageWrap'),
					simplePage = _.find(self.viewModel.attr('simplePages'), function (simplePage) {
						return simplePage && simplePage.attr('_id') === id;
					});

				new SimplePage(formWrap, {
					simplePage: simplePage ? simplePage : new simplePagesModel()
				});
			},

			'.removeSimplePage click': function (el) {
				var simplePage = el.parents('.simplePage').data('simplePage');

				if (confirm('Вы действительно хотите удалить страницу: "' + simplePage.attr('name') + '"?')) {
					simplePage.destroy().always(function (simplePage, status, def) {
						appState.attr('notification', {
							status: status,
							msg: simplePage.name + '. '+ def.responseJSON.message
						})
					});
				}
			},

			'{simplePagesModel} updated': function () {
				this.viewModel.reOrder('simplePages');
			},

			'{simplePagesModel} created': function (Model, ev, simplePage) {
				var self = this,
					simplePages = self.viewModel.attr('simplePages');

				simplePages.push(simplePage);
				this.viewModel.reOrder('simplePage');
			}
		});

	}
);