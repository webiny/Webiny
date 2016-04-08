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

        const settings = (
            <Ui.Dynamic.FieldSet name="settings">
                <Ui.Dynamic.Row>
                    {function (record, index, actions) {
                        return (
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
                                        <Ui.Button type="primary" label="Add" onClick={actions.add(index)}/>
                                        <Ui.Button type="secondary" label="x" onClick={actions.remove(index)}/>
                                    </div>
                                </Ui.Grid.Col>
                            </Ui.Grid.Row>
                        );
                    }}
                </Ui.Dynamic.Row>
                <Ui.Dynamic.Empty>
                    {function (actions) {
                        return (
                            <Ui.Grid.Row>
                                <Ui.Grid.Col all={12}>
                                    <h5>You have not created any settings yet. Click "Add settings" to start creating your settings!</h5>
                                    <Ui.Button type="primary" label="Add settings" onClick={actions.add(0)}/>
                                </Ui.Grid.Col>
                            </Ui.Grid.Row>
                        )
                    }}
                </Ui.Dynamic.Empty>
            </Ui.Dynamic.FieldSet>
        );

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
                                                </Ui.Grid.Col>
                                            </Ui.Grid.Row>
                                            <Ui.Grid.Row>
                                                <Ui.Grid.Col all={4}>
                                                    <Ui.Input label="Email" name="email" validate="required,email"/>
                                                </Ui.Grid.Col>
                                                <Ui.Grid.Col all={4}>
                                                    <Ui.Select {...userGroupSelect}/>
                                                </Ui.Grid.Col>
                                                <Ui.Grid.Col all={4}>
                                                    <Ui.Search validate="required" label="Find user" api="/core/files" searchFields="name"
                                                               textAttr="name" fields="id,name" name="userQuery"/>
                                                </Ui.Grid.Col>
                                            </Ui.Grid.Row>
                                            <Ui.Grid.Row>
                                                <Ui.Grid.Col all={4}>
                                                    <Ui.DateTime label="Date & Time" name="datetime"/>
                                                </Ui.Grid.Col>
                                                <Ui.Grid.Col all={4}>
                                                    <Ui.Date label="Date" name="date"/>
                                                </Ui.Grid.Col>
                                                <Ui.Grid.Col all={4}>
                                                    <Ui.Time label="Time" name="time"/>
                                                </Ui.Grid.Col>
                                            </Ui.Grid.Row>
                                            <Ui.Grid.Row>
                                                <Ui.Grid.Col all={12}>
                                                    <Ui.Switch label="Enabled" name="enabled"/>
                                                </Ui.Grid.Col>
                                            </Ui.Grid.Row>
                                            <Ui.Grid.Row>
                                                {/* CHECKBOXES */}
                                                <Ui.Grid.Col all={6}>
                                                    <Ui.CheckboxGroup label="Roles (Static)" name="roles" grid={12}>
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
                                                    <Ui.CheckboxGroup {...userGroupsSelect} label="User groups (API)">
                                                        <Ui.CheckboxGroup className="mt5" api="/core/users" textAttr="email"/>
                                                    </Ui.CheckboxGroup>
                                                </Ui.Grid.Col>
                                            </Ui.Grid.Row>
                                            <Ui.Grid.Row>
                                                {/* RADIO */}
                                                <Ui.Grid.Col all={6}>
                                                    <Ui.RadioGroup label="Roles (static)" name="access" grid={12} validate="required">
                                                        <checkbox value="Admin">Admin</checkbox>
                                                        <checkbox value="Billing">Billing</checkbox>
                                                        <checkbox value="Crm">CRM</checkbox>
                                                        <checkbox value="Dashboard">Dashboard</checkbox>
                                                    </Ui.RadioGroup>
                                                </Ui.Grid.Col>
                                                <Ui.Grid.Col all={6}>
                                                    <Ui.RadioGroup label="User (API)" name="user" api="/core/users" textAttr="email"/>
                                                </Ui.Grid.Col>
                                            </Ui.Grid.Row>
                                            <Ui.Grid.Row>
                                                <Ui.Grid.Col all={12}>
                                                    <Ui.Textarea label="Description" name="description"/>
                                                </Ui.Grid.Col>
                                            </Ui.Grid.Row>
                                            <Ui.Grid.Row>
                                                <Ui.Grid.Col all={12}>
                                                    <h4>Settings</h4>
                                                    {settings}
                                                </Ui.Grid.Col>
                                            </Ui.Grid.Row>
                                        </fields>
                                    </Ui.Form.Form>
                                </Ui.Tabs.Tab>
                                <Ui.Tabs.Tab label="Second tab">
                                    <Ui.Form.Form layout={false} onInvalid={this.ui('tabs:selectTab', 1)}>
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
                            <Ui.Button type="default" onClick={this.ui('myForm:cancel')} label="Cancel"/>
                            <Ui.Button type="secondary" onClick={this.ui('myForm:reset')} label="Reset"/>
                            <Ui.Button type="primary" onClick={this.ui('myForm:submit')} label="Submit"/>
                        </Ui.Panel.Footer>
                    </Ui.Panel.Panel>
                </Ui.Form.Container>
            </Webiny.Builder.View>
        );
    }
}

export default Form;
