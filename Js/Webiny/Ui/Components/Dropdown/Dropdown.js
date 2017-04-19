import Webiny from 'Webiny';
import styles from './styles.css';

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

        const {styles} = this.props;

        $(ReactDOM.findDOMNode(this)).on({
            'show.bs.dropdown': () => {
                this.props.onShow();
                $('.' + this.id).addClass(styles.opened);
            },
            'shown.bs.dropdown': () => {
                this.props.onShown();
            },
            'hide.bs.dropdown': () => {
                this.props.onHide();
                $('.' + this.id).removeClass(styles.opened);
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
        const {styles} = this.props;
        $('.' + this.id).removeClass('open');
        $('.' + this.id).removeClass(styles.opened);
    }
}

Dropdown.defaultProps = {
    align: 'normal',
    closeOnClick: true,
    disabled: false,
    listStyle: null,
    onShow: _.noop,
    onShown: _.noop,
    onHide: _.noop,
    onHidden: _.noop,
    type: 'default',
    renderer() {
        const {styles, ...props} = this.props;

        const alignClasses = {
            normal: '',
            left: 'pull-left',
            right: 'pull-right'
        };

        const classes = this.classSet(
            styles.dropdown,
            alignClasses[props.align],
            props.className,
            this.id,
            this.props.type === 'balloon' && styles.balloon
        );

        const buttonClasses = this.classSet(
            'dropdown-toggle',
            styles.dropdownToggle,
            {disabled: this.props.disabled}
        );

        return (
            <div className={classes}>
                <button className={buttonClasses} type="button" data-toggle="dropdown">
                    {props.title}
                    <span className={'caret ' + styles.caret}/>
                </button>
                <ul className={'dropdown-menu ' + styles.dropdownMenu} role="menu" style={this.props.listStyle}>
                    {_.isFunction(props.children) ? props.children.call(this, this) : props.children}
                </ul>
            </div>
        );
    }
};

export default Webiny.createComponent(Dropdown, {styles, api: ['close']});
