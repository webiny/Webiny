import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Tab extends Webiny.Ui.Component {

}

Tab.defaultProps = {
    label: 'Tab',
    alwaysRender: true,
    disabled: false,
    onClick: _.noop,
    icon: null,
    // The following props are passed from Tabs component
    active: false,
    index: null,
    parent: null,
    renderer() {
        const onClick = (e) => {
            this.props.onClick(this, this.props.index, e);
            if (!e.isDefaultPrevented()) {
                this.props.parent.selectTab(this.props.index);
            }
        };

        const active = {active: this.props.active};
        const tabSelectorClass = this.classSet(active, this.props.disabled ? 'disabled' : '');

        const icon = this.props.icon ? <Ui.Icon icon={'left ' + this.props.icon}/> : null;
        let label = this.props.label;
        if (_.isString(this.props.label)) {
            label = (
                <a href="javascript:void(0);">
                    {icon}
                    {this.props.label}
                </a>
            );
        }

        if (this.props.render === 'tab') {
            return (
                <li className={tabSelectorClass} onClick={onClick}>{label}</li>
            );
        }

        const tabClass = this.classSet('tab-pane', active);

        if (!this.props.disabled && (this.props.active || this.props.alwaysRender)) {
            return (
                <div className={tabClass}>
                    {this.props.children}
                    <div className="clearfix"></div>
                </div>
            );
        }

        return null;
    }
};

export default Tab;