import Webiny from 'Webiny';
import ErrorGroup from './ErrorGroup';
import ErrorCount from './ErrorCount';
const Ui = Webiny.Ui.Components;

class ListErrors extends Webiny.Ui.View {

    constructor(props) {
        super(props);

        this.bindMethods('populateState');

        this.state = {};
    }

    populateState(id, count) {
        this.state[id] = count;
    }

    resolveGroup(error, list) {
        const api = new Webiny.Api.Endpoint('/entities/core/logger-error-group');
        api.get('resolve/' + error.id).then((response) => {
            list.loadData();
        });
    }

    resolveCallback(errorGroup, newErrorCount) {
        console.log('updated: ' + errorGroup + ' => ' + newErrorCount);
        this.populateState(errorGroup, newErrorCount);
    }
}

ListErrors.defaultProps = {

    renderer() {
        const jsErrorList = {
            api: '/entities/core/logger-error-group',
            fields: '*',
            searchFields: 'error',
            query: {'_sort': '-lastEntry', 'type': this.props.type},
            layout: null
        };

        return (

            <Ui.List.ApiContainer {...jsErrorList}>
                {(data, meta, errorList) => {
                    return (
                        <Ui.Grid.Row>
                            <Ui.Grid.Col all={12}>
                                <Ui.Form.Fieldset
                                    title={`Found a total of ${meta.totalCount} records (showing ${meta.perPage} per page)`}/>
                            </Ui.Grid.Col>
                            <Ui.Grid.Col all={12}>
                                <Ui.List.Loader/>
                                <Ui.List.Table.Empty renderIf={!data.length}/>
                                <Ui.ExpandableList>
                                    {data.map(row => {
                                        this.populateState(row.id, row.errorCount);
                                        return (

                                            <Ui.ExpandableList.Row key={row.id}>
                                                <Ui.ExpandableList.Field all={1} name="Count" className="text-center">
                                                    <ErrorCount count={this.state[row.id]}/>
                                                </Ui.ExpandableList.Field>
                                                <Ui.ExpandableList.Field all={5} name="Error">{row.error}</Ui.ExpandableList.Field>
                                                <Ui.ExpandableList.Field all={4} name="Last Entry">
                                                    <Ui.Filters.DateTime value={row.lastEntry}/>
                                                </Ui.ExpandableList.Field>

                                                <Ui.ExpandableList.RowDetailsList title={row.error}>
                                                    <ErrorGroup errorGroup={row} errorGroupList={errorList}
                                                                resolveCallback={this.resolveCallback}/>
                                                </Ui.ExpandableList.RowDetailsList>

                                                <Ui.ExpandableList.ActionSet>
                                                    <Ui.ExpandableList.Action
                                                        label="Resolve Group"
                                                        icon="icon-check"
                                                        onClick={()=>this.resolveGroup(row, errorList)}/>
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
            </Ui.List.ApiContainer>
        );
    }
};

export default ListErrors;