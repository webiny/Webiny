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
                    {this.props.label}
                    {icon}
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
        this.state = {};

        this.bindMethods('selectTab');
    }

    selectTab(index) {
        this.setState({selected: index});
    }

    componentWillMount() {
        super.componentWillMount();
        this.setState({selected: Webiny.Router.getParams('tab', this.props.selected) || 0});
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        let selected = Webiny.Router.getParams('tab', props.selected);
        if (selected === null) {
            selected = this.state.selected;
        }
        this.setState({selected});
    }
}

Tabs.defaultProps = {
    position: 'top', // top, left
    renderer() {
        const tabsContainerCss = this.classSet({
            'tabs': true,
            'tabs--navigation-top': this.props.position === 'top',
            'tabs--navigation-left': this.props.position === 'left'
        });

        const tabsHeader = [];
        const tabsContent = [];

        React.Children.map(this.props.children, (child, index) => {
            const active = this.state.selected === index;

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

        return (
            <div className={tabsContainerCss}>
                <div className="tabs__body">
                    <ul className="tabs__navigation nav nav-tabs">{tabsHeader}</ul>
                    <div className="tabs__panes">{tabsContent}</div>
                </div>
            </div>
        );
    }
};