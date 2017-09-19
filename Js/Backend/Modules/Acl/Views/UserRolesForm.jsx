import React from 'react';
import Webiny from 'webiny';

class Form extends Webiny.Ui.View {

}

Form.defaultProps = {
    renderer() {
        const formProps = {
            api: '/entities/webiny/user-roles',
            fields: '*,permissions,isAdminRole',
            connectToRouter: true,
            onSubmitSuccess: 'UserRoles.List',
            onCancel: 'UserRoles.List',
            onSuccessMessage: (record) => {
                return <span>Role <strong>{record.name}</strong> was saved successfully!</span>;
            }
        };

        const {Ui} = this.props;

        return (
            <Ui.Form {...formProps}>
                {(model, form) => (
                    <Ui.View.Form>
                        <Ui.View.Header title={model.id ? 'ACL - Edit Role' : 'ACL - Create Role'}/>
                        <Ui.View.Body>
                            <Ui.Section title="General"/>
                            <Ui.Grid.Row>
                                <Ui.Grid.Col all={6}>
                                    <Ui.Input label="Name" name="name" validate="required"/>
                                </Ui.Grid.Col>
                                <Ui.Grid.Col all={6}>
                                    <Ui.Input label="Slug" name="slug" validate="required"/>
                                </Ui.Grid.Col>
                            </Ui.Grid.Row>
                            <Ui.Grid.Row>
                                <Ui.Grid.Col all={12}>
                                    <Ui.Input label="Description" name="description" validate="required"/>
                                </Ui.Grid.Col>
                                <Ui.Grid.Col all={12}>
                                    <Ui.Switch label="Is admin role?" name="isAdminRole"
                                               description="If enabled, this role will be assigned to the admin user who is installing the corresponding app"/>
                                </Ui.Grid.Col>
                            </Ui.Grid.Row>
                            <Ui.UserPermissions name="permissions"/>
                        </Ui.View.Body>
                        <Ui.View.Footer>
                            <Ui.Button type="default" onClick={form.cancel} label="Go back"/>
                            <Ui.Button type="primary" onClick={form.submit} label="Save role" align="right"/>
                        </Ui.View.Footer>
                    </Ui.View.Form>
                )}
            </Ui.Form>
        );
    }
};

export default Webiny.createComponent(Form, {
    modulesProp: 'Ui',
    modules: [
        'Switch', 'Form', 'View', 'Tabs', 'Input', 'Button', 'Grid', 'Section',
        {UserPermissions: 'Webiny/Backend/UserPermissions'}
    ]
});
