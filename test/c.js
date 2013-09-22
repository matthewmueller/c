/**
 * Module Dependencies
 */

var C = require('../');
var assert = require('assert');
var fs = require('fs');
var read = fs.readFileSync;
var rm = fs.unlinkSync;

/**
 * Tests
 */

describe('C', function() {
  var c;

  beforeEach(function() {
    c = C();
  });

  describe('c(k, v)', function() {
    it('should set strings', function() {
      c('a', 'b');
      assert(c.obj.all.all.a == 'b');
    });

    it('should set objects', function() {
      c({ a: 'b', c: 'd' });
      assert(c.obj.all.all.a == 'b');
      assert(c.obj.all.all.c == 'd');
    });

    it('should get values', function() {
      c({ a: 'b', c: 'd' });
      assert(c('a') == 'b');
      assert(c('c') == 'd');
      assert(c.a == 'b');
      assert(c.c == 'd');
    });

    it('should set client-side vars', function() {
      c.client({ a: 'b', c: 'd' });
      assert(c.obj.all.client.a == 'b');
      assert(c.obj.all.client.c == 'd');
    });

    it('should set server-side vars', function() {
      c.server({ a: 'b', c: 'd' });
      assert(c.obj.all.server.a == 'b');
      assert(c.obj.all.server.c == 'd');
    });

    it('should get values', function() {
      c({ a: 'b', c: 'd' });
      assert(c('a') == 'b');
      assert(c('c') == 'd');
      assert(c.a == 'b');
      assert(c.c == 'd');
    });

    it('should only get server-side vars', function() {
      c.server('e', 'f');
      c.client('g', 'h');
      assert(c.e, 'f');
      assert(!c.g);
    });

    it('should inherit based on NODE_ENV', function() {
      var dev = c.env('development');
      var prod = c.env('production');
      c('a', 'b');
      dev('c', 'd');
      dev.server('e', 'f');
      prod('g', 'h');
      assert(c.a, 'b');
      assert(c.c, 'd');
      assert(c.e, 'f');
      assert(!c.g);
    });

    it('should inherit based on custom NODE_ENV', function() {
      process.env.NODE_ENV = 'production';
      var dev = c.env('development');
      var prod = c.env('production');
      c('a', 'b');
      dev('c', 'd');
      dev.server('e', 'f');
      prod('g', 'h');
      prod.server('i', 'j');
      assert(c.a, 'b');
      assert(!c.c);
      assert(!c.e);
      assert(c.g, 'h');
      assert(c.i, 'j');
      process.env.NODE_ENV = 'development';
    });
  });

  describe('c.env(env)', function() {
    var dev;

    beforeEach(function() {
      dev = c.env('development');
    });

    it('should set strings', function() {
      dev('a', 'b');
      assert(dev.obj.all.a == 'b');
    });

    it('should set objects', function() {
      dev({ a: 'b', c: 'd' });
      assert(dev.obj.all.a == 'b');
      assert(dev.obj.all.c == 'd');
    });

    it('should get environment vars', function() {
      dev({ a: 'b', c: 'd' });
      assert(dev.a == 'b');
      assert(dev.c == 'd');
    });

    it('should only get server-side vars', function() {
      dev.server('e', 'f');
      dev.client('g', 'h');
      assert(dev.e, 'f');
      assert(!dev.g);
    });

    it('should inherit only from dev', function() {
      c('a', 'b');
      dev('c', 'd');
      assert(!dev.a);
      assert(dev.c, 'd');
    });
  });

  describe('c.import(conf)', function() {
    it('should import json', function() {
      c('a', 'b');
      c.import({ development: { all: { c: 'd' }}});
      assert(c.a == 'b');
      assert(c.c == 'd');
    });

    it('should import conf', function() {
      c('a', 'b');
      var other = C('c', 'd');
      c.import(other);
      assert(c.a == 'b');
      assert(c.c == 'd');
    });
  });

  describe('c.write(path)', function() {
    afterEach(function() {
      rm(__dirname + '/client.js');
    });

    it('should write client config to `path`', function() {
      c('a', 'b');
      c.client('e', 'f');
      c.server('c', 'd');

      var dev = c.env('development');
      dev('g', 'h');
      dev.client('i', 'j');
      dev.server('k', 'l');
      var prod = c.env('production');
      prod('m', 'n');
      prod.client('o', 'p');
      prod.server('q', 'r');

      c.write(__dirname + '/client.js');

      var json = require(__dirname + '/client');
      assert(json.a == 'b');
      assert(json.e == 'f');
      assert(!json.c);
      assert(json.g == 'h');
      assert(json.i == 'j');
      assert(!json.k);
      assert(!json.m);
      assert(!json.o);
      assert(!json.q);
    });
  });

});
