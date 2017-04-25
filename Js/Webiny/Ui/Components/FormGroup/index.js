import Webiny from 'Webiny';
import styles from './styles.css';
import Required from './Components/Required';
import Label from './Components/Label';
import InfoMessage from './Components/InfoMessage';
import ValidationIcon from './Components/ValidationIcon';
import ValidationMessage from './Components/ValidationMessage';
import DescriptionMessage from './Components/DescriptionMessage';

class FormGroup extends Webiny.Ui.Component {

}

FormGroup.defaultProps = {
    renderer() {
        return <div className="form-group">{this.props.children}</div>;
    }
};

_.assign(FormGroup, {
    Label,
    Required,
    InfoMessage,
    ValidationIcon,
    ValidationMessage,
    DescriptionMessage
});

export default FormGroup;