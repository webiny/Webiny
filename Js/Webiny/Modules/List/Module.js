import Webiny from 'Webiny';
import ApiContainer from './Components/ApiContainer';
import StaticContainer from './Components/StaticContainer';
import Table from './Components/Table/Table';
import Row from './Components/Table/Row';
import Field from './Components/Table/Field';
import FieldInfo from './Components/Table/FieldInfo';
import FieldRenderer from './Components/Table/FieldRenderer';
import Header from './Components/Table/Header';
import Footer from './Components/Table/Footer';
import SelectAll from './Components/Table/SelectAll';
import SelectRow from './Components/Table/SelectRow';
import Filters from './Components/Filters';
import FormFilters from './Components/FormFilters';
import Pagination from './Components/Pagination';
import MultiActions from './Components/MultiActions';
import MultiAction from './Components/MultiActions/MultiAction';
import ModalMultiAction from './Components/MultiActions/ModalMultiAction';
import DateTimeField from './Components/Table/Fields/DateTimeField';
import DateField from './Components/Table/Fields/DateField';
import TimeField from './Components/Table/Fields/TimeField';
import FileSizeField from './Components/Table/Fields/FileSizeField';
import CaseField from './Components/Table/Fields/CaseField';
import ToggleField from './Components/Table/Fields/ToggleField';
import TimeAgoField from './Components/Table/Fields/TimeAgoField';
import Actions from './Components/Table/Actions';
import Action from './Components/Table/Actions/Action';
import RouteAction from './Components/Table/Actions/RouteAction';
import EditAction from './Components/Table/Actions/EditAction';
import ModalAction from './Components/Table/Actions/ModalAction';
import DeleteAction from './Components/Table/Actions/DeleteAction';
import EditModalAction from './Components/Table/Actions/EditModalAction';
import Empty from './Components/Table/Empty';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.List = {
            ApiContainer,
            StaticContainer,
            Table: {
                Table,
                Header,
                Row,
                Field,
                FieldInfo,
                FieldRenderer,
                Footer,
                Empty,
                SelectAll,
                SelectRow,
                DateTimeField,
                DateField,
                TimeField,
                FileSizeField,
                CaseField,
                ToggleField,
                TimeAgoField,
                Actions,
                Action,
                EditAction,
                RouteAction,
                ModalAction,
                DeleteAction,
                EditModalAction
            },
            MultiActions,
            MultiAction,
            ModalMultiAction,
            Filters,
            FormFilters,
            Pagination
        };
    }
}

export default Module;
