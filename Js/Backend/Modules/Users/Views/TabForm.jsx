import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const UiD = Webiny.Ui.Dispatcher;
const Table = Ui.List.Table;

import AddCreditsModal from './AddCreditsModal';

class Form extends Webiny.Ui.View {

    render() {
        const containerProps = {
            api: '/entities/core/users',
            fields: 'id,firstName,lastName,email,userGroups,settings,enabled',
            title: 'Users form',
            connectToRouter: true,
            onSubmitSuccess: () => {
                Webiny.Router.goToRoute('Users.List')
            },
            onCancel: () => {
                Webiny.Router.goToRoute('Users.List')
            }
        };

        return (
            <Webiny.Builder.View name="core-users-form">
                <Ui.Form.ApiContainer ui="myForm" {...containerProps}>
                    {/*<Ui.Data api="/brands/analytics">
                     {(data, filter) => <Stats title="New Brands" data={data.newBrands} onChange={newVal => filter({date: newVal})()}/>}
                     </Ui.Data>*/}
                    <Ui.Grid.Col all={12}>
                        <Ui.Panel.Panel>
                            <Ui.Panel.Header title="Users Form"/>
                            <Ui.Panel.Body>
                                <Ui.Tabs.Tabs ui="tabs">
                                    <Ui.Tabs.Tab label="General">
                                        <Ui.Form.Form layout={false} onInvalid={this.ui('tabs:selectTab', 0)}>
                                            <fields>
                                                <Ui.Grid.Row>
                                                    <Ui.Grid.Col all={6}>
                                                        <Ui.Input label="First name" name="firstName" validate="required"/>
                                                    </Ui.Grid.Col>
                                                    <Ui.Grid.Col all={6}>
                                                        <Ui.Input label="Last name" name="lastName" validate="required"/>
                                                    </Ui.Grid.Col>
                                                    <Ui.Grid.Col all={12}>
                                                        <Ui.Input label="Email" name="email" validate="required,email"/>
                                                    </Ui.Grid.Col>
                                                    <Ui.Grid.Col all={12}>
                                                        <Ui.Button type="primary" label="Add credits" onClick={this.ui('addCreditsModal:show')}/>
                                                        <AddCreditsModal ui="addCreditsModal"/>
                                                    </Ui.Grid.Col>
                                                </Ui.Grid.Row>
                                                <Ui.Grid.Row>
                                                    <Ui.Grid.Col all={12}>
                                                        <Ui.Switch label="Enabled" name="enabled"/>
                                                    </Ui.Grid.Col>
                                                </Ui.Grid.Row>
                                            </fields>
                                        </Ui.Form.Form>
                                    </Ui.Tabs.Tab>
                                    <Ui.Tabs.Tab label="Files" onClick={this.ui('files:loadData')}>
                                        <Ui.List.ApiContainer ui="files" autoLoad={false} api="/entities/core/files" fields="id,name,type,size">
                                            <Table.Table>
                                                <Table.Row>
                                                    <Table.Field name="name" align="left" label="Name"/>
                                                    <Table.Field name="type" align="left" label="Type" sort="type"/>
                                                    <Table.FileSizeField name="size" label="Size"/>
                                                </Table.Row>
                                            </Table.Table>
                                            <Ui.List.Pagination size="small"/>
                                        </Ui.List.ApiContainer>
                                    </Ui.Tabs.Tab>
                                </Ui.Tabs.Tabs>
                            </Ui.Panel.Body>
                            <Ui.Panel.Footer className="text-right">
                                <Ui.Button type="default" onClick={this.ui('myForm:cancel')} label="Cancel"/>
                                <Ui.Button type="primary" onClick={this.ui('myForm:submit')} label="Submit"/>
                            </Ui.Panel.Footer>
                        </Ui.Panel.Panel>
                    </Ui.Grid.Col>
                </Ui.Form.ApiContainer>
            </Webiny.Builder.View>
        );
    }
}

export default Form;