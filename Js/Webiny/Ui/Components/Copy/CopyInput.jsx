import Webiny from 'Webiny';
import styles from './CopyInput.css';

class CopyInput extends Webiny.Ui.FormComponent {
    componentDidMount() {
        super.componentDidMount();

        const button = ReactDOM.findDOMNode(this).querySelector('button');

        this.clipboard = new this.props.Clipboard(button, {
            text: () => {
                return this.props.value;
            }
        });

        this.clipboard.on('success', () => {
            const onSuccessMessage = this.props.onSuccessMessage;
            if (_.isFunction(onSuccessMessage)) {
                onSuccessMessage();
            } else if (_.isString(onSuccessMessage)) {
                Webiny.Growl.info(onSuccessMessage);
            }
        });
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.clipboard.destroy();
    }
}

CopyInput.defaultProps = _.merge({}, Webiny.Ui.FormComponent.defaultProps, {
    actionLabel: 'Copy',
    onSuccessMessage: 'Copied to clipboard!',
    onCopy: _.noop,
    renderer() {
        const props = {
            className: styles['form-control'],
            readOnly: true,
            type: 'text',
            value: this.props.value || ''
        };

        const {Button} = this.props;

        return (
            <div className={this.classSet(styles['form-group'], this.props.className)}>
                {this.renderLabel()}
                {this.renderInfo()}
                <div className={styles['input-group']}>
                    <input {...props}/>
                    <Button type="primary" className={styles.btnCopy}>
                        {this.props.actionLabel}
                    </Button>
                </div>
                {this.renderDescription()}
            </div>
        );
    }
});

export default Webiny.createComponent(CopyInput, {
    styles,
    modules: {
        Button: 'Button',
        Clipboard: () => import('clipboard')
    }
});
