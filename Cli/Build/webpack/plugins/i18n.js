const _ = require('lodash');

class i18nPlugin {
    constructor() {
        this.i18n = {};
    }

    apply(compiler) {
        const outputName = 'i18n.json';

        compiler.plugin('emit', (compilation, compileCallback) => {
            const content = {
                app: compiler.options.name,
                lang: "en-GB",
                files: Object.values(this.i18n)
            };

            const json = JSON.stringify(content, null, 4);

            compilation.assets[outputName] = {
                source: () => json,
                size: () => json.length
            };

            compileCallback();
        });
    }

    getTarget() {
        return this.i18n;
    }

    getLoader() {
        return {
            loader: 'i18n-loader',
            options: {
                addString: (file, key, value) => {
                    file = file.split('/Apps/').pop();
                    const obj = this.i18n[file] || {file, key, strings: []};
                    if (!_.find(obj.strings, {'default': value})) {
                        obj.strings.push({'default': value, translation: ''});
                    }
                    obj.strings = _.sortBy(obj.strings, ['default']);
                    this.i18n[file] = obj;
                }
            }
        };
    }
}

module.exports = i18nPlugin;