function getConfig(param) {
    return localStorage.getItem('Webiny.Ui.Components.Console.' + param);
}

function setConfig(param, value) {
    return localStorage.setItem('Webiny.Ui.Components.Console.' + param, value);
}

function execute(method, params) {
    if (getConfig('enabled') === 'false') {
        return;
    }

    if (console[method]) {
        console[method](...params);
    } else if (this[method]) {
        this[method](...params);
    }

    if (getConfig('trace') === 'true' && _.isFunction(console.trace)) {
        console.trace();
    }
}


class Console {

    init() {
		this.devDomains = [];

        History.Adapter.bind(window, 'statechange', () => {
            if (getConfig('enabled') === 'false') {
                return;
            }

            if (getConfig('clearOnStateChange') === 'true') {
                console.clear();
            }
        });

        if (getConfig('enabled') === null) {
            setConfig('enabled', this.isDevDomain());
        }

        ['log', 'info', 'error', 'warn', 'groupCollapsed', 'groupEnd'].forEach(method => {
            this[method] = function () {
                execute(method, arguments)
            }
        });
        return this;
    }

    setEnabled(flag = true) {
        setConfig('enabled', flag);
    }

    showTrace(flag = true) {
        setConfig('trace', flag);
    }

    setClearOnStateChange(flag = true) {
        setConfig('clearOnStateChange', flag)
    }

    setDevelopmentDomains(domains) {
        this.devDomains = domains;
        return this;
    }

    isDevDomain() {
        return this.devDomains.indexOf(location.hostname) > -1;
    }

    html(data) {
        var self = this;
        for (var i = 0; i < arguments.length; i++) {
            var wrapper = document.createElement('wrapper');
            wrapper.innerHTML = arguments[i];
            self.log(wrapper);
        }
    }
}

export default new Console;