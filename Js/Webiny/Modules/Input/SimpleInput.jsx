import Webiny from 'Webiny';

const validProps = ['value', 'onChange', 'className', 'style', 'placeholder', 'disabled', 'readonly'];

class SimpleInput extends Webiny.Ui.Component {

}

SimpleInput.defaultProps = {
    renderer() {
        return <input {..._.pick(this.props, validProps)}/>;
    }
};

export default SimpleInput;