import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

export class Tab extends Webiny.Ui.Component {

}

Tab.defaultProps = {
    label: 'Tab',
    alwaysRender: true,
    disabled: false,
    onClick: _.noop,
    icon: null,
    // The following props are passed from Tabs component
    render: 'tab', // tab or content,
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

export class Tabs extends Webiny.Ui.Component {

    constructor() {
        super();
        this.tabs = [];
        this.state = {
            selected: 0
        };

        this.bindMethods('selectTab');
    }

    selectTab(index) {
        this.setState({selected: index});
    }

    componentWillMount() {
        super.componentWillMount();
        this.setState({selected: Webiny.Router.getParams('tab') || this.props.selected || 0});
        if (this.props.attachToForm) {
            this.props.attachToForm(this);
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        if (this.props.detachFromForm) {
            this.props.detachFromForm(this);
        }
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        this.setState({selected: props.selected || this.state.selected});
    }
}

Tabs.defaultProps = {
    position: 'top', // top, left
    size: 'default',
    renderer() {
        const tabsContainerCss = this.classSet({
            'tabs': true,
            'tabs--navigation-top': this.props.position === 'top',
            'tabs--navigation-left': this.props.position === 'left'
        });

        const tabsHeader = [];
        const tabsContent = [];

        React.Children.map(this.props.children, (child, index) => {
            const active = parseInt(this.state.selected) === index;

            const props = {
                key: index,
                index,
                active,
                parent: this,
                renderIf: _.get(child.props, 'renderIf', true)
            };
            props.render = 'tab';
            tabsHeader.push(React.cloneElement(child, props, child.props.children));
            props.render = 'content';
            tabsContent.push(React.cloneElement(child, props, child.props.children));
        });

        const tabsNavClasses = {
            'tabs__navigation nav nav-tabs': true,
            'tabs__navigation--large': this.props.size === 'large'
        };

        return (
            <div className={tabsContainerCss}>
                <div className="tabs__body">
                    <ul className={this.classSet(tabsNavClasses)}>{tabsHeader}</ul>
                    <div className="tabs__panes">{tabsContent}</div>
                </div>
            </div>
        );
    }
};