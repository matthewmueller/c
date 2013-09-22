/**
 * Module Dependencies
 */

var fs = require('fs');
var write = fs.writeFileSync;
var extend = require('extend.js');
var loaded = process.env.NODE_ENV || 'development';

/**
 * Expose `C`
 */

module.exports = C;

/**
 * Initialize `C`
 *
 * @param {Object} obj
 * @return {C}
 * @api public
 */

function C(key, value) {
  if (!(this instanceof C)) return new C(key, value);

  var c = function(k, v) {
    return c.mutate(k, v, c.obj.all, 'all');
  };

  c.obj = {};

  // set up the all environment
  c.obj.all = { all: {}, client: {}, server: {} };

  // set up the loaded environment
  c.obj[loaded] = { all: {}, client: {}, server: {} };

  // environments
  c.envs = {};

  // inherit the prototype
  c.__proto__ = C.prototype;

  // pass the key through
  if (key) c(key, value);

  return c;
}

/**
 * Inherit methods
 */

C.prototype.mutate = mutate;
C.prototype.all = all;
C.prototype.client = client;
C.prototype.server = server;

/**
 * Environment
 *
 * @param {String} env
 * @return {C}
 */

C.prototype.env = function(env) {
  var environment = new Environment(env, this);
  this.envs[env] = environment;
  return environment;
};

/**
 * Set
 *
 * @param {Object} obj
 * @param {String} k
 * @param {Mixed} v
 * @return {C}
 * @api private
 */

C.prototype.set = function(obj, k, v, runtime) {
  obj[runtime][k] = v;

  var o = this.obj;
  var env = process.env.NODE_ENV || loaded;
  var json = extend({}, o.all.all, o.all.server, o[env].all, o[env].server);

  this.__defineGetter__(k, function() {
    return json[k];
  });
};

/**
 * Initialize a new `Environment`
 */

function Environment(env, root) {

  var e = function(k, v) {
    e.mutate(k, v, e.obj, 'all');
  };

  e.obj = { all: {}, client: {}, server: {} };
  e.root = root;
  root.obj[env] = e.obj;

  e.__proto__ = Environment.prototype;

  return e;
}

/**
 * Inherit methods
 */

Environment.prototype.mutate = mutate;
Environment.prototype.all = all;
Environment.prototype.client = client;
Environment.prototype.server = server;

/**
 * Set
 *
 * @param {Object} obj
 * @param {String} k
 * @param {Mixed} v
 * @return {Environment}
 * @api private
 */

Environment.prototype.set = function(obj, k, v, runtime) {
  // set the object
  obj[runtime][k] = v;

  // set local value
  var o = this.obj;
  var json = extend({}, o.all, o.server);

  // define the local getter
  this.__defineGetter__(k, function() {
    return json[k];
  });

  // set the root
  this.root.set(obj, k, v, runtime);

  return this;
};

/**
 * Import
 *
 * @param {Object|C} conf
 * @return {C}
 * @api public
 */

C.prototype.import = function(conf) {
  conf = (conf.obj) ? conf.obj : conf;
  this.extend(conf);
  return this;
};

/**
 * Write
 *
 * @param {String} path
 * @return {C}
 * @api public
 */

C.prototype.write = function(path) {
  var o = this.obj;
  var env = process.env.NODE_ENV || loaded;
  var json = extend({}, o.all.all, o.all.client, o[env].all, o[env].client);
  write(path, 'module.exports = ' + JSON.stringify(json) + ';');
  return this;
};

/**
 * "deeper" extend. 2 levels deep.
 *
 * @api private
 */

C.prototype.extend = function(conf) {
  var o = this.obj;
  var environment;

  for(var env in conf) {
    if (undefined === o[env]) new Environment(env, this);

    for(var runtime in conf[env]) {
      this.mutate(conf[env][runtime], null, o[env], runtime);
    }
  }
};

/**
 * Output full JSON
 *
 * @return {Object}
 */

function json() {
  return this.obj;
}

/**
 * All
 *
 * @param {String|Object} k
 * @param {Mixed} v
 * @return {Mixed|C}
 */

function all(k, v) {
  var obj = (this.root) ? this.obj : this.obj.all;
  return this.mutate(k, v, obj, 'all');
}

/**
 * Server
 *
 * @param {String|Object} k
 * @param {Mixed} v
 * @return {Mixed|C}
 */

function server(k, v) {
  var obj = (this.root) ? this.obj : this.obj.all;
  return this.mutate(k, v, obj, 'server');
}


/**
 * Client
 *
 * @param {String|Object} k
 * @param {Mixed} v
 * @return {Mixed|C}
 */

function client(k, v) {
  var obj = (this.root) ? this.obj : this.obj.all;
  return this.mutate(k, v, obj, 'client');
}

/**
 * Mutate
 *
 * @param {String} k
 * @param {Mixed} v
 * @param {Object} obj
 * @return {C}
 * @api private
 */

function mutate(k, v, obj, runtime) {
  if ('object' == typeof k) {
    for(var key in k) this.set(obj, key, k[key], runtime);
  } else if (!v) {
    return this[k];
  } else {
    this.set(obj, k, v, runtime);
  }

  return this;
}
