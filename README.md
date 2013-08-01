bem-environ
===========

[![NPM version](https://badge.fury.io/js/bem-environ.png)](http://badge.fury.io/js/bem-environ)

## Usage

// TODO: describe all of the project's features

Install it with `npm`

```
› npm install bem-environ
```

Update your project's `make.js` to extend common build process provided
by [bem-tools](http://github.com/bem/bem-tools)

```javascript
// make.js

// Initialize environ with global root path
var environ = require('bem-environ')(__dirname);

// Extend common `bem make` build process with `bem-environ`'s nodes (optional)
environ.extendMake(MAKE);

MAKE.decl('Arch', {

  // ...

});
```
