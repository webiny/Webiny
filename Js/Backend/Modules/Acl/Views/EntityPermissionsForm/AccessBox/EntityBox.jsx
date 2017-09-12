import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';
import ToggleAccessButton from './ToggleAccessButton';
import MethodTooltip from './MethodTooltip';

import styles from './styles.css';

class EntityBox extends Webiny.Ui.Component {
    constructor(props) {
        super(props);
        this.state = {entityFilter: ''};

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
        const {Tooltip, entity, permissions, onTogglePermission, currentlyEditingPermission} = this.props;

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
                    <Tooltip interactive placement="top" key={key} target={(
                        <ToggleAccessButton
                            method={method}
                            onClick={() => onTogglePermission(entity.class, key)}
                            value={permissions[key]}/>
                    )}>
                        <MethodTooltip method={method} currentlyEditingPermission={currentlyEditingPermission}/>
                    </Tooltip>
                );
            }
        });

        return <div>{buttons}</div>;
    }

    /**
     * Renders toggle buttons for custom API endpoints (if they exist on given entity).
     */
    renderCustomMethods() {
        const {Input, Tooltip, entity, permissions, currentlyEditingPermission, onTogglePermission} = this.props;

        let customMethods = [];

        _.each(entity.methods, method => {
            if (!method.custom) {
                return true;
            }
            const exposed = _.get(permissions, entity.class + '.' + method.key, false);
            customMethods.push(_.assign({}, method, {exposed}));
        });

        let header = <h2 className={styles.customMethodsTitle}>{this.i18n(`Custom methods`)}</h2>;
        let content = <div className={styles.noCustomMethods}>{this.i18n(`No custom methods.`)}</div>;

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

            return (
                <li key={method.key} className={styles.customMethodListItem}>
                    <Tooltip interactive target={(
                        <ToggleAccessButton
                            label={this.i18n(`E`)}
                            key={method.key}
                            method={method}
                            onClick={() => onTogglePermission(entity.class, method.key)}
                            value={_.get(permissions, method.key)}/>
                    )}>
                        <MethodTooltip method={method} currentlyEditingPermission={currentlyEditingPermission}/>
                    </Tooltip>

                    <div className={styles.methodDetails}>
                        <div className={styles.methodTypeLabel}>
                            {method.method.toUpperCase()}
                        </div>
                        <div title={method.path} className={styles.methodPathLabel}>{method.path}</div>
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
    i18nNamespace : 'Webiny.Backend.Acl.EntityBox',
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
    modules: ['Input', 'ClickConfirm', 'Tooltip']
});
