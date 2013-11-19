'use strict';

var Collection = require('../collection/collection');
var Inflector  = require('../../../lib/ActiveSupport/inflector/inflector');
var _          = require('lodash');

function Base() {
  if (!this.cached) this.cached = {};

  var hasMany      = [];
  var belongsTo    = [];

  this.prototype.$save    = function() {
    console.log('Persisting to backend');
  };

  this.new = function(data) {
    if (data && !data.id) data = {id: data};
    if (data && this.cached[data.id]) return this.cached[data.id];
    var t = new this(data);

    // Set the belongsTo association for any dependents
    _.each(hasMany, function(hasMany) {
      t[hasMany.name.pluralize().toLowerCase()][this.name.toLowerCase()] = t;
    }, this);

    this.cached[t.id] = t;
    return t;
  };

  // this.where              = function(terms) {
  //   if (typeof terms != 'object') return;
  //   console.log(_.where(this.cached, terms, this))
    
  // };

  this.hasMany            = function(table) {
    var klass             = eval(this[table.classify()]);
    hasMany.push(klass);
    this.prototype[table] = new Collection(klass, this);
  };

  this.belongsTo          = function(table) {
    var klass             = eval(this[table.camelize()]);
    belongsTo.push(klass);
    this.prototype[table] = undefined;
  };

  return this;
};

module.exports = Base;
