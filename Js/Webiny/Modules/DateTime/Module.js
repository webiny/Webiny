import Webiny from 'Webiny';
import Date from './Date';
import DateTime from './DateTime';
import Time from './Time';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Date = Date;
        Webiny.Ui.Components.DateTime = DateTime;
        Webiny.Ui.Components.Time = Time;
    }
}

export default Module;
