
# c.js

  multi-environment configuration for client and server

## Installation

Using npm:

    npm install c.js

Using component:

    component install matthewmueller/c

## Example

```js
var conf = require('c.js')();
var all = conf.all();
var dev = conf.env('development');
var prod = conf.env('production');
var private = conf.import(require('./private'));

all({
  script: __dirname + '/scripts'
})

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

module.exports = conf.export();
```

## API

### C(json)

Create a new configuration with initial `json`. `json` added to all environments on both the client and server.

### c.env(environment)

Initialize an environment specific configuration. The environment is loaded based on `process.env.NODE_ENV` and defaults to `development`

### c.all()

Initialize the `all` environment, or configuration that is inherited by all environments. May also use specific `client` and `server` configuration

```js
var all = c.all();
all({ ... });
all.server({ ... });
all.client({ ... });
```

### c.export()

Used to finalize the configuration, exporting only the JSON relevant to the given environment. Also writes the client-side JSON for consumption by component.

### c.import(c)

Import configuration from another file. Useful for private files and breaking up big configurations.

### c.json()

Get the raw `json`

### Environment(key, value)

Add a key value pair to an environment configuration on both client and server. `key` may also be an object to add many values at once. This function may be called any number of times. If no `value` is specified, the function is a getter.

```js
dev('log', true);

dev({
  https: false,
  autologin: true
})
```

### environment.client(key, value)

Add a configuration for the client-side under the given environment. `browser` is an alias to `client`.

```js
dev.client({ ... })
```

### environment.server(key, value)

Add a configuration for the server-side under the given environment.

```js
dev.server({ ... })
```

### environment.json()

Get the raw `json` for the environment

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
