const crypto = require('crypto');
const _ = require('lodash');
const NormalModule = require("webpack/lib/NormalModule");

class ChunkIds {
    apply(compiler) {
        this.compiler = compiler;
        compiler.plugin("compilation", (compilation) => {
            // Generate chunk IDs
            compilation.plugin("before-chunk-ids", (chunks) => {
                chunks.forEach((chunk, index) => {
                    if (!chunk.hasEntryModule() && chunk.id === null) {
                        let id = index;
                        if (process.env.NODE_ENV === 'production') {
                            chunk.id = compiler.options.name + '-' + this.createChunkIdHash(chunk);
                        } else {
                            id = this.generateChunkName(chunk);
                            // ID must contain the name of the app to avoid ID clashes between multiple apps
                            chunk.id = compiler.options.name + '-' + index;
                            // Name is only used in development for easier debugging
                            chunk.name = id;
                        }
                    }
                });
            });
        });
    }

    generateChunkName(chunk) {
        const appName = this.compiler.options.name.split('.')[0] + '_';
        const jsName = this.compiler.options.name.replace('.', '_Js_') + '_';
        const chunkModules = chunk.mapModules(m => m).filter(this.filterJsModules).sort(this.sortByIndex);
        const filteredModules = chunkModules.filter(m => !m.resource.includes('/node_modules/'));
        let chunkName = _.get(filteredModules, '[0].resource', _.get(chunkModules, '0.resource', 'undefined')).split('/Apps/').pop();
        return chunkName.replace('/index.js', '').replace(/\//g, '_').replace(/\.jsx?/, '').replace(jsName, '').replace(appName, '');
    }

    sortByIndex(a, b) {
        return a.index - b.index;
    }

    filterJsModules(m) {
        if (m instanceof NormalModule) {
            return m.resource.endsWith('.js') || m.resource.endsWith('.jsx');
        }

        return false;
    }

    createChunkIdHash(chunk) {
        // We are generating chunk id based on containing modules (their `resource` path relative to `Apps` folder).
        // That way chunk id does not change as long as it contains the same modules (no matter the content).
        const paths = chunk.mapModules(this.getRelativeModulePath).sort((a, b) => a.index - b.index).join("\n");
        return crypto.createHash('md5').update(paths).digest('hex').substr(0, 10);
    }

    getRelativeModulePath(module) {
        if (!module || !module.resource) {
            return '';
        }

        return module.resource.split('/Apps/').pop();
    }
}

module.exports = ChunkIds;
