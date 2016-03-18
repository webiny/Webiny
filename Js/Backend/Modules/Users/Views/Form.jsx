import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const UiD = Webiny.Ui.Dispatcher;

class Form extends Webiny.Ui.View {

    getConfig() {
        // Return an object containing config for each UI component (ui="profileForm", ui="invoiceList")
        return {
            // Form config
            myForm: {
                // Form component will pass this function as a renderer to `email` component
                renderEmail: function inputRenderEmail() {
                    // NOTE: `this` is bound to the input instance
                    return <input type="text" className="form-control" placeholder="Custom input" valueLink={this.props.valueLink}/>;
                },

                // Form will pass this function as a callback to `valueLink`
                onChangeEmail: function inputChangeEmail(newVal, oldVal) {
                    // NOTE: `this` is bound to Form instance, because it contains the data
                    console.log('Email changed', newVal);
                },

                onSubmit: function onSubmit(model) {
                    // This will be passed as Form's `onSubmit` prop
                    // `this` is bound to FormContainer
                    console.info('Form submitted: ', model);
                    this.api.crudUpdate(this.state.model.id, model).then(ar => {
                        console.log(ar.getData());
                        this.props.onSubmitSuccess(ar);
                    })
                },

                onSubmitSuccess: function onSubmitSuccess(apiResponse) {
                    console.log('API SUCCESS', apiResponse);
                    Webiny.Router.goToRoute('Dashboard');
                },

                onInvalid: function onInvalid() {
                    // This will be passed as Form's `onInvalid` prop
                    // `this` is bound to FormContainer
                    console.warn('Form validation failed!');
                },

                title: function title() {
                    // This method will be executed to get form title
                    return 'Custom form title from config';
                },

                /**
                 * Custom OPTIONS loader for form combo boxes (includes DATA and RENDERING)
                 * @returns {Promise<TResult>|Promise.<T>}
                 */
                optionsUserGroup: function optionsUserGroup() {
                    let apiParams = this.apiParams({
                        _perPage: 100,
                        enabled: true,
                        location: '@activeLocation.id',
                        _fields: 'id,name,tag'
                    });
                    return new Webiny.Api.Entity('/core/user-groups').crudList(apiParams).then(apiResponse => {
                        return this.createOptions(apiResponse.getData(), 'id', (item) => {
                            return (
                                <div>
                                    <strong>{item.name}</strong><br/>
                                    <span>Tag: {item.tag}</span>
                                </div>
                            );
                        });
                    });
                },

                /**
                 * Custom OPTION renderer (ONLY RENDERING, NO DATA LOADING)
                 * @param item
                 * @returns {*}
                 */
                optionCreatedBy: function optionCreatedBy(item) {
                    return (
                        <div>
                            <strong>{item.firstName} {item.lastName}</strong><br/>
                            <span>Email: {item.email}</span>
                        </div>
                    );
                },

                getData: function () {
                    // TODO: customize data loading
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
        return (
            <Webiny.Builder.View name="core-users-list" config={this.getConfig()}>
                <Ui.FormContainer ui="myForm" api="/core/users" fields="id,firstName,lastName,email">
                    <Ui.Panel.Panel>
                        <Ui.Panel.Header title="Webiny Form"/>
                        <Ui.Panel.Body>
                            <Ui.Hide if={UiD.eq('myForm.state.model.email', 'pavel910@gmail.com')}>
                                <h3>Conditional title (<Ui.Value value={'myForm-1.state.model.email'}/>)</h3>
                            </Ui.Hide>
                            <Ui.Tabs.Tabs ui="tabs">
                                <Ui.Tabs.Tab label="First Tab">
                                    <Ui.Form layout={false}>
                                        <fields>
                                            <Ui.Grid.Row>
                                                <Ui.Grid.Col all={12}>
                                                    <Ui.Hide if={UiD.eq('myForm-1.state.model.email', 'pavel910@gmail.com')}>
                                                        <Ui.Value value={'myForm-1.state.model.email'}/>
                                                        <Ui.Input label="ID" name="id"/>
                                                    </Ui.Hide>
                                                    <Ui.Input label="Email" name="email"/>
                                                </Ui.Grid.Col>
                                            </Ui.Grid.Row>
                                        </fields>
                                    </Ui.Form>
                                </Ui.Tabs.Tab>
                                <Ui.Tabs.Tab label="Second tab">
                                    <Ui.Form layout={false} onInvalid={this.signal('tabs:selectTab', 1)}>
                                        <fields>
                                            <Ui.Grid.Row>
                                                <Ui.Grid.Col all={12}>
                                                    <Ui.Input label="First name" name="firstName" validate="required"/>
                                                    <Ui.Input label="Last name" name="lastName" validate="required"/>
                                                </Ui.Grid.Col>
                                            </Ui.Grid.Row>
                                        </fields>
                                    </Ui.Form>
                                </Ui.Tabs.Tab>
                            </Ui.Tabs.Tabs>
                        </Ui.Panel.Body>
                        <Ui.Panel.Footer className="text-right">
                            <Ui.Button type="default" onClick={this.signal('myForm:cancel')} label="Cancel"/>
                            <Ui.Button type="secondary" onClick={this.signal('myForm:reset')} label="Reset"/>
                            <Ui.Button type="primary" onClick={this.signal('myForm:submit')} label="Submit"/>
                        </Ui.Panel.Footer>
                    </Ui.Panel.Panel>
                </Ui.FormContainer>
            </Webiny.Builder.View>
        );
    }
}

export default Form;
