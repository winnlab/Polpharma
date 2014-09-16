define(
	[
		'canjs'
	],

	function (can) {

		return can.Model.extend({
			id: "_id",
			findAll: "GET /admin/visitor",
			create:  'POST /admin/visitor',
			update:  'PUT /admin/visitor',
			destroy: 'DELETE /admin/visitor/{id}',
			parseModel: function (data) {
				if (data.success) {
					data = data.message;
				}
				return data;
			},
			parseModels: function (data) {
				return data.message.visitors;
			},
			exportToExcel: function () {
				return can.ajax({
					url: '/admin/exportToExcel'
				});
			}
		}, {
			uploaded: function (name, value) {
				this.attr(name, value);
			},
			removeUploaded: function (name) {
				this.attr(name, undefined);
			}
		});

	}
);