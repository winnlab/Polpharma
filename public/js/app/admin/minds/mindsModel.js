define(
	[
		'canjs'
	],

	function (can) {

		return can.Model.extend({
			id: "_id",
			findAll: "GET /admin/mind",
			create:  'POST /admin/mind',
			update:  'PUT /admin/mind',
			destroy: 'DELETE /admin/mind/{id}',
			parseModel: function (data) {
				if (data.success) {
					data = data.message;
				}
				return data;
			},
			parseModels: function (data) {
				return data.message.minds;
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