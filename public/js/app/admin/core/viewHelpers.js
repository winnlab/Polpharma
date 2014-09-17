'use strict';

define([
	'canjs',
    'underscore'
],
	function (can, _) {
		
		can.mustache.registerHelper('checkState', function (options) {
			return options.context.attr('viewState') === 'list'
				? options.fn()
				: options.inverse();
		});

		can.mustache.registerHelper('isPrimitive', function (observer, primitive, options) {
			return observer() === primitive ? options.fn() : options.inverse();
		});

		can.mustache.registerHelper('getArrayObjValue', function (array, index, key) {			
			return array() ? array().attr(index + '.' + key) : '';
		});		

		can.mustache.registerHelper('sortedBy', function (collection, prop, options) {
			if (collection && collection.length) {
				var sorted = _.sortBy(collection, function (member) {
					return member.attr(prop);
				});
				
				return _.map(sorted, function (member) {
					return options.fn(member);
				}).join('');
			}
		});
		
		can.mustache.registerHelper('createForm', function (id, className) {
			return '<div id="' + id() + '" class="right-side ' + className + '"></div>';
		});

		can.mustache.registerHelper('checkSelected', function (id, anotherId) {
			return id() === anotherId() ? 'selected' : '';
		});

		can.mustache.registerHelper('checkRelation', function (id, relId, options) {
			return id() === relId() ? options.fn() : options.inverse();
		});		

		can.mustache.registerHelper('getBoxName', function (index) {
			var classes = ['bg-light-blue', 'bg-red', 'bg-green', 'bg-yellow', 'bg-maroon', 'bg-purple', 'bg-aqua'];
			return classes[index() % classes.length]
		});

		can.mustache.registerHelper('make3Col', function (index) {
			return (index() + 1) % 3 === 0 ? '<div class="clearfix"></div>' : '';
		});

        can.mustache.registerHelper('checkLanguages', function (languages, name, description) {
            console.log(languages().attr());
        });




		can.mustache.registerHelper('getJobType', function (jobType) {
			var jobTypes = ['Врач', 'Фармацевт'];
			return jobTypes[jobType()-1];
		});

		can.mustache.registerHelper('getSpeciality', function (speciality_doc, speciality_apt, jobType) {
			var result = null;
			var specialities_doc = ['педиатр', 'терапевт', 'кардиолог', 'семейный врач', 'гастроэнтеролог', 'невропатолог', 'аллерголог', 'дерматолог', 'пульмонолог', 'офтальмолог', 'инфекционист', 'ЛОР'];
			var specialities_apt = ['провизор', 'заведующий аптекой', 'менеджер по закупкам'];

			if ( jobType() == 1) {
				result = specialities_doc[speciality_doc()-1];
			} else if ( jobType() == 2 ) {
				result = specialities_apt[speciality_apt()-1];
			}
			return result;
		});

		can.mustache.registerHelper('getInstitutionTypes', function (institutions) {
			var institutionTypes = ['Поликлиника', 'Стационар', 'Сетевая аптека', 'Несетевая аптека'];

			var result = '';

			if ( institutions() ) {
				for (var institution in institutions().attr()) {
					result += institutionTypes[institutions().attr()[institution] - 1] + ',';
				}

				result = result.substring(0, result.length - 1);
			}

			return result;
		});

		can.mustache.registerHelper('getSocialNetworks', function (networks) {
			var networkTypes = ['Facebook', 'Vkontakte', 'Odnoklassniki', 'Twitter'];

			var result = '';

            if (networks() instanceof Array) {
                if (networks && networks().attr().length > 0) {
                    for (var network in networks().attr()) {
                        result += networkTypes[networks().attr()[network] - 1] + ',';
                    }

                    result = result.substring(0, result.length - 1);
                }
            }

			return result;
		});

		can.mustache.registerHelper('acceptRejectHelper', function (value) {

			var result = '';
			if (value() == 1) {
				result = '<span class="btn btn-success">Да</span>'
			} else if (value() == 2) {
				result = '<span class="btn btn-danger">Нет</span>'
			} else {
				result = '<span class="btn btn-warning">Нет ответа</span>'
			}

			return result;
		});
	}
);