import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('profile');
  this.route('overview');
  this.route('import');
  this.route('signin');
  this.route('logout');
  this.route('new');
  // this.route('class', {path: '/class/:class_id'});
});

export default Router;
