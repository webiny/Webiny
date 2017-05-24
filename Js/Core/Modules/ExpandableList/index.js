import Webiny from 'Webiny';
import ExpandableList from './Components/ExpandableList';
import Row from './Components/Row';
import Field from './Components/Field';
import Action from './Components/Action';
import ActionSet from './Components/ActionSet';
import RowDetailsList from './Components/RowDetailsList';
import RowDetailsContent from './Components/RowDetailsContent';

ExpandableList.Row = Row;
ExpandableList.Field = Field;
ExpandableList.Action = Action;
ExpandableList.ActionSet = ActionSet;
ExpandableList.RowDetailsContent = RowDetailsContent;
ExpandableList.RowDetailsList = RowDetailsList;

class Module extends Webiny.Module {

    init() {
        this.name = 'ExpandableList';
        Webiny.Ui.Components.ExpandableList = ExpandableList;
    }
}

export default Module;
