import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const UiD = Webiny.Ui.Dispatcher;

class Form extends Webiny.Ui.View {

    getConfig() {
        // Return an object containing config for each UI component (ui="myForm", ui="myList")
        return {
            // Form config
            myForm: {
                // Form component will pass this function as a renderer to `email` component
                /*renderEmail: function inputRenderEmail() {
                 // NOTE: `this` is bound to the input instance
                 return <input type="text" className="form-control" placeholder="Custom input" valueLink={this.props.valueLink}/>;
                 },*/

                // Form will pass this function as a callback to `valueLink`
                onChangeEmail: function inputChangeEmail(newVal, oldVal) {
                    // NOTE: `this` is bound to Form instance, because it contains the data
                    console.log('Email changed', newVal);
                },

                onChangeCreatedBy: function inputChangeEmail(newVal, oldVal) {
                    Webiny.Injector.value('activeUser', newVal);
                },

                /*onSubmit: function onSubmit(model) {
                 // This will be passed as Form's `onSubmit` prop
                 // `this` is bound to Form.Container
                 console.info('Form submitted: ', model);
                 this.api.crudUpdate(this.state.model.id, model).then(ar => {
                 console.log(ar.getData());
                 this.props.onSubmitSuccess(ar);
                 })
                 },

                 onSubmitSuccess: function onSubmitSuccess(apiResponse) {
                 console.log('API SUCCESS', apiResponse);
                 //Webiny.Router.goToRoute('Dashboard');
                 },*/

                onInvalid: function onInvalid(attributes = {}) {
                    // TODO: pass invalid attributes to this callback
                    // This will be passed as Form's `onInvalid` prop
                    // `this` is bound to Form.Container
                    console.warn('Form validation failed!');
                },

                title: function title() {
                    // This method will be executed to get form title
                    return 'Custom form title from config';
                },

                /**
                 * Custom OPTIONS loader for form combo boxes (ONLY DATA)
                 * @returns {Promise<TResult>|Promise.<T>}
                 */
                optionsUserGroup: function optionsUserGroup() {
                    let apiParams = {
                        _perPage: 100,
                        _fields: 'id,name,tag'
                    };

                    return new Webiny.Api.Entity('/core/user-groups').crudList(apiParams).then(apiResponse => {
                        return {
                            data: apiResponse.getData().list,
                            valueAttr: 'id',
                            textAttr: 'name'
                        };
                    });
                },

                /**
                 * Custom OPTION renderer (ONLY RENDERING)
                 * @param item
                 * @returns {*}
                 */
                optionRendererUserGroup: {
                    option: function optionRenderer(item) {
                        return (
                            <div>
                                <strong>{item.name}</strong><br/>
                                <span>Tag: {item.tag}</span>
                            </div>
                        );
                    },
                    selected: function selectedOptionRenderer(item) {
                        return item.name;
                    }
                },

                loadData: function () {
                    const id = Webiny.Router.getParams('id');
                    return this.api.crudGet(id).then(apiResponse => apiResponse.getData());
                }
            },
            // List config
            invoiceList: {
                pageChange: (nextPage, currentPage) => {
                    // Handle list pagination
                }
            }
        };
    }

    render() {
        const userGroupSelect = {
            label: 'User group',
            name: 'userGroup',
            placeholder: 'Select user group',
            allowClear: true
        };

        const userGroupsSelect = {
            label: 'User groups',
            name: 'nestedGroups',
            placeholder: 'Select user groups',
            allowClear: true,
            api: '/core/user-groups',
            apiParams: this.apiParams({_fields: 'tag,name', _perPage: 2}),
            valueAttr: 'tag',
            textAttr: 'name'
        };

        const createdBySelect = {
            label: 'Created by',
            name: 'createdBy',
            placeholder: 'Select user',
            allowClear: true,
            api: '/core/users',
            apiParams: this.apiParams({_fields: 'id,email'}),
            valueAttr: 'id',
            textAttr: 'email'
        };

        const fileSelect = {
            label: 'File',
            name: 'file',
            placeholder: 'Select file',
            api: '/core/files',
            apiParams: this.apiParams({_fields: 'id,name', _perPage: 100}),
            valueAttr: 'id',
            textAttr: 'name'
        };

        return (
            <Webiny.Builder.View name="core-users-form" config={this.getConfig()}>
                <Ui.Form.Container ui="myForm" api="/core/users" fields="id,firstName,lastName,email,userGroups,settings,enabled">
                    <Ui.Panel.Panel>
                        <Ui.Panel.Header title="Webiny Form"/>
                        <Ui.Panel.Body>
                            <Ui.Hide if={UiD.eq('myForm.state.model.email', 'pavel910@gmail.com')}>
                                <h3>Conditional title (<Ui.Value value={'myForm-1.state.model.email'}/>)</h3>
                            </Ui.Hide>
                            <Ui.Tabs.Tabs ui="tabs">
                                <Ui.Tabs.Tab label="First Tab">
                                    <Ui.Form.Form layout={false}>
                                        <fields>
                                            <Ui.Grid.Row>
                                                <Ui.Grid.Col all={12}>
                                                    <Ui.Hide if={UiD.eq('myForm-1.state.model.email', 'pavel910@gmail.com')}>
                                                        <Ui.Value value={'myForm-1.state.model.email'}/>
                                                        <Ui.Input label="ID" name="id"/>
                                                    </Ui.Hide>
                                                    <Ui.Input label="Email" name="email" validate="required,email"/>
                                                    <Ui.Select {...userGroupSelect}/>
                                                    <Ui.Switch label="Enabled" name="enabled"/>
                                                </Ui.Grid.Col>
                                                <Ui.Grid.Col all={6}>
                                                    <Ui.CheckboxGroup label="Roles" name="roles" grid={12}>
                                                        <checkbox value="Admin">Admin&nbsp;management</checkbox>
                                                        <checkbox value="Billing">Billing</checkbox>
                                                        <checkbox value="Booking">Bookings</checkbox>
                                                        <checkbox value="Cms">Cms</checkbox>
                                                        <checkbox value="Coupon">Coupon&nbsp;management</checkbox>
                                                        <checkbox value="Crm">CRM</checkbox>
                                                        <checkbox value="Dashboard">Dashboard</checkbox>
                                                        <validator name="minLength">Please select at least 2 options</validator>
                                                    </Ui.CheckboxGroup>
                                                </Ui.Grid.Col>
                                                <Ui.Grid.Col all={6}>
                                                    <Ui.CheckboxGroup {...userGroupsSelect}>
                                                        <Ui.CheckboxGroup className="mt5" api="/core/users" apiParams={{_fields: 'id,email'}} textAttr="email"/>
                                                    </Ui.CheckboxGroup>
                                                </Ui.Grid.Col>
                                                <Ui.Grid.Col all={12}>
                                                    <h4>Settings</h4>
                                                    <Ui.Dynamic.FieldSet name="settings">
                                                        <Ui.Dynamic.Row>
                                                            <Ui.Grid.Row>
                                                                <Ui.Grid.Col all={3}>
                                                                    <Ui.Input placeholder="Key" name="key" validate="required"/>
                                                                </Ui.Grid.Col>
                                                                <Ui.Grid.Col all={3}>
                                                                    <Ui.Input placeholder="Value" name="value" validate="required"/>
                                                                </Ui.Grid.Col>
                                                                <Ui.Grid.Col all={3}>
                                                                    <Ui.Select {...createdBySelect} label={null}/>
                                                                </Ui.Grid.Col>
                                                                <Ui.Grid.Col all={3}>
                                                                    <div className="btn-group">
                                                                        <Ui.Dynamic.Add>
                                                                            <Ui.Button type="primary" label="Add"/>
                                                                        </Ui.Dynamic.Add>
                                                                        <Ui.Dynamic.Remove>
                                                                            <Ui.Button type="secondary" label="Remove"/>
                                                                        </Ui.Dynamic.Remove>
                                                                    </div>
                                                                </Ui.Grid.Col>
                                                            </Ui.Grid.Row>
                                                        </Ui.Dynamic.Row>
                                                        <Ui.Dynamic.Empty>
                                                            <h5>You have not created any settings yet. Click "Add settings" to start
                                                                creating your settings!</h5>
                                                            <Ui.Dynamic.Add>
                                                                <Ui.Button type="primary" label="Add settings"/>
                                                            </Ui.Dynamic.Add>
                                                        </Ui.Dynamic.Empty>
                                                    </Ui.Dynamic.FieldSet>
                                                </Ui.Grid.Col>
                                            </Ui.Grid.Row>
                                        </fields>
                                    </Ui.Form.Form>
                                </Ui.Tabs.Tab>
                                <Ui.Tabs.Tab label="Second tab">
                                    <Ui.Form.Form layout={false} onInvalid={this.signal('tabs:selectTab', 1)}>
                                        <fields>
                                            <Ui.Grid.Row>
                                                <Ui.Grid.Col all={12}>
                                                    <Ui.Input label="First name" name="firstName" validate="required"/>
                                                    <Ui.Input label="Last name" name="lastName" validate="required"/>
                                                </Ui.Grid.Col>
                                            </Ui.Grid.Row>
                                        </fields>
                                    </Ui.Form.Form>
                                </Ui.Tabs.Tab>
                            </Ui.Tabs.Tabs>
                        </Ui.Panel.Body>
                        <Ui.Panel.Footer className="text-right">
                            <Ui.Button type="default" onClick={this.signal('myForm:cancel')} label="Cancel"/>
                            <Ui.Button type="secondary" onClick={this.signal('myForm:reset')} label="Reset"/>
                            <Ui.Button type="primary" onClick={this.signal('myForm:submit')} label="Submit"/>
                        </Ui.Panel.Footer>
                    </Ui.Panel.Panel>
                </Ui.Form.Container>
            </Webiny.Builder.View>
        );
    }
}

export default Form;
