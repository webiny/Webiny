import Webiny from 'Webiny';
import Container from './Components/Container';
import Table from './Components/Table/Table';
import Row from './Components/Table/Row';
import Field from './Components/Table/Field';
import FieldInfo from './Components/Table/FieldInfo';
import Header from './Components/Table/Header';
import Footer from './Components/Table/Footer';
import Filters from './Components/Filters';
import Pagination from './Components/Pagination';
import MultiActions from './Components/MultiActions';
import DateTimeField from './Components/Table/Fields/DateTimeField';
import DateField from './Components/Table/Fields/DateField';
import TimeField from './Components/Table/Fields/TimeField';
import Actions from './Components/Table/Actions';
import Action from './Components/Table/Action';
import Empty from './Components/Table/Empty';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.List = {
            Container,
            Table: {
                Table,
                Header,
                Row,
                Field,
                FieldInfo,
                Footer,
                DateTimeField,
                DateField,
                TimeField,
                Actions,
                Action,
                Empty
            },
            Filters,
            MultiActions,
            Pagination
        };
    }
}

export default Module;
