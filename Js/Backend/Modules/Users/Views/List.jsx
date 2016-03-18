import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class List extends Webiny.Ui.View {

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
                    console.info('Form submitted: ', model);
                },

                onInvalid: function onInvalidl() {
                    // This will be passed as Form's `onInvalid` prop
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
                            return  (
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
                    return  (
                        <div>
                            <strong>{item.firstName} {item.lastName}</strong><br/>
                            <span>Email: {item.email}</span>
                        </div>
                    );
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
                <Ui.Form ui="myForm">
                    <fields>
                        <Ui.Grid.Row>
                            <Ui.Grid.Col all={12}>
                                <Ui.Input label="Email" name="email" validate="required,email"/>
                            </Ui.Grid.Col>
                        </Ui.Grid.Row>
                    </fields>
                    <actions>
                        <Ui.Button type="default" onClick={this.signal('myForm:cancel')} label="Cancel"/>
                        <Ui.Button type="secondary" onClick={this.signal('myForm:reset')} label="Reset"/>
                        <Ui.Button type="primary" onClick={this.signal('myForm:submit')} label="Submit"/>
                    </actions>
                </Ui.Form>
            </Webiny.Builder.View>
        );
    }
}

export default List;
