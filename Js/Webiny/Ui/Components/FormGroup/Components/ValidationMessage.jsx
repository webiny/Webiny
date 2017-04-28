import Webiny from 'Webiny';
import styles from './../styles.css';

class ValidationMessage extends Webiny.Ui.Component {

}

ValidationMessage.defaultProps = {
    success: true,
    renderer() {
        let css = null;
        if (this.props.success === false) {
            css = styles.validationMessageError;
        }

        const {Animate, children} = this.props;

        //return <span className={this.classSet(styles.validationMessage, css)}>{this.props.children}</span>;

        return (
            <Animate
                trigger={true}
                hide={{translateY: 0, opacity: 0, duration: 225}}
                show={{translateY: 50, opacity: 1, duration: 225}}>
                <span className={this.classSet(styles.validationMessage, css)}>{children}</span>
            </Animate>
        );
    }
};

export default Webiny.createComponent(ValidationMessage, {modules: ['Animate'], styles});