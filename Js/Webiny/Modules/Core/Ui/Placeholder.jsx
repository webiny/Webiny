import Component from './../Core/Component';
import View from './../Core/View';
import Router from './../Router/Router';

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
        if (!Router.getActiveRoute()) {
            return null;
        }

        const route = Router.getActiveRoute();
        console.log("ACTIVE ROUTE", route);
        const components = route.getComponents(this.props.name);

        let defComponents = [];
        if (!route.skipDefaultComponents()) {
            defComponents = Router.getDefaultComponents(this.props.name);
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
};

export default Placeholder;
