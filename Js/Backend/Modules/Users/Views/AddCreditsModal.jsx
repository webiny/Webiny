import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

// TODO: maybe create a Webiny.Ui.ModalComponent that will handle show/hide/onHide/onShow methods

class AddCreditsModal extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.state = {
            error: false,
            extraData: {},
            model: {
                credits: 0
            }
        };

        Webiny.Tools.Validator.addValidator('cronFrequency', (val) => {
            const api = new Webiny.Api.Endpoint('/entities/core/users');

            return api.post('call', {mask: val}).then(ar => {
                throw new Error('Message');
            });
        });

        this.bindMethods('addCredits,show,hide,generateSlug');
    }

    /**
     * @param model Submitted form data
     * @param container Form container instance that handled the forms
     * @returns {*}
     */
    addCredits(model) {
        this.setState({model, error: false});
        const api = new Webiny.Api.Endpoint('/entities/core/users');
        return api.post('call', model).then(ar => {
            if (ar.isError() && ar.getCode() === 'WBY-ENTITY-API-METHOD-VALIDATION') {
                return this.setState({error: ar.getData().credits});
            }

            this.hide();
        });
    }

    generateSlug(value) {
        console.log("GENERATE SLUG", value);
        const api = new Webiny.Api.Endpoint('/entities/core/users');

        return api.post('call', {data: value}).then(ar => {
            this.setState({error: 'Neki glupi error!'});
        });
    }

    hide() {
        this.refs.dialog.hide();
    }

    show() {
        this.refs.dialog.show();
    }

    render() {
        let error = null;

        if (this.state.error) {
            error = (
                <div className="alert alert-danger" role="alert">
                    <span className="icon icon-cancel-circled"></span>
                    <button type="button" className="close" data-dismiss="alert">
                        <span aria-hidden="true">×</span>
                    </button>
                    <strong>Oh snap!</strong> {this.state.error}
                </div>
            );
        }

        const formProps = {
            ui: 'addCreditsForm',
            api: '/entities/core/users',
            fields: 'id,firstName,lastName,email,userGroups,settings,enabled,userQuery',
            connectToRouter: true
        };

        const searchProps = {
            validate: 'required',
            name: 'userQuery',
            textAttr: 'name',
            label: 'Find file',
            api: '/entities/core/files',
            fields: 'name',
            searchFields: 'name'
        };

        return (
            <Ui.Modal.Dialog ref="dialog">
                <Ui.Modal.Header title="Add credits"/>
                <Ui.Modal.Body>
                    {error}
                    <Ui.Form.ApiContainer {...formProps}>
                        <Ui.Tabs.Tabs ui="myTabs" position="left">
                            <Ui.Tabs.Tab label="First Tab">
                                <Ui.Form.Form layout={false}>
                                    <fields>
                                        <Ui.Grid.Row>
                                            <Ui.Grid.Col all={12}>
                                                <Ui.Input label="Email" name="email" validate="cronFrequency" description="Enter your email or you will be fired!"/>
                                            </Ui.Grid.Col>
                                            <Ui.Grid.Col all={12}>
                                                <Ui.Search {...searchProps}/>
                                            </Ui.Grid.Col>
                                        </Ui.Grid.Row>
                                    </fields>
                                </Ui.Form.Form>
                            </Ui.Tabs.Tab>
                            <Ui.Tabs.Tab label="Second tab" icon="icon-columns">
                                <Ui.Form.Form layout={false} onInvalid={this.ui('modalTabs:selectTab', 1)}>
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
                    </Ui.Form.ApiContainer>
                </Ui.Modal.Body>
                <Ui.Modal.Footer>
                    <Ui.Button type="secondary" label="Cancel" onClick={this.ui('addCreditsModal:hide')}/>
                    <Ui.Button type="primary" label="Add credits" onClick={this.ui('addCreditsForm:submit')}/>
                </Ui.Modal.Footer>
            </Ui.Modal.Dialog>
        );
    }
}

export default AddCreditsModal;