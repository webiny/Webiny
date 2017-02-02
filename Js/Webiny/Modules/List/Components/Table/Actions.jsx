import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Actions extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.bindMethods('shouldHideItem');
    }

    shouldHideItem(item) {
        let hide = item.props.hide || false;
        if (hide) {
            hide = _.isFunction(hide) ? hide(this.props.data) : hide;
        }

        let show = item.props.show || true;
        if (show) {
            show = _.isFunction(show) ? show(this.props.data) : show;
        }

        return hide || !show;
    }
}

Actions.defaultProps = {
    label: 'Actions',
    hide: false,
    renderer() {
        if (this.props.hide) {
            return null;
        }
        return (
            <Ui.Dropdown title={this.props.label} className="balloon">
                <Ui.Dropdown.Header title="Actions"/>
                {React.Children.map(this.props.children, child => {
                    if (this.shouldHideItem(child)) {
                        return null;
                    }

                    if (Webiny.isElementOfType(child, Ui.Dropdown.Divider) || Webiny.isElementOfType(child, Ui.Dropdown.Header)) {
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

export default Actions;