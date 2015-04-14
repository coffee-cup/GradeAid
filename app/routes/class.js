import Ember from 'ember';

var scope = {
  this: null
};

export default Ember.Route.extend({
  model: function(params) {
    scope.this = this;
    this.controllerFor('class').set('class_id', params.class_id);
    this.controllerFor('class').set('mark_title', '');
    chrome.runtime.sendMessage({message: 'get_schedule'}, function(response) {
    	var model = response.schedule;
      scope.this.controllerFor('class').set('model', model);

      var c = null;
      for (var i=0; i<model.classes.length; i++) {
        if (model.classes[i].id === params.class_id) {
          c = model.classes[i];
        }
      }

      scope.this.controllerFor('class').set('class', c);
    });
  }
});
