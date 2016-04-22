/* eslint-disable */
import Webiny from 'Webiny';
import data from './data';
const Ui = Webiny.Ui.Components;
const Table = Ui.List.Table;
const UiD = Webiny.Ui.Dispatcher;
import CustomLayout from './CustomLayout';

class List extends Webiny.Ui.View {

    getConfig() {
        return {
            myInlineList: {
                defaultParams: {
                    category: 'joinedTeam'
                },
                layout: () => {
                    return (
                        <div className="col-xs-12" style={{marginBottom: 20}}>
                            <h3>Custom function layout</h3>
                            <hr/>
                            <table/>
                            <div className="pull-left">
                                <pagination/>
                            </div>
                        </div>
                    );
                }
            },
            myInlineList2: {
                layout: () => <CustomLayout/>
            }
        };
    }

    render() {
        return (
            <Webiny.Builder.View name="core-users-list" config={this.getConfig()}>
                <Ui.Grid.Row>
                    <Ui.Grid.Col all={12}>
                        <Ui.List.ApiContainer ui="myList" api="/entities/core/users" fields="id,enabled,firstName,lastName,email,createdOn">
                            <Table.Table>
                                <Table.Row>
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
                                        <Table.DeleteAction/>
                                    </Table.Actions>
                                </Table.Row>
                                <Table.Footer/>
                            </Table.Table>
                            <Ui.List.Pagination/>
                        </Ui.List.ApiContainer>
                    </Ui.Grid.Col>
                </Ui.Grid.Row>
                <Ui.Grid.Row>
                    <Ui.Grid.Col all={12}>
                        <Ui.List.StaticContainer ui="myInlineList" data={data}>
                            <Ui.List.Filters>
                                {function (apply, reset) {
                                    return (
                                        <Ui.Grid.Row>
                                            <Ui.Grid.Col all={12}>
                                                <Ui.Button onClick={reset()} label="Show All"/>
                                                <Ui.Button onClick={apply({category: 'joinedTeam'})} label="Show Joined Team"/>
                                            </Ui.Grid.Col>
                                        </Ui.Grid.Row>
                                    );
                                }}
                            </Ui.List.Filters>
                            <Table.Table type="striped">
                                <Table.Row>
                                    <Table.Field name="category" align="left" sort="category" label="Category"/>
                                    <Table.DateTimeField name="createdOn" align="left" label="Created On" sort="createdOn.$date"
                                                         format="DD/MMM/YY HH:mm"/>
                                    <Table.DateField name="createdOn" align="left" label="Date"/>
                                    <Table.TimeField name="createdOn" align="left" label="Time"/>
                                    <Table.Actions>
                                        <Table.Action label="Edit" route="Users.Form" params="id"/>
                                        <Table.Action label="Delete" route="Users.Form" params="id"/>
                                    </Table.Actions>
                                </Table.Row>
                                <Table.Footer/>
                            </Table.Table>
                            <Ui.List.Pagination/>
                        </Ui.List.StaticContainer>
                    </Ui.Grid.Col>
                </Ui.Grid.Row>
                <Ui.Grid.Row>
                    <Ui.Grid.Col all={12}>
                        <Ui.List.ApiContainer ui="myInlineList2" api="/entities/core/files" fields="id,src,name,type,size,createdOn"
                                           searchFields="name">
                            <Ui.List.Filters>
                                {function (apply, reset) {
                                    return (
                                        <Ui.Grid.Row>
                                            <Ui.Grid.Col all={12}>
                                                <Ui.Button onClick={reset()} label="Show All"/>
                                                <Ui.Button onClick={apply({type: 'image/png'})} label="Show PNG"/>
                                            </Ui.Grid.Col>
                                        </Ui.Grid.Row>
                                    );
                                }}
                            </Ui.List.Filters>
                            <Table.Table>
                                <Table.Row>
                                    <Table.Field name="name" align="left" label="Name"/>
                                    <Table.Field name="type" align="left" label="Type" sort="type"/>
                                    <Table.FileSizeField name="size" align="left" label="Size" sort="size"/>
                                </Table.Row>
                                <Table.Empty/>
                                <Table.Footer/>
                            </Table.Table>
                            <Ui.List.Pagination size="small"/>
                        </Ui.List.ApiContainer>
                    </Ui.Grid.Col>
                </Ui.Grid.Row>
            </Webiny.Builder.View>
        );
    }
}

export default List;