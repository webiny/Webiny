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
            <Ui.View>
                <Ui.View.Header title="User Groups List">
                    <Ui.Link type="primary" route="UserGroups.Create" align="right">
                        <Ui.Icon icon="icon-plus-circled"/>
                        Create user group
                    </Ui.Link>
                </Ui.View.Header>
                <Ui.View.Body>
                    <Ui.List.ApiContainer {...listProps}>
                        <Table.Table>
                            <Table.Row>
                                <Table.Field name="name" label="Name" sort="name">
                                    {data => (
                                        <span>
                                        <strong>{data.name}</strong><br/>{data.id}
                                    </span>
                                    )}
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
                </Ui.View.Body>
            </Ui.View>
        );
    }
};

export default List;