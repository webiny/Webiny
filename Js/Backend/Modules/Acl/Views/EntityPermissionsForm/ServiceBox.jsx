import Webiny from 'Webiny';
import ToggleAccessButton from './ToggleAccessButton';

import styles from './styles.css';

class ServiceBox extends Webiny.Ui.Component {
    constructor(props) {
        super(props);
        this.state = {serviceFilter: ''};
        this.api = new Webiny.Api.Endpoint('/services/webiny/user-permissions');
    }

    /**
     * Renders toggle buttons for custom API endpoints (if they exist on given service).
     */
    renderCustomMethods() {
        const {Icon, Input, Tooltip, service, permissions, onTogglePermission} = this.props;

        let customMethods = [];

        _.each(service.methods, method => {
            const exposed = _.get(permissions, service.class + '.' + method.key, false);
            customMethods.push(_.assign({}, method, {exposed}));
        });

        let header = null;
        let content = <div className="empty">{this.i18n(`No custom methods.`)}</div>

        if (_.isEmpty(customMethods)) {
            return (
                <div className={styles.customMethods}>
                    <header>{header}</header>
                    {content}
                </div>
            );
        }

        header = (
            <span>
                <Input placeholder="Filter methods..." {...this.bindTo('serviceFilter')} delay={0}/>
            </span>
        );

        let methods = customMethods.map(method => {
            if (method.url.indexOf(this.state.serviceFilter.toLowerCase()) === -1) {
                return;
            }

            return (
                <li key={method.key}>
                    <ToggleAccessButton
                        key={method.key}
                        method={method}
                        onClick={() => onTogglePermission(service.class, method.key)}
                        value={_.get(permissions, method.key)}/>

                    <div>
                        <div className={styles.method}>
                            {method.method.toUpperCase()}
                            <Tooltip key="label" target={<Icon icon="icon-info-circle"/>}>
                                <div className={styles.customMethodTooltip}>
                                    <strong>{method.name}</strong>
                                    <div>{method.description}</div>
                                </div>
                            </Tooltip>
                        </div>
                        <div>{method.url.replace(webinyApiPath, '')}</div>
                    </div>
                    <div className="clearfix"/>
                </li>
            );
        });

        // Filter out undefined values (when method filtering is active)
        methods = _.filter(methods, item => !_.isUndefined(item));
        content = _.isEmpty(methods) ? <div className="empty">{this.i18n(`Nothing to show.`)}</div> : <ul>{methods}</ul>;

        return (
            <div className={styles.customMethods}>
                <header>{header}</header>
                {content}
            </div>
        );
    }
}

ServiceBox.defaultProps = {
    service: {},
    permissions: {},
    onTogglePermission: _.noop,
    onRemoveService: _.noop,
    renderer() {
        const {ClickConfirm} = this.props;

        return (
            <div className="col-lg-4 col-md-6 col-sm-12">
                <div className={styles.accessBox}>
                    <div>
                        <h1>{this.props.service.class}</h1>
                        <ClickConfirm
                            onComplete={() => this.props.onRemoveService(this.props.service)}
                            message={this.i18n('Are you sure you want to remove {service}?', {
                                service: <strong>{this.props.service.class}</strong>
                            })}>
                            <span onClick={_.noop} className={styles.removeButton}>×</span>
                        </ClickConfirm>
                        {this.renderCustomMethods()}
                    </div>
                </div>
            </div>
        );
    }
};

export default Webiny.createComponent(ServiceBox, {
    modules: ['Icon', 'Input', 'Button', 'ClickConfirm', 'Tooltip']
});
