/* eslint-disable */
import Webiny from 'Webiny';
import data from './data';
const Ui = Webiny.Ui.Components;
const Table = Ui.List.Table;
const UiD = Webiny.Ui.Dispatcher;
import CustomLayout from './CustomLayout';

class List extends Webiny.Ui.View {

    log(data, actions) {
        console.log("MULTI ACTION LOG", data);
    }

    render() {
        return (
            <Ui.View.List>
                <Ui.View.Header title="Demo List">
                    <Ui.ClickSuccess message="Simple!" onClose={() => console.log("Me closed!")}>
                        <Ui.Button type="primary" label="ClickSuccess" align="right" onClick={() => {}}/>
                    </Ui.ClickSuccess>
                    <Ui.ClickSuccess message="Hell yeah!">
                        {success => (
                            <Ui.ClickConfirm message="Do you really want to delete this user?" onComplete={success}>
                                <Ui.Button type="primary" label="ClickSuccess with ClickConfirm" align="right" onClick={() => {
                                    return new Promise(r => {
                                        setTimeout(r, 1500);
                                    });
                                }}/>
                            </Ui.ClickConfirm>
                        )}
                    </Ui.ClickSuccess>
                    <Ui.ClickConfirm message="Do you really want to delete this user?">
                        <Ui.Button type="primary" label="ClickConfirm" align="right" onClick={() => {
                            return new Promise(r => {
                                setTimeout(r, 1500);
                            });
                        }}/>
                    </Ui.ClickConfirm>
                    <Ui.ClickConfirm message="Do you really want to delete this user?" renderDialog={(confirm, cancel, confirmation) => {
                        return (
                            <Ui.Modal.Dialog onCancel={cancel}>
                                {confirmation.renderLoader()}
                                <Ui.Modal.Header title="Custom title"/>
                                <Ui.Modal.Body>
                                    <p>Some custom dialog body...</p>
                                </Ui.Modal.Body>
                                <Ui.Modal.Footer>
                                    <Ui.Button type="primary" label="Confirm" align="right" onClick={confirm}/>
                                    <Ui.Button type="secondary" label="Cancel" align="right" onClick={cancel}/>
                                </Ui.Modal.Footer>
                            </Ui.Modal.Dialog>
                        );
                    }}>
                        <Ui.Button type="primary" label="ClickConfirm custom dialog" align="right" onClick={() => {
                            return new Promise(r => {
                                setTimeout(r, 1500);
                            });
                        }}/>
                    </Ui.ClickConfirm>
                </Ui.View.Header>
                <Ui.View.Body>
                    <Ui.List.ApiContainer
                        connectToRouter={true}
                        api="/entities/core/users"
                        query={{enabled:  true}}
                        sort="email" fields="id,enabled,firstName,lastName,email,createdOn"
                        searchFields="name,email">
                        <Table.Table>
                            <Table.Row>
                                <Table.RowDetailsField/>
                                <Table.Field name="firstName" align="left" label="First Name" sort="firstName">
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
                                <Table.CaseField name="enabled" align="left" label="Status" sort="enabled">
                                    <case value={true}>Enabled</case>
                                    <case value={false}>Disabled</case>
                                </Table.CaseField>
                                <Table.Field name="createdOn" align="left" label="Created On" sort="createdOn"/>
                                <Table.DateTimeField name="createdOn" align="left" label="Created On" sort="createdOn"/>
                                <Table.TimeAgoField name="createdOn" align="left" label="Created On" sort="createdOn"/>
                                <Table.Actions>
                                    <Table.EditAction route="Demo.Form"/>
                                    <Ui.Dropdown.Divider/>
                                    <Table.DeleteAction/>
                                </Table.Actions>
                            </Table.Row>
                            <Table.RowDetails>
                                {(data, rowDetails) => {
                                    const detailsProps = {
                                        api: '/entities/core/user-groups',
                                        fields: 'id,name,tag'
                                    };
                                    return (
                                        <Ui.List.ApiContainer {...detailsProps}>
                                            <Ui.List.Loader/>
                                            <Table.Table>
                                                <Table.Row>
                                                    <Table.Field name="id" label="ID"/>
                                                    <Table.Field name="name" label="Name"/>
                                                    <Table.Field name="tag" label="Tag"/>
                                                </Table.Row>
                                            </Table.Table>
                                        </Ui.List.ApiContainer>
                                    );
                                }}
                            </Table.RowDetails>
                        </Table.Table>
                        <Ui.List.Pagination/>
                        <Ui.List.MultiActions>
                            <Ui.List.MultiAction label="Log" onAction={this.log}/>
                            <Ui.Dropdown.Divider/>
                            <Ui.List.DeleteMultiAction>
                                {rows => {
                                    const props = {
                                        message: 'Delete ' + rows.length + ' records?',
                                        onConfirm: this.delete
                                    };
                                    return (
                                        <Ui.Modal.Confirmation {...props}/>
                                    );
                                }}
                            </Ui.List.DeleteMultiAction>
                        </Ui.List.MultiActions>
                    </Ui.List.ApiContainer>
                </Ui.View.Body>
            </Ui.View.List>
        );
    }
}

export default List;