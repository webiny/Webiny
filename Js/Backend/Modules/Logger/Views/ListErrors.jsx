import React from 'react';
import Webiny from 'Webiny';
import ErrorGroup from './ErrorGroup';
import ErrorCount from './ErrorCount';

class ListErrors extends Webiny.Ui.View {

    constructor(props) {
        super(props);

        this.bindMethods('resolveError');

        this.state = {};
    }

    resolveGroup(error, list) {
        const api = new Webiny.Api.Endpoint('/entities/webiny/logger-error-group');
        api.delete(error.id).then(() => {
            list.loadData();
        });
    }

    resolveError(error, list, parentList) {
        const api = new Webiny.Api.Endpoint('/entities/webiny/logger-entry');
        api.post(error.id + '/resolve').then((response) => {
            if (response.getData('errorCount') < 1) {
                // if we have 0 errors in this group, we have to refresh the parent table
                parentList.loadData();
            } else {
                list.loadData();
                this['errorCount-' + response.getData('errorGroup')].updateCount(response.getData('errorCount'));
            }
        });
    }
}

ListErrors.defaultProps = {

    renderer() {
        const jsErrorList = {
            api: '/entities/webiny/logger-error-group',
            fields: '*',
            searchFields: 'error',
            query: {'_sort': '-lastEntry', 'type': this.props.type},
            layout: null
        };

        return (
            <Webiny.Ui.LazyLoad modules={['List', 'Section', 'Grid', 'ExpandableList', 'Filters']}>
                {(Ui) => (
                    <Ui.List {...jsErrorList}>
                        {(data, meta, errorList) => {
                            return (
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={12}>
                                        <Ui.Section
                                            title={`Found a total of ${meta.totalCount} records (showing ${meta.perPage} per page)`}/>
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={12}>
                                        <Ui.List.Loader/>
                                        <Ui.List.Table.Empty renderIf={!data.length}/>
                                        <Ui.ExpandableList>
                                            {data.map(row => {
                                                return (

                                                    <Ui.ExpandableList.Row key={row.id}>
                                                        <Ui.ExpandableList.Field width={1} name="Count" className="text-center">
                                                            <ErrorCount count={row.errorCount} ref={ref => this['errorCount-' + row.id] = ref}/>
                                                        </Ui.ExpandableList.Field>
                                                        <Ui.ExpandableList.Field width={5} name="Error">{row.error}</Ui.ExpandableList.Field>
                                                        <Ui.ExpandableList.Field width={4} name="Last Entry">
                                                            <Ui.Filters.DateTime value={row.lastEntry}/>
                                                        </Ui.ExpandableList.Field>

                                                        <Ui.ExpandableList.RowDetailsList title={row.error}>
                                                            <ErrorGroup errorGroup={row} resolveError={this.resolveError} parentList={errorList}/>
                                                        </Ui.ExpandableList.RowDetailsList>

                                                        <Ui.ExpandableList.ActionSet>
                                                            <Ui.ExpandableList.Action
                                                                label="Resolve Group"
                                                                icon="icon-check"
                                                                onClick={() => this.resolveGroup(row, errorList)}/>
                                                        </Ui.ExpandableList.ActionSet>

                                                    </Ui.ExpandableList.Row>

                                                );
                                            })}
                                        </Ui.ExpandableList>
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={12}>
                                        <Ui.List.Pagination/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                            );
                        }}
                    </Ui.List>
                )}
            </Webiny.Ui.LazyLoad>
        );
    }
};

export default ListErrors;