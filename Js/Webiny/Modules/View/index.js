import Webiny from 'Webiny';
import View from './View';
import FormView from './FormView';
import ListView from './ListView';
import DashboardView from './DashboardView';
import ChartBlock from './ChartBlock';
import InfoBlock from './InfoBlock';
import Body from './Body';
import Header from './Header';
import Footer from './Footer';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.View = View;
        View.Form = FormView;
        View.List = ListView;
        View.Dashboard = DashboardView;
        View.Header = Header;
        View.Body = Body;
        View.Footer = Footer;

        View.ChartBlock = ChartBlock;
        View.InfoBlock = InfoBlock;

        // Add FormView into list of components that will receive a `form` prop when used inside of Form
        const injectInto = Webiny.Ui.Components.Form.defaultProps.injectInto;
        Webiny.Ui.Components.Form.defaultProps.injectInto = () => {
            const injects = injectInto();
            injects.push(FormView);
            return injects;
        };
    }
}

export default Module;
