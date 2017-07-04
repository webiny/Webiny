const _ = require('lodash');
const crypto = require('crypto');
const chalk = require('chalk');
const Webiny = require('webiny/lib/webiny');

function sortByIndex(a, b) {
    return a.index - b.index;
}

class Bundler {
    constructor(stats, options) {
        this.compilers = {};
        this.chunkManifest = {};
        this.bundleDefinitions = {};
        this.stats = stats;
        this.options = options;
    }

    bundle() {
        return new Promise(finishBundling => {
            // Generate bundles
            Webiny.info('Preparing bundles...');
            this.stats.stats.map(s => {
                const compiler = s.compilation.compiler;
                this.compilers[compiler.name] = {
                    resolver: compiler.resolvers.normal,
                    context: compiler.options.context,
                    outputPath: compiler.options.output.path,
                    publicPath: '/build/production/' + compiler.name.replace('.', '_')
                };
            });

            const stats = this.stats.toJson();
            // Build chunk manifest for all apps
            stats.children.map(app => {
                app.chunks.map(chunk => {
                    if (chunk.entry || !chunk.files) {
                        return;
                    }

                    const filteredModules = chunk.modules.filter(m => !m.name.includes('/node_modules/')).sort(sortByIndex);
                    if (filteredModules.length > 0) {
                        const resolvedPath = Webiny.projectRoot() + _.trimStart(filteredModules[0].name, '.');
                        this.chunkManifest[resolvedPath] = this.compilers[app.name].outputPath + '/' + chunk.files[0];
                    }
                });
            });

            // Build bundles for each app
            const bundleModuleResolves = [];
            stats.children.map(app => {
                const compiler = this.compilers[app.name];
                this.bundleDefinitions[app.name] = {};
                const bundlesManifest = compiler.context + '/bundles.json';
                if (!Webiny.fileExists(bundlesManifest)) {
                    return;
                }

                const metaJson = compiler.outputPath + '/meta.json';
                let meta = JSON.parse(Webiny.readFile(metaJson));
                const bundles = JSON.parse(Webiny.readFile(bundlesManifest));
                _.each(bundles, (modules, url) => {
                    _.set(this.bundleDefinitions[app.name], url, []);
                    modules.map(m => {
                        bundleModuleResolves.push(
                            new Promise(r => {
                                compiler.resolver.resolve(compiler.context, '', m, (err, res) => {
                                    if (err) {
                                        Webiny.failure(chalk.red(m));
                                        return r();
                                    }

                                    Webiny.success(m + chalk.magenta(' => ') + chalk.green(res));
                                    if (!this.chunkManifest[res]) {
                                        Webiny.failure(chalk.red('Chunk not found: ') + chalk.magenta(res));
                                        return r();
                                    }
                                    this.bundleDefinitions[app.name][url].push(this.chunkManifest[res]);
                                    r();
                                });
                            })
                        );
                    });
                });
            });

            // Resolve module paths
            Promise.all(bundleModuleResolves).then(() => this.writeBundles()).then(() => {
                finishBundling();
            });
        });
    }

    writeBundles() {
        const md5 = crypto.createHash('md5');
        _.each(this.bundleDefinitions, (bundles, appName) => {
            const compiler = this.compilers[appName];
            const metaJson = compiler.outputPath + '/meta.json';
            const appMeta = JSON.parse(Webiny.readFile(metaJson));
            _.each(bundles, (chunks, url) => {
                const bundleContent = chunks.filter(c => !!c).map(chunk => Webiny.readFile(chunk)).join("\n");
                const bundleHash = md5.update(bundleContent).digest('hex').substr(0, 10);
                _.set(appMeta, 'bundles.' + url, this.generateUrl(compiler.publicPath + '/bundles/' + bundleHash + '.js'));
                Webiny.writeFile(compiler.outputPath + '/bundles/' + bundleHash + '.js', bundleContent);
            });
            Webiny.writeFile(metaJson, JSON.stringify(appMeta, null, 4));
        });
    }

    generateUrl(file) {
        let prefix = '';

        _.each(this.options.assetRules, rule => {
            const regex = new RegExp(rule.test);
            if (regex.test(file)) {
                prefix = rule.domain + prefix;
                return false;
            }
        });

        return prefix + file;
    }
}

module.exports = Bundler;