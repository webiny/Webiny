import Webiny from 'Webiny';
import styles from './../styles.css';

class ValidationMessage extends Webiny.Ui.Component {

}

ValidationMessage.defaultProps = {
    success: true,
    hideValidationAnimation: {translateY: 0, opacity: 0, duration: 225},
    showValidationAnimation: {translateY: 50, opacity: 1, duration: 225},
    renderer() {
        let css = null;
        if (this.props.success === false) {
            css = styles.validationMessageError;
        }

        const {Animate, children} = this.props;

        return (
            <Animate
                trigger={!this.props.success}
                hide={this.props.hideValidationAnimation}
                show={this.props.showValidationAnimation}
                className={styles.validationMessageHolder}>
                <span className={this.classSet(styles.validationMessage, css)}>{children}</span>
            </Animate>
        );
    }
};

export default Webiny.createComponent(ValidationMessage, {modules: ['Animate'], styles});