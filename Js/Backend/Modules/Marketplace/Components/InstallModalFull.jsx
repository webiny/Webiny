import React from 'react';
import Webiny from 'webiny';
import styles from './../Views/styles.css';


class InstallModal extends Webiny.Ui.ModalComponent {
    constructor(props) {
        super(props);

        this.state = {
            step: 1
        };
    }

    renderDialog() {
        const {Modal, Button, Link, Grid, Logic, Alert, Progress} = this.props;

        return (
            <Modal.Dialog>
                <Modal.Content>

                    <Modal.Header onClose={this.hide} title="Install"/>

                    <Modal.Body>

                        <Logic.Show if={(this.state.step === 1)}>
                            <Alert type="warning" title="Notice">
                                Make sure you are in the development mode and that your watch process is running before starting the install
                                process.
                            </Alert>
                            <div className="text-center">
                                <Button type="primary" label="Start Installation" onClick={() => {
                                    this.setState({step: 2})
                                }}/>
                            </div>
                        </Logic.Show>

                        <Logic.Show if={(this.state.step === 2)}>
                            <Alert type="info">
                                Downloading app bundle, please wait...
                            </Alert>
                            <Progress value={50}/>

                            <div className="text-center">
                                <Link onClick={() => {
                                    this.setState({step: 3})
                                }}>Proceed to step 3</Link>
                            </div>
                        </Logic.Show>

                        <Logic.Show if={(this.state.step === 3)}>
                            <Alert type="info">
                                Bundle downloaded, running the install process.
                            </Alert>
                            <Progress value={75}/>

                            <div className="text-center">
                                <Link onClick={() => {
                                    this.setState({step: 4})
                                }}>Proceed to step 4</Link>
                            </div>
                        </Logic.Show>

                        <Logic.Show if={(this.state.step === 4)}>
                            <Alert type="success" title="Done">
                                Installation complete. Refresh your browser to load the new app.
                            </Alert>
                            <Progress value={100}/>
                            <br/>
                            <div className="text-center">
                                <Button type="primary" label="Refresh" onClick={() => {
                                    location.reload();
                                }}/>
                            </div>
                        </Logic.Show>

                    </Modal.Body>
                    <Modal.Footer>

                    </Modal.Footer>
                </Modal.Content>
            </Modal.Dialog>
        );
    }
}

export default Webiny.createComponent(InstallModal, {styles, modules: ['Modal', 'Button', 'Link', 'Grid', 'Logic', 'Alert', 'Progress']});