import Webiny from 'Webiny';
import ToggleAccessButton from './ToggleAccessButton';

import styles from './styles.css';

class EntityBox extends Webiny.Ui.Component {
    constructor(props) {
        super(props);
        this.state = {entityFilter: ''};
        this.api = new Webiny.Api.Endpoint('/entities/webiny/user-permissions');
        this.crud = {
            create: '/.post',
            read: '{id}.get',
            list: '/.get',
            update: '{id}.patch',
            delete: '{id}.delete'
        };
    }

    /**
     * Renders toggle buttons for basic CRUD API endpoints (if they exist on given entity).
     */
    renderCrudMethods() {
        const {entity, permissions, onTogglePermission} = this.props;

        const existingOperations = {
            crudCreate: _.find(entity.methods, {key: this.crud.create}),
            crudRead: _.find(entity.methods, {key: this.crud.get}) || _.find(entity.methods, {key: this.crud.list}),
            crudUpdate: _.find(entity.methods, {key: this.crud.update}),
            crudDelete: _.find(entity.methods, {key: this.crud.delete})
        };

        const buttons = [];
        _.each(existingOperations, (method, key) => {
            if (method) {
                buttons.push(
                    <ToggleAccessButton
                        key={key}
                        method={method}
                        onClick={() => onTogglePermission(entity.class, key)}
                        value={permissions[key]}/>
                );
            }
        });

        return <div>{buttons}</div>;
    }

    /**
     * Renders toggle buttons for custom API endpoints (if they exist on given entity).
     */
    renderCustomMethods() {
        const {Icon, Link, Input, Tooltip, entity, permissions, currentlyEditingPermission, onTogglePermission} = this.props;

        let customMethods = [];

        _.each(entity.methods, method => {
            if (!method.custom) {
                return true;
            }
            const exposed = _.get(permissions, entity.class + '.' + method.key, false);
            customMethods.push(_.assign({}, method, {exposed}));
        });

        let header = <h2 className={styles.customMethodsTitle}>{this.i18n(`Custom methods`)}</h2>;
        let content = <div className={styles.noCustomMethods}>{this.i18n(`No custom methods.`)}</div>

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
                <h2 className={styles.customMethodsTitle}>{this.i18n(`Custom methods`)}</h2>
                <Input placeholder="Filter methods..." {...this.bindTo('entityFilter')} delay={0}/>
            </span>
        );

        let methods = customMethods.map(method => {
            if (method.url.indexOf(this.state.entityFilter.toLowerCase()) === -1) {
                return;
            }

            console.log(method)

            let parameters = {
                body: [],
                headers: [],
                path: []
            };


            _.each(_.get(method, 'parameters', {}), (parameter, key) => {
                parameters.path.push({key, type: parameter.type, description: parameter.description})
            });

            _.each(_.get(method, 'body', {}), (parameter, key) => {
                parameters.body.push({key, type: parameter.type, description: parameter.description})
            });

            _.each(_.get(method, 'headers', []), parameter => {
                parameters.headers.push({key: parameter.name, type: parameter.type, description: parameter.description});
            });

            return (
                <li key={method.key} className={styles.customMethodListItem}>
                    <Tooltip placement="top" key="label" target={(
                        <ToggleAccessButton
                            key={method.key}
                            method={method}
                            onClick={() => onTogglePermission(entity.class, method.key)}
                            value={_.get(permissions, method.key)}/>
                    )}>
                        <div className={styles.detailsTooltip}>
                            <h3>{method.name} {method.public && <span className={styles.publicMethod}>{this.i18n(`(public)`)}</span>}</h3>
                            <div>{method.description}</div>

                            <br/>
                            <h3>{this.i18n(`Execution:`)}</h3>
                            <div>
                                <div className={styles.methodBox}>{method.method}</div>
                                {method.path}
                            </div>

                            <br/>
                            {!_.isEmpty(parameters.path) && (
                                <wrapper>
                                    <h3>{this.i18n(`Path:`)}</h3>
                                    <table className={styles.parametersTable}>
                                        <tbody>
                                        {parameters.path.map(item => (
                                            <tr key={item.key}>
                                                <td>{item.type}</td>
                                                <td><strong>{item.key}</strong></td>
                                                <td>{item.description}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </wrapper>
                            )}

                            <br/>
                            {!_.isEmpty(parameters.body) && (
                                <wrapper>
                                    <h3>{this.i18n(`Body:`)}</h3>
                                    <table className={styles.parametersTable}>
                                        <tbody>
                                        {parameters.body.map(item => (
                                            <tr key={item.key}>
                                                <td>{item.type}</td>
                                                <td><strong>{item.key}</strong></td>
                                                <td>{item.description}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </wrapper>
                            )}

                            <br/>
                            {!_.isEmpty(parameters.headers) && (
                                <wrapper>
                                    <h3>{this.i18n(`Headers:`)}</h3>
                                    <table className={styles.parametersTable}>
                                        <tbody>
                                        {parameters.headers.map(item => (
                                            <tr key={item.key}>
                                                <td>{item.type}</td>
                                                <td><strong>{item.key}</strong></td>
                                                <td>{item.description}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </wrapper>
                            )}

                            <br/>

                            {_.isEmpty(method.usages) ? (
                                <wrapper>
                                    <h3>{this.i18n(`Usages`)}</h3>
                                    <div>
                                        No usages.
                                    </div>
                                </wrapper>
                            ) : (
                                <wrapper>
                                    <h3>{this.i18n(`Usages ({total}):`, {total: method.usages.length})}</h3>
                                    <div>
                                        <table className={styles.usagesTable}>
                                            <thead>
                                            <tr>
                                                <th>{this.i18n(`Permission`)}</th>
                                                <th>{this.i18n(`Roles`)}</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {method.usages.map(permission => {

                                                return (
                                                    <tr key={permission.id}>
                                                        <td>
                                                            {permission.id === currentlyEditingPermission.id ? (
                                                                <span>{permission.name}</span>
                                                            ) : (
                                                                <Link
                                                                    separate
                                                                    route="UserPermissions.Edit"
                                                                    params={{id: permission.id}}>
                                                                    {permission.name}
                                                                </Link>
                                                            )}
                                                        </td>
                                                        <td className={this.classSet({[styles.moreRoles]: true})}>
                                                            {permission.roles.map(role => (
                                                                <Link
                                                                    separate
                                                                    key={permission.id}
                                                                    route="UserRoles.Edit"
                                                                    params={{id: role.id}}>
                                                                    {role.name}
                                                                </Link>
                                                            ))}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            </tbody>
                                        </table>
                                    </div>
                                </wrapper>
                            )}

                        </div>
                    </Tooltip>

                    <div>
                        <div className={styles.methodTypeLabel}>
                            {method.method.toUpperCase()}
                        </div>
                        <div>{method.url.replace(webinyApiPath, '')}</div>
                    </div>
                    <div className="clearfix"/>
                </li>
            );
        });

        // Filter out undefined values (when method filtering is active)
        methods = _.filter(methods, item => !_.isUndefined(item));
        content = _.isEmpty(methods) ? <div className={styles.noCustomMethods}>{this.i18n(`Nothing to show.`)}</div> :
            <ul className={styles.customMethodsList}>{methods}</ul>;

        return (
            <div>
                <header>{header}</header>
                {content}
            </div>
        );
    }
}

EntityBox.defaultProps = {
    currentlyEditingPermission: null,
    entity: {},
    permissions: {},
    onTogglePermission: _.noop,
    onRemoveEntity: _.noop,
    renderer() {
        const {ClickConfirm} = this.props;

        return (
            <div className="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                <div className={styles.box}>
                    <div>
                        <h1 className={styles.title}>{this.props.entity.class}</h1>
                        <ClickConfirm
                            onComplete={() => this.props.onRemoveEntity(this.props.entity)}
                            message={this.i18n('Are you sure you want to remove {entity}?', {
                                entity: <strong>{this.props.entity.class}</strong>
                            })}>
                            <span onClick={_.noop} className={styles.removeButton}>×</span>
                        </ClickConfirm>
                        {this.renderCrudMethods()}
                        {this.renderCustomMethods()}
                    </div>
                </div>
            </div>
        );
    }
};

export default Webiny.createComponent(EntityBox, {
    modules: ['Icon', 'Input', 'Button', 'ClickConfirm', 'Tooltip', 'Link']
});
