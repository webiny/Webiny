import Webiny from 'Webiny';
import 'bootstrap-daterangepicker';
import 'eonasdan-bootstrap-datetimepicker';

import Date from './Date';
import DateTime from './DateTime';
import Time from './Time';
import DateRange from './DateRange';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Date = Date;
        Webiny.Ui.Components.DateTime = DateTime;
        Webiny.Ui.Components.Time = Time;
        Webiny.Ui.Components.DateRange = DateRange;
    }
}

export default Module;
