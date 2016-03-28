import Webiny from 'Webiny';
import Container from './Components/Container';
import Table from './Components/Table/Table';
import Row from './Components/Table/Row';
import Field from './Components/Table/Field';
import Header from './Components/Table/Header';
import Footer from './Components/Table/Footer';
import Action from './Components/Table/Action';
import Filters from './Components/Filters';
import Pagination from './Components/Pagination';
import MultiActions from './Components/MultiActions';

class Module extends Webiny.Module {

    constructor(app) {
        super(app);
        Webiny.Ui.Components.List = {
            Container,
            Table: {
                Table,
                Header,
                Row,
                Field,
                Action,
                Footer
            },
            Filters,
            MultiActions,
            Pagination
        };
    }
}

export default Module;
