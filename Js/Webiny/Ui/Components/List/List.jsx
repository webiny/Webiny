import Webiny from 'Webiny';
import ApiContainer from './Components/ApiContainer';
import StaticContainer from './Components/StaticContainer';

class List extends Webiny.Ui.Component {
    componentWillMount() {
        super.componentWillMount();
        if (this.props.ui) {
            Webiny.Ui.Dispatcher.unregister(this.props.ui, this);
        }
    }
}

List.defaultProps = {
    renderer() {
        const props = _.omit(this.props, ['renderer']);
        if (_.has(props, 'api') && props.api) {
            return <ApiContainer {...props}/>;
        }
        return <StaticContainer {...props}/>;
    }
};

export default Webiny.createComponent(List);