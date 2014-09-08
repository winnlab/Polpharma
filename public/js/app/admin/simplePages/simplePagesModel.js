define(
	[
		'canjs'
	],

	function (can) {

		return can.Model.extend({
			id: "_id",
			findAll: "GET /admin/simplePage",
			create:  'POST /admin/simplePage',
			update:  'PUT /admin/simplePage',
			destroy: 'DELETE /admin/simplePage/{id}',
			parseModel: function (data) {
				if (data.success) {
					data = data.message;
				}
				return data;
			},
			parseModels: function (data) {
				return data.message.simplePages;
			}
		}, {});

	}
);