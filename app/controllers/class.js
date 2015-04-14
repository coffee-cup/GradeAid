import Ember from 'ember';

export default Ember.Controller.extend({
	// return background colour in css based on the clases colour
	backgroundColour: function() {
		var c = this.get('class');
		if (c)
      {		return 'background-color: ' + c.colour;
  }
  return 'background-color: ' + 'white';
}.property('class'),

ls: [1,2,3],

actions: {

  addMark: function() {
    var mark_title = this.get('mark_title');

    if (mark_title) {
      var schedule = this.get('model');

      var mark = createMark(mark_title);
      var c = this.get('class');

      c.marks.pushObject(mark);
      this.set('class', c);

      chrome.runtime.sendMessage({type: 'update', message: 'new_mark', class_id: c.id, schedule: schedule});
    }
  }
  
}
});

