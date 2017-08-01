import React from 'react';
import Webiny from 'webiny';

class ExportPermissionModal extends Webiny.Ui.ModalComponent {

    constructor(props) {
        super(props);

        this.state = {
            content: ''
        };
    }

    componentWillMount() {
        super.componentWillMount();
        const _fields = 'name,slug,description,permissions';
        const api = new Webiny.Api.Endpoint('/entities/webiny/user-permissions');
        return api.get(this.props.permission.id, {_fields}).then(response => {
            const data = response.getData('entity');
            delete data.id;

            this.setState({
                content: JSON.stringify(data, null, 4)
            });
        });
    }

    renderDialog() {
        const {Modal, Data, Copy, CodeHighlight} = this.props;
        return (
            <Modal.Dialog wide>
                <Modal.Content>
                    <Modal.Header title="Export Role"/>
                    <Modal.Body>
                        <CodeHighlight language="json">{this.state.content}</CodeHighlight>
                    </Modal.Body>
                    <Modal.Footer>
                        <Copy.Button label="Copy" type="primary" value={this.state.content} renderIf={this.state.content}/>
                    </Modal.Footer>
                </Modal.Content>
            </Modal.Dialog>
        );
    }
}

export default Webiny.createComponent(ExportPermissionModal, {modules: ['Modal', 'Data', 'Copy', 'CodeHighlight']});