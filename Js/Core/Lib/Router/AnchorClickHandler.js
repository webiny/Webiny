import Webiny from 'webiny';
import _ from 'lodash';

export default (router, a, e) => {
    let url = a.href;

    // _blank links should not be intercepted
    if (a.target === '_blank') {
        return;
    }

    // Prevent scrolling to top when clicking on '#' link
    if (_.endsWith(url, '#')) {
        e.preventDefault();
        return;
    }

    // Check if it's an anchor link
    if (url.indexOf('#') > -1) {
        return;
    }

    // Push state and let the Router process the rest
    if (url.startsWith(Webiny.Config.WebPath) || url.startsWith('file://')) {
        e.preventDefault();
        url = url.replace(Webiny.Config.WebPath, '').replace('file://', '');
        router.history.push(url, {
            title: a.getAttribute('data-document-title') || null,
            prevTitle: window.document.title,
            scrollY: a.getAttribute('data-prevent-scroll') === 'true' ? window.scrollY : false
        });
    }
};