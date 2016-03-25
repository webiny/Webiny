import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Row extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.fields = [];
        this.actions = [];

        this.bindMethods('prepareChildren,prepareChild,renderField,renderActions');
    }

    componentWillMount() {
        super.componentWillMount();
        this.prepareChildren(this.props.children)
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        this.prepareChildren(props.children);
    }

    prepareChild(child) {
        if (typeof child !== 'object' || child === null) {
            return child;
        }

        // Table handles Row and Footer
        if (child.type === Ui.List.Table.Field) {
            this.fields.push(child);
        } else if (child.type === Ui.List.Table.Action) {
            this.actions.push(child);
        }
    }

    prepareChildren(children) {
        this.fields = [];
        this.actions = [];

        if (typeof children !== 'object' || children === null) {
            return children;
        }
        return React.Children.map(children, this.prepareChild);
    }

    renderField(field, i) {
        const props = _.clone(field.props);
        props.data = this.props.data;
        props.key = i;
        props.sorted = this.props.sorters[props.name] || null;

        // Add field renderer
        const name = _.upperFirst(_.camelCase(field.props.name));
        if (_.has(this.props, 'field' + name)) {
            props.renderer = this.props['field' + name];
        }

        return React.cloneElement(field, props);
    }

    renderActions() {
        return null;
    }

    render() {
        return (
            <tr>
                {this.fields.map(this.renderField)}
            </tr>
        );
    }
}

export default Row;