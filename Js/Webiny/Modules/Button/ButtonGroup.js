import Webiny from 'Webiny';
import styles from './styles/Button.css';

class ButtonGroup extends Webiny.Ui.Component {

}

ButtonGroup.defaultProps = {
    renderer() {
        return (
          <div className={styles.btnGroup}>
              {this.props.children}
          </div>
        );
    }
};

export default Webiny.createComponent(ButtonGroup, {styles});
