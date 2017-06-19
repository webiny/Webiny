const crypto = require('crypto');

class ChunkIds {
    apply(compiler) {
        compiler.plugin("compilation", (compilation) => {
            // Generate chunk IDs
            compilation.plugin("before-chunk-ids", (chunks) => {
                chunks.forEach((chunk, index) => {
                    if (!chunk.hasEntryModule() && chunk.id === null) {
                        let id = index;
                        if (process.env.NODE_ENV === 'production') {
                            chunk.id = compiler.options.name + '-' + this.createChunkIdHash(chunk);
                        } else {
                            const context = chunk.modules[0].context;
                            if (context.includes('/node_modules/')) {
                                id = context.split('/node_modules/')[1].split('/')[0];
                            } else if (context.includes('/Ui/Components/')) {
                                id = context.split('/Ui/Components/')[1].split('/')[0];
                            } else if (context.includes('/Vendors/')) {
                                id = 'Vendors-' + context.split('/Vendors/')[1].split('/')[0];
                            } else {
                                id = context.split('/').pop();
                            }
                            // ID must contain the name of the app to avoid ID clashes between multiple apps
                            chunk.id = compiler.options.name + '-' + index;
                            // Name is only used in development for easier debugging
                            chunk.name = id + '-' + index;
                        }
                    }
                });
            });

            // In production we parse [webinyhash] filename placeholder to populate it with chunkIds combined hash
            // This is required due to the fact that chunk ids may change, but entry point [chunkhash] will not change.
            // This will create an up-to-date hash and your CDN will not server wrong files :)
            if (process.env.NODE_ENV === 'production') {
                const mainTemplate = compilation.mainTemplate;
                mainTemplate.plugin("asset-path", (path, data) => {
                    if (path.includes('[webinyhash]')) {
                        const chunkIds = data.chunk.chunks.map(chunk => chunk.renderedHash);
                        const chunkIdsHash = crypto.createHash('md5').update(chunkIds.join(':')).digest('hex');

                        return path.replace(/\[webinyhash\]/gi, chunkIdsHash.substring(0, 10));
                    }

                    return path;
                });
            }
        });
    }

    createChunkIdHash(chunk) {
        // We are generating chunk id based on containing modules (their `resource` path relative to `Apps` folder).
        // That way chunk id does not change as long as it contains the same modules (no matter the content).
        const paths = chunk.modules.map(this.getRelativeModulePath).sort().join('\n');
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
