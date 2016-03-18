import Webiny from 'Webiny';

class View extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.bindMethods('prepareContent');
    }

    prepareContent(children) {
        const config = this.props.config;
        let index = 0;
        return React.Children.map(children, child => {
            const props = _.clone(child.props);
            props.key = index;
            if (_.has(config, child.props.ui)) {
                props.config = config[child.props.ui];
            }
            index++;
            return React.cloneElement(child, props);
        }, this);
    }

    render() {
        const content = this.prepareContent(this.props.children);
        console.log(content);
        return (
            <webiny-view>{content}</webiny-view>
        );
    }
}

View.defaultProps = {};

export default View;
