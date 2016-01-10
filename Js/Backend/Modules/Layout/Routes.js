export default {
    routes: {
        Dashboard: {
            url: '/',
            views: {
                MasterContent: 'Views.Example',
                Header: 'Components.Navigation'
            }
        }
    },

    defaultComponents: {
        MasterLayout: 'Views.Main'
    }
};