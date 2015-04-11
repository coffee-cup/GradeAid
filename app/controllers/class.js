import Ember from 'ember';

export default Ember.Controller.extend({
	class: function() {
		var model = this.get('model');
		var class_id = this.get('class_id');

		if (!model || !class_id) {
			return null;
		}

		for (var i=0; i<model.classes.length; i++) {
			if (model.classes[i].id === this.get('class_id')) {
				return model.classes[i];
			}
		}
		return null;
	}.property('model', 'class_id')
});

