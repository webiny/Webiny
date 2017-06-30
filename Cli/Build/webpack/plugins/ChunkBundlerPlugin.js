const _ = require('lodash');

class ChunkBundlerPlugin {
    constructor(options) {
        this.options = options || {}
    }

    apply(compiler) {
        compiler.plugin('emit', (compilation, compileCallback) => {
            const resolvedPaths = {};
            const promises = [];
            _.each(this.options, (modules, url) => {
                resolvedPaths[url] = [];
                const resolvedChunkPaths = modules.map(module => {
                    return new Promise(resolve => {
                        compiler.resolvers.normal.resolve(compiler.options.context, '', module, (err, res) => {
                            resolvedPaths[url].push(res);
                            resolve();
                        });
                    });
                });
                promises.push(Promise.all(resolvedChunkPaths));
            });

            const mappedChunks = {};
            Promise.all(promises).then(() => {
                // Try finding the resolved chunk paths in the chunks modules
                _.each(resolvedPaths, (paths, url) => {
                    mappedChunks[url] = [];
                    compilation.chunks.map(chunk => {
                        chunk.mapModules(module => {
                            if (module.resource && paths.includes(module.resource)) {
                                mappedChunks[url].push(
                                    '// ' + chunk.files[0] + "\n\n" + compilation.assets[chunk.files[0]].source()
                                );
                            }
                        });
                    });
                });

                let index = 0;
                // Write new meta
                let meta = JSON.parse(compilation.assets['meta.json'].source());
                _.each(mappedChunks, (source, url) => {
                    const src = source.join('');
                    const bundleFile = 'bundles/bundle-' + index + '.js';
                    compilation.assets[bundleFile] = {
                        source: () => src,
                        size: () => src.length
                    };
                    _.set(meta, 'bundles.' + url, compiler.options.output.publicPath + bundleFile);
                    index++;
                });

                // Assign new meta.json to output assets
                meta = JSON.stringify(meta, null, 4);
                compilation.assets['meta.json'] = {
                    source: () => meta,
                    size: () => meta.length
                };

                compileCallback();
            });
        });
    }
}

module.exports = ChunkBundlerPlugin;