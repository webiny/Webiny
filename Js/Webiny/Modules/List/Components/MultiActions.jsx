import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
class MultiActions extends Webiny.Ui.Component {

}

MultiActions.defaultProps = {
    label: 'With selected...',
    renderer() {
        return (
            <Ui.Dropdown title={this.props.label}>
                <Ui.Dropdown.Header title="Actions"/>
                {React.Children.map(this.props.children, child => {
                    if (child.type === Ui.Dropdown.Divider || child.type === Ui.Dropdown.Header) {
                        return child;
                    }

                    return (
                        <li role="presentation">
                            {React.cloneElement(child, {
                                data: this.props.data,
                                actions: this.props.actions
                            })}
                        </li>
                    );
                })}
            </Ui.Dropdown>
        );
    }
};

export default MultiActions;