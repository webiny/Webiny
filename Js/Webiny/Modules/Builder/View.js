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
        if (child.props.ui && _.has(config, child.props.ui)) {
            const props = _.clone(child.props);
            props.key = index;
            if (child.props.ui && _.has(config, child.props.ui)) {
                _.merge(props, config[child.props.ui]);
            }
            return React.cloneElement(child, props, props.children);
        }

        return React.cloneElement(child, child.props, this.prepareChildren(child.props && child.props.children));
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
