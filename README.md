bem-environ
===========

[![NPM version](https://badge.fury.io/js/bem-environ.png)](http://badge.fury.io/js/bem-environ)

## Usage

Install it with `npm`

```
› npm install bem-environ --save
```

If you plan to distribute your module/library as an npm package, add `bem-environ` to `bundledDependencies` section
(see example) in your `package.json`. This is due to every BEM library need its own copy of `bem-environ`, but `npm`
tries to optimise packages installation.

```javascript
{
    "bundledDependencies": ["bem-environ"]
}
```

Update your project's `make.js` to extend common build process provided
by [bem-tools](http://github.com/bem/bem-tools)

```javascript
// make.js

// Initialize environ with global root path (see API section for more examples)
var environ = require('bem-environ')(__dirname);

function extendMake(registry) {

    // Extend common `bem make` build process with `bem-environ`'s nodes (optional)
    environ.extendMake(registry);

    registry.decl('Arch', {

      // ...

    });

};

// For compatibility with bem-tools << 1.0.0
if (MAKE) extendMake(MAKE);

// For compatibility with bem-tools >= 1.0.0
if (module && module.exports) module.exports = extendMake;
```

### API

#### environ(root | opts)

`{String|Object} root | opts` — Options to declare or path to the environment root

Set environment root and other options.

##### Examples

Set environment root only:

```javascript
var environ = require('bem-environ')(__dirname);
```

Set environment root and other options:

```javascript
var environ = require('bem-environ')({
    root: __dirname,
    libDir: 'components', // override default 'libs' directory
    confDir: 'conf' // override default 'configs' directory
});
```

#### extendMake(registry)

`{BEM.Registry} registry` — bem-tools registry object

Extend bem-tools registry object with nodes of `bem-environ`.

#### getLibPath(lib, [path...])

`{String} lib` — Library name
`{String} path...` — Library internal path

Return absolute path to the library root or its files or directories.

#### getLibRelPath(lib, [path...])

`{String} lib` — Library name
`{String} path...` — Library internal path

Return relative to the root path to the library root or its files or directories.
