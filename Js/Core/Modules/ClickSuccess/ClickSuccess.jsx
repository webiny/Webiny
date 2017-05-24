import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class ClickSuccess extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.state = {data: {}};
        this.bindMethods('getContent,onClick,hide');
    }

    hide() {
        return this.refs.dialog.hide();
    }

    onClick() {
        return Promise.resolve(this.realOnClick(this)).then(() => {
            return this.refs.dialog.show();
        });
    }

    getContent() {
        const show = (data) => {
            this.setState({data});
            this.refs.dialog.show();
        };

        const content = this.props.children;
        if (_.isFunction(content)) {
            return content(show);
        }

        const input = React.Children.toArray(content)[0];
        this.realOnClick = input.props.onClick;
        const props = _.omit(input.props, ['onClick']);
        props.onClick = this.onClick;
        return React.cloneElement(input, props);
    }
}

ClickSuccess.defaultProps = {
    onClose: _.noop,
    message: null,
    renderDialog: null,
    renderer() {
        const dialogProps = {
            ref: 'dialog',
            message: () => _.isFunction(this.props.message) ? this.props.message(this.state.data) : this.props.message,
            onClose: () => {
                this.hide().then(this.props.onClose);
            }
        };

        if (_.isFunction(this.props.renderDialog)) {
            dialogProps['renderDialog'] = this.props.renderDialog.bind(this, this.state.data, dialogProps.onClose);
        }


        return (
            <webiny-click-success>
                {this.getContent()}
                <Ui.Modal.Success {...dialogProps}/>
            </webiny-click-success>
        );
    }
};

export default ClickSuccess;
