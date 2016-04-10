import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Table extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.rowElement = null;
        this.footerElement = null;
        this.emptyElement = null;
        this.headers = [];

        this.bindMethods('prepareChildren,prepareChild,renderRow,renderHeader,onSort');
    }

    componentWillMount() {
        super.componentWillMount();
        this.tempProps = this.props;
        this.prepareChildren(this.props.children)
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        this.tempProps = props;
        this.prepareChildren(props.children);
    }

    onSort(name, sort) {
        const sorters = _.clone(this.props.sorters);
        if (sort !== 0) {
            sorters[name] = sort;
        } else {
            delete sorters[name];
        }

        this.props.onSort(sorters);
    }

    prepareChild(child) {
        if (typeof child !== 'object' || child === null) {
            return child;
        }

        // Table handles Row and Footer
        if (child.type === Ui.List.Table.Row) {
            this.rowElement = child;
            // Parse Row fields to extract headers
            this.headers = [];
            React.Children.map(child.props.children, rowChild => {
                if (rowChild.type === Ui.List.Table.Field || rowChild.type.prototype instanceof Ui.List.Table.Field) {
                    const headerProps = _.omit(rowChild.props, 'renderer');
                    headerProps.sortable = headerProps.sort || false;
                    headerProps.sorted = this.tempProps.sorters[headerProps.name] || 0;
                    headerProps.children = React.Children.map(rowChild.props.children, child => {
                        if (child.type === Ui.List.Table.FieldInfo) {
                            return child;
                        }
                    });
                    this.headers.push(headerProps);
                }

                if (rowChild.type === Ui.List.Table.Actions) {
                    this.headers.push({});
                }
            });
        } else if (child.type === Ui.List.Table.Footer) {
            this.footerElement = child;
        } else if (child.type === Ui.List.Table.Empty) {
            this.emptyElement = child;
        }
    }

    prepareChildren(children) {
        if (typeof children !== 'object' || children === null) {
            return children;
        }
        return React.Children.map(children, this.prepareChild);
    }

    renderRow(data, index) {
        const props = _.omit(this.rowElement.props, ['children']);
        _.assign(props, {
            table: this,
            key: index,
            data: data,
            sorters: _.clone(this.props.sorters),
            actions: this.props.actions
        });

        return React.cloneElement(this.rowElement, props, this.rowElement.props.children);
    }

    renderHeader(header, i) {
        header.key = i;
        header.onSort = this.onSort;
        return <Ui.List.Table.Header {...header}/>
    }
}

Table.defaultProps = {
    data: [],
    type: 'simple',
    renderer: function renderer() {
        const className = this.classSet([
            'table',
            'table-' + this.props.type
        ]);

        if (!this.props.data || !this.props.data.length) {
            return this.emptyElement;
        }

        return (
            <table className={className}>
                <thead>
                <tr>
                    {this.headers.map(this.renderHeader)}
                </tr>
                </thead>
                <tbody>
                {this.props.data.map(this.renderRow)}
                </tbody>
            </table>
        );
    }
};

export default Table;