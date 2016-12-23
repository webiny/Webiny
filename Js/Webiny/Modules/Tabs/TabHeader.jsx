import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class TabHeader extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.bindMethods('renderLabel');
    }

    renderLabel() {
        return this.props.renderLabel.call(this);
    }
}

TabHeader.defaultProps = {
    label: 'Tab',
    disabled: false,
    onClick: _.noop,
    icon: null,
    active: false,
    activeTabClassName: 'active',
    disabledTabClassName: 'disabled',
    renderLabel() {
        let label = this.props.label;
        const i18n = React.isValidElement(label) && _.get(label, 'type.name') === 'I18N';
        if (_.isString(this.props.label) || i18n) {
            label = (
                <a href="javascript:void(0);">
                    {this.props.icon ? <Ui.Icon icon={'left ' + this.props.icon}/> : null}
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

export default TabHeader;