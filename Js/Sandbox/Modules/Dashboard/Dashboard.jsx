import Webiny from 'Webiny';

class Dashboard extends Webiny.Ui.View {
    constructor(props) {
        super(props);

        const {Draft} = props;

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
    }
}

Dashboard.defaultProps = {
    renderer() {
        const DraftEditor = this.props.Draft.Editor;

        const modules = [
            'Avatar',
            'ClickConfirm',
            'CodeEditor',
            'Button',
            'File',
            'Image',
            'Gallery',
            'Link',
            'DownloadLink',
            'HtmlEditor',
            'Form',
            'Grid',
            'DateTime',
            'Date',
            'Time',
            'DateRange',
            'Icon',
            'Carousel'
        ];
        const src = "https://scontent-amt2-1.xx.fbcdn.net/v/t31.0-8/17855125_536372119866416_7405702212874834803_o.jpg?oh=386fe327a0899af7461322ff3b00177b&oe=5987F465";
        return (
            <Webiny.Ui.LazyLoad modules={modules}>
                {(Ui) => (
                    <Ui.Form>
                        {(model) => (
                            <div>
                                <pre>{JSON.stringify(model, null, 4)}</pre>
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
                                            <Ui.Button type="primary" label="Click me!" onClick={() => {}}/>
                                        </Ui.ClickSuccess>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                                <hr/>

                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={6}>
                                        <h2>CodeEditor</h2>
                                        <Ui.CodeEditor label="Email template" name="content" description="Enter plain text or HTML content"/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>


                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={3}>
                                        <Ui.DateTime label="Date & Time" name="datetime" placeholder="Select date and time"/>
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={3}>
                                        <Ui.Date label="Date" name="date" placeholder="Select a date" validate="required"/>
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={3}>
                                        <Ui.Time label="Time" name="time" placeholder="Select time"/>
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={3}>
                                        <Ui.DateRange label="Date range" name="daterange" placeholder="Select a date range"/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={12}>

                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={6}>
                                        <Ui.File name="file"/>
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={6}>
                                        <Ui.DownloadLink type="secondary" align="right"
                                                         download="/entities/demo/records/report/summary/csv">
                                            <Ui.Icon icon="icon-file-o"/>
                                            Export CSV
                                        </Ui.DownloadLink>
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={12}>
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
                                        <Ui.HtmlEditor name="html"/>
                                        <DraftEditor
                                            name="draft"
                                            placeholder="Tell a story..."
                                            plugins={this.plugins}/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                            </div>
                        )}
                    </Ui.Form>
                )}
            </Webiny.Ui.LazyLoad>
        );
    }
};

export default Webiny.createComponent(Dashboard, {modules: ['Draft']});