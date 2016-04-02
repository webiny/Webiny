import Webiny from 'Webiny';

class Container extends Webiny.Ui.Component {
    constructor(props){
        super(props);

        this.state = {
            content: null
        };

        this.bindMethods('setContent');
    }

    setContent(content){
        setTimeout(() => this.setState({content}), 10);
    }

    componentDidUpdate() {
        super.componentDidUpdate();
        if(this.state.content){
            // Need to focus on .modal to reduce scope of events (keyup and click in Modal.Dialog)
            $('.modal').focus();
        }
    }

    render() {
        return (
            <webiny-modal-container>{this.state.content}</webiny-modal-container>
        );
    }
}

export default Container;