define(
	[
		'canjs'
	],

	function (can) {

		return can.Model.extend({
			id: "_id",
			create:  'POST /personalData',
			update:  'PUT /personalData',
			parseModel: function (data) {
				if (data.success) {
					data = data.message;
				}
				return data;
			},
			parseModels: function (data) {
				return data.message;
			}
		}, {});

	}
);