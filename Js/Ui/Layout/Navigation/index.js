import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';

/**
 * Note: this class needs to be optimized. The handling of mobile menu is just awful, a lot of (ughh) jquery code which needs to go out.
 * For now it does the job, but once we have more time we'll clean it up.
 */
class Navigation extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.state = {
            user: null,
            highlight: null,
            display: window.outerWidth > 768 ? 'desktop' : 'mobile'
        };

        this.checkDisplayInterval = null;
        this.offRouteChanged = _.noop;
        this.bindMethods('onClick');
    }

    componentDidMount() {
        super.componentDidMount();

        // Navigation is rendered based on user roles so we need to watch for changes
        this.watch('User', user => {
            this.setState({user});
        });

        this.watch('Navigation', nav => {
            this.setState({highlight: _.get(nav, 'highlight')});
        });

        this.offRouteChanged = Webiny.Router.onRouteChanged(event => {
            this.setState({route: event.route.name});
        });

        this.checkDisplayInterval = setInterval(() => {
            this.setState({display: window.outerWidth > 768 ? 'desktop' : 'mobile'});
        }, 500);
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.offRouteChanged();
        clearInterval(this.checkDisplayInterval);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.state, nextState);
    }

    onClick(menu) {
        if (menu.props.apps.includes(this.state.highlight)) {
            Webiny.Model.set(['Navigation', 'highlight'], null);
        }
    }
}

Navigation.defaultProps = {
    renderer() {
        const {Desktop, Mobile} = this.props;
        const props = {
            onClick: this.onClick,
            highlight: this.state.highlight
        };

        if (this.state.display === 'mobile') {
            return <Mobile {...props}/>
        }

        return <Desktop {...props}/>
    }
};

export default Webiny.createComponent(Navigation, {
    modules: ['Link', {
        Desktop: 'Webiny/Layout/Navigation/Desktop',
        Mobile: 'Webiny/Layout/Navigation/Mobile'
    }]
});
