import Webiny from 'Webiny';

class Dropdown extends Webiny.Ui.Component {

}

Dropdown.defaultProps = {
    renderer() {
        const props = _.clone(this.props);

        const alignClasses = {
            normal: '',
            left: 'pull-left',
            right: 'pull-right'
        };

        const classes = this.classSet(
            'dropdown',
            alignClasses[props.align],
            props.className
        );

        return (<div className={classes}>
            <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">
                {props.title}
                <span className="caret"></span>
            </button>
            <ul className="dropdown-menu" role="menu">
                {props.children}
            </ul>
        </div>);
    }
};

export default Dropdown;
