import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const Table = Ui.List.Table;

class List extends Webiny.Ui.View {

}

List.defaultProps = {
    renderer: function render() {
        const listProps = {
            api: '/entities/core/user-groups',
            fields: 'id,name,tag,createdOn',
            connectToRouter: true,
            query: {_sort: 'name'},
            perPage: 25
        };

        return (
            <Webiny.Builder.View na me="core-users-list">
                <Ui.Grid.Col all={12}>
                    <h2>
                        <Ui.Grid.Row>
                            <Ui.Grid.Col all={10}>
                                User Groups
                            </Ui.Grid.Col>
                            <Ui.Grid.Col all={2}>
                                <Ui.Link type="primary" align="right" route="UserGroups.Create">Create new User Group</Ui.Link>
                            </Ui.Grid.Col>
                        </Ui.Grid.Row>
                    </h2>
                </Ui.Grid.Col>
                <Ui.List.ApiContainer {...listProps}>
                    <Table.Table>
                        <Table.Row>
                            <Table.Field name="name" label="Name" sort="name">
                                <Table.FieldRenderer>
                                    {function renderer(data) {
                                        return (
                                            <td className={this.getTdClasses()}>
                                                <strong>{data.name}</strong>
                                                <br/>
                                                {data.id}
                                            </td>
                                        );
                                    }}
                                </Table.FieldRenderer>
                            </Table.Field>
                            <Table.Field name="tag" label="Tag" sort="tag"/>
                            <Table.Actions>
                                <Table.EditAction route="UserGroups.Edit"/>
                                <Table.DeleteAction/>
                            </Table.Actions>
                        </Table.Row>
                        <Table.Footer/>
                    </Table.Table>
                    <Ui.List.Pagination/>
                </Ui.List.ApiContainer>
            </Webiny.Builder.View>
        );
    }
};

export default List;