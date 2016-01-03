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
            return false;
        }

        const route = Webiny.Router.getActiveRoute();
        const components = route.getComponents(this.props.name);

        let defComponents = [];
        if (!route.skipDefaultComponents()) {
            defComponents = Webiny.Router.getDefaultComponents(this.props.name);
        }

        const render = [];
        _.compact(components.concat(defComponents)).forEach((item, index) => {
            const props = {key: index};
            if (!_.isFunction(item)) {
                _.assign(props, item[1]);
                item = item[0];
            }
            render.push(React.createElement(item, props));
        });

        if (!render.length) {
            return false;
        }

        return <rad-placeholder>{render}</rad-placeholder>;
    }

    componentDidUpdate() {
        if (this.props.onDidUpdate) {
            this.props.onDidUpdate();
        }
    }
}

export default Placeholder;
