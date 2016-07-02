import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Action extends Webiny.Ui.Component {

}

Action.defaultProps = {
    onClick: _.noop,
    download: null,
    renderer() {
        if (_.isFunction(this.props.children)) {
            return this.props.children.call(this, this.props.data, this);
        }

        return (
            <Ui.Link
                download={this.props.download}
                data={this.props.data}
                onClick={() => this.props.onClick.call(this, this.props.data, this)}>
                {this.props.label}
            </Ui.Link>
        );
    }
};

export default Action;