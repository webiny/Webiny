import Webiny from 'Webiny';
import styles from './styles/Fieldset.css';

class Fieldset extends Webiny.Ui.Component {

}

Fieldset.defaultProps = {
    title: null,
    className: null,
    style: null,
    renderer() {
        return (
            <fieldset className={this.classSet(styles.fieldset, this.props.className)}>
                {this.props.title && (
                    <legend className={styles.legend}>{this.props.title}</legend>
                )}
                {this.props.children}
            </fieldset>
        );
    }
};

export default Fieldset;