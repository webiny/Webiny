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
            connectToRouter: true,
            onSubmitSuccess: 'Demo.List'
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
                    <Ui.View.Form>
                        <Ui.View.Header title="Demo Form" description="Demo form to demonstrate most of the input components Webiny offers">
                            <Ui.Link type="default" align="right" route="Demo.List">Back to list</Ui.Link>
                            <Ui.Copy.Button copied="Stolen!" type="secondary" icon="icon-pencil" value="You just stole a record!"
                                            label="Steal it..." align="right"/>
                        </Ui.View.Header>
                        <Ui.View.Body noPadding>
                            <Ui.Tabs.Tabs size="large">
                                <Ui.Tabs.Tab label="Input components" icon="icon-gauge">
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
                                            <Ui.DateTime label="Date & Time" name="datetime" placeholder="Select date and time"/>
                                        </Ui.Grid.Col>
                                        <Ui.Grid.Col all={4}>
                                            <Ui.Date label="Date" name="date" placeholder="Select a date"/>
                                        </Ui.Grid.Col>
                                        <Ui.Grid.Col all={4}>
                                            <Ui.Time label="Time" name="time" placeholder="Select time"/>
                                        </Ui.Grid.Col>
                                    </Ui.Grid.Row>
                                    <Ui.Grid.Row>
                                        <Ui.Grid.Col all={4}>
                                            <Ui.DateRange label="Date range" name="range"/>
                                        </Ui.Grid.Col>
                                        <Ui.Grid.Col all={4}>
                                            <Ui.Select name="staticSelect" label="Static select" placeholder="Select an option">
                                                <option value="yes">Yes</option>
                                                <option value="no">
                                                    <webiny-no>No</webiny-no>
                                                </option>
                                                <option value="maybe"><strong>Maybe</strong></option>
                                            </Ui.Select>
                                        </Ui.Grid.Col>
                                        <Ui.Grid.Col all={4}>
                                            <Ui.Switch label="Enabled" name="enabled"/>
                                        </Ui.Grid.Col>
                                    </Ui.Grid.Row>
                                    <Ui.Grid.Row>
                                        <Ui.Grid.Col all={12}>
                                            <Ui.Copy.Input label="Cron setup"
                                                           value="* * * * * wget http://selecto.app:8001/api/services/cron-manager/runner/run >/dev/null 2>&1"/>
                                        </Ui.Grid.Col>
                                        <Ui.Grid.Col all={12}>
                                            <Ui.Tags name="tags" placeholder="Add tag" label="Tags"/>
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
                                <Ui.Tabs.Tab label="Checkboxes" icon="icon-columns">
                                    <Ui.Grid.Row>
                                        {/* CHECKBOXES */}
                                        <Ui.Grid.Col all={6}>
                                            <Ui.Form.Fieldset title="Static checkboxes (hard-coded options)"/>
                                            <Ui.CheckboxGroup name="roles" grid={12}>
                                                <option value="Admin">Admin&nbsp;management</option>
                                                <option value="Coupon">Coupon&nbsp;management</option>
                                                <option value="Crm">CRM</option>
                                                <option value="Dashboard">Dashboard</option>
                                                <option value="anually">{() => <strong>Annually</strong>}</option>
                                                <option value="monthly">
                                                    <div>Monthly&nbsp;<i>(One season minimum)</i></div>
                                                </option>
                                                <validator name="minLength">Please select at least 2 options</validator>
                                            </Ui.CheckboxGroup>

                                            <div className="clearfix"/>
                                            <Ui.Form.Fieldset title="Single checkbox"/>
                                            <Ui.Checkbox label="Single checkbox" name="singleCheckbox" grid={12}>
                                                <Ui.Tooltip target={<Ui.Icon icon="icon-info-circle"/>}>
                                                    Set immediately
                                                </Ui.Tooltip>
                                            </Ui.Checkbox>

                                            <div className="clearfix"/>
                                            <Ui.Form.Fieldset title="Custom checkbox markup (using 'checkboxRenderer' prop)"/>
                                            <Ui.CheckboxGroup name="roles" grid={12} checkboxRenderer={function renderCheckbox() {
                                                return (
                                                    <li className="list-item col-xs-offset-1">
                                                        <div className="form-group">
                                                            <div className="checkbox">
                                                                <input type="checkbox" id={this.id} disabled={this.isDisabled()} checked={this.isChecked()} onChange={this.onChange}/>
                                                                <label htmlFor={this.id}><span className="container-icon"></span>{this.props.label}</label>
                                                            </div>
                                                        </div>
                                                    </li>
                                                );
                                            }}>
                                                <option value="Admin">Admin&nbsp;management</option>
                                                <option value="Coupon">Coupon&nbsp;management</option>
                                                <option value="Crm">CRM</option>
                                            </Ui.CheckboxGroup>
                                        </Ui.Grid.Col>
                                        <Ui.Grid.Col all={6}>
                                            <Ui.Form.Fieldset title="Dynamic checkboxes with nested options"/>
                                            <Ui.CheckboxGroup {...userGroupsSelect} label="User groups (API)">
                                                <Ui.CheckboxGroup className="mt5" api="/entities/core/users" textAttr="email"/>
                                            </Ui.CheckboxGroup>
                                        </Ui.Grid.Col>
                                    </Ui.Grid.Row>
                                </Ui.Tabs.Tab>
                                <Ui.Tabs.Tab label="Radio buttons" icon="icon-columns">
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
                                                           textAttr="email" grid={12}/>
                                        </Ui.Grid.Col>
                                    </Ui.Grid.Row>
                                </Ui.Tabs.Tab>
                            </Ui.Tabs.Tabs>
                        </Ui.View.Body>
                        <Ui.View.Footer>
                            <Ui.Button type="default" onClick={container.cancel} label="Cancel"/>
                            <Ui.Button type="primary" onClick={container.submit} label="Submit" align="right"/>
                        </Ui.View.Footer>
                    </Ui.View.Form>
                )}
            </Ui.Form.Container>
        );
    }
}

export default Form;
