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

        const refs = {
            targetElement: _.assign({
                width: this.props.targetFirstChildElement.offsetWidth,
                height: this.props.targetFirstChildElement.offsetHeight,
            }, $(this.props.targetFirstChildElement).position()),
            content: {
                width: this.ref.offsetWidth,
                height: this.ref.offsetHeight
            }
        };

        const style = {};
        switch (this.props.placement) {
            case 'bottomRight':
                style.top = refs.targetElement.top + refs.targetElement.height;
                style.left = refs.targetElement.left + refs.targetElement.width;
                break;
            case 'bottom':
                style.top = refs.targetElement.top + refs.targetElement.height;
                style.left = refs.targetElement.left + (-(refs.content.width - refs.targetElement.width) / 2);
                break;
            case 'bottomLeft':
                style.top = refs.targetElement.top + refs.targetElement.height;
                style.left = refs.targetElement.left - refs.content.width;
                break;
            case 'left':
                style.top = refs.targetElement.top + (-(refs.content.height - refs.targetElement.height) / 2);
                style.left = refs.targetElement.left - refs.content.width;
                break;
            case 'topLeft':
                style.top = refs.targetElement.top - refs.content.height;
                style.left = refs.targetElement.left - refs.content.width;
                break;
            case 'top':
                style.top = refs.targetElement.top - refs.content.height;
                style.left = refs.targetElement.left + (-(refs.content.width - refs.targetElement.width) / 2);
                break;
            case 'topRight':
                style.top = refs.targetElement.top - refs.content.height;
                style.left = refs.targetElement.left + refs.targetElement.width;
                break;
            default: // 'right'
                style.top = refs.targetElement.top + (-(refs.content.height - refs.targetElement.height) / 2);
                style.left = refs.targetElement.left + refs.targetElement.width;
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