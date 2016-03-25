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

        const config = this.props.config;
        let props = _.clone(child.props);
        if (child.props.ui && _.has(config, child.props.ui)) {
            props.key = index;
            if (props.ui && _.has(config, props.ui)) {
                props = _.merge({}, props, config[props.ui]);
            }
        }

        return React.cloneElement(child, props, this.prepareChildren(props && props.children));
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
        return React.Children.map(children, this.prepareChild, this);
    }

    render() {
        const content = this.prepareChildren(this.props.children);
        return (
            <webiny-view>{content}</webiny-view>
        );
    }
}

View.defaultProps = {};

export default View;
