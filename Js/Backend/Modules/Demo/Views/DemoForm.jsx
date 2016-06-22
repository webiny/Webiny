/* eslint-disable */
import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const UiD = Webiny.Ui.Dispatcher;


class Form extends Webiny.Ui.View {
    render() {
        const formProps = {
            ui: 'myForm',
            api: '/entities/core/users',
            fields: 'id,firstName,lastName,email,settings,enabled,avatar.id@avatar',
            connectToRouter: true
        };

        const userGroupSelect = {
            label: 'User group',
            name: 'userGroup',
            placeholder: 'Select user group',
            allowClear: true,
            api: '/entities/core/user-groups',
            fields: 'tag,name,id,createdOn',
            perPage: 2,
            optionRenderer: (item) => {
                return (
                    <div>
                        <strong>{item.data.name}</strong><br/>
                        <span>Tag: {item.data.tag}</span>
                    </div>
                );
            },
            selectedRenderer: (item) => {
                return item.data.name;
            },
            onChange: (newValue, oldValue, input) => {
                console.log(newValue, input.getCurrentData());
            }
        };

        const userGroupsSelect = {
            label: 'User groups',
            name: 'nestedGroups',
            placeholder: 'Select user groups',
            allowClear: true,
            api: '/entities/core/user-groups',
            fields: 'tag,name',
            perPage: 2,
            valueAttr: 'tag',
            textAttr: 'name'
        };

        const createdBySelect = {
            label: 'Created by',
            name: 'createdBy',
            placeholder: 'Select user',
            allowClear: true,
            api: '/entities/core/users',
            fields: 'id,email',
            valueAttr: 'id',
            textAttr: 'email'
        };

        const settings = (
            <Ui.Dynamic.Fieldset name="settings">
                <Ui.Dynamic.Row>
                    {function (record, index, actions) {
                        return (
                            <Ui.Grid.Row key={index}>
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
            </Ui.Dynamic.Fieldset>
        );

        return (
            <Ui.Form.Container {...formProps}>
                {(model, container) => (
                    <Ui.Panel.Panel>
                        <Ui.Panel.Header title="Webiny Form"/>
                        <Ui.Panel.Body>
                            <Ui.Hide if={model.email === 'pavel910@gmail.com'}>
                                <h3>Conditional title ({model.email})</h3>
                            </Ui.Hide>
                            <Ui.Tabs.Tabs>
                                <Ui.Tabs.Tab label="First Tab" icon="icon-gauge">
                                    <Ui.Grid.Row>
                                        <Ui.Grid.Col all={3}>
                                            <Ui.Input label="Email" name="email" validate="required,email"/>
                                        </Ui.Grid.Col>
                                        <Ui.Grid.Col all={3}>
                                            <Ui.Select {...userGroupSelect} />
                                        </Ui.Grid.Col>
                                        <Ui.Grid.Col all={6}>
                                            <Ui.Search
                                                validate="required"
                                                name="avatar"
                                                textAttr="name"
                                                label="Find file"
                                                api="/entities/core/files"
                                                fields="name,id,createdOn,ref"
                                                searchFields="name"
                                                allowFreeInput={false}
                                                useDataAsValue={false}
                                                filterBy="userGroup"
                                                onChange={(newValue, oldValue, input) => console.log(newValue, input.getCurrentData())}/>
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
                                        <Ui.Grid.Col all={4}>
                                            <Ui.DateRange label="Date range" name="range"/>
                                        </Ui.Grid.Col>
                                        <Ui.Grid.Col all={4}>
                                            <Ui.Select name="staticSelect" label="Static select" placeholder="Select an option">
                                                <option value="yes">Yes</option>
                                                <option value="no"><webiny-no>No</webiny-no></option>
                                                <option value="maybe"><strong>Maybe</strong></option>
                                            </Ui.Select>
                                        </Ui.Grid.Col>
                                        <Ui.Grid.Col all={4}>
                                            <Ui.Switch label="Enabled" name="enabled"/>
                                        </Ui.Grid.Col>
                                    </Ui.Grid.Row>
                                    <Ui.Grid.Row>
                                        <Ui.Grid.Col all={12}>
                                            <Ui.Tags name="tags" placeholder="Add tag" label="Tags"/>
                                        </Ui.Grid.Col>
                                    </Ui.Grid.Row>
                                    <Ui.Grid.Row>
                                        {/* CHECKBOXES */}
                                        <Ui.Grid.Col all={6}>
                                            <Ui.CheckboxGroup label="Roles (Static)" name="roles" grid={12}>
                                                <option value="Admin">Admin&nbsp;management</option>
                                                <option value="Billing">Billing</option>
                                                <option value="Booking">Bookings</option>
                                                <option value="Cms">Cms</option>
                                                <option value="Coupon">Coupon&nbsp;management</option>
                                                <option value="Crm">CRM</option>
                                                <option value="Dashboard">Dashboard</option>
                                                <validator name="minLength">Please select at least 2 options</validator>
                                            </Ui.CheckboxGroup>
                                        </Ui.Grid.Col>
                                        <Ui.Grid.Col all={6}>
                                            <Ui.CheckboxGroup {...userGroupsSelect} label="User groups (API)">
                                                <Ui.CheckboxGroup className="mt5" api="/entities/core/users" textAttr="email"/>
                                            </Ui.CheckboxGroup>
                                        </Ui.Grid.Col>
                                    </Ui.Grid.Row>
                                    <Ui.Grid.Row>
                                        {/* RADIO */}
                                        <Ui.Grid.Col all={6}>
                                            <Ui.RadioGroup label="Roles (static)" name="access" grid={12} validate="required">
                                                <option value="Admin">Admin</option>
                                                <option value="Billing">Billing</option>
                                                <option value="Crm">CRM</option>
                                                <option value="Dashboard">Dashboard</option>
                                            </Ui.RadioGroup>
                                        </Ui.Grid.Col>
                                        <Ui.Grid.Col all={6}>
                                            <Ui.RadioGroup label="User (API)" name="user" api="/entities/core/users"
                                                           textAttr="email"/>
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
                                </Ui.Tabs.Tab>
                                <Ui.Tabs.Tab label="Second tab" icon="icon-columns">
                                    <Ui.Grid.Row>
                                        <Ui.Grid.Col all={12}>
                                            <Ui.Input label="First name" name="firstName" validate="required"/>
                                            <Ui.Input label="Last name" name="lastName" validate="required"/>
                                        </Ui.Grid.Col>
                                    </Ui.Grid.Row>
                                </Ui.Tabs.Tab>
                            </Ui.Tabs.Tabs>
                        </Ui.Panel.Body>
                        <Ui.Panel.Footer className="text-right">
                            <Ui.Button type="default" onClick={container.cancel} label="Cancel"/>
                            <Ui.Button type="secondary" onClick={container.reset} label="Reset"/>
                            <Ui.Button type="primary" onClick={container.submit} label="Submit"/>
                        </Ui.Panel.Footer>
                    </Ui.Panel.Panel>
                )}
            </Ui.Form.Container>
        );
    }
}

export default Form;
