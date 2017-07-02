import Webiny from 'Webiny';
import styles from './styles.css';

const crudLabels = {
    '/.post': 'C',
    '{id}.get': 'R',
    '/.get': 'R',
    '{id}.patch': 'U',
    '{id}.delete': 'D'
};

class ToggleAccessButton extends Webiny.Ui.Component {
    renderLabel() {
        const key = this.props.method.key;
        return crudLabels[key] || 'E';
    }
}

ToggleAccessButton.defaultProps = {
    method: null,
    value: false,
    onClick: _.noop,
    renderer() {
        const {Button, method, onClick, value} = this.props;
        if (method.public) {
            return <Button type="primary" className={this.classSet(styles.toggleAccessButton, styles.toggleAccessButtonPublic)}>P</Button>;
        }

        return (
            <div className={styles.toggleAccessButtonWrapper} ref={ref => this.ref = ref}>
                <Button
                    type="primary"
                    onClick={() => {
                        this.ref.querySelector('button').blur();
                        onClick();
                    }}
                    className={this.classSet(styles.toggleAccessButton, {[styles.toggleAccessButtonExposed]: value})}>
                    {this.renderLabel()}
                </Button>
            </div>
        );
    }
};

export default Webiny.createComponent(ToggleAccessButton, {
    modules: ['Button']
});
