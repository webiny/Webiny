import Webiny from 'Webiny';
import styles from './styles.css';

class TooltipContent extends Webiny.Ui.Component {
    constructor() {
        super();
        this.ref = null;
        this.state = {style: {}};
        this.bindMethods('onClick');
    }

    componentDidMount() {
        super.componentDidMount();
        this.setupPlacement();
        this.registerEventListeners();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.unregisterEventListeners();
    }

    setupPlacement() {
        const refs = {
            wrapper: _.assign({
                width: this.props.wrapper.offsetWidth,
                height: this.props.wrapper.offsetHeight,
            }, $(this.props.wrapper).position()),
            content: {
                width: this.ref.offsetWidth,
                height: this.ref.offsetHeight
            }
        };

        const style = {};
        switch (this.props.placement) {
            case 'bottomRight':
                style.top = refs.wrapper.top + refs.wrapper.height;
                style.left = refs.wrapper.left + refs.wrapper.width;
                break;
            case 'bottom':
                style.top = refs.wrapper.top + refs.wrapper.height;
                style.left = refs.wrapper.left + (-(refs.content.width - refs.wrapper.width) / 2);
                break;
            case 'bottomLeft':
                style.top = refs.wrapper.top + refs.wrapper.height;
                style.left = refs.wrapper.left - refs.content.width;
                break;
            case 'left':
                style.top = refs.wrapper.top + (-(refs.content.height - refs.wrapper.height) / 2);
                style.left = refs.wrapper.left - refs.content.width;
                break;
            case 'topLeft':
                style.top = refs.wrapper.top - refs.content.height;
                style.left = refs.wrapper.left - refs.content.width;
                break;
            case 'top':
                style.top = refs.wrapper.top - refs.content.height;
                style.left = refs.wrapper.left + (-(refs.content.width - refs.wrapper.width) / 2);
                break;
            case 'topRight':
                style.top = refs.wrapper.top - refs.content.height;
                style.left = refs.wrapper.left + refs.wrapper.width;
                break;
            default: // 'right'
                style.top = refs.wrapper.top + (-(refs.content.height - refs.wrapper.height) / 2);
                style.left = refs.wrapper.left + refs.wrapper.width;
        }

        this.setState('style', style);
    }

    /**
     * If tooltip was triggered by 'click' event, then we want to watch for all outside clicks, to automatically close the tooltip.
     */
    registerEventListeners() {
        if (this.props.trigger === 'click') {
            document.addEventListener('click', this.onClick)
        }
    }

    unregisterEventListeners() {
        if (this.props.trigger === 'click') {
            document.removeEventListener('click', this.onClick)
        }
    }

    onClick(event) {
        if (!this.ref.contains(event.target)) {
            this.props.onOutsideClick();
        }
    }
}

TooltipContent.defaultProps = {
    wrapper: null,
    content: null,
    placement: 'right',
    trigger: 'hover',
    onOutsideClick: _.noop,
    onMouseEnter: _.noop,
    onMouseLeave: _.noop,
    renderer() {
        return (
            <div
                style={this.state.style}
                className={this.classSet(styles.content, styles['content' + _.upperFirst(this.props.placement)])}
                ref={ref => this.ref = ref}
                onMouseEnter={this.props.onMouseEnter}
                onMouseLeave={this.props.onMouseLeave}>
                <div className={styles.innerContent}>
                    {this.props.content}
                </div>
            </div>
        );

    }
};

export default TooltipContent;