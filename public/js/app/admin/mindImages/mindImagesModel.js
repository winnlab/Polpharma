define(
	[
		'canjs'
	],

	function (can) {

		return can.Model.extend({
			id: "_id",
			findAll: "GET /admin/mindImage",
			create:  'POST /admin/mindImage',
			update:  'PUT /admin/mindImage',
			destroy: 'DELETE /admin/mindImage/{id}',
			parseModel: function (data) {
				if (data.success) {
					data = data.message;
				}
				return data;
			},
			parseModels: function (data) {
				return data.message.mindImages;
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