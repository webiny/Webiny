const path = require('path');
const fs = require('fs');
const _ = require('lodash');

const appJs = new RegExp('app([-0-9a-z]+)?.js$');
const vendorJs = new RegExp('vendor([-0-9a-z]+)?.js$');
const appCss = new RegExp('app([-0-9a-z]+)?.css$');

class AssetsPlugin {
    constructor(options) {
        options = options || {};
        this.manifestVariable = options.manifestVariable || "webpackManifest";
        this.assetRules = options.assetRules || [];
    }

    apply(compiler) {
        const outputName = 'meta.json';
        const cache = {};
        const moduleAssets = {};
        const appPath = compiler.options.name.replace('.', '_');

        compiler.plugin('compilation', function (compilation) {
            compilation.plugin('module-asset', function (module, file) {
                moduleAssets[file] = path.join(
                    path.dirname(file),
                    path.basename(module.userRequest)
                );
            });
        });

        compiler.plugin('emit', (compilation, compileCallback) => {
            let manifest = {};

            _.merge(manifest, compilation.chunks.reduce((memo, chunk) => {
                // Map original chunk name to output files.
                // For nameless chunks, just map the files directly.
                return chunk.files.reduce((memo, file) => {
                    // Don't add hot updates to manifest
                    if (file.indexOf('hot-update') >= 0) {
                        return memo;
                    }

                    if (file.startsWith('chunks/')) {
                        memo.chunks = memo.chunks || {};
                        memo.chunks[chunk.id] = file;
                        return memo;
                    }

                    memo['name'] = compiler.name;

                    if (appJs.test(file) && !file.startsWith('chunks/')) {
                        memo['app'] = file;
                    }

                    if (appCss.test(file)) {
                        memo['css'] = file;
                    }

                    return memo;
                }, memo);
            }, {}));

            // Map vendor file
            try {
                fs.readdirSync(compiler.options.output.path).map(f => {
                    if (vendorJs.test(f) && !f.startsWith('chunks/')) {
                        manifest['vendor'] = f;
                    }
                });
            } catch (e) {
                console.log(e.message);
            }

            // Append publicPath onto all references.
            // This allows output path to be reflected in the manifest.
            if (process.env.NODE_ENV === 'production') {
                const urlKeys = ['app', 'vendor', 'css', 'chunks'];
                manifest = _.reduce(manifest, (memo, value, key) => {
                    if (!urlKeys.includes(key)) {
                        memo[key] = value;
                        return memo;
                    }

                    if (key === 'chunks') {
                        const chunks = {};
                        _.each(value, (chkValue, chkKey) => {
                            chunks[chkKey] = this.generateUrl(chkValue, appPath);
                        });
                        memo[key] = chunks;
                    } else {
                        memo[key] = this.generateUrl(value, appPath);
                    }
                    return memo;
                }, {});
            } else {
                const urlKeys = ['app', 'vendor', 'css'];
                manifest = _.reduce(manifest, (memo, value, key) => {
                    memo[key] = urlKeys.includes(key) ? compiler.options.output.publicPath + value : value;
                    return memo;
                }, {});
            }

            Object.keys(manifest).sort().forEach(key => {
                cache[key] = manifest[key];
            });

            const json = JSON.stringify(cache, null, 2);

            compilation.assets[outputName] = {
                source: () => json,
                size: () => json.length
            };

            compileCallback();
        });

        let oldChunkFilename;
        let manifestVariable = this.manifestVariable;

        compiler.plugin("this-compilation", function (compilation) {
            const mainTemplate = compilation.mainTemplate;
            mainTemplate.plugin("require-ensure", function (_) {
                const filename = this.outputOptions.chunkFilename || this.outputOptions.filename;

                if (filename) {
                    oldChunkFilename = this.outputOptions.chunkFilename;
                    this.outputOptions.chunkFilename = "__CHUNK_MANIFEST__";
                }

                return _;
            });
        });

        compiler.plugin("compilation", function (compilation) {
            compilation.mainTemplate.plugin("require-ensure", function (_, chunk, hash, chunkIdVar) {
                if (oldChunkFilename) {
                    this.outputOptions.chunkFilename = oldChunkFilename;
                }

                return _.replace("\"__CHUNK_MANIFEST__\"", manifestVariable + "[" + chunkIdVar + "]");
            });
        });
    }

    generateUrl(file, appPath) {
        let prefix = '/build/production/' + appPath;

        _.each(this.assetRules, rule => {
            const regex = new RegExp(rule.test);
            if (regex.test(file)) {
                prefix = rule.domain + prefix;
                return false;
            }
        });

        return prefix + '/' + file;
    }
}

module.exports = AssetsPlugin;