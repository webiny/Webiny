import ViewManager from './../Core/ViewManager';
import Component from './../Core/Component';

class Placeholder extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.onDidUpdate) {
            this.props.onDidUpdate();
        }
    }

    componentDidUpdate() {
        if (this.props.onDidUpdate) {
            this.props.onDidUpdate();
        }
    }
}

Placeholder.defaultProps = {
    renderer() {
        let components = ViewManager.getContent(this.props.name);
        if (!_.isArray(components)) {
            components = [components];
        }
        const cmps = [];
        _.each(components, (item, index) => {
            if (!item) {
                return;
            }
            if (React.isValidElement(item)) {
                cmps.push(item);
            } else {
                const props = {key: index};
                if (!_.isFunction(item)) {
                    _.assign(props, item[1]);
                    item = item[0];
                }
                cmps.push(React.createElement(item, props));
            }
        });

        return (
            <webiny-placeholder>{cmps}</webiny-placeholder>
        );
    }
};

export default Placeholder;