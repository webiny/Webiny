import Webiny from 'Webiny';
import View from './../Core/Core/View';

class Basic extends View {

    constructor() {
        super();
        this.state = {
            showLoader: false,
            alerts: {
                success: [],
                danger: []
            }
        };
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
        const output = [];
        _.forEach(this.state.alerts, (alerts, type) => {
            const props = {
                key: 'rad-' + type + '-alerts',
                onClose: this.unsetAlert.bind(this, type),
                type,
                children: alerts,
                addClassName: classes
            };
            output.push(<Webiny.Ui.Components.Alert {...props}/>);
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

        let stateAlerts = _.clone(this.state.alerts);
        if (!type) {
            stateAlerts = alert;
        } else {
            if (_.isArray(alert)) {
                stateAlerts[type] = stateAlerts[type].concat(alert);
            } else {
                stateAlerts[type].push(alert);
            }
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
            });
        }

        const stateAlerts = _.clone(this.state.alerts);
        stateAlerts[type].length = 0;
        this.setState({alerts: stateAlerts});
    }

    showLoader() {
        this.setState({showLoader: true});
    }

    hideLoader() {
        this.setState({showLoader: false});
    }

    renderLoader() {
        return this.state.showLoader ? <Webiny.Ui.Components.Loader/> : null;
    }
}

export default Basic;
