import Webiny from 'Webiny';

export class Tab extends Webiny.Ui.Component {

    render() {
        let onClick = (e) => {
            this.props.onClick(this, this.props.index, e);
            if (!e.isDefaultPrevented()) {
                this.props.parent.selectTab(this.props.index);
            }
        };

        const active = {active: this.props.active};
        const tabSelectorClass = this.classSet(active, this.props.disabled ? 'disabled' : '');

        let label = this.props.label;
        if (_.isString(this.props.label)) {
            label = <a href="javascript:">{this.props.label}</a>;
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
}

Tab.defaultProps = {
    label: 'Tab',
    alwaysRender: true,
    disabled: false,
    onClick: _.noop,

    // The following props are passed from Tabs component
    render: 'tab', // tab or content,
    active: false,
    index: null,
    parent: null
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
        this.setState({selected: Webiny.Router.getParam('tab', this.props.selected) || 0});
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        let selected = Webiny.Router.getParam('tab', props.selected);
        if (selected === null) {
            selected = this.state.selected;
        }
        this.setState({selected});
    }

    render() {
        const css = this.classSet('tabs', this.props.className);
        const tabsCss = this.classSet({
            'nav': true,
            'nav-tabs': this.props.position === 'top',
            'nav-tabs nav-stacked col-md-2': this.props.position === 'left'
        });

        const contentCss = this.classSet({
            'tab-content': true,
            'col-md-10': this.props.position === 'left'
        });

        const tabsHeader = [];
        const tabsContent = [];

        React.Children.map(this.props.children, (child, index) => {
            const active = this.state.selected === index;

            const props = {
                key: index,
                index: index,
                active: active,
                parent: this
            };
            props.render = 'tab';
            tabsHeader.push(React.cloneElement(child, props, child.props.children));
            props.render = 'content';
            tabsContent.push(React.cloneElement(child, props, child.props.children));
        });

        const style = {};
        if (this.props.position === 'top') {
            style.overflow = 'visible';
        }

        return (
            <div className={css}>
                <ul className={tabsCss}>{tabsHeader}</ul>
                <div className={contentCss} style={style}>{tabsContent}</div>
            </div>
        );
    }
}

Tabs.defaultProps = {
    position: 'top' // top, left
};