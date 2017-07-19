import Webiny from 'Webiny';
import styles from './styles.css';

class TooltipContent extends Webiny.Ui.Component {
    constructor() {
        super();
        this.ref = null;
        this.state = {style: {visibility: 'hidden'}};
        this.bindMethods('onClick');
    }

    componentDidMount() {
        super.componentDidMount();
        setTimeout(() => {
            this.setupPlacement();
            this.registerEventListeners();
        });
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.unregisterEventListeners();
    }

    setupPlacement() {
        if (!this.ref) {
            return;
        }

        const target = _.assign({
            width: this.props.targetFirstChildElement.offsetWidth,
            height: this.props.targetFirstChildElement.offsetHeight,
        }, $(this.props.targetFirstChildElement).position());

        const content = {
            width: this.ref.offsetWidth,
            height: this.ref.offsetHeight
        };

        const style = {};
        switch (this.props.placement) {
            case 'bottomRight':
                style.top = target.top + target.height;
                style.left = target.left + target.width;
                break;
            case 'bottom':
                style.top = target.top + target.height;
                style.left = target.left + (-(content.width - target.width) / 2);
                break;
            case 'bottomLeft':
                style.top = target.top + target.height;
                style.left = target.left - content.width;
                break;
            case 'left':
                style.top = target.top + (-(content.height - target.height) / 2);
                style.left = target.left - content.width;
                break;
            case 'topLeft':
                style.top = target.top - content.height;
                style.left = target.left - content.width;
                break;
            case 'top':
                style.top = target.top - content.height;
                style.left = target.left + (-(content.width - target.width) / 2);
                break;
            case 'topRight':
                style.top = target.top - content.height;
                style.left = target.left + target.width;
                break;
            default: // 'right'
                style.top = target.top + (-(content.height - target.height) / 2);
                style.left = target.left + target.width;
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
    targetFirstChildElement: null,
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