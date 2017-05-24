import Webiny from 'Webiny';

class MultiActions extends Webiny.Ui.Component {

}

MultiActions.defaultProps = {
    label: 'With selected...',
    renderer() {
        const {Dropdown} = this.props;
        return (
            <Dropdown title={this.props.label}>
                <Dropdown.Header title="Actions"/>
                {React.Children.map(this.props.children, child => {
                    if (Webiny.isElementOfType(child, Dropdown.Divider) || Webiny.isElementOfType(child, Dropdown.Header)) {
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
            </Dropdown>
        );
    }
};

export default Webiny.createComponent(MultiActions, {modules: ['Dropdown']});