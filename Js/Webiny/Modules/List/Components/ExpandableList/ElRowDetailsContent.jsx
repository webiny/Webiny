import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class ElRowDetailsContent extends Webiny.Ui.Component {

}

ElRowDetailsContent.defaultProps = {
    renderer() {
        let content = this.props.children;
        if (_.isFunction(this.props.children)) {
            content = this.props.children.call(this, this.props.data, this);
        }

        return <div>{content}</div>;
    }
};

export default ElRowDetailsContent;