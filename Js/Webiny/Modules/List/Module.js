import Webiny from 'Webiny';
import ApiContainer from './Components/ApiContainer';
import StaticContainer from './Components/StaticContainer';
import Table from './Components/Table/Table';
import Row from './Components/Table/Row';
import RowDetails from './Components/Table/RowDetails';
import Field from './Components/Table/Field';
import FieldInfo from './Components/Table/FieldInfo';
import Header from './Components/Table/Header';
import Footer from './Components/Table/Footer';
import SelectAll from './Components/Table/SelectAll';
import SelectRow from './Components/Table/SelectRow';
import Filters from './Components/Filters';
import FormFilters from './Components/FormFilters';
import Loader from './Components/ListContainerLoader';
import Pagination from './Components/Pagination';
import MultiActions from './Components/MultiActions';
import MultiAction from './Components/MultiActions/MultiAction';
import ModalMultiAction from './Components/MultiActions/ModalMultiAction';
import DeleteMultiAction from './Components/MultiActions/DeleteMultiAction';
import DateTimeField from './Components/Table/Fields/DateTimeField';
import DateField from './Components/Table/Fields/DateField';
import TimeField from './Components/Table/Fields/TimeField';
import PriceField from './Components/Table/Fields/PriceField';
import FileSizeField from './Components/Table/Fields/FileSizeField';
import CaseField from './Components/Table/Fields/CaseField';
import ToggleField from './Components/Table/Fields/ToggleField';
import TimeAgoField from './Components/Table/Fields/TimeAgoField';
import GravatarField from './Components/Table/Fields/GravatarField';
import RowDetailsField from './Components/Table/Fields/RowDetailsField';
import Actions from './Components/Table/Actions';
import Action from './Components/Table/Actions/Action';
import RouteAction from './Components/Table/Actions/RouteAction';
import EditAction from './Components/Table/Actions/EditAction';
import ModalAction from './Components/Table/Actions/ModalAction';
import DeleteAction from './Components/Table/Actions/DeleteAction';
import EditModalAction from './Components/Table/Actions/EditModalAction';
import Empty from './Components/Table/Empty';
import ExpandableList from './Components/ExpandableList/ExpandableList';
import ElRow from './Components/ExpandableList/ElRow';
import ElField from './Components/ExpandableList/ElField';
import ElAction from './Components/ExpandableList/ElAction';
import ElActionSet from './Components/ExpandableList/ElActionSet';
import ElRowDetailsList from './Components/ExpandableList/ElRowDetailsList';
import ElRowDetailsContent from './Components/ExpandableList/ElRowDetailsContent';

ExpandableList.Row = ElRow;
ExpandableList.Field = ElField;
ExpandableList.Action = ElAction;
ExpandableList.ActionSet = ElActionSet;
ExpandableList.RowDetailsContent = ElRowDetailsContent;
ExpandableList.RowDetailsList = ElRowDetailsList;

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.ExpandableList = ExpandableList;
        Webiny.Ui.Components.List = {
            ApiContainer,
            StaticContainer,
            Table: {
                Table,
                Header,
                Row,
                RowDetails,
                Field,
                FieldInfo,
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
                PriceField,
                GravatarField,
                RowDetailsField,
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
            DeleteMultiAction,
            Filters,
            FormFilters,
            Pagination,
            Loader
        };
    }
}

export default Module;
