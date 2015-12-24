import BaseStore from './../../Lib/Store/Base';
class Store extends BaseStore {

    getFqn() {
        return 'Alert';
    }

    getDefaultState() {
        return {
            success: [],
            danger: []
        };
    }

    init() {
        this.onAction('Alert.Success.Create', alert => {
            this.addAlerts(alert, 'success');
            this.emitChange();
        });

        this.onAction('Alert.Danger.Create', alert => {
            this.addAlerts(alert, 'danger');
            this.emitChange();
        });

        this.onAction('Alert.Success.Reset', ()  => {
            this.state.success.length = 0;
            this.emitChange();
        });

        this.onAction('Alert.Danger.Reset', () => {
            this.state.danger.length = 0;
            this.emitChange();
        });

        this.onAction('Alert.Reset', () => {
            this.state.danger.length = 0;
            this.state.success.length = 0;
            this.emitChange();
        });

        this.onAction('Alert.List', options => {
            if (options.removeAll) {
                var state = _.clone(this.state);
                this.setDefaultState();
                return state;

            }
            return this.state;
        });

        super.init()
    }

    addAlerts(alerts, type) {
        if (_.isArray(alerts)) {
            this.state[type] = this.state[type].concat(alerts)
        } else {
            this.state[type].push(alerts);
        }
    }

}

export default Store;