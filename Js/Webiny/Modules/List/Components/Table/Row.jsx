import Webiny from 'Webiny';
import SelectRow from './SelectRow';
const Ui = Webiny.Ui.Components;

class Row extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.state = {
            selected: false
        };

        this.fields = [];
        this.actions = null;
        this.data = props.data;

        this.bindMethods('prepareChildren,prepareChild,renderField,onClick');
    }

    componentWillMount() {
        super.componentWillMount();
        this.prepareChildren(this.props.children);
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        this.data = props.data;
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
            this.actions = React.cloneElement(child, {
                data: this.data,
                actions: this.props.actions
            });
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
        _.assign(props, {
            data: this.data,
            key: i,
            sorted: this.props.sorters[props.name] || null,
            actions: this.props.actions,
            rowIndex: this.props.index,
            rowDetailsExpanded: this.props.expanded
        });

        // Filter Field children
        const childrenArray = _.isArray(field.props.children) ? field.props.children : [field.props.children];
        const children = [];
        _.filter(childrenArray).map(fieldChild => {
            // Do not include FieldInfo in Field children
            if (fieldChild.type !== Ui.List.Table.FieldInfo) {
                children.push(fieldChild);
            }
        });

        return React.cloneElement(field, props, children.length === 1 ? children[0] : children);
    }

    onClick() {
        const onClick = this.props.onClick;
        if (_.isString(onClick) && onClick === 'toggleRowDetails') {
            this.props.actions.toggleRowDetails(this.props.index)();
        } else if (_.isFunction(onClick)) {
            onClick.call(this, this.data, this);
        }
    }
}

Row.defaultProps = {
    className: null,
    onClick: _.noop,
    renderer() {
        let select = null;
        if (this.props.onSelect) {
            select = (
                <SelectRow value={this.props.selected} onChange={value => this.props.onSelect(this.data, value)}/>
            );
        }

        return (
            <tr className={this.classSet(this.props.className)} onClick={this.onClick}>
                {select}
                {this.fields.map(this.renderField)}
                {this.actions ? <td>{this.actions}</td> : null}
            </tr>
        );
    }
};

export default Row;