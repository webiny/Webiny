import Webiny from 'Webiny';
/**
 * Main is the main container that will hold all other components.
 * This component is the first one to render in the <body> element.
 */
class Main extends Webiny.Ui.View {

    render() {
        return (
            <div id="main">
                <section id="content_wrapper">
                    <section id="content" className="animated fadeIn">
                        <div className="panel">
                            <div className="panel-header">
                                <Webiny.Ui.Placeholder name="Header"/>
                            </div>
                            <div className="panel-body">
                                <Webiny.Ui.Placeholder name="MasterContent"/>
                            </div>
                        </div>
                    </section>
                </section>
            </div>
        );
    }
}

export default Main;
