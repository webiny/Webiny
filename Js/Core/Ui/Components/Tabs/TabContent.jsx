import Webiny from 'Webiny';
import styles from './styles.css';

class TabContent extends Webiny.Ui.Component {

}

TabContent.defaultProps = {
    alwaysRender: true,
    active: false,
    disabled: false,
    renderer() {
        if (!this.props.disabled && (this.props.active || this.props.alwaysRender)) {
            const tabClass = this.classSet(
                styles.pane,
                {
                    [styles.paneActive]: this.props.active
                }
            );
            return (
                <div className={tabClass}>
                    {this.props.children}
                    <div className={this.props.styles.clearfix}/>
                </div>
            );
        }

        return null;
    }
};

export default Webiny.createComponent(TabContent, {styles});