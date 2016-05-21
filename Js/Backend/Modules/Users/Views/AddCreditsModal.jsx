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

        this.bindMethods('show,hide');
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
                    <Ui.Form.Container {...formProps}>
                        {() => (
                            <Ui.Tabs.Tabs ui="myTabs" position="left">
                                <Ui.Tabs.Tab label="First Tab">
                                    <Ui.Grid.Row>
                                        <Ui.Grid.Col all={12}>
                                            <Ui.Input
                                                label="Email"
                                                name="email"
                                                validate="cronFrequency"
                                                description="Enter your email or you will be fired!"/>
                                        </Ui.Grid.Col>
                                        <Ui.Grid.Col all={12}>
                                            <Ui.Search {...searchProps}/>
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
                        )}
                    </Ui.Form.Container>
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