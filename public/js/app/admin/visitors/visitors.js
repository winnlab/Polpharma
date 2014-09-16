'use strict';

define(
	[
		'canjs',
		'underscore',
		'app/visitors/visitor',
		'app/visitors/visitorsModel',
		'core/appState',
		'css!app/visitors/css/visitors'
	],

	function (can, _, Visitor, visitorsModel, appState) {

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
					module: 'visitors',
					action: undefined,
					entity_id: undefined
				});
				this.attr('viewState', 'list');
			},
			toEntity: function (visitor_id) {
				can.route.attr({
					entity_id: visitor_id,
					action: 'set',
					module: 'visitors'
				});
			}
		});

		return can.Control.extend({
			defaults: {
				viewpath: 'app/visitors/views/',
				visitorsModel: visitorsModel
			}
		}, {
			init: function () {

				var self = this,
					route = can.route.attr();

				var viewModel = new ViewModel();

				viewModel.attr({
					'visitors': new visitorsModel.List({})
				});

				if (route.entity_id && route.action) {
					viewModel.attr('viewState', 'edit');
					can.when(
							viewModel.attr('visitors')
						).then(function () {
							self.setVisitor(route.entity_id);
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

				if (data.module === 'visitors' && viewState !== 'list') {
					viewModel.toList();
				}
			},

			':module/:action/:entity_id route': function (data) {
				if (data.module === 'visitors') {
					this.setVisitor(data.entity_id);
				}
			},

			'.exportToExcel click': function (el, ev) {
				ev.preventDefault();

				visitorsModel.exportToExcel()
					.done(function () {

						window.location.href = '/uploads/visitors.xls'
					})
					.fail(function () {
						console.log('error');
					});
			},

			/*
			 * Set fragment functions
			 */

			'.addVisitor click': function () {
				this.viewModel.toEntity('0');
			},

			'.editVisitor click': function (el) {
				var visitor = el.parents('.visitor').data('visitor');
				this.viewModel.toEntity(visitor.attr('_id'));
			},

			setVisitor: function (id) {

				this.viewModel.attr({
					'id': Date.now(),
					'viewState': 'edit'
				});

				var self = this,
					formWrap = self.element.find('.setVisitorWrap'),
					visitor = _.find(self.viewModel.attr('visitors'), function (visitor) {
						return visitor && visitor.attr('_id') === id;
					});

				new Visitor(formWrap, {
					visitor: visitor ? visitor : new visitorsModel()
				});
			},

			'.removeVisitor click': function (el) {
				var visitor = el.parents('.visitor').data('visitor');

				if (confirm('Вы действительно хотите удалить мысль: "' + visitor.attr('name') + '"?')) {
					visitor.destroy().always(function (visitor, status, def) {
						appState.attr('notification', {
							status: status,
							msg: visitor.name + '. '+ def.responseJSON.message
						})
					});
				}
			},

			'{visitorsModel} updated': function () {
				this.viewModel.reOrder('visitors');
			},

			'{visitorsModel} created': function (Model, ev, visitor) {
				var self = this,
					visitors = self.viewModel.attr('visitors');

				visitors.push(visitor);
				this.viewModel.reOrder('visitor');
			}
		});

	}
);