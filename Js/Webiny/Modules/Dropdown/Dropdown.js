import Webiny from 'Webiny';

class Dropdown extends Webiny.Ui.Component {

    constructor(props) {
        super(props);
        this.id = _.uniqueId('dropdown-');
        this.bindMethods('close');
    }

    componentDidMount() {
        super.componentDidMount();

        if (!this.props.closeOnClick) {
            $(document).on('click.' + this.id, '.' + this.id + ' .dropdown-menu', function (e) {
                e.stopPropagation();
            });
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        $(document).off('.' + this.id);
    }

    close() {
        $('.' + this.id).removeClass('open');
    }
}

Dropdown.defaultProps = {
    closeOnClick: true,
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
            props.className,
            this.id
        );

        return (
            <div className={classes}>
                <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">
                    {props.title}
                    <span className="caret"></span>
                </button>
                <ul className="dropdown-menu" role="menu">
                    {_.isFunction(props.children) ? props.children.call(this, this) : props.children}
                </ul>
            </div>
        );
    }
};

export default Dropdown;
