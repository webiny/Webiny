import Webiny from 'Webiny';

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
            return <Button type="primary" className="public">P</Button>;
        }

        return (
            <wrapper ref={ref => this.ref = ref}>
                <Button
                    type="primary"
                    onClick={() => {
                        this.ref.querySelector('button').blur();
                        onClick();
                    }}
                    className={this.classSet({exposed: value})}>
                    {this.renderLabel()}
                </Button>
            </wrapper>
        );
    }
};

export default Webiny.createComponent(ToggleAccessButton, {
    modules: ['Button']
});
