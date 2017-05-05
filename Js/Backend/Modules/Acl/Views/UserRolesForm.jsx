/* eslint-disable */
import Webiny from 'Webiny';

class Form extends Webiny.Ui.View {

}

Form.defaultProps = {
    renderer() {
        const containerProps = {
            api: '/entities/core/user-roles',
            fields: '*,permissions',
            connectToRouter: true,
            onSubmitSuccess: 'UserRoles.List',
            onCancel: 'UserRoles.List',
            onSuccessMessage: (record) => {
                return <span>Role <strong>{record.name}</strong> was saved successfully!</span>;
            }
        };

        const modules = [
            'Switch', 'Form', 'View', 'Tabs', 'Input', 'Button', 'Grid',
            {UserPermissions: 'Core/Backend/UserPermissions'}
        ];

        return (
            <Webiny.Ui.LazyLoad modules={modules}>
                {(Ui) => (
                    <Ui.Form ui="myForm" {...containerProps}>
                        {(model, container) => (
                            <Ui.View.Form>
                                <Ui.View.Header title={model.id ? 'ACL - Edit Role' : 'ACL - Create Role'}/>
                                <Ui.View.Body noPadding>
                                    <Ui.Tabs size="large">
                                        <Ui.Tabs.Tab label="General" icon="fa-unlock-alt">
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
                                            </Ui.Grid.Row>
                                            <Ui.UserPermissions name="permissions"/>
                                        </Ui.Tabs.Tab>
                                    </Ui.Tabs>
                                </Ui.View.Body>
                                <Ui.View.Footer>
                                    <Ui.Button type="default" onClick={container.cancel} label="Go back"/>
                                    <Ui.Button type="primary" onClick={container.submit} label="Save role" align="right"/>
                                </Ui.View.Footer>
                            </Ui.View.Form>
                        )}
                    </Ui.Form>
                )}
            </Webiny.Ui.LazyLoad>
        );
    }
};

export default Form;
