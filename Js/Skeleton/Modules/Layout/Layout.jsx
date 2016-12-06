import Webiny from 'Webiny';
import Components from './Components/Components';
/**
 * Layout is the main container that will hold all other components.
 * This component is the first one to render in the <body> element.
 */
class Layout extends Webiny.Ui.View {

}

Layout.defaultProps = {
    renderer() {
        return (
            <div className="master minimized">
                <Webiny.Ui.Components.Growl.Container ui="GrowlContainer"/>
                <Components.Navigation/>

                <div className="master-content">
                    <div className="container-fluid">
                        <Webiny.Ui.Placeholder name="Content"/>
                    </div>
                </div>
                <Webiny.Ui.Placeholder name="Footer"/>
            </div>
        );
    }
};

export default Layout;
