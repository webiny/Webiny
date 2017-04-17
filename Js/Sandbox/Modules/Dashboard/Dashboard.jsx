import Webiny from 'Webiny';

class Dashboard extends Webiny.Ui.View {

}

Dashboard.defaultProps = {
    renderer() {
        const modules = [
            'Avatar',
            'File',
            'Image',
            'Gallery',
            'Link',
            'DownloadLink',
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

export default Dashboard;