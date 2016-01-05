import Webiny from 'Webiny';

class Placeholder extends Webiny.Ui.Component {

    constructor() {
        super();
    }

    componentDidMount() {
        if (this.props.onDidUpdate) {
            this.props.onDidUpdate();
        }
    }

    render() {
        if (!Webiny.Router.getActiveRoute()) {
            return null;
        }

        const route = Webiny.Router.getActiveRoute();
        const components = route.getComponents(this.props.name);

        let defComponents = [];
        if (!route.skipDefaultComponents()) {
            defComponents = Webiny.Router.getDefaultComponents(this.props.name);
        }

        const cmps = [];
        _.compact(components.concat(defComponents)).forEach((item, index) => {
            const props = {key: index};
            if (!_.isFunction(item)) {
                _.assign(props, item[1]);
                item = item[0];
            }
            cmps.push(React.createElement(item, props));
        });

        if (!cmps.length) {
            return null;
        }

        return (
            <rad-placeholder>{cmps}</rad-placeholder>
        );
    }

    componentDidUpdate() {
        if (this.props.onDidUpdate) {
            this.props.onDidUpdate();
        }
    }
}

export default Placeholder;
