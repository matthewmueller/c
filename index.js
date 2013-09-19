/**
 * Module Dependencies
 */

var fs = require('fs');
var write = fs.writeFileSync;
var path = require('path');
var join = path.join;
var extend = require('extend.js');

/**
 * Expose `C`
 */

module.exports = C;

/**
 * Initialize `C`
 */

function C(obj) {
  if (!(this instanceof C)) return new C(obj);
  this.obj = {};
  this.obj.all = {};
  this.obj.all.all = obj || {};
  this.obj.all.client = {};
  this.obj.all.server = {};
}

/**
 * Export
 */

C.prototype.export = function() {
  var obj = this.obj;
  var all = obj.all || {};
  var env = process.env.NODE_ENV || 'development';
  var json = obj[env] || {};
  var client = extend({}, all.all, all.client, json.all, json.client);
  var server = extend({}, all.all, all.server, json.all, json.server);
  write(__dirname + '/client.js', 'module.exports = ' + JSON.stringify(client) + ';');
  return server;
};

/**
 * Import
 */

C.prototype.import = function(conf) {
  this.obj = extend({}, this.obj, conf.json());
  return this;
};

/**
 * Get json representation
 */

C.prototype.json = function() {
  return this.obj;
};

/**
 * All config
 */

C.prototype.all = function() {
  return new Environment('all', this);
};

/**
 * Environment
 */

C.prototype.env = function(env) {
  return new Environment(env, this);
};

/**
 * Environment
 */

function Environment(name, C) {
  var env = function(k, v) {
    return env.mutate(env.obj.all, k, v);
  };

  env.obj = C.obj[name] = C.obj[name] || {};
  env.obj.all = {};
  env.obj.server = {};
  env.obj.client = {};
  env.__proto__ = Environment.prototype;
  return env;
}

/**
 * Add the mutator function
 */

Environment.prototype.mutate = mutate;

/**
 * Define server configuration
 *
 * @param {Object|Key} k
 * @param {Mixed} v
 * @return {env}
 */

Environment.prototype.server = function(k, v) {
  return this.mutate(this.obj.server, k, v);
};

/**
 * Define client-side configuration
 *
 * @param {Object|Key} k
 * @param {Mixed} v
 * @return {env}
 */

Environment.prototype.browser =
Environment.prototype.client = function(k, v) {
  return this.mutate(this.obj.client, k, v);
};

/**
 * Mutator
 */

function mutate(obj, k, v) {
  if ('object' == typeof k) {
    for(var key in k) obj[key] = k[key];
    return this;
  }

  if (!v) {
    v = obj[k];
    if (undefined === obj[k]) return null;
    return v;
  }

  obj[k] = v;
  return this;
}

/**
 * Get json representation
 */

Environment.prototype.json = function() {
  return this.obj;
};
