import Webiny from 'Webiny';

class EmptyLayout extends Webiny.Ui.View {

}

EmptyLayout.defaultProps = {
    renderer() {
        return (
            <div className="master minimized">
                <Webiny.Ui.Components.Growl.Container ui="GrowlContainer"/>

                <div className="master-content">
                    <div className="container-fluid">
                        <Webiny.Ui.Placeholder name="Content"/>
                    </div>
                </div>
            </div>
        );
    }
};

export default EmptyLayout;
