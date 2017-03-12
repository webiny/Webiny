import Webiny from 'Webiny';

class Dropdown extends Webiny.Ui.Component {

    constructor(props) {
        super(props);
        this.id = _.uniqueId('dropdown-');
        this.opened = false;
        this.bindMethods('close');
    }

    componentDidMount() {
        super.componentDidMount();

        if (!this.props.closeOnClick) {
            $(document).on('click.' + this.id, '.' + this.id + ' .dropdown-menu', e => {
                e.stopPropagation();
            });
        }

        $(ReactDOM.findDOMNode(this)).on({
            'show.bs.dropdown': () => {
                this.props.onShow();
            },
            'shown.bs.dropdown': () => {
                this.props.onShown();
            },
            'hide.bs.dropdown': () => {
                this.props.onHide();
            },
            'hidden.bs.dropdown': () => {
                this.props.onHidden();
            }
        });
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
    disabled: false,
    listStyle: null,
    onShow: _.noop,
    onShown: _.noop,
    onHide: _.noop,
    onHidden: _.noop,
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

        const buttonClasses = this.classSet('btn btn-default dropdown-toggle', {disabled: this.props.disabled});

        return (
            <div className={classes}>
                <button className={buttonClasses} type="button" data-toggle="dropdown">
                    {props.title}
                    <span className="caret"></span>
                </button>
                <ul className="dropdown-menu" role="menu" style={this.props.listStyle}>
                    {_.isFunction(props.children) ? props.children.call(this, this) : props.children}
                </ul>
            </div>
        );
    }
};

export default Dropdown;
