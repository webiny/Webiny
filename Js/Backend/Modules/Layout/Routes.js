import Webiny from 'Webiny';
import Views from './Views/Views';
import Components from './Components/Components';

export default {
    routes: [
        new Webiny.Route('Dashboard', '/', {
            MasterContent: Views.Example
        })
    ],

    defaultComponents: {
        Header: Components.Navigation,
        MasterLayout: Views.Main
    }
};