class Page {
    loadScript(url) {
        return new Promise(resolve => {
            const s = document.createElement('script');
            s.type = 'text/javascript';
            s.src = webinyJsPath + url.replace('http://localhost:3000', '');
            s.async = true;
            s.onload = () => resolve();
            document.body.appendChild(s);
        });
    }

    loadStylesheet(url) {
        return new Promise(resolve => {
            const s = document.createElement('link');
            s.rel = 'stylesheet';
            s.href = url;
            s.href = webinyCssPath + url.replace('http://localhost:3000', '');
            s.onload = resolve;
            document.head.appendChild(s);
        });
    }

    setMeta(attributes) {
        let updatedExisting = false;
        _.each(['name', 'property'], name => {
            if (_.has(attributes, name)) {
                // Fetch existing element
                const element = document.querySelector(`meta[${name}="${attributes[name]}"]`);
                if (element) {
                    // If exists, update with new attributes
                    _.each(attributes, (value, key) => element.setAttribute(key, value));
                    updatedExisting = true;
                    return false;
                }
            }
        });

        if (updatedExisting) {
            return;
        }

        // Create new element
        const element = document.createElement('meta');
        _.each(attributes, (value, key) => element.setAttribute(key, value));
        document.head.appendChild(element);
    }

    setTitle(title) {
        document.title = title;
    }
}

module.exports = Page;