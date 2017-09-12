import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';

class ExportRoleModal extends Webiny.Ui.ModalComponent {

    constructor(props) {
        super(props);

        this.state = {
            content: '',
            loading: true
        };
    }

    componentWillMount() {
        super.componentWillMount();
        const _fields = 'name,slug,isAdminRole,description,permissions[slug]';
        const api = new Webiny.Api.Endpoint('/entities/webiny/user-roles');
        return api.get(this.props.role.id, {_fields}).then(response => {
            const role = response.getData('entity');
            role.permissions = _.map(role.permissions, 'slug');
            delete role.id;

            this.setState({
                loading: false,
                content: JSON.stringify(role, null, 4)
            });
        });
    }

    renderDialog() {
        const {Modal, Button, Copy, CodeHighlight, Loader} = this.props;
        return (
            <Modal.Dialog>
                <Modal.Content>
                    <Modal.Header title="Export Role"/>
                    <Modal.Body style={this.state.loading ? {height: 200} : {}} noPadding>
                        {this.state.loading ? <Loader/> : <CodeHighlight language="json">{this.state.content}</CodeHighlight>}
                    </Modal.Body>
                    <Modal.Footer>
                        <Copy.Button label="Copy" type="primary" value={this.state.content} renderIf={this.state.content}/>
                    </Modal.Footer>
                </Modal.Content>
            </Modal.Dialog>
        );
    }
}

export default Webiny.createComponent(ExportRoleModal, {modules: ['Modal', 'Button', 'Copy', 'CodeHighlight', 'Loader']});