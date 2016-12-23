import Webiny from 'Webiny';
import Tab from './Tab';

class Tabs extends Webiny.Ui.Component {

    constructor() {
        super();
        this.state = {
            selected: 0
        };

        this.tabs = [];
        this.tabsHeader = [];
        this.tabsContent = [];

        this.bindMethods('parseChildren,selectTab,renderTabs,renderTabsHeader,renderTabsContent');
    }

    selectTab(index) {
        this.setState({selected: index});
    }

    getSelectedTab() {
        return this.state.selected;
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

    parseChildren(props, state) {
        this.tabsHeader = [];
        this.tabsContent = [];

        React.Children.map(props.children, (child, index) => {
            const active = parseInt(state.selected) === index;

            const props = _.merge({}, _.omit(child.props, ['children', 'renderer']), {
                key: index,
                index,
                active,
                renderIf: _.get(child.props, 'renderIf', true)
            });

            let tabClicked = (e) => {
                // Pass instance of Tabs, index clicked and event.
                child.props.onClick(this, index, e);
                if (!e.isDefaultPrevented()) {
                    this.selectTab(index);
                }
            };

            this.tabsHeader.push(
                <Tab.Header {..._.omit(props, ['alwaysRender'])} onClick={tabClicked}/>
            );
            this.tabsContent.push(
                <Tab.Content {..._.omit(props, ['onClick', 'icon', 'label', 'renderer'])}>{child.props.children}</Tab.Content>
            );
        });
    }

    renderTabs() {
        return this.props.renderTabs.call(this);
    }

    renderTabsHeader() {
        return this.props.renderTabsHeader.call(this);
    }

    renderTabsContent() {
        return this.props.renderTabsContent.call(this);
    }
}

Tabs.defaultProps = {
    position: 'top', // top, left
    size: 'default',
    renderTabs() {
        const tabsContainerCss = this.classSet({
            'tabs': true,
            'tabs--navigation-top': this.props.position === 'top',
            'tabs--navigation-left': this.props.position === 'left'
        });

        const tabsNavClasses = {
            'tabs__navigation nav nav-tabs': true,
            'tabs__navigation--large': this.props.size === 'large'
        };

        return (
            <div className={tabsContainerCss}>
                <div className="tabs__body">
                    <ul className={this.classSet(tabsNavClasses)}>{this.renderTabsHeader()}</ul>
                    <div className="tabs__panes">{this.renderTabsContent()}</div>
                </div>
            </div>
        );
    },
    renderTabsHeader() {
        return this.tabsHeader;
    },
    renderTabsContent() {
        return this.tabsContent;
    },
    renderer() {
        this.parseChildren(this.props, this.state);
        return this.renderTabs();
    }
};

export default Tabs;