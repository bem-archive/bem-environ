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
     * Константы, зависящие от окружения `ENV_ROOT`
     *
     * NOTE: список названий констант, которые могут быть переопределены
     * на уровне проекта.
     *
     * @private
     * @type Array
     */
    __extendables = ['LIB_DIR', 'LIB_ROOT'],

    /** @type Function */
    resolve = PATH.resolve.bind(null, __bemRoot),
    /** @type Function */
    envresolve = PATH.resolve.bind(null, __root),

    /**
     * Путь до корня окружения
     *
     * NOTE: под окружением подразумеваем проект, сборку которого
     * мы осуществляем.
     *
     * @type String
     * @exports ENV_ROOT
     */
    ENV_ROOT = environ.ENV_ROOT = envresolve('../'),

    /**
     * Путь до корня проекта / библиотеки
     * @type String
     * @exports PRJ_ROOT
     */
    PRJ_ROOT = environ.PRJ_ROOT = resolve('../'),

    /**
     * Имя директории куда складываем библиотеки
     * @type String
     * @exports LIB_DIR
     */
    LIB_DIR = environ.LIB_DIR = 'libs',

    /**
     * Путь до корня хранилища библиотек
     *
     * NOTE: путь расчитывается относительно корня окружения `ENV_ROOT`
     * пока нет способа описать зависимости в библиотеках.
     *
     * @type String
     * @exports LIB_ROOT
     */
    LIB_ROOT = environ.LIB_ROOT = PATH.join(ENV_ROOT, LIB_DIR),

    /**
     * Имя директории с .bem-конфигами
     * @type String
     * @exports CONF_DIR
     */
    CONF_DIR = environ.CONF_DIR = 'configs',

    /**
     * Путь до директории с .bem-конфигами
     * @type String
     * @exports CONF_ROOT
     */
    CONF_ROOT = environ.CONF_ROOT = resolve(CONF_DIR);

/**
 * «Текущая» конфигурация
 * @exports getConf
 * @returns {Object}
 */
environ.getConf = getConf;
function getConf() {
    return require(PATH.join(environ.CONF_ROOT, 'current'));
}

/**
 * Абсолютный путь до библиотеки `lib`
 * @exports getLibPath
 * @param {String} lib id библиотеки
 * @param {String} [...path]
 * @returns {String}
 */
environ.getLibPath = getLibPath;
function getLibPath() {
    var args = Array.prototype.slice.call(arguments, 0);
    return PATH.join.apply(PATH, [environ.LIB_ROOT].concat(args));
}

/**
 * Путь до библиотеки `lib` относительно корня проекта
 * @exports getLibRelPath
 * @param {String} lib id библиотеки
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
    var root = process.env.__root_level_dir;
    return root || __bemRoot;
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
 * @param {String} root
 * @returns {Object}
 */
function environ(root) {
    setGlobalRoot(root);
    return environ;
}

module.exports = environ;
