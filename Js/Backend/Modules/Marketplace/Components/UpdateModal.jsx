import React from 'react';
import Webiny from 'webiny';
import styles from './../Views/styles.css';

class InstallModal extends Webiny.Ui.ModalComponent {
    constructor(props) {
        super(props);

        // started - installation has started
        // ended - API call has ended
        // finished - installation reached 100%

        this.state = {messages: [], started: false, ended: false, progress: 0, finished: false};

        this.bindMethods('startUpdate,onClose');
    }

    startUpdate() {
        // Before we begin the update - we need to disable React Hot Loader to prevent possible errors during installation since webpack is still watching
        __REACT_HOT_LOADER__ = null;
        const {Progress} = this.props;
        this.setState({started: true});
        const api = new Webiny.Api.Endpoint('/services/webiny/marketplace');
        let currentResponseLength = false;

        // Add initial message
        const messages = this.state.messages;
        messages.push({message: 'Fetching app details...'});
        this.setState({messages});

        api.setConfig({
            downloadProgress: e => {
                let response = e.currentTarget.response || '';
                if (currentResponseLength === false) {
                    currentResponseLength = response.length;
                }
                else {
                    const newLength = response.length;
                    response = response.substring(currentResponseLength);
                    currentResponseLength = newLength;
                }

                const messages = this.state.messages;
                // We may receive multiple messages in a single line so we need to handle them using a delimiter
                response.split("_-_").filter(l => l.length).map(line => {
                    try {
                        const res = JSON.parse(line);
                        if (res.roles) {
                            Webiny.Model.set(['User', 'roles'], res.roles);
                        }

                        if (res.progress) {
                            const lastMessage = messages.length - 1;
                            messages[lastMessage].message = <Progress value={parseInt(res.progress)}/>;
                            this.setState({messages, progress: parseInt(res.progress), finished: res.progress === 100});
                        }

                        if (res.message) {
                            messages.push(res);
                            this.setState({messages, time: new Date().getTime()});
                        }
                    } catch (e) {

                    }
                });
            }
        });

        return api.get(`apps/${this.props.app.id}/install`).then(() => {
            this.setState({ended: true});
            if (this.state.finished) {
                setTimeout(() => {
                    this.hide().then(() => this.props.onUpdated());
                }, 2000);
            }
        });
    }

    componentDidUpdate() {
        super.componentDidUpdate();
        if (this.logger) {
            this.logger.scrollTop = 10000;
        }
    }

    resetState() {
        this.setState({messages: [], started: false, ended: false, progress: 0, finished: false});
    }

    show() {
        this.resetState();
        return super.show();
    }

    onClose() {
        if (!this.state.started || this.state.ended) {
            this.hide();
        }
    }

    renderDialog() {
        const {Modal, Button, Link, Grid, Logic, Alert} = this.props;

        return (
            <Modal.Dialog closeOnClick={!this.state.started || this.state.ended} onClose={this.onClose}>
                <Modal.Content>
                    <Modal.Header onClose={this.onClose} title="Update"/>
                    <Modal.Body>
                        <Logic.Hide if={this.state.started}>
                            <Alert type="warning" title="Notice">
                                Make sure your watch process is running before updating the app.
                            </Alert>
                            <div className="text-center">
                                <Button type="primary" label="Begin Update" onClick={this.startUpdate}/>
                            </div>
                        </Logic.Hide>
                        <Logic.Hide if={!this.state.started}>
                            <Logic.Show if={this.state.finished}>
                                <Alert type="success" title="Done">
                                    Your app is updated!
                                </Alert>
                            </Logic.Show>
                            <pre style={{height: 500, overflow: 'scroll', fontSize: 12}} ref={ref => this.logger = ref}>
                            {this.state.messages.map((m, i) => (
                                <div key={i}>{m.message}</div>
                            ))}
                            </pre>
                        </Logic.Hide>
                    </Modal.Body>
                    {(this.state.finished || this.state.ended) && (
                        <Modal.Footer>
                            <Button align="right" label="Close" onClick={this.hide}/>
                        </Modal.Footer>
                    )}
                </Modal.Content>
            </Modal.Dialog>
        );
    }
}

export default Webiny.createComponent(InstallModal, {styles, modules: ['Modal', 'Button', 'Link', 'Grid', 'Logic', 'Alert', 'Progress']});