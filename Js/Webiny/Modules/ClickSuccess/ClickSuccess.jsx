import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class ClickSuccess extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.bindMethods('getContent,onClick,hide');
    }

    hide() {
        return this.refs.dialog.hide();
    }

    onClick() {
        return Q(this.realOnClick(this)).then(() => {
            return this.refs.dialog.show();
        });
    }

    getContent() {
        const show = () => {
            this.refs.dialog.show();
        };

        let content = this.props.children;
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
    renderer() {
        return (
            <webiny-click-success>
                {this.getContent()}
                <Ui.Modal.Success
                    ref="dialog"
                    message={() => this.props.message}
                    onClose={() => {
                        this.hide().then(this.props.onClose);
                    }}/>
            </webiny-click-success>
        );
    }
};

export default ClickSuccess;
