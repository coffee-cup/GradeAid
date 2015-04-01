(function($) {
  $(function() {

    // plugin init
    $('.button-collapse').sideNav({
      menuWidth: 240,
      activationWidth: 70
    });
  });

})(jQuery); // end of jQuery name space


/*

import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    // console.log(Ember.$('.profile-link'));
    return {"schedule": "one"};
    // return Ember.$.getJSON("assets/data/schedule.json").then(function(data) {
    //     console.log(data);
    //     return data;
    //   });
  }
});

*/
