import Webiny from 'Webiny';

class Logger {
    constructor() {
        // config
        this.postInterval = 1000; // milliseconds

        // internals
        this.errors = [];
        this.errorHashMap = [];
        this.clientInfo = this.getClientInfo();
        this.interval = null;

        // assign error handlers
        this.errorHandler();

        // start the interval
        this.startInterval();
    }

    errorHandler() {
        // javascript system errors
        window.onerror = (msg, url, line, columnNo, error) => {
            this.reportError('js', msg, error.stack);
        };

        // API response errors
        Webiny.Http.addResponseInterceptor(response => {
            if (response.status !== 200) {
                // we want to log only responses that are not valid JSON objects
                // 5xx response with a valid JSON object is probably an expected exception
                try {
                    JSON.parse(response.data);
                } catch (e) {
                    this.reportError('api', response.data, response.request.body, response.request.method + ' ' + response.request.url);
                }
            }

            return response;
        });
    }

    reportError(type, msg, stack, url = null) {
        const date = new Date();
        const errorHash = this.hashString(msg + url);
        url = (_.isNull(url) ? location.href : url);

        console.log('reporting error: ' + msg);

        if (this.errorHashMap.indexOf(errorHash) < 0) {
            this.errors.push({
                type,
                msg,
                url,
                stack,
                date
            });
            this.errorHashMap.push(errorHash);
        }
    }

    getClientInfo() {
        return {
            date: new Date(),
            browserName: platform.name,
            osName: platform.os.name,
            screenWidth: window.screen.availWidth,
            screenHeight: window.screen.availHeight
        };
    }

    startInterval() {
        this.interval = setInterval(() => {
            this.pushErrors();
        }, this.postInterval);
    }

    stopInterval() {
        clearInterval(this.interval);
    }

    pushErrors() {
        if (this.errors.length > 0) {
            this.stopInterval();
            console.log('sending errors:' + this.errors.length);
            $.ajax({
                method: 'POST',
                url: webinyApiPath + '/entities/core/logger-error-group/save-report',
                data: {errors: this.errors, client: this.clientInfo}
            }).done(() => {
                this.errors = [];
                this.errorHashMap = [];
                this.startInterval();
            });
        }
    }

    hashString(str) {
        let hash = 0;
        if (str.length === 0) {
            return hash;
        }
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }
}

export default Logger;