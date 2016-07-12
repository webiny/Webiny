import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Confirmation extends Webiny.Ui.ModalComponent {

    constructor(props) {
        super(props);

        this.state = {
            loading: false
        };

        this.data = [];
        this.bindMethods('showLoading,renderContent,renderLoader,renderDialog,onCancel,onConfirm');
    }

    show() {
        this.setState({time: new Date().getTime()});
        return super.show();
    }

    showLoading() {
        this.setState({loading: true});
    }

    hideLoading() {
        this.setState({loading: false});
    }

    onCancel() {
        if (!this.isAnimating()) {
            if (_.isFunction(this.props.onCancel)) {
                return this.props.onCancel(this);
            }
            return this.hide();
        }
    }

    onConfirm() {
        if (_.isFunction(this.props.onConfirm)) {
            const data = _.clone(this.data);
            data.push(this);
            this.showLoading();
            return Q(this.props.onConfirm(...data)).then(() => {
                this.hideLoading();
                if (this.props.autoHide) {
                    return this.hide();
                }
            });
        }
    }

    renderLoader() {
        if (this.state.loading) {
            return this.props.renderLoader();
        }
        return null;
    }

    renderContent() {
        let content = this.props.message;
        if (!content) {
            content = this.props.children;
        }

        if (_.isFunction(content)) {
            content = content();
        }
        return content;
    }

    setData(...data) {
        this.data = data;
        return this;
    }

    renderDialog() {
        return this.props.renderDialog.call(this, this.onConfirm, this.onCancel, this);
    }
}

Confirmation.defaultProps = _.merge({}, Webiny.Ui.ModalComponent.defaultProps, {
    title: 'Confirmation dialog',
    confirm: 'Yes',
    cancel: 'No',
    onConfirm: _.noop,
    onCancel: null,
    autoHide: true,
    renderLoader() {
        return (
            <div className="loading-overlay">
                <div className="loading-overlay__icon-wrapper">
                    <div className="loading-overlay__icon"></div>
                </div>
            </div>
        );
    },
    renderDialog(confirm, cancel) {
        return (
            <Ui.Modal.Dialog modalContainerTag="confirmation-modal" className="alert-modal" onCancel={cancel}>
                {this.renderLoader()}
                <Ui.Modal.Body>
                    <div className="text-center">
                        <h4>{this.props.title}</h4>

                        <p>{this.renderContent()}</p>
                    </div>
                </Ui.Modal.Body>
                <Ui.Modal.Footer>
                    <Ui.Button type="default" label={this.props.cancel} onClick={cancel}/>
                    <Ui.Button type="primary" label={this.props.confirm} onClick={confirm}/>
                </Ui.Modal.Footer>
            </Ui.Modal.Dialog>
        );
    }
});

export default Confirmation;