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

    render() {
        return (
            <webiny-modal-container>{this.state.content}</webiny-modal-container>
        );
    }
}

export default Container;