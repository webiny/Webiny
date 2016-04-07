import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const Table = Ui.List.Table;
const UiD = Webiny.Ui.Dispatcher;

class List extends Webiny.Ui.View {

    render() {
        return (
            <Webiny.Builder.View na me="core-users-list">
                <Ui.Grid.Col all={12}>
                    <h2>Users</h2>
                </Ui.Grid.Col>
                <Ui.List.Container ui="myList" api="/core/users" fields="id,enabled,firstName,lastName,email,createdOn,gravatar">
                    <Ui.List.FormFilters>
                        {function (applyFilters, resetFilters) {
                            return (
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={3}>
                                        <Ui.Select placeholder="Email" allowClear={true} api="/core/users" name="email"
                                                   valueAttr="email" textAttr="email"/>
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={3}>
                                        <Ui.Select placeholder="Status" allowClear={true} name="enabled">
                                            <option value="true">Enabled</option>
                                            <option value="false">Disabled</option>
                                        </Ui.Select>
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={4}>
                                        <Ui.Date placeholder="Created On" name="createdOn"/>
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={2}>
                                        <Ui.Button type="primary" label="Filter" onClick={applyFilters()}/>
                                        <Ui.Button type="secondary" label="Reset" onClick={resetFilters()}/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                            );
                        }}
                    </Ui.List.FormFilters>
                    <Table.Table>
                        <Table.Row detailsRenderer={null} onShowDetails={null}>
                            <Table.Field name="firstName" align="left" label="First Name" sort="firstName">
                                <Table.FieldRenderer>
                                    {function () {
                                        const r = this.props.data;
                                        return (
                                            <td className={this.getTdClasses()}>
                                                <Ui.Gravatar hash={r.gravatar}/>

                                                <div className="list-group">
                                                    <a href="#" className="list-group-item">
                                                        <h5 className="list-group-item-heading">{r.firstName} {r.lastName}</h5>

                                                        <p className="list-group-item-text">{r.id}</p>
                                                    </a>
                                                </div>
                                            </td>
                                        );
                                    }}
                                </Table.FieldRenderer>
                            </Table.Field>
                            <Table.Field name="email" align="left" sort="email" label="Email"/>
                            <Table.ToggleField name="enabled" label="Status" sort="enabled"/>
                            <Table.Field name="createdOn" align="left" label="Created On" sort="createdOn"/>
                            <Table.Actions>
                                <Table.EditAction route="Users.Form"/>
                                <Table.DeleteAction/>
                            </Table.Actions>
                        </Table.Row>
                        <Table.Footer/>
                    </Table.Table>
                    <Ui.List.Pagination/>
                </Ui.List.Container>
            </Webiny.Builder.View>
        );
    }
}

export default List;