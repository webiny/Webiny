import Webiny from 'Webiny';
import styles from './styles.css';

class ServicePermissions extends Webiny.Ui.Component {
}

ServicePermissions.defaultProps = {
    data: {},
    renderer() {
        const {Button, data} = this.props;

        return null;
    }
};

export default Webiny.createComponent(ServicePermissions, {
    modules: [
        'Input', 'Button'
    ]
});
