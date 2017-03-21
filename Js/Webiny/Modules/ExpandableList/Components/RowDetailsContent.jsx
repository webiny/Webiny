import Webiny from 'Webiny';

class RowDetailsContent extends Webiny.Ui.Component {

}

RowDetailsContent.defaultProps = {
    renderer() {
        let content = this.props.children;
        if (_.isFunction(this.props.children)) {
            content = this.props.children.call(this, this.props.data, this);
        }

        return <div>{content}</div>;
    }
};

export default RowDetailsContent;