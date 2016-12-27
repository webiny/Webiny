import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class SystemApiTokenModal extends Webiny.Ui.ModalComponent {

    constructor(props) {
        super(props);

        this.state = {
            confirmed: false
        };
    }

    renderDialog() {
        let showToken = (
            <Ui.Button
                type="primary"
                label="I'm well aware of possible consequences of sharing this token. Reveal it!"
                onClick={() => this.setState({confirmed: true})}/>
        );

        if (this.state.confirmed) {
            showToken = <Ui.Copy.Input value={this.props.token}/>;
        }

        return (
            <Ui.Modal.Dialog>
                <Ui.Modal.Header title="System API token"/>
                <Ui.Modal.Body>
                    <Ui.Alert type="info">
                        To grant access to your API to 3rd party clients,&nbsp;
                        <Ui.Link onClick={() => this.hide().then(() => this.props.createToken())}>create a new API token</Ui.Link>.
                    </Ui.Alert>

                    <p>
                        System API token allows its bearer to access resources exposed by your API.
                        <br/>This system token is not meant to be shared, it is for your system only!
                        <br/><br/>
                        Use it when you need to make internal API calls, by sending a <Ui.Label inline>X-Webiny-Authorization</Ui.Label>
                        header.
                    </p>
                    <Ui.Grid.Row>
                        <Ui.Grid.Col all={12} className="text-center">
                            {showToken}
                        </Ui.Grid.Col>
                    </Ui.Grid.Row>
                </Ui.Modal.Body>
                <Ui.Modal.Footer>
                    <Ui.Link type="default" align="left" route="ApiTokens.Logs" params={{token: 'system'}}>View logs</Ui.Link>
                    <Ui.Button label="Close" onClick={this.hide}/>
                </Ui.Modal.Footer>
            </Ui.Modal.Dialog>
        );
    }
}

export default SystemApiTokenModal;