import Webiny from 'Webiny';
import Views from './Views/Views';
import Components from './Components/Components';

export default {
    routes: [
        new Webiny.Route('Dashboard', '/', {
            MasterContent: Views.Example,
            Header: Components.Navigation
        })
    ],

    defaultComponents: {
        MasterLayout: Views.Main
    }
};