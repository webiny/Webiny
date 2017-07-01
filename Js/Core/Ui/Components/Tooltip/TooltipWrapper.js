import Webiny from 'Webiny';
import styles from './styles.css';
import TooltipContent from './TooltipContent';

class TooltipWrapper extends Webiny.Ui.Component {
    constructor() {
        super();
        this.ref = null;
        this.state = {
            click: {
                wrapper: false
            },
            hover: {
                wrapper: false,
                content: false
            }
        };
        this.bindMethods('onClick,onMouseEnter,onMouseLeave');
    }

    componentDidMount() {
        super.componentDidMount();
        setTimeout(() => {
            this.registerEventListeners();
        }, 100);
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.unregisterEventListeners();
    }

    /**
     * We attach different event listeners, depending on received 'trigger' prop. We are doing this with native JS
     * because we need to access first child, or in other words, the real element on which the tooltip was applied.
     */
    registerEventListeners() {
        switch (this.props.trigger) {
            case 'click':
                this.ref.firstChild.addEventListener('click', this.onClick);
                break;
            default: // Hover
                this.ref.firstChild.addEventListener('mouseenter', this.onMouseEnter);
                this.ref.firstChild.addEventListener('mouseleave', this.onMouseLeave);
        }
    }

    /**
     * On componentWillUnmount, we make sure we cleanup all attached event listeners.
     */
    unregisterEventListeners() {
        switch (this.props.trigger) {
            case 'click':
                this.ref.firstChild.removeEventListener('click', this.onClick);
                break;
            default: // Hover
                this.ref.firstChild.removeEventListener('mouseenter', this.onMouseEnter);
                this.ref.firstChild.removeEventListener('mouseleave', this.onMouseLeave);
        }
    }

    onClick() {
        setTimeout(() => this.setState('click.wrapper', !this.state.click.wrapper), this.props.delay[0]);
    }

    onMouseEnter() {
        setTimeout(() => this.setState('hover.wrapper', true), this.props.delay[0]);
    }

    onMouseLeave() {
        setTimeout(() => this.setState('hover.wrapper', false), this.props.delay[1]);
    }

    /**
     * Tells us if tooltip content must be in the DOM, conditions depend on received 'trigger' prop.
     * @returns {boolean}
     */
    mustShowTooltipContent() {
        switch (this.props.trigger) {
            case 'click':
                return this.state.click.wrapper;
                break;
            default: // hover
                if (this.props.interactive) {
                    return this.state.hover.wrapper || this.state.hover.content;
                }
                return this.state.hover.wrapper;
        }
    }
}


TooltipWrapper.defaultProps = {
    placement: 'right',
    trigger: 'hover',
    interactive: false,
    target: null,
    delay: [50, 50],
    renderer() {
        return (
            <div className={this.classSet(styles.wrapper)} ref={ref => this.ref = ref}>
                {this.props.target}
                {this.mustShowTooltipContent() && (
                    <TooltipContent
                        trigger={this.props.trigger}
                        onOutsideClick={this.onClick}
                        onMouseEnter={() => this.setState('hover.content', true)}
                        onMouseLeave={() => this.setState('hover.content', false)}
                        content={this.props.content}
                        placement={this.props.placement}
                        wrapper={this.ref}/>
                )}
            </div>
        );
    }
};

export default TooltipWrapper;