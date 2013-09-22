
# c.js

  multi-environment configuration for server and client (with component, bower, etc.). Automatically defines getters for configuration.

## Installation

Using npm:

    npm install c.js

## Example

In `config/index.js`:

```js
var c = module.exports = require('c.js')();
var dev = c.env('development');
var prod = c.env('production');
var private = c.import(require('./private'));

c('script', __dirname + '/scripts');

dev({
  debug: 'app:*',
  volume: __dirname + '/volume'
});

dev.client({
  debug: 'app:*',
  retry: 10
});

prod.server('s3', 'some key');
prod.client('ga', 'some key');

// write client-side configuration
conf.write(__dirname + '/client.js');
```

In `production` index.js:

```js
  var conf = require('./config');
  conf.script // __dirname + '/scripts'
  conf.s3 // some key
  conf.ga // undefined (client-side key)
```

In `production` client.js:

```js
  var conf = require('./config');
  conf.script // __dirname + '/scripts'
  conf.s3 // undefined (server-side key)
  conf.ga // some key
```

## API

### C(key, value)

Create a new configuration with initial data. The arguments are added to all environments on both runtimes (client and server). Arguments passed to the `mutate` function (see below).

### c(key, value)

Add configuration to all environments and runtimes. Arguments passed to the `mutate` function. This function may be called any number of times.

### c.all(key, value)

Alias to `c(key, value)`.

### c.server(key, value);

Add configuration to the `server` runtime on all environments.  Arguments passed to the `mutate` function.

### c.client(key, value);

Add configuration to the `client` runtime on all environments.  Arguments passed to the `mutate` function.

### c.env(environment)

Initialize an environment specific configuration. The environment is loaded based on `process.env.NODE_ENV` and defaults to `development`.

### c.import(c)

Import configuration from another file. Useful for private files and breaking up big configurations. `c` may be either a `c` instance or `json`.

### c.write(filepath)

Write the client runtime to the filepath. Used to be required by the local `component.json` or `bower.json`. Should be placed at the end of the file. Also might want to add the `filepath` to your `.gitignore`.

```js
c.write(__dirname + '/client.js');
```

### c.json()

Get the raw `json`

### Environment(key, value)

Add a key value pair to an environment configuration on both client and server. Arguments passed to the `mutate` function. This function may be called any number of times.

```js
dev('log', true);

dev({
  https: false,
  autologin: true
})
```

### environment.client(key, value)

Add a configuration for the `client` runtime under the given environment.

```js
dev.client({ ... })
```

### environment.server(key, value)

Add a configuration for the `server` runtime under the given environment.

```js
dev.server({ ... })
```

### environment.json()

Get the raw `json` for the environment

### mutate(key, value)

This mutate function is used internally by all environment and root configurations. You may set many values at once by passing an object to `key`, or set a single value by passing the `key` and `value`, or get a value by only specifying a `key`. For getters, the root configuration (all) inherits from the loaded environment.

```js
  mutate('a', 'b');
  mutate({ a: b });
  mutate('a');
```

## Tests

```
npm install
make test
```

## License

(The MIT License)

Copyright (c) 2012 matthew mueller &lt;mattmuelle@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
