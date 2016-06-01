import Webiny from 'Webiny';
/**
 * Main is the main container that will hold all other components.
 * This component is the first one to render in the <body> element.
 */
class Main extends Webiny.Ui.View {

}

Main.defaultProps = {
    renderer() {
        const Components = Webiny.Apps.Core.Backend.Layout.Components;
        return (
            <div className="master minimized">
                <Webiny.Ui.Components.Growl.Container ui="GrowlContainer"/>
                <Webiny.Ui.Placeholder name="Header"/>

                <div className="master-content master-content--no-background">
                    <div className="container-fluid">
                        <Webiny.Ui.Placeholder name="MasterContent"/>
                    </div>
                </div>
                <Components.Footer/>
            </div>
        );
    }
};

export default Main;
