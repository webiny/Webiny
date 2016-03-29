import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Row extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.fields = [];
        this.actions = null;
        this.data = [];

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
        if (child.type === Ui.List.Table.Field || child.type.prototype instanceof Ui.List.Table.Field) {
            this.fields.push(child);
        } else if (child.type === Ui.List.Table.Actions) {
            this.actions = child;
        }
    }

    prepareChildren(children) {
        this.fields = [];
        this.actions = null;

        if (typeof children !== 'object' || children === null) {
            return children;
        }
        return React.Children.map(children, this.prepareChild);
    }

    renderField(field, i) {
        const props = _.omit(field.props, ['children']);
        props.data = this.data;
        props.key = i;
        props.sorted = this.props.sorters[props.name] || null;

        // Add field renderer
        const name = _.upperFirst(_.camelCase(field.props.name));
        if (_.has(this.props, 'field' + name)) {
            props.renderer = this.props['field' + name];
        }

        return React.cloneElement(field, props, field.props.children);
    }

    renderActions() {
        return null;
    }

    render() {
        this.data = _.clone(this.props.data);
        return (
            <tr>
                {this.fields.map(this.renderField)}
                {this.actions ? <td>{this.actions}</td> : null}
            </tr>
        );
    }
}

export default Row;