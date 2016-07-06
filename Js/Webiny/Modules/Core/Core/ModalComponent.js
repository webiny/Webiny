import Component from './Component';

class ModalComponent extends Component {

    constructor(props) {
        super(props);
        this.bindMethods('show,hide');
    }

    hide() {
        return this.refs.dialog.hide();
    }

    show() {
        return this.refs.dialog.show();
    }
}

export default ModalComponent;
