import Router from './Router';

class Route {

    constructor(name, pattern, components, title = '') {
        // Normalize components
        const nComponents = {};
        if (!_.isPlainObject(components) || React.isValidElement(components)) {
            nComponents['Content'] = components;
        } else {
            _.forIn(components, (cmp, placeholder) => {
                nComponents[placeholder] = cmp;
            });
        }

        this.name = name;
        this.layout = 'default';
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

        const splatParams = pattern.match(this.splatParam);
        if (splatParams) {
            splatParams.forEach(item => {
                this.paramNames.push(item.replace('*', ''));
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
        _.merge(this.paramValues, $.deparam(window.location.search.substring(1)));

        return true;
    }

    getName() {
        return this.name;
    }

    /**
     *
     * @param params
     * @param pattern
     * @returns {*}
     */
    getHref(params = null, pattern = null) {
        let url = pattern || this.pattern;

        const newParams = params || {};

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

        return _.trimEnd(Router.getBaseUrl(), '/') + url;
    }

    getPattern() {
        return this.pattern;
    }

    getTitle() {
        return this.title;
    }

    setTitle(title) {
        this.title = title;
        return this;
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

    getComponents() {
        return this.components;
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

    setRole(role) {
        if (_.isString(role)) {
            role = role.split(',');
        }
        this.role = role;
        return this;
    }

    setLayout(name) {
        this.layout = name;
        return this;
    }
}

export default Route;
