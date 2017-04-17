import Webiny from 'Webiny';
import BaseCropper from './BaseCropper';

class InlineCropper extends BaseCropper {

    componentDidMount() {
        super.componentDidMount();
        if (this.props.image) {
            setTimeout(this.initCropper);
        }
    }
}

InlineCropper.defaultProps = _.merge({}, BaseCropper.defaultProps, {
    renderer() {
        const props = this.props;
        if (!props.image) {
            return null;
        }

        const {Button} = props;

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
                    <Button type="primary" className="pull-right ml5" onClick={this.applyCropping}>Apply cropping</Button>
                    <Button type="default" className="pull-right ml5" onClick={this.props.onHidden}>Cancel</Button>
                </div>
            </webiny-image-cropper>
        );
    }
});

export default Webiny.createComponent(InlineCropper, {modules: ['Button']});