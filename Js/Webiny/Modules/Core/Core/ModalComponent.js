import Component from './Component';

class ModalComponent extends Component {

    constructor(props) {
        super(props);
        this.bindMethods('show,hide');
    }

    hide() {
        this.refs.dialog.hide();
    }

    show() {
        this.refs.dialog.show();
    }
}

export default ModalComponent;
