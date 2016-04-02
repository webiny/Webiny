import Webiny from 'Webiny';
/**
 * Main is the main container that will hold all other components.
 * This component is the first one to render in the <body> element.
 */
class Main extends Webiny.Ui.View {

    render() {
        const Components = Webiny.Apps.Core.Backend.Layout.Components;
        return (
            <div className="master minimized">
                <Webiny.Ui.Components.Placeholder name="Header"/>
                <div className="master-content container-fluid master-content--no-background">
                    <Webiny.Ui.Components.Placeholder name="MasterContent"/>
                </div>
                <Webiny.Ui.Components.Modal.Container ui="ModalContainer"/>
                <Components.Footer/>
            </div>
        );
    }
}

export default Main;
