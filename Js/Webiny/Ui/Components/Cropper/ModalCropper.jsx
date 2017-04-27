import Webiny from 'Webiny';
import BaseCropper from './BaseCropper';

class ModalCropper extends BaseCropper {

    constructor(props) {
        super(props);
        this.bindMethods('show,hide');
    }

    componentDidUpdate(prevProps) {
        super.componentDidUpdate();
        if (!prevProps.image && this.props.image) {
            return this.show();
        }

        if (prevProps.image && !this.props.image) {
            return this.hide();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(nextProps.image, this.props.image) || !_.isEqual(nextState, this.state);
    }

    applyCropping() {
        const model = this.getImage();
        this.hide().then(() => {
            this.props.onCrop(model);
        });
    }

    hide() {
        return this.refs.dialog && this.refs.dialog.hide();
    }

    show() {
        return this.refs.dialog && this.refs.dialog.show();
    }
}

ModalCropper.defaultProps = _.merge({}, BaseCropper.defaultProps, {
    config: {},
    title: 'Crop image',
    action: 'Apply cropping',
    closeOnClick: false,
    onCrop: _.noop,
    onShown: _.noop,
    onHidden: _.noop,
    renderer() {
        const props = this.props;

        const modalProps = {
            onShown: () => {
                // Execute callback first
                props.onShown();
                // Initialize cropper plugin
                setTimeout(this.initCropper);
            },
            onHide: () => {
                this.destroyCropper();
            },
            onHidden: () => {
                props.onHidden();
            },
            closeOnClick: props.config.closeOnClick || props.closeOnClick,
            className: ''
        };

        const {Modal, Button} = props;

        return (
            <Modal.Dialog ref="dialog" {...modalProps}>
                <Modal.Header title={props.title}/>
                <Modal.Body>
                    {props.children}
                    <div className="col-xs-12 no-padding">
                        <img
                            className="img-cropper"
                            width="100%"
                            src={props.image && props.image.src + this.getCacheBust()}
                            style={{maxWidth: '100%'}}/>
                    </div>
                    <div className="clearfix"/>
                    Cropped image size: <strong>{this.state.width}x{this.state.height}</strong>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="primary" className="pull-right ml5" onClick={this.applyCropping}>{props.action}</Button>
                </Modal.Footer>
            </Modal.Dialog>
        );
    }
});

export default Webiny.createComponent(ModalCropper, {
    modules: ['Modal', 'Button', {Cropper: () => import('Webiny/Vendors/Cropper')}],
    api: ['show', 'hide']
});