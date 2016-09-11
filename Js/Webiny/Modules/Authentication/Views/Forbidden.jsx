import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Forbidden extends Webiny.Ui.View {

}

Forbidden.defaultProps = {
    renderer(){
        return (
            <Ui.View.List>
                <Ui.View.Body>
                    <h3><Ui.Icon icon="icon-cancel"/>Access Forbidden</h3>

                    <p>
                        Unfortunately, you are not allowed to see this page.<br/>
                        If you think this is a mistake, please contact your system administrator.
                    </p>
                </Ui.View.Body>
            </Ui.View.List>
        );
    }
};

export default Forbidden;