import React from 'react';
import Webiny from 'webiny';

class SystemApiTokenModal extends Webiny.Ui.ModalComponent {

    constructor(props) {
        super(props);

        this.state = {
            confirmed: false
        };
    }

    renderDialog() {
        const {Button, Modal, Link, Copy, Alert, Grid, Label} = this.props;
        let showToken = (
            <Button
                type="primary"
                label="I'm well aware of possible consequences of sharing this token. Reveal it!"
                onClick={() => this.setState({confirmed: true})}/>
        );

        if (this.state.confirmed) {
            showToken = <Copy.Input value={this.props.token}/>;
        }

        return (
            <Modal.Dialog>
                <Modal.Content>
                    <Modal.Header title="System API token"/>
                    <Modal.Body>
                        <Alert type="info">
                            To grant access to your API to 3rd party clients,&nbsp;
                            <Link onClick={() => this.hide().then(() => this.props.createToken())}>
                                Create a new API token
                            </Link>.
                        </Alert>

                        <p>
                            System API token allows its bearer to access resources exposed by your API.
                            <br/>This system token is not meant to be shared, it is for your system only!
                            <br/><br/>
                            Use it when you need to make internal API calls, by sending a <Label inline>X-Webiny-Authorization</Label>
                            header.
                        </p>
                        <Grid.Row>
                            <Grid.Col all={12} className="text-center">
                                {showToken}
                            </Grid.Col>
                        </Grid.Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Link type="default" align="left" route="ApiLogs.List" params={{token: 'system'}}>View logs</Link>
                        <Button label="Close" onClick={this.hide}/>
                    </Modal.Footer>
                </Modal.Content>
            </Modal.Dialog>
        );
    }
}

export default Webiny.createComponent(SystemApiTokenModal, {
    modules: ['Button', 'Modal', 'Link', 'Copy', 'Alert', 'Grid', 'Label']
});