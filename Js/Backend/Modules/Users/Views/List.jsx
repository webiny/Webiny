import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const Table = Ui.List.Table;

class List extends Webiny.Ui.View {

}

List.defaultProps = {
    renderer: function render() {
        const listProps = {
            api: '/entities/core/users',
            fields: 'id,enabled,firstName,lastName,email,createdOn,gravatar',
            connectToRouter: true,
            searchFields: 'firstName,lastName,email'
        };

        const statusProps = {
            placeholder: 'Status',
            allowClear: true,
            name: 'enabled',
            onChange: val => {
                this.ui('emailFilter').setApiParams({enabled: val}).prepareOptions();
            }
        };

        const selectProps = {
            ui: 'emailFilter',
            placeholder: 'Email',
            allowClear: true,
            api: '/entities/core/users',
            name: 'email',
            valueAttr: 'email',
            textAttr: 'email'
        };

        return (
            <Webiny.Builder.View na me="core-users-list">
                <Ui.Grid.Col all={12}>
                    <h2>Users</h2>
                </Ui.Grid.Col>
                <Ui.List.ApiContainer ui="myList" {...listProps}>
                    <Ui.List.FormFilters>
                        {(applyFilters, resetFilters) => {
                            return (
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={4}>
                                        <Ui.Select {...statusProps}>
                                            <option value="true">Enabled</option>
                                            <option value="false">Disabled</option>
                                        </Ui.Select>
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={4}>
                                        <Ui.Select {...selectProps}/>
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={4}>
                                        <Ui.Button type="primary" label="Filter" onClick={applyFilters()}/>
                                        <Ui.Button type="secondary" label="Reset" onClick={resetFilters()}/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                            );
                        }}
                    </Ui.List.FormFilters>
                    <Table.Table>
                        <Table.Row detailsRenderer={null} onShowDetails={null}>
                            <Table.Field name="firstName" label="First Name" sort="firstName"/>
                            <Table.Field name="email" sort="email" label="Email"/>
                            <Table.CaseField name="enabled" label="Status" sort="enabled">
                                <case value={true}>Enabled</case>
                                <case value={false}>Disabled</case>
                            </Table.CaseField>
                            <Table.DateField name="createdOn" label="Created On" sort="createdOn"/>
                            <Table.Actions>
                                <Table.EditAction route="Users.Form"/>
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