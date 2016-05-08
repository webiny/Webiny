import Router from './Router';

class Route {

    constructor(name, pattern, components, title = '') {
        // Normalize components
        const nComponents = {};
        if (!_.isPlainObject(components)) {
            nComponents['MasterContent'] = _.isArray(components) ? components : [components];
        } else {
            _.forIn(components, (cmp, placeholder) => {
                if (_.isArray(cmp)) {
                    nComponents[placeholder] = cmp;
                } else {
                    nComponents[placeholder] = [cmp];
                }
            });
        }

        this.name = name;
        this.module = false;
        this.pattern = pattern;
        this.components = nComponents;
        this.title = title;
        this.regex = null;
        this.paramNames = [];
        this.paramValues = {};
        this.namedParam = /:\w+/g;
        this.splatParam = /\*\w+/g;
        this.skipDefaults = false;

        // Extract params names
        const params = pattern.match(this.namedParam);
        if (params) {
            params.forEach(item => {
                this.paramNames.push(item.replace(':', ''));
            });
        }

        // Build route regex
        const regex = pattern.replace(this.namedParam, '([^\/]+)').replace(this.splatParam, '(.*?)');
        this.regex = new RegExp('^' + regex + '$');
    }

    match(url) {
        if (!this.regex.test(url)) {
            return false;
        }

        // Url params
        this.paramValues = {};
        if (this.paramNames) {
            const matchedParams = url.match(this.regex);
            if (matchedParams) {
                matchedParams.shift();
                matchedParams.forEach((value, index) => {
                    this.paramValues[this.paramNames[index]] = value;
                });
            }
        }

        // Parse query string params
        window.location.search.substring(1).split('&').forEach(el => {
            if (el !== '') {
                el = el.split('=');
                let value = decodeURIComponent(el[1]);
                if (/^\d+$/.test(value)) {
                    value = parseInt(value);
                }

                if (value === 'true') {
                    value = true;
                }

                if (value === 'false') {
                    value = false;
                }

                this.paramValues[decodeURIComponent(el[0])] = value;
            }
        });

        return true;
    }

    getName() {
        return this.name;
    }

    /**
     *
     * @param params
     * @param merge True = Merge existing params with new ones. False = use only given params
     * @returns {*}
     */
    getHref(params = null, pattern = null, merge = true) {
        let url = pattern || this.pattern;

        let newParams = params;
        if (merge) {
            newParams = _.merge({}, this.paramValues, params);
        }

        _.forEach(newParams, (value, key) => {
            if (value === null) {
                delete newParams[key];
            }
        });

        // Build main URL
        this.paramNames.forEach(param => {
            url = url.replace(':' + param, newParams[param]);
            delete newParams[param];
        });

        // Build query string from the remaining params
        if (Object.keys(newParams).length > 0) {
            url += '?' + $.param(newParams);
        }

        return Router.getBaseUrl() + url;
    }

    getPattern() {
        return this.pattern;
    }

    getTitle() {
        return this.title;
    }

    getParams(name = null) {
        if (name) {
            if (_.isUndefined(this.paramValues[name])) {
                return null;
            }
            return this.paramValues[name];
        }
        return this.paramValues;
    }

    getQueryParams(name = null) {
        const queryParams = _.omit(this.getParams(), this.paramNames);
        if (name) {
            if (_.isUndefined(queryParams[name])) {
                return null;
            }
            return queryParams[name];
        }
        return queryParams;
    }

    setParams(params = false) {
        params = params === false ? this.getParams() : params;
        Router.goToRoute(this.getName(), params);
        return this;
    }

    getComponents(placeholder) {
        return this.components[placeholder] || [];
    }

    skipDefaultComponents(flag = null) {
        if (flag === null) {
            return this.skipDefaults;
        }

        this.skipDefaults = flag;
        return this;
    }

    setModule(module) {
        this.module = module;
        return this;
    }

    getModule() {
        return this.module;
    }

}

export default Route;
