'use strict';

define(
	[
		'canjs',
		'underscore',
		'app/minds/mind',
		'app/minds/mindsModel',
		'core/appState',
		'css!app/minds/css/minds'
	],

	function (can, _, Mind, mindsModel, appState) {

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
					module: 'minds',
					action: undefined,
					entity_id: undefined
				});
				this.attr('viewState', 'list');
			},
			toEntity: function (mind_id) {
				can.route.attr({
					entity_id: mind_id,
					action: 'set',
					module: 'minds'
				});
			}
		});

		return can.Control.extend({
			defaults: {
				viewpath: 'app/minds/views/',
				mindsModel: mindsModel
			}
		}, {
			init: function () {

				var self = this,
					route = can.route.attr();

				var viewModel = new ViewModel();

				viewModel.attr({
					'minds': new mindsModel.List({})
				});

				if (route.entity_id && route.action) {
					viewModel.attr('viewState', 'edit');
					can.when(
							viewModel.attr('minds')
						).then(function () {
							self.setMind(route.entity_id);
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

				if (data.module === 'minds' && viewState !== 'list') {
					viewModel.toList();
				}
			},

			':module/:action/:entity_id route': function (data) {
				if (data.module === 'minds') {
					this.setMind(data.entity_id);
				}
			},

			/*
			 * Set fragment functions
			 */

			'.addMind click': function () {
				this.viewModel.toEntity('0');
			},

			'.editMind click': function (el) {
				var mind = el.parents('.mind').data('mind');
				this.viewModel.toEntity(mind.attr('_id'));
			},

			setMind: function (id) {

				this.viewModel.attr({
					'id': Date.now(),
					'viewState': 'edit'
				});

				var self = this,
					formWrap = self.element.find('.setMindWrap'),
					mind = _.find(self.viewModel.attr('minds'), function (mind) {
						return mind && mind.attr('_id') === id;
					});

				new Mind(formWrap, {
					mind: mind ? mind : new mindsModel()
				});
			},

			'.removeMind click': function (el) {
				var mind = el.parents('.mind').data('mind');

				if (confirm('Вы действительно хотите удалить мысль: "' + mind.attr('name') + '"?')) {
					mind.destroy().always(function (mind, status, def) {
						appState.attr('notification', {
							status: status,
							msg: mind.name + '. '+ def.responseJSON.message
						})
					});
				}
			},

			'{mindsModel} updated': function () {
				this.viewModel.reOrder('minds');
			},

			'{mindsModel} created': function (Model, ev, mind) {
				var self = this,
					minds = self.viewModel.attr('minds');

				minds.push(mind);
				this.viewModel.reOrder('mind');
			}
		});

	}
);