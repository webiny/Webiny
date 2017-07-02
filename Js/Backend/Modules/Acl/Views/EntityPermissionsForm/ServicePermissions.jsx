import Webiny from 'Webiny';
import styles from './styles.css';
import ServiceBox from './AccessBox/ServiceBox';
import AddServiceModal from './AddServiceModal';

class ServicePermissions extends Webiny.Ui.Component {

    constructor() {
        super();
        this.state = {
            services: [],
            loading: false
        };

        this.api = new Webiny.Api.Endpoint('/entities/webiny/user-permissions');
    }

    componentWillMount() {
        super.componentWillMount();
        if (!_.isEmpty(this.props.permissions)) {
            this.setState('loading', true, () => {
                this.api.setQuery({
                    services: _.keys(this.props.permissions)
                }).get('/service').then(apiResponse => this.setState({loading: false, services: apiResponse.getData()}));
            });
        }
    }
}

ServicePermissions.defaultProps = {
    model: null,
    permissions: {},
    onTogglePermission: _.noop,
    onAddService: _.noop,
    onRemoveService: _.noop,
    renderer() {
        const {Loader, Button, ViewSwitcher, Grid, Icon, permissions} = this.props;

        return (
            <ViewSwitcher>
                <ViewSwitcher.View view="form" defaultView>
                    {showView => (
                        <div className={styles.servicePermissionsWrapper}>
                            {this.state.loading && <Loader/>}
                            <Grid.Row className={styles.addAction}>
                                <Grid.Col all={12} className="text-center">
                                    <Button type="primary" onClick={showView('addServiceModal')}>
                                        <Icon icon="icon-plus-circled"/>
                                        {this.i18n(`Add service`)}
                                    </Button>
                                </Grid.Col>
                            </Grid.Row>

                            {_.isEmpty(this.state.services) ? (
                                <Grid.Row>
                                    <Grid.Col all={12} className="text-center">
                                        <div>
                                            <h2>{this.i18n(`No services selected.`)}</h2>
                                            <p>
                                                {this.i18n(`To manage access, please add a service first.`)}
                                            </p>
                                        </div>
                                    </Grid.Col>
                                </Grid.Row>
                            ) : (
                                <Grid.Row className={styles.accessBoxesWrapper}>
                                    {this.state.services.map(service => (
                                        <ServiceBox
                                            currentlyEditingPermission={this.props.model}
                                            onTogglePermission={(service, method) => this.props.onTogglePermission(service, method)}
                                            onRemoveService={service => {
                                                const index = this.state.services.indexOf(service);
                                                const services = _.clone(this.state.services);
                                                services.splice(index, 1);
                                                this.setState({services}, () => {
                                                    this.props.onRemoveService(service);
                                                    Webiny.Growl.success(this.i18n('Service removed successfully!'));
                                                });
                                            }}
                                            key={service.class}
                                            service={service}
                                            permissions={permissions[service.class]}/>
                                    ))}
                                </Grid.Row>
                            )}
                        </div>
                    )}
                </ViewSwitcher.View>
                <ViewSwitcher.View view="addServiceModal" modal>
                    {(showView, data) => (
                        <AddServiceModal
                            exclude={this.state.services}
                            onSubmit={service => {
                                this.setState('services', _.clone(this.state.services).concat([service]), () => {
                                    this.props.onAddService(service);
                                    Webiny.Growl.success(this.i18n('Service was added successfully!'));
                                });
                            }}/>
                    )}
                </ViewSwitcher.View>
            </ViewSwitcher>
        );
    }
};

export default Webiny.createComponent(ServicePermissions, {
    modules: [
        'Input', 'Button', 'ViewSwitcher', 'Grid', 'Icon', 'Loader'
    ]
});
