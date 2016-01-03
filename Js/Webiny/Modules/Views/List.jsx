import Basic from './Basic';

/**
 * This is a list view which handles most often-needed actions
 * It automatically sets state letiables, stores, data fetching/filtering, change detection of URL params, alerts...
 */
class List extends Basic {

    constructor() {
        super();

        _.assign(this.state, {
            data: [],
            meta: {
                totalCount: 0,
                totalPages: [],
                perPage: 0,
                currentPage: 0,
                filters: [],
                sorter: []
            },
            params: {}
        });

        this.urlParams = true;

        this.bindMethods('getData,listChangeSort');
    }

    componentDidMount() {
        this.store = this.getStore(this.getStoreFqn());
        this.onStoreChanged(this.store);
        this.onRouteChanged(this.getData);
        this.listEvents();
    }

    getHeaderIcon() {
        return Webiny.Ui.Components.Icon.Type.BARS;
    }

    getFields() {
        return '';
    }

    /**
     * Instead of URL, params can be sent through 2nd parameter too
     * @param route
     * @param params
     */
    getData(route = Webiny.Router.getActiveRoute(), nonUrlParams = {}) {
        const params = _.clone(route.getParams());
        let fields = this.getFields();

        this.showLoader();

        fields = _.isArray(fields) ? fields.join(',') : fields;
        fields = fields + ',id';
        params.fields = fields;

        _.assign(params, nonUrlParams);
        _.assign(params, this.getAdditionalListParams());

        this.setState({params});

        this.trigger(this.getStoreFqn() + '.List', params).then(() => {
            this.hideLoader();
        });
    }

    getAdditionalListParams() {
        return {};
    }

    renderComponent() {
        const bodyInjects = this.getInjectedRadComponents(this.renderBody);
        const footerInjects = this.getInjectedRadComponents(this.renderFooter);
        const headerInjects = this.getInjectedRadComponents(this.renderHeader);
        const loader = this.state.showLoader ? <Webiny.Ui.Components.Loader/> : null;

        return (
            <div>
                {this.renderAlerts()}
                <Webiny.Ui.Components.Panel.Panel>
                    {loader}
                    {this.renderHeader(...headerInjects)}
                    <Webiny.Ui.Components.Panel.Body style={{overflow: 'visible'}}>
                        {this.renderBody(...bodyInjects)}
                    </Webiny.Ui.Components.Panel.Body>
                    <Webiny.Ui.Components.Panel.Footer style={{padding: '0px 25px 25px'}}>
                        {this.renderFooter(...footerInjects)}
                    </Webiny.Ui.Components.Panel.Footer>
                </Webiny.Ui.Components.Panel.Panel>
            </div>
        );
    }

    renderBody() {
        return null;
    }

    renderFooter() {
        return null;
    }

    renderHeader() {
        const Link = Webiny.Ui.Components.Router.Link;
        return (
            <Webiny.Ui.Components.Panel.Header title={this.getHeaderTitle()} icon={this.getHeaderIcon()} style={{overflow: 'visible'}}>
                {this.getHeaderActions().map((action, index) => {
                    return (
                        <Link key={'panel-header-action-' + index} type="primary" size="small" className="pull-right" {...action}>
                            {action.label}
                        </Link>
                    );
                })}
            </Webiny.Ui.Components.Panel.Header>
        );
    }

    /** ------------ Functionality in separate methods for easier overriding of submit() method ------------*/

    listEvents() {
        this.listen('Webiny.Ui.Components.Table.Action.Edit', data => {
            this.listEventEdit(data);
        });

        this.listen('Webiny.Ui.Components.Table.Action.Delete', data => {
            this.listEventDelete(data);
        });

        this.listen('Webiny.Ui.Components.Table.Field.Toggle', data => {
            this.listEventToggleStatus(data.data, data.field);
        });

        this.listen('Webiny.Ui.Components.Table.Action.MultiAction', data => {
            const methodName = 'multiAction' + _.capitalize(data.action);
            if (!_.isFunction(this[methodName])) {
                return Webiny.Console.warn('MultiAction method \'' + methodName + '\' not defined.');
            }
            return this[methodName](data.selected, data.value);
        });

        this.listen('Webiny.Ui.Components.Table.Action.Menu', data => {
            const methodName = 'menuAction' + _.capitalize(data.action);
            if (!_.isFunction(this[methodName])) {
                return Webiny.Console.warn('MenuAction method \'' + methodName + '\' not defined.');
            }
            return this[methodName](data.data);
        });
    }

    listChangePerPage(page) {
        if (this.urlParams) {
            Webiny.Router.goToRoute('current', {perPage: page});
        } else {
            this.getData(null, {perPage: page});
        }
    }


    listChangePage(pageParam) {
        this.getData(null, pageParam);
    }

    listChangeSort(pageParam) {
        this.getData(null, pageParam);
    }

    listEventEdit(data) {
        Webiny.Router.goToUrl(Webiny.Router.getCurrentPathName('/' + data.id));
    }

    listEventDelete(data) {
        this.store.getApi().delete(_.isString(data) ? data : data.id).then(apiResponse => {
            if (!apiResponse.isError()) {
                this.getData(Webiny.Router.getActiveRoute());
                this.setAlert(this.listDeleteSuccessMessage(apiResponse, data), 'success');
            } else {
                this.setAlert(apiResponse.getErrorReport('errors'), 'danger');
            }
        });
    }

    listEventToggleStatus(data, field) {
        this.showLoader();
        const post = {};
        post[field] = !data[field];
        this.store.getApi().crudUpdate(data.id, post, {_fields: 'id'}).then(() => {
            this.getData(Webiny.Router.getActiveRoute());
        });
    }

    listDeleteSuccessMessage() {
        return 'Deleted successfully.';
    }
}

export default List;
