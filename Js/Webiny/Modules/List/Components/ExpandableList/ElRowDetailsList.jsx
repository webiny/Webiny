import Webiny from 'Webiny';

class ElRowDetailsList extends Webiny.Ui.Component {

}

ElRowDetailsList.defaultProps = {
    renderer() {
        let content = this.props.children;
        if (_.isFunction(this.props.children)) {
            content = this.props.children.call(this, this.props.data, this);
        }

        return <div>{content}</div>;
    }
};

export default ElRowDetailsList;