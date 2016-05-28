/* eslint-disable */
import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const Table = Ui.List.Table;

class Form extends Webiny.Ui.View {

}

Form.defaultProps = {
    renderer() {
        const containerProps = {
            api: '/entities/core/users',
            fields: 'id,firstName,lastName,email,userGroups,settings,enabled,avatar,gallery',
            connectToRouter: true,
            onSubmitSuccess: 'Users.List',
            onCancel: 'Users.List',
            onSuccessMessage: (record) => {
                return <span>User <strong>{record.firstName}</strong> was saved successfully!</span>;
            }
        };

        const inlineContainerProps = {
            id: Webiny.Router.getParams('id'),
            api: '/entities/core/users',
            fields: 'id,firstName,email',
            onSuccessMessage: (record) => {
                return <span>User <strong>{record.firstName}</strong> was saved successfully!</span>;
            }
        };

        const deleteConfirmProps = {
            ui: 'deleteConfirm',
            title: 'You need you to confirm this action',
            message: 'Do you really want to delete this record?',
            confirm: 'Yes, very!',
            cancel: 'Nope',
            onConfirm: modal => {
                modal.hide();
            }
        };

        const changeConfirmProps = {
            message: newValue => {
                if (newValue && newValue.id !== '56a905eff31cd07c458b456b') {
                    return `Do you really want to change selection to ${newValue.src}?`;
                }
                return null;
            },
            onCancel: form => {
                return form.getInitialModel('avatar');
            }
        };

        const avatarConfirmProps = {
            message: (newValue, oldValue) => {
                return `Set new avatar?`;
            }
        };

        return (
            <Ui.Form.Container ui="myForm" {...containerProps}>
                {(model, container) => (
                    <Ui.Grid.Col all={12}>
                        <Ui.Panel.Panel>
                            <Ui.Modal.Confirmation {...deleteConfirmProps}/>
                            <Ui.Button type="primary" label="Delete user" align="right" onClick={this.ui('deleteConfirm:show')}/>
                            <Ui.Panel.Header title="Users Form"/>
                            <Ui.Panel.Body>
                                <Ui.Form.Error message="Something went wrong during save" container={container}/>
                                <Ui.Tabs.Tabs>
                                    <Ui.Tabs.Tab label="General">
                                        <Ui.Grid.Row>
                                            <Ui.Grid.Col all={6}>
                                                <Ui.Input label="First name" name="firstName" validate="required"/>
                                            </Ui.Grid.Col>
                                            <Ui.Grid.Col all={6}>
                                                <Ui.Input label="Last name" name="lastName" validate="required"/>
                                            </Ui.Grid.Col>
                                            <Ui.Grid.Col all={6}>
                                                <Ui.Input label="Email" name="email" description="Your email"/>
                                            </Ui.Grid.Col>
                                            <Ui.Grid.Col all={6}>
                                                <Ui.ChangeConfirm {...changeConfirmProps}>
                                                    <Ui.Search
                                                        name="document"
                                                        label="Document"
                                                        placeholder="Select a document"
                                                        api="/entities/core/files"
                                                        fields="name"
                                                        searchFields="name"
                                                        useDataAsValue/>
                                                </Ui.ChangeConfirm>
                                            </Ui.Grid.Col>
                                            <Ui.Grid.Col all={12}>
                                                <Ui.Textarea label="Notes" name="notes" description="User notes"/>
                                            </Ui.Grid.Col>
                                        </Ui.Grid.Row>
                                        <Ui.Grid.Row>
                                            <Ui.Grid.Col all={12}>
                                                <Ui.Switch label="Enabled" name="enabled"/>
                                            </Ui.Grid.Col>
                                        </Ui.Grid.Row>
                                    </Ui.Tabs.Tab>
                                    <Ui.Tabs.Tab label="Files" onClick={this.ui('files:loadData')}>
                                        <Ui.ChangeConfirm {...avatarConfirmProps}>
                                            <Ui.Files.Avatar
                                                name="avatar"
                                                cropper={{
                                                        title: 'Crop your avatar',
                                                        config: {
                                                            aspectRatio: 1,
                                                            autoCropArea: 1,
                                                            guides: false,
                                                            strict: true,
                                                            width: 400,
                                                            height: 400,
                                                            cropBoxResizable: false
                                                        }}}/>
                                        </Ui.ChangeConfirm>
                                        <Ui.Files.Gallery
                                            defaultBody={{ref: Webiny.Router.getParams('id')}}
                                            name="gallery"
                                            newCropper={{
                                                         title: 'Crop your new image',
                                                         action: 'Upload image',
                                                         config: {
                                                             closeOnClick: false,
                                                             autoCropArea: 0.7,
                                                             guides: false,
                                                             strict: true,
                                                             mouseWheelZoom: false,
                                                             touchDragZoom: false
                                                         }
                                                         }}
                                            editCropper={{
                                                         title: 'Edit your image',
                                                         action: 'Save changes',
                                                         config: {
                                                             closeOnClick: true,
                                                             autoCropArea: 1,
                                                             guides: false,
                                                             strict: true,
                                                             mouseWheelZoom: false,
                                                             touchDragZoom: false
                                                         }
                                                     }}/>

                                        <h2>Files list</h2>
                                        <Ui.List.ApiContainer ui="files" autoLoad={false} api="/entities/core/files"
                                                              fields="id,name,type,size" perPage={3}>
                                            <Table.Table>
                                                <Table.Row>
                                                    <Table.Field name="name" align="left" label="Name"/>
                                                    <Table.Field name="type" align="left" label="Type" sort="type"/>
                                                    <Table.FileSizeField name="size" label="Size"/>
                                                </Table.Row>
                                            </Table.Table>
                                            <Ui.List.Pagination size="small"/>
                                        </Ui.List.ApiContainer>
                                    </Ui.Tabs.Tab>
                                    <Ui.Tabs.Tab label="Form">
                                        <Ui.Form.Container ui="inlineForm" {...inlineContainerProps}>
                                            {(model, form) => (
                                                <Ui.Grid.Row>
                                                    <Ui.Form.Error container={form}>
                                                        {error => <Ui.Alert title="Hmmm..." type="info">Not sure what
                                                            happened...</Ui.Alert>}
                                                    </Ui.Form.Error>
                                                    <Ui.Grid.Col all={6}>
                                                        <Ui.Input label="First name" name="firstName" validate="required"/>
                                                    </Ui.Grid.Col>
                                                    <Ui.Grid.Col all={4}>
                                                        <Ui.Input label="Email" name="email" description="Your email"/>
                                                    </Ui.Grid.Col>
                                                    <Ui.Grid.Col all={2}>
                                                        <Ui.Button type="primary" onClick={form.submit} label="Save"/>
                                                    </Ui.Grid.Col>
                                                </Ui.Grid.Row>
                                            )}
                                        </Ui.Form.Container>
                                    </Ui.Tabs.Tab>
                                </Ui.Tabs.Tabs>
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

export default Form;
