import Webiny from 'Webiny';
import styles from './styles/Loader.css';

class Loader extends Webiny.Ui.Component {

}

Loader.defaultProps = {
    className: null,
    style: null,
    renderer() {
        return (
            <div className={this.classSet(styles.overlay, this.props.className)} style={this.props.style}>
                <div className={styles.iconWrapper}>
                    <div className={styles.icon}></div>
                </div>
            </div>
        );
    }
};

export default Loader;