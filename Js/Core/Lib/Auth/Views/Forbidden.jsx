import View from './../../Core/View';
import createComponent from './../../createComponent';

class Forbidden extends View {

}

Forbidden.defaultProps = {
    renderer() {
        const {Icon, View} = this.props;
        return (
            <View.List>
                <View.Body>
                    <h3><Icon icon="icon-cancel"/>Access Forbidden</h3>

                    <p>
                        Unfortunately, you are not allowed to see this page.<br/>
                        If you think this is a mistake, please contact your system administrator.
                    </p>
                </View.Body>
            </View.List>
        );
    }
};

export default createComponent(Forbidden, {modules: ['Icon', 'View']});