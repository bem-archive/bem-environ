var PATH = require('path'),
    DECL_SEP = '@';

module.exports = function(registry, environ) {

    registry.decl('Arch', {

        /**
         * Defines projects libraries dependencies based on environ's config
         *
         * @param {Array} libs Array of libraries' ids
         * @return {Object}
         */
        useLibraries : function(libs) {
            // {Array} known libraries
            var repo = environ.getConf().libraries || {},
                relative = PATH.relative.bind(null, this.root),
                getLibPath = environ.getLibPath;

            return libs.reduce(function(enabled, lib) {
                var treeish;

                if(lib.indexOf(DECL_SEP) !== -1) {
                    var parts = lib.split(DECL_SEP);

                    lib = parts[0].trim();
                    treeish = parts.splice(1).join(DECL_SEP).trim();
                }

                if(repo[lib] == null) {
                    throw new Error('Library ' + lib + ' is not registered!');
                }

                var decl = repo[lib];
                treeish && (decl.treeish = treeish);

                enabled[relative(getLibPath(lib))] = decl;

                return enabled;
            }, {});
        },

        /**
         * @returns {Object}
         * @override
         */
        getLibraries : function() {
            var libs = this.libraries;
            return Array.isArray(libs) ? this.useLibraries(libs) : libs;
        },

        /**
         * @returns {Array}
         * @override
         */
        createBlockLibrariesNodes : function(parent) {
            var arch = this.arch,
                libs = this.__base.apply(this, arguments),
                libsNodeName = environ.LIB_DIR,
                node = new (registry.getNodeClass('Node'))(
                        libsNodeName === '.' ? 'libs' : libsNodeName);

            arch.setNode(node)
                .addChildren(node, libs);

            if(parent) {
                arch.addParents(node, parent);

                libs.forEach(function(libNode) {
                    arch.unlink(parent, libNode);
                });
            }

            return [node.getId()];
        }

    });

};
