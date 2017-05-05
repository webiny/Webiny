import Webiny from 'Webiny';
import Component from './../Core/Component';

class LazyLoad extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            modules: null
        };
    }

    componentWillMount() {
        super.componentWillMount();

        Webiny.import(this.props.modules).then(modules => {
            // Finish loading and render content
            this.setState({loaded: true, modules});
        });
    }
}

LazyLoad.defaultProps = {
    renderer() {
        if (this.state.loaded) {
            try {
                return this.props.children(this.state.modules);
            } catch (e) {
                console.error(e);
            }
        }
        return null;
    }
};

export default LazyLoad;