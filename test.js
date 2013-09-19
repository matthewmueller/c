/**
 * Module Dependencies
 */

var C = require('./');

var conf = C();

// var all = conf.all();

// all({
//   whatever: 'hi'
// });

// all.client('lol', 'haha');

var dev = conf.env('development');

// dev('test', 'ok');
dev({
  whatever: 'ook'
});

dev.server({
  a: '1',
  b: '2',
  c: '3'
});

dev.client({
  a: 'a',
  b: 'b',
  c: 'c'
});
console.log(require('./another'));
conf.import(require('./another'));

console.log(conf.export());
