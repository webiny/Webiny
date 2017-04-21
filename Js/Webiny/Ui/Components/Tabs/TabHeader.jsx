import Webiny from 'Webiny';

class TabHeader extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.bindMethods('renderLabel');
    }

    renderLabel() {
        return this.props.labelRenderer.call(this);
    }
}

TabHeader.defaultProps = {
    label: 'Tab',
    disabled: false,
    onClick: _.noop,
    icon: null,
    activeTabClassName: 'active',
    disabledTabClassName: 'disabled',
    active: false,
    labelRenderer() {
        let label = this.props.label;
        const i18n = React.isValidElement(label) && Webiny.isElementOfType(label, Webiny.Ui.Components.I18N);
        if (_.isString(this.props.label) || i18n) {
            const {Icon} = this.props;
            label = (
                <a href="javascript:void(0);">
                    {this.props.icon ? <Icon icon={'left ' + this.props.icon}/> : null}
                    {label}
                </a>
            );
        }
        return label;
    },
    renderer() {
        const css = {};
        css[this.props.activeTabClassName] = this.props.active;
        css[this.props.disabledTabClassName] = this.props.disabled;

        return (
            <li className={this.classSet(css)} onClick={this.props.onClick}>{this.renderLabel()}</li>
        );
    }
};

export default Webiny.createComponent(TabHeader, {modules: ['Icon']});