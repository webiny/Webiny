import Webiny from 'Webiny';

class View extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.bindMethods('prepareChildren,prepareChild');
    }

    prepareChild(child, index) {
        if (typeof child !== 'object' || child === null) {
            return child;
        }

        let props = _.omit(child.props, ['children']);
        if (props.ui && _.has(this.props.config, props.ui)) {
            props = _.merge({key: index}, props, this.props.config[props.ui]);
        }

        if (React.Children.toArray(child.props.children).length) {
            return React.cloneElement(child, props, this.prepareChildren(child.props && child.props.children));
        }

        return child;
    }

    /**
     * @private
     * @param children
     * @returns {*}
     */
    prepareChildren(children) {
        if (typeof children !== 'object' || children === null) {
            return children;
        }
        return React.Children.map(children, this.prepareChild);
    }

    render() {
        return (
            <webiny-view>{this.prepareChildren(this.props.children)}</webiny-view>
        );
    }
}

View.defaultProps = {};

export default View;
