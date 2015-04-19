import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';

Ember.MODEL_FACTORY_INJECTIONS = true;

var App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver: Resolver
});

loadInitializers(App, config.modulePrefix);

Ember.Handlebars.helper('computedGrade', function(grade, total, options) {
  grade = parseFloat(grade);
  total = parseInt(total);

  if (!grade) {
    grade = 0;
  }

  if (!total) {
    total = 0;
  }

  var cg = (grade / total) * 100;

  if (cg < 0) {
    return 0;
  }

  return cg.toFixed(1);
});

export default App;
