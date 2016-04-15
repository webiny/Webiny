import Webiny from 'Webiny';

class Actions extends Webiny.Ui.Component {

}

Actions.defaultProps = {
    label: 'More',
    renderer: function renderer() {
        return (
            <div className="dropdown balloon">
                <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">
                    {this.props.label}
                    <span className="caret"></span>
                </button>
                <ul className="dropdown-menu">
                    {React.Children.map(this.props.children, child => {
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