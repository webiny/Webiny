import Webiny from 'Webiny';
import TabHeader from './TabHeader';
import TabContent from './TabContent';

class Tabs extends Webiny.Ui.Component {

    constructor() {
        super();
        this.state = {
            selected: 0
        };

        this.tabs = [];
        this.tabsHeader = [];
        this.tabsContent = [];

        this.bindMethods('parseChildren,selectTab,renderTabs,renderHeader,renderContent');
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
        this.setState({selected: _.isNil(props.selected) ? this.state.selected : props.selected});
    }

    parseChildren(props, state) {
        this.tabsHeader = [];
        this.tabsContent = [];

        React.Children.map(props.children, (child, index) => {
            const active = parseInt(state.selected) === index;

            const headerProps = {
                key: index,
                active
            };

            _.assign(headerProps, _.omit(child.props, ['renderer', 'children', 'contentRenderer', 'headerRenderer']));

            let tabClicked = (e) => {
                // Pass instance of Tabs, index clicked and event.
                child.props.onClick(this, index, e);
                if (!e.isDefaultPrevented()) {
                    this.selectTab(index);
                }
            };

            if (_.has(child.props, 'headerRenderer')) {
                headerProps.renderer = child.props.headerRenderer;
            }

            this.tabsHeader.push(
                <TabHeader {...headerProps} onClick={tabClicked}/>
            );

            const contentProps = {
                key: index,
                active
            };
            _.assign(contentProps, _.omit(child.props, ['renderer', 'contentRenderer', 'headerRenderer']));
            if (_.has(child.props, 'contentRenderer')) {
                contentProps.renderer = child.props.contentRenderer;
            }
            this.tabsContent.push(
                <TabContent {...contentProps}/>
            );
        });
    }

    renderTabs() {
        return this.props.tabsRenderer.call(this);
    }

    renderHeader() {
        return this.props.headerRenderer.call(this);
    }

    renderContent() {
        return this.props.contentRenderer.call(this);
    }
}

Tabs.defaultProps = {
    position: 'top', // top, left
    size: 'default',
    tabsRenderer() {
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
                    <ul className={this.classSet(tabsNavClasses)}>{this.renderHeader()}</ul>
                    <div className="tabs__panes">{this.renderContent()}</div>
                </div>
            </div>
        );
    },
    headerRenderer() {
        return this.tabsHeader;
    },
    contentRenderer() {
        return this.tabsContent;
    },
    renderer() {
        this.parseChildren(this.props, this.state);
        return this.renderTabs();
    }
};

export default Webiny.createComponent(Tabs);