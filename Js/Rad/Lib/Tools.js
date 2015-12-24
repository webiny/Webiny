class Tools {

    createUID() {
        var delim = '-';

        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }

        return S4() + S4() + delim + S4() + delim + S4() + delim + S4() + delim + S4() + S4() + S4();
    }

    keys(obj) {
        if (obj instanceof Array) {
            return [...obj.keys()];
        }
        return Object.keys(obj);
    }

    toSlug(str) {
        var trimmed = _.trim(str);
        var url = trimmed.replace(/[^a-z0-9-\/]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase();
        if (url.length) {
            return ('/' + url).replace(/\/{2,}/g, '/');
        }

        return null;
    }
}

export default new Tools;