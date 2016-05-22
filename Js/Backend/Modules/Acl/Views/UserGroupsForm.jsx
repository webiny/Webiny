/* eslint-disable */
import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const Table = Ui.List.Table;

class UserGroupsForm extends Webiny.Ui.View {

}

UserGroupsForm.defaultProps = {
    renderer() {
        const containerProps = {
            api: '/entities/core/user-groups',
            fields: 'id,name,tag',
            connectToRouter: true,
            onSubmitSuccess: 'UserGroups.List',
            onCancel: 'UserGroups.List',
            onSuccessMessage: (record) => {
                return <span>User group <strong>{record.name}</strong> saved!</span>;
            }
        };

        return (
            <Ui.Form.Container {...containerProps}>
                {(model, container) => (
                    <Ui.Grid.Col all={12}>
                        <Ui.Panel.Panel>
                            <Ui.Panel.Header title="User Group"/>
                            <Ui.Panel.Body>
                                <Ui.Form.Error container={container}/>
                            </Ui.Panel.Body>
                            <Ui.Panel.Footer className="text-right">
                                <Ui.Button type="default" onClick={container.cancel} label="Cancel"/>
                                <Ui.Button type="primary" onClick={container.submit} label="Submit"/>
                            </Ui.Panel.Footer>
                        </Ui.Panel.Panel>
                    </Ui.Grid.Col>
                )}
            </Ui.Form.Container>
        );
    }
};

export default UserGroupsForm;
