import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import FileCropper from './Base/FileCropper';

class InlineFileCropper extends FileCropper {

    componentDidMount() {
        super.componentDidMount();
        if (this.props.image) {
            setTimeout(this.initCropper);
        }
    }
}

InlineFileCropper.defaultProps = _.merge({}, FileCropper.defaultProps, {
    renderer() {
        const props = this.props;
        if (!props.image) {
            return null;
        }

        return (
            <webiny-image-cropper>
                {props.children}
                <div className="col-xs-12 no-padding">
                    <img
                        className="img-cropper"
                        width="100%"
                        style={{maxWidth: '100%'}}
                        src={props.image && props.image.src + this.getCacheBust()}/>
                    Cropped image size: <strong>{this.state.width}x{this.state.height}</strong>
                </div>
                <div className="col-xs-12">
                    <Ui.Button type="primary" className="pull-right ml5" onClick={this.applyCropping}>Apply cropping</Ui.Button>
                    <Ui.Button type="default" className="pull-right ml5" onClick={this.props.onHidden}>Cancel</Ui.Button>
                </div>
            </webiny-image-cropper>
        );
    }
});

export default InlineFileCropper;