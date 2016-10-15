import Webiny from 'Webiny';

class Graph extends Webiny.Ui.Component {

    constructor() {
        super();
        this.graph = {
            instance: null,
            id: _.uniqueId('graph-element-')
        };
        this.bindMethods('createGraph');
    }

    /**
     * We must rerender the graph if something was changed
     * @param props
     */
    componentWillReceiveProps(props) {
        if (!props.config) {
            return;
        }
        const columns = {
            next: _.get(props.config, 'data.columns'),
            previous: _.get(this.props.config, 'data.columns')
        };

        // Let's compare previous and next data
        if (!_.isEqual(columns.previous, columns.next)) {
            if (!this.graph.instance) {
                return this.createGraph(props);
            }
            this.graph.instance.load({
                columns: props.config.data.columns
            });
        }
    }

    componentDidMount() {
        super.componentDidMount();
        if (!this.props.config) {
            return;
        }
        setTimeout(this.createGraph, 5);
    }

    createGraph(props = this.props){
        const config = props.config;
        config.bindto = '#' + this.graph.id;
        this.graph.instance = c3.generate(config);
    }
}

Graph.defaultProps = {
    config: {},
    renderer() {
        return <div id={this.graph.id} className="line-chart"></div>;
    }
};

export default Graph;