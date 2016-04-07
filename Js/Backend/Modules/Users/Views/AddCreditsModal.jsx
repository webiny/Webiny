import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

// TODO: maybe create a Webiny.Ui.ModalComponent that will handle show/hide/onHide/onShow methods

class AddCreditsModal extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.state = {
            error: false,
            isShown: false,
            extraData: {},
            model: {
                credits: 0
            }
        };

        this.bindMethods('addCredits,show,hide');
    }

    /**
     * @param model Submitted form data
     * @param container Form container instance that handled the forms
     * @returns {*}
     */
    addCredits(model, container) {
        this.setState({model, error: false});
        const api = new Webiny.Api.Entity('/core/users');
        return api.post('call', model).then(ar => {
            if (ar.isError() && ar.getCode() === 'WBY-ENTITY-API-METHOD-VALIDATION') {
                return this.setState({error: ar.getData().credits});
            }

            this.hide();
        });
    }

    hide() {
        this.setState({isShown: false});
    }

    show() {
        this.setState({isShown: true});
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

        return (
            <Ui.Modal.Dialog show={this.state.isShown} onHide={this.hide}>
                <Ui.Modal.Header title="Add credits"/>
                <Ui.Modal.Body>
                    <Ui.Form.Container data={this.state.model} ui="addCreditsForm" onSubmit={this.addCredits}>
                        <Ui.Form.Form layout={false}>
                            <fields>
                                <Ui.Grid.Row>
                                    {error}
                                    <Ui.Grid.Col all={12}>
                                        <Ui.Input label="Credits" name="credits" validate="required"/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                            </fields>
                        </Ui.Form.Form>
                    </Ui.Form.Container>
                </Ui.Modal.Body>
                <Ui.Modal.Footer>
                    <Ui.Button label="Cancel" onClick={this.ui('addCreditsModal:hide')}/>
                    <Ui.Button label="Add credits" onClick={this.ui('addCreditsForm:submit')}/>
                </Ui.Modal.Footer>
            </Ui.Modal.Dialog>
        );
    }
}

export default AddCreditsModal;