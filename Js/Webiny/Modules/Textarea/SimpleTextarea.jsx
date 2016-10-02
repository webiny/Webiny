import Webiny from 'Webiny';

const validProps = ['value', 'onChange', 'className', 'style', 'placeholder', 'disabled', 'readonly'];

class SimpleTextarea extends Webiny.Ui.Component {

}

SimpleTextarea.defaultProps = {
    renderer() {
        return <textarea {..._.pick(this.props, validProps)}/>;
    }
};

export default SimpleTextarea;