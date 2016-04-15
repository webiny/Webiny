import BaseContainer from './BaseContainer';

class StaticContainer extends BaseContainer {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        super.componentWillMount();
        if (this.props.loadData) {
            return this.props.loadData.call(this).then(data => {
                this.setState({model: data});
            });
        }

        this.setState({model: this.props.data});
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        if (props.data) {
            this.setState({model: props.data});
        }
    }

    /* eslint-disable */

    loadData(id = null) {
        // Doesn't do anything
    }

    /* eslint-enable */

    onSubmit(model) {
        this.props.onSubmit(model);
    }
}

StaticContainer.defaultProps = {
    connectToRouter: false
};

export default StaticContainer;