import Webiny from 'Webiny';

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
    label: 'More',
    renderer() {
        return (
            <div className="dropdown balloon">
                <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">
                    {this.props.label}
                    <span className="caret"></span>
                </button>
                <ul className="dropdown-menu">
                    {React.Children.map(this.props.children, child => {
                        if (this.shouldHideItem(child)) {
                            return null;
                        }

                        return (
                            <li>
                                {React.cloneElement(child, {
                                    data: this.props.data,
                                    actions: this.props.actions
                                })}
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
};

export default Actions;