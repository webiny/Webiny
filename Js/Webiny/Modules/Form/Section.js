import Webiny from 'Webiny';
import styles from './styles/Section.css';

class Section extends Webiny.Ui.Component {

}

Section.defaultProps = {
    title: null,
    icon: null,
    renderer() {
        let icon = null;
        if (this.props.icon) {
            icon = <Webiny.Ui.Components.Icon icon={this.props.icon}/>;
        }

        return (
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    <h5 className={styles.title}>{icon} {this.props.title}</h5>

                    <div className={styles.container}>{this.props.children}</div>
                </div>
            </div>
        );
    }
};

export default Section;
