var PATH = require('path'),

    /**
     * Path to project root level .bem/ directory
     * @const
     * @private
     */
    __bemRoot = findBemRoot(module.parent.paths),

    /**
     * @const
     * @private
     */
    __root = getGlobalRoot(),

    /**
     * `ENV_ROOT` dependent constants
     *
     * NOTE: list of constants that could be overriden on project level
     *
     * @private
     * @type Array
     */
    __extendables = ['LIB_DIR', 'LIB_ROOT'],

    /** @type Function */
    resolve = PATH.resolve.bind(null, __bemRoot),
    /** @type Function */
    envresolve = PATH.resolve.bind(null, __root);

/**
 * Path to the environment root
 *
 * NOTE: environment is a project being build
 *
 * @type String
 * @exports ENV_ROOT
 */
environ.ENV_ROOT = envresolve('../');

/**
 * Path to the project / library root
 * @type String
 * @exports PRJ_ROOT
 */
environ.PRJ_ROOT = resolve('../');

/**
 * Name of the libs storage directory
 * @type String
 * @exports LIB_DIR
 */
environ.LIB_DIR = 'libs';

/**
 * Path to the libs storage root
 *
 * @type String
 * @exports LIB_ROOT
 */
Object.defineProperty(environ, 'LIB_ROOT', {
    enumerable: true,
    get: function() {
        return PATH.join(environ.ENV_ROOT, environ.LIB_DIR);
    }
});

/**
 * Name of .bem-configs directory
 * @type String
 * @exports CONF_DIR
 */
environ.CONF_DIR = 'configs';

/**
 * Path to .bem-configs directory
 * @type String
 * @exports CONF_ROOT
 */
Object.defineProperty(environ, 'CONF_ROOT', {
    enumerable: true,
    get: function() {
        return resolve(environ.CONF_DIR);
    }
});

/**
 * "Current" configuration
 * @exports getConf
 * @returns {Object}
 */
environ.getConf = getConf;
function getConf() {
    return require(PATH.join(environ.CONF_ROOT, 'current'));
}

/**
 * Get absolute path to the `lib` library
 * @exports getLibPath
 * @param {String} lib  Library name
 * @param {String} [...path]
 * @returns {String}
 */
environ.getLibPath = getLibPath;
function getLibPath() {
    var args = Array.prototype.slice.call(arguments, 0);
    return PATH.join.apply(PATH, [environ.LIB_ROOT].concat(args));
}

/**
 * Get relative path to the `lib` library
 * @exports getLibRelPath
 * @param {String} lib  Library name
 * @param {String} [...path]
 * @returns {String}
 */
environ.getLibRelPath = getLibRelPath;
function getLibRelPath() {
    return PATH.relative(environ.PRJ_ROOT, getLibPath.apply(null, arguments));
}

/**
 * bem make configuration entry point.
 *
 * Extends `bem make` build process with `bem-environ` nodes.
 *
 * Should be used like this:
 *
 *     require('bem-environ').extendMake(MAKE);
 *
 * @param {Object} registry Nodes registry (MAKE variable in .bem/make.js)
 */
environ.extendMake = function(registry) {
    require('./nodes')(registry, environ);
};

if (__root !== __bemRoot) {
    try {
        // Try to find `bem-environ` in project dependencies
        matchEnviron(__root, '../node_modules/bem-environ');
    } catch(e) {
        // `bem-environ` was not found, try to find `.bem/environ`
        try {
            matchEnviron(__root, 'environ');
        } catch(ignore) {}
    }
}

function matchEnviron(root, path) {
    // Override constants from `__extendables` using `ENV_ROOT` environment
    var rootEnviron = require(PATH.join(root, path));

    __extendables.forEach(function(name) {
        var v = rootEnviron[name];
        if (typeof v !== 'undefined') {
            environ[name] = v;
        }
    });

    setGlobalRoot(root);
}

function findBemRoot(paths) {
    var found = '';
    paths.forEach(function(p) {
        if (found) return;
        try {
            found = PATH.dirname(require.resolve(PATH.join(p, '../.bem/make.js')));
        } catch(ignore) {}
    });
    return found;
}

function getGlobalRoot() {
    return process.env.__root_level_dir || __bemRoot;
}

/**
 * @param {String} root  Absolute path to project root level .bem/ directory
 */
function setGlobalRoot(root) {
    process.env.__root_level_dir = root;
}

/**
 * Init function.
 *
 * Usage example:
 *
 *     var environ = require('bem-environ')(__dirname);
 *
 * @param {String|Object} opts
 * @returns {Object}
 */
function environ(opts) {
    var root;
    if (typeof opts === 'string') {
        root = opts;
    } else {
        opts.root && (root = opts.root);
        opts.confDir && (environ.CONF_DIR = opts.confDir);
        opts.libDir && (environ.LIB_DIR = opts.libDir);
    }

    if (root) {
        setGlobalRoot(root);
    }

    return environ;
}

module.exports = environ;
