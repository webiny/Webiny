import Webiny from 'Webiny';
import ErrorGroup from './ErrorGroup';
const Ui = Webiny.Ui.Components;

class ListErrors extends Webiny.Ui.View {

}

ListErrors.defaultProps = {

    renderer() {
        const jsErrorList = {
            api: '/entities/core/logger-error-group',
            fields: '*',
            connectToRouter: true,
            searchFields: 'error',
            query: {'_sort': '-lastEntry', 'type': this.props.type},
            layout: null
        };

        return (

            <Ui.List.ApiContainer {...jsErrorList}>

                {(data, meta, list) => {
                    return (
                        <Ui.Grid.Row>
                            <Ui.Grid.Col all={12}>
                                <Ui.Form.Fieldset
                                    title={`Found a total of ${meta.totalCount} records (showing ${meta.perPage} per page)`}/>
                            </Ui.Grid.Col>
                            <Ui.Grid.Col all={12}>
                                <Ui.List.Loader/>
                                <Ui.List.Table.Empty renderIf={!data.length}/>
                                <Ui.List.ExpandableList.ExpandableList>
                                    {data.map(row => {
                                        return (

                                            <Ui.List.ExpandableList.ElRow key={row.id}>
                                                <Ui.List.ExpandableList.ElField all={1} name="Count" className="text-center">
                                                    <span className="badge badge-primary">{row.errorCount}</span>
                                                </Ui.List.ExpandableList.ElField>
                                                <Ui.List.ExpandableList.ElField all={5}
                                                                                name="Error">{row.error}</Ui.List.ExpandableList.ElField>
                                                <Ui.List.ExpandableList.ElField all={4}
                                                                                name="Last Entry">{row.lastEntry}</Ui.List.ExpandableList.ElField>

                                                <Ui.List.ExpandableList.ElRowDetailsList title={row.error}>
                                                    <ErrorGroup errorGroup={row}/>
                                                </Ui.List.ExpandableList.ElRowDetailsList>

                                                <Ui.List.ExpandableList.ElActionSet>
                                                    <Ui.List.ExpandableList.ElAction label="Resolve Group" icon="icon-check"/>
                                                </Ui.List.ExpandableList.ElActionSet>

                                            </Ui.List.ExpandableList.ElRow>

                                        );
                                    })}
                                </Ui.List.ExpandableList.ExpandableList>
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