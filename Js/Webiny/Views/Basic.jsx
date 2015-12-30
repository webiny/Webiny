import View from './../Lib/View'
import AlertStore from './Stores/Alert'
import Registry from './../Lib/Registry'

class Basic extends View {

    constructor() {
        super();
        this.state = {
            showLoader: false,
            alerts: {
                success: [],
                danger: []
            }
        }
    }

    /**
     * On mounting of component, we just wanna "pull" all alerts that are in the store
     * (before getting them from the store, all alerts inside the store will be cleared)
     */
    componentWillMount() {
        this.trigger('Alert.List', {removeAll: true}).then(alerts => {
            this.setAlert(alerts);
        });
    }

    getHeaderTitle() {
        return Webiny.Router.getActiveRoute().getModule().name + 's';
    }

    getHeaderIcon() {
        return '';
    }

    getHeaderActions() {
        return [];
    }

    getId() {
        return Webiny.Router.getActiveRoute().getParams('id');
    }

    renderAlerts(classes = null) {
        var output = [];
        _.forEach(this.state.alerts, (alerts, type) => {
            var props = {
                key: 'rad-' + type + '-alerts',
                onClose: this.unsetAlert.bind(this, type),
                type: type,
                children: alerts,
				addClassName: classes
            };
            output.push(<Webiny.Components.Alert {...props}/>);
        });

        return <div>{output}</div>;
    }

    /**
     * @param alert
     * @param type
     * @param unset
     */
    setAlert(alert, type, unset = true) {
        if (unset) {
            this.unsetAlert(type);
        }

        var stateAlerts = _.clone(this.state.alerts);
        if (!type) {
            stateAlerts = alert;
        } else {
            _.isArray(alert) ? stateAlerts[type] = stateAlerts[type].concat(alert) : stateAlerts[type].push(alert);
        }

        this.setState({alerts: stateAlerts});
    }

    unsetAlert(type) {
        if (!type) {
            return this.setState({
                alerts: {
                    success: [],
                    danger: []
                }
            })
        }

        var stateAlerts = _.clone(this.state.alerts);
        stateAlerts[type].length = 0;
        this.setState({alerts: stateAlerts})
    }

    showLoader() {
        this.setState({showLoader: true});
    }

    hideLoader() {
        this.setState({showLoader: false});
    }

    renderLoader() {
        return this.state.showLoader ? <Webiny.Components.Loader/> : null;
    }
}

Registry.addStore(new AlertStore());

export default Basic;