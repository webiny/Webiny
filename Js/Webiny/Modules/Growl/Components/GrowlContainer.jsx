import Webiny from 'Webiny';

class GrowlContainer extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.state = {
            growls: []
        };

        this.bindMethods('addGrowl,removeGrowl,removeById');
    }

    addGrowl(growl) {
        let growlIndex = null;
        if (growl.props.id) {
            growlIndex = _.findIndex(this.state.growls, g => g.props.id === growl.props.id);
        }

        if (growlIndex > -1) {
            this.state.growls[growlIndex] = growl;
        } else {
            if (!growl.props.id) {
                growl = React.cloneElement(growl, {id: _.uniqueId('growl-')});
            }
            this.state.growls.push(growl);
        }
        this.setState({growls: this.state.growls});
        return growl.props.id;
    }

    removeById(id) {
        if (this.refs[id]) {
            this.removeGrowl(this.refs[id]);
        }
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
                    return React.cloneElement(growl, {ref: growl.props.id, key: growl.props.id, onRemove: this.removeGrowl});
                })}
            </div>
        );
    }
};

export default GrowlContainer;