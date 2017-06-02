class DllBootstrapPlugin {
    constructor(options) {
        this.options = options || {}
    }

    apply(compiler) {
        compiler.plugin('compilation', (compilation) => {
            compilation.mainTemplate.plugin('startup', (source, chunk) => {
                const bootstrapEntry = this.options.module;
                const module = chunk.modules.find(m => m.rawRequest === bootstrapEntry);
                if (module) {
                    source = `__webpack_require__(${module.id});\n${source}`;
                }

                return source;
            })
        })
    }
}

module.exports = DllBootstrapPlugin;