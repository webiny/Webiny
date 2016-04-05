import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const Table = Ui.List.Table;
const UiD = Webiny.Ui.Dispatcher;

class List extends Webiny.Ui.View {

    render() {
        return (
            <Webiny.Builder.View na me="core-users-list">
                <Ui.List.Container ui="myList" api="/core/users" fields="id,enabled,firstName,lastName,email,createdOn">
                    <Table.Table>
                        <Table.Row detailsRenderer={null} onShowDetails={null}>
                            <Table.Field name="firstName" align="left" label="First Name" sort="firstName">
                                <Table.FieldRenderer>
                                    {function () {
                                        return (
                                            <td className={this.getTdClasses()}>
                                                <strong>{this.props.data.firstName} {this.props.data.lastName}</strong><br/>
                                                {this.props.data.id}
                                            </td>
                                        );
                                    }}
                                </Table.FieldRenderer>
                                <Table.FieldInfo title="About first name">
                                    <div className="table-responsive">
                                        <table className="table table-simple">
                                            <thead>
                                            <tr>
                                                <th className="text-left">Label</th>
                                                <th className="text-left">Description</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td><span className="label label-danger">Inactive</span></td>
                                                <td>The site is currently not active, meaning you can only access the site
                                                    administration,
                                                    while the public part of the website is not accessible.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><span className="label label-warning">Active but not CNAMEd</span></td>
                                                <td>Both public part and the administration are active,
                                                    however the public part can only be accessed via the temporary domain.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><span className="label label-success">Active and CNAMEd</span></td>
                                                <td>Both public part and the administration are active,
                                                    and the domain can be accessed via the user domain.
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </Table.FieldInfo>
                            </Table.Field>
                            <Table.Field name="email" align="left" sort="email" label="Email">
                                <Table.FieldInfo title="About email">
                                    <p>
                                        API Key is used if you wish to make API calls from other websites, or devices, to retrieve
                                        content
                                        from a particular site.
                                        Only requests that have the matching API key will get a proper response.
                                        <br/><br/>
                                        The API key is sent via <span className="label label-default">X-Webiny-Api-Key</span> HTTP
                                        request
                                        header.
                                        <br/>
                                    </p>
                                </Table.FieldInfo>
                            </Table.Field>
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