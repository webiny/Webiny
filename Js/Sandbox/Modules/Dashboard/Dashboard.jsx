import Webiny from 'Webiny';

class Dashboard extends Webiny.Ui.View {
    constructor(props) {
        super(props);

        const {Draft} = props;

        this.infoId = null; // for growl

        this.plugins = [
            new Draft.Plugins.Heading(),
            new Draft.Plugins.Bold(),
            new Draft.Plugins.Italic(),
            new Draft.Plugins.Underline(),
            new Draft.Plugins.UnorderedList(),
            new Draft.Plugins.OrderedList(),
            new Draft.Plugins.Alignment(),
            new Draft.Plugins.Link(),
            new Draft.Plugins.Blockquote(),
            new Draft.Plugins.Table(),
            new Draft.Plugins.Code(),
            new Draft.Plugins.Video(),
            new Draft.Plugins.CodeBlock(),
            new Draft.Plugins.ToJSON()
        ];

        this.bindMethods('growlInfo,growlWarning');
    }

    growlInfo() {
        Webiny.Growl.info('A friendly info!', 'New info available', true).then(growlId => this.infoId = growlId);
    }

    growlSuccess() {
        Webiny.Growl.success('You did it!', 'Success!', false, 5000);
    }

    growlDanger() {
        Webiny.Growl.danger('Some things went terribly wrong...', 'Watch out!', true);
    }

    growlWarning() {
        Webiny.Growl.warning(
            <div>
                You can even use components here:
                <Webiny.Ui.LazyLoad modules={['Button']}>
                    {(Ui) => (
                        <Ui.Button
                            onClick={() => Webiny.Growl.remove(this.infoId)}
                            label="Close info growl"/>
                    )}
                </Webiny.Ui.LazyLoad>
            </div>,
            'You should investigate',
            true
        );
    }

}

Dashboard.defaultProps = {
    renderer() {
        const DraftEditor = this.props.Draft.Editor;

        const modules = [
            'Alert',
            'Avatar',
            'Button',
            'ButtonGroup',
            'Carousel',
            'ChangeConfirm',
            'Checkbox',
            'CheckboxGroup',
            'ClickConfirm',
            'ClickSuccess',
            'CodeEditor',
            'CodeHighlight',
            'Copy',
            'DateTime',
            'Date',
            'Dropdown',
            'Email',
            'Fieldset',
            'Draft',
            'File',
            'Form',
            'Gallery',
            'GoogleMap',
            'Gravatar',
            'HtmlEditor',
            'Icon',
            'IconPicker',
            'Image',
            'ImageUploader',
            'Input',
            'Label',
            'List',
            'MarkdownEditor',
            'Panel',
            'Password',

            'Link',
            'DownloadLink',

            'Grid',
            'Time',
            'DateRange'
        ];
        const src = "https://scontent-amt2-1.xx.fbcdn.net/v/t31.0-8/17855125_536372119866416_7405702212874834803_o.jpg?oh=386fe327a0899af7461322ff3b00177b&oe=5987F465";
        return (
            <Webiny.Ui.LazyLoad modules={modules}>
                {(Ui) => (
                    <Ui.Form>
                        {(model) => (
                            <div style={{margin: "15px"}}>
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={6}>
                                        <h2>Alert</h2>
                                        <Ui.Alert type="info" title="Well done!" close={true}>You successfully read this important alert
                                            message.</Ui.Alert>
                                        <Ui.Alert type="success" title="Well done!">You successfully read this important alert
                                            message.</Ui.Alert>
                                        <Ui.Alert type="warning" title="Well done!">You successfully read this important alert
                                            message.</Ui.Alert>
                                        <Ui.Alert type="error" title="Well done!">You successfully read this important alert
                                            message.</Ui.Alert>
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={6}>
                                        <h2>Avatar</h2>
                                        <Ui.Avatar
                                            name="avatar"
                                            cropper={{
                                                title: 'Crop your image',
                                                action: 'Upload image',
                                                config: {
                                                    closeOnClick: false,
                                                    autoCropArea: 0.7,
                                                    aspectRatio: 1,
                                                    width: 300,
                                                    height: 300
                                                }
                                            }}/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                                <hr/>

                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={6}>
                                        <h2>Button</h2>
                                        <Ui.Button type="primary" icon="icon-plus-circled" label="Create" onClick={() => alert('Hi!')}/>
                                        <Ui.Button type="secondary" icon="icon-plus-circled" label="Create" onClick={() => alert('Hi!')}/>
                                        <Ui.Button type="default" icon="icon-plus-circled" label="Create" onClick={() => alert('Hi!')}/>
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={6}>
                                        <h2>ButtonGroup</h2>
                                        <Ui.ButtonGroup>
                                            <Ui.Button type="primary" icon="icon-plus-circled" label="Create" onClick={() => alert('Hi!')}/>
                                            <Ui.Button type="secondary" icon="icon-plus-circled" label="Create"
                                                       onClick={() => alert('Hi!')}/>
                                            <Ui.Button type="default" icon="icon-plus-circled" label="Create" onClick={() => alert('Hi!')}/>
                                        </Ui.ButtonGroup>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                                <hr/>

                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={6}>
                                        <h2>Carousel</h2>
                                        <Ui.Carousel items="3">
                                            <div style={{backgroundColor: "#ff3f4d"}}>
                                                <h2 style={{padding: "5rem 0", color: "#fff"}}>Swipe</h2>
                                            </div>
                                            <div style={{backgroundColor: "#ff3f4d"}}>
                                                <h2 style={{padding: "5rem 0", color: "#fff"}}>Drag</h2>
                                            </div>
                                            <div style={{backgroundColor: "#ff3f4d"}}>
                                                <h2 style={{padding: "5rem 0", color: "#fff"}}>Responsive</h2>
                                            </div>
                                            <div style={{backgroundColor: "#ff3f4d"}}>
                                                <h2 style={{padding: "5rem 0", color: "#fff"}}>CSS3</h2>
                                            </div>
                                            <div style={{backgroundColor: "#ff3f4d"}}>
                                                <h2 style={{padding: "5rem 0", color: "#fff"}}>Fast</h2>
                                            </div>
                                            <div style={{backgroundColor: "#ff3f4d"}}>
                                                <h2 style={{padding: "5rem 0", color: "#fff"}}>Easy</h2>
                                            </div>
                                            <div style={{backgroundColor: "#ff3f4d"}}>
                                                <h2 style={{padding: "5rem 0", color: "#fff"}}>Free</h2>
                                            </div>
                                            <div style={{backgroundColor: "#ff3f4d"}}>
                                                <h2 style={{padding: "5rem 0", color: "#fff"}}>Upgradable</h2>
                                            </div>
                                            <div style={{backgroundColor: "#ff3f4d"}}>
                                                <h2 style={{padding: "5rem 0", color: "#fff"}}>Tons of options</h2>
                                            </div>
                                            <div style={{backgroundColor: "#ff3f4d"}}>
                                                <h2 style={{padding: "5rem 0", color: "#fff"}}>Infinity</h2>
                                            </div>
                                            <div style={{backgroundColor: "#ff3f4d"}}>
                                                <h2 style={{padding: "5rem 0", color: "#fff"}}>Auto Width</h2>
                                            </div>
                                        </Ui.Carousel>
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={6}>
                                        <h2>ChangeConfirm</h2>
                                        // pending dependency upon Switch component
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                                <hr/>

                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={6}>
                                        <h2>Checkbox</h2>
                                        <Ui.Checkbox label="Single checkbox" name="enabled" grid={12}/>
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={6}>
                                        <h2>CheckboxGroup</h2>
                                        <Ui.CheckboxGroup label="Choose your favorite fruit:" name="fruits" validate="minLength:2">
                                            <option value="strawberry">Strawberry</option>
                                            <option value="blackberry">Blackberry</option>
                                            <option value="mango">Mango</option>
                                            <option value="banana">Banana</option>
                                            <validator name="minLength">Please select at least 2 options</validator>
                                        </Ui.CheckboxGroup>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                                <hr/>

                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={6}>
                                        <h2>ClickConfirm</h2>
                                        <Ui.ClickConfirm message="Do you really want to delete your credit card?">
                                            <Ui.Button type="primary" label="Delete credit card" onClick={() => {
                                                // You can return a promise or any other value
                                                return new Promise(r => {
                                                    setTimeout(r, 1500);
                                                });
                                            }}/>
                                        </Ui.ClickConfirm>
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={6}>
                                        <h2>ClickSuccess</h2>
                                        <Ui.ClickSuccess message="That was easy!">
                                            <Ui.Button type="primary" label="Click me!" onClick={() => {
                                            }}/>
                                        </Ui.ClickSuccess>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                                <hr/>

                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={6}>
                                        <h2>CodeEditor</h2>
                                        <Ui.CodeEditor name="content" description="Enter plain text or HTML content"/>
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={6}>
                                        <h2>CodeHighlight</h2>
                                        <Ui.CodeHighlight>
                                            {`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>Webiny</title>
<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
</head>
<body>
...
</body>
</html>`}
                                        </Ui.CodeHighlight>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                                <hr/>

                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={6}>
                                        <h2>Copy.Button</h2>
                                        <Ui.Copy.Button type="secondary" icon="icon-pencil" value="Clipboard content"
                                                        label="Click to copy!"/>
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={6}>
                                        <h2>Copy.Input</h2>
                                        <Ui.Copy.Input label="Your download link" value="http://download.me/35Tzy7"/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                                <hr/>

                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={6}>
                                        <h2>DateTime</h2>
                                        <Ui.DateTime label="Date & Time" name="datetime" placeholder="Select date and time"/>
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={6}>
                                        <h2>Date</h2>
                                        <Ui.Date label="Date" name="date" placeholder="Select a date" validate="required"/>
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={6}>
                                        <h2>Time</h2>
                                        <Ui.Time label="Time" name="time" placeholder="Select time"/>
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={6}>
                                        <h2>DateRange</h2>
                                        <Ui.DateRange label="Date range" name="daterange" placeholder="Select a date range"/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                                <hr/>

                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={6}>
                                        <h2>Draft</h2>
                                        <DraftEditor
                                            name="draft"
                                            placeholder="Tell a story..."
                                            plugins={this.plugins}/>
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={6}>
                                        <h2>Dropdown</h2>
                                        <Ui.Dropdown title="Actions">
                                            <Ui.Dropdown.Header title="Column"/>
                                            <Ui.Dropdown.Link onClick={() => {
                                            }} icon="fa-plus" title="Insert"/>
                                            <Ui.Dropdown.Link onClick={() => {
                                            }} icon="fa-plus" title="Update"/>
                                            <Ui.Dropdown.Divider/>
                                            <Ui.Dropdown.Link onClick={() => {
                                            }} icon="fa-plus" title="Insert"/>
                                            <Ui.Dropdown.Link onClick={() => {
                                            }} icon="fa-remove" title="Delete"/>
                                        </Ui.Dropdown>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                                <hr/>

                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={6}>
                                        <h2>Email</h2>
                                        <Ui.Email
                                            placeholder="Enter a valid email address"
                                            label="Email"
                                            name="email"
                                            validate="required" // 'email' validator is added automatically
                                            description="Your email will be used for logging in"/>
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={6}>
                                        <h2>Fieldset</h2>
                                        <Ui.Fieldset title="Owner details">
                                            <h4>Inside the fieldset</h4>
                                        </Ui.Fieldset>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                                <hr/>

                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={6}>
                                        <h2>File</h2>
                                        <Ui.File name="file"/>
                                    </Ui.Grid.Col>

                                    <Ui.Grid.Col all={6}>
                                        <h2>Form</h2>
                                        <Ui.Form>
                                            {(model, form) => {
                                                return (
                                                    <Ui.Grid.Row>
                                                        <Ui.Grid.Col xs={12}>
                                                            <Ui.Form.Error/>
                                                            <Ui.Input name="title" label="Title" validate="required"/>
                                                            <Ui.Input name="slug" label="Slug" validate="required"/>
                                                            <Ui.Button type="primary" label="Submit" onClick={form.submit}/>
                                                        </Ui.Grid.Col>
                                                    </Ui.Grid.Row>
                                                );
                                            }}
                                        </Ui.Form>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                                <hr/>

                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={6}>
                                        <h2>Gallery</h2>
                                        <Ui.Gallery
                                            name="gallery"
                                            maxImages={7}
                                            newCropper={{
                                                title: 'Crop your image',
                                                action: 'Upload image',
                                                config: {
                                                    closeOnClick: false,
                                                    autoCropArea: 0.7,
                                                    aspectRatio: 1,
                                                    width: 300,
                                                    height: 300
                                                }
                                            }}/>
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={6}>
                                        <h2>GoogleMap</h2>
                                        <div style={{width: '300px', height: '300px'}}>
                                            <Ui.GoogleMap apiKey="AIzaSyCSATPF__n85eueKyE9UgjNUOpEuvFMmCk"/>
                                        </div>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                                <hr/>

                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={6}>
                                        <h2>Gravatar</h2>
                                        <Ui.Gravatar hash="205e460b479e2e5b48aec07710c08d50"/>
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={6}>
                                        <h2>Growl</h2>
                                        <Ui.Button label="Info" onClick={this.growlInfo}/>
                                        <Ui.Button label="Success" onClick={this.growlSuccess}/>
                                        <Ui.Button label="Danger" onClick={this.growlDanger}/>
                                        <Ui.Button label="Warning" onClick={this.growlWarning}/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                                <hr/>

                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={6}>
                                        <h2>HtmlEditor</h2>
                                        <Ui.HtmlEditor />
                                    </Ui.Grid.Col>

                                    <Ui.Grid.Col all={6}>
                                        <h2>Icon</h2>
                                        <Ui.Icon icon="fa-cog"/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>

                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={6}>
                                        <h2>IconPicker</h2>
                                        <Ui.IconPicker placeholder="Select an icon" label="Icon Picker" name="icon"/>
                                    </Ui.Grid.Col>

                                    <Ui.Grid.Col all={6}>
                                        <h2>Image</h2>
                                        <Ui.Image
                                            name="image"
                                            cropper={{
                                                title: 'Crop your image',
                                                action: 'Upload image',
                                                config: {
                                                    closeOnClick: false,
                                                    autoCropArea: 0.7,
                                                    aspectRatio: 1,
                                                    width: 300,
                                                    height: 300
                                                }
                                            }}/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                                <hr/>

                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={6}>
                                        <h2>ImageUploader</h2>
                                        <Ui.ImageUploader/>
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={6}>
                                        <h2>Input</h2>
                                        <Ui.Input
                                            placeholder="Enter a valid email address"
                                            label="Email"
                                            name="email"
                                            validate="required,email"
                                            info="Only email"
                                            description="Your email will be used for logging in"/>
                                        <br/>
                                        <Ui.Input addonLeft="$" addonRight="USD"/>
                                        <Ui.Input iconRight="fa-user"/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                                <hr/>

                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={6}>
                                        <h2>Label</h2>
                                        <Ui.Label>default</Ui.Label>
                                        <Ui.Label type="info">info</Ui.Label>
                                        <Ui.Label type="primary">primary</Ui.Label>
                                        <Ui.Label type="success">success</Ui.Label>
                                        <Ui.Label type="warning">warning</Ui.Label>
                                        <Ui.Label type="error">error</Ui.Label>
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={6}>

                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                                <hr/>

                                <Ui.Grid.Row style={{backgroundColor: 'white'}}>
                                    <Ui.Grid.Col all={12}>
                                        <h2>List</h2>
                                        <Ui.List
                                            connectToRouter={true}
                                            api="/entities/the-hub/articles"
                                            sort="id"
                                            fields="*, published"
                                            searchFields="title">
                                            <Ui.List.Table>
                                                <Ui.List.Table.Row>
                                                    <Ui.List.Table.RowDetailsField/>

                                                    <Ui.List.Table.Field name="title" align="left" label="Title" sort="title"
                                                                         route="Dashboard"/>
                                                    <Ui.List.Table.Field name="views" align="left" label="Views" sort="views"/>
                                                    <Ui.List.Table.ToggleField name="published" align="center" label="Published"/>

                                                    <Ui.List.Table.Actions>
                                                        <Ui.List.Table.DeleteAction/>
                                                    </Ui.List.Table.Actions>

                                                </Ui.List.Table.Row>

                                                <Ui.List.Table.RowDetails>
                                                    {(data, rowDetails) => {
                                                        return (
                                                            <Ui.List data={data.contacts}>
                                                                <Ui.List.Loader/>
                                                                <Ui.List.Table>
                                                                    <Ui.List.Table.Row>
                                                                        <Ui.List.Table.Field name="key" label="Key"/>
                                                                        <Ui.List.Table.Field name="value" label="Value"/>
                                                                        <Ui.List.Table.Field name="createdBy" label="User ID"/>
                                                                    </Ui.List.Table.Row>
                                                                </Ui.List.Table>
                                                            </Ui.List>
                                                        );
                                                    }}
                                                </Ui.List.Table.RowDetails>
                                            </Ui.List.Table>
                                            <Ui.List.Pagination/>
                                            <Ui.List.MultiActions>
                                                <Ui.List.MultiAction label="Log" onAction={() => {
                                                }}/>
                                                <Ui.Dropdown.Divider/>
                                            </Ui.List.MultiActions>
                                        </Ui.List>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                                <hr/>

                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={6}>
                                        <h2>MarkdownEditor</h2>
                                        <Ui.MarkdownEditor/>
                                    </Ui.Grid.Col>

                                    <Ui.Grid.Col all={6}>
                                        <h2>Panel</h2>
                                        <Ui.Panel>
                                            <Ui.Panel.Header>Some Header</Ui.Panel.Header>
                                            <Ui.Panel.Body>
                                                This is body content
                                            </Ui.Panel.Body>
                                            <Ui.Panel.Footer>
                                                This is the footer
                                            </Ui.Panel.Footer>
                                        </Ui.Panel>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                                <hr/>

                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={6}>
                                        <h2>Password</h2>
                                        <Ui.Password name="pass" validate="required" label="Your password"/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                                <hr/>

                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={6}>
                                        <Ui.DownloadLink type="secondary" align="right"
                                                         download="/entities/demo/records/report/summary/csv">
                                            <Ui.Icon icon="icon-file-o"/>
                                            Export CSV
                                        </Ui.DownloadLink>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>

                                <pre>{JSON.stringify(model, null, 4)}</pre>
                            </div>
                        )}
                    </Ui.Form>
                )}
            </Webiny.Ui.LazyLoad>
        );
    }
};

export default Webiny.createComponent(Dashboard, {modules: ['Draft']});