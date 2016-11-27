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
        const placeholderProps = _.omit(this.props, ['renderer', 'name', 'children']);
        _.each(components, (item, index) => {
            if (!item) {
                return;
            }
            const componentProps = _.merge({key: index}, placeholderProps);
            if (React.isValidElement(item)) {
                if (_.isString(item.type)) {
                    cmps.push(item);
                } else {
                    cmps.push(React.cloneElement(item, componentProps));
                }
            } else {
                if (!_.isFunction(item)) {
                    _.assign(componentProps, item[1]);
                    item = item[0];
                }
                console.log({item});
                cmps.push(React.createElement(item, componentProps));
            }
        });

        return (
            <webiny-placeholder>{cmps}</webiny-placeholder>
        );
    }
};

export default Placeholder;