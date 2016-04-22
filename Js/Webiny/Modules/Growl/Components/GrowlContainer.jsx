import Webiny from 'Webiny';
import Growl from './Growl';

class GrowlContainer extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.state = {
            growls: []
        };

        this.bindMethods('addGrowl,removeGrowl');
    }

    addGrowl(growl) {
        this.state.growls.push(React.cloneElement(growl, {id: Webiny.Tools.createUID()}));
        this.setState({growls: this.state.growls});
    }

    removeGrowl(growl) {
        $(ReactDOM.findDOMNode(growl)).fadeOut(400);
        setTimeout(() => {
            const index = _.findIndex(this.state.growls, item => item.props.id === growl.props.id);
            this.state.growls.splice(index, 1);
            this.setState({growls: this.state.growls});
        }, 400);
    }
}

GrowlContainer.defaultProps = {
    renderer: function renderer() {
        return (
            <div className="top-right growl">
                <div className="growl-notification"></div>
                {this.state.growls.map(growl => {
                    return React.cloneElement(growl, {key: growl.props.id, onRemove: this.removeGrowl});
                })}
            </div>
        );
    }
};

export default GrowlContainer;