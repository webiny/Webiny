import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Table extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.rowElement = null;
        this.footerElement = null;
        this.emptyElement = null;
        this.headers = [];

        this.state = {
            selectAll: false,
            selectedData: []
        };

        this.bindMethods('prepareChildren,prepareChild,renderRow,renderHeader,onSort,onSelect,selectAll');
    }

    componentWillMount() {
        super.componentWillMount();
        this.tempProps = this.props; // assign props to tempProps to be accessible without passing through method args
        this.prepareChildren(this.props.children);
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        this.tempProps = props; // assign props to tempProps to be accessible without passing through method args
        this.prepareChildren(props.children);
    }

    selectAll(select) {
        console.log("SELECT ALL", select);
    }

    onSelect(index, selected) {
        const selectedData = this.state.selectedData;
        if (selected) {
            selectedData[index] = this.props.data[index];
        } else {
            selectedData.splice(index, 1);
        }
        this.setState({selectedData});
        this.props.onSelect(_.compact(selectedData));
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
                    headerProps.sorted = this.tempProps.sorters[headerProps.sort] || 0;
                    headerProps.children = React.Children.map(rowChild.props.children, ch => {
                        if (ch.type === Ui.List.Table.FieldInfo) {
                            return ch;
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
            index,
            key: index,
            data,
            sorters: _.clone(this.props.sorters),
            actions: this.props.actions
        });

        if (this.props.onSelect) {
            props.onSelect = this.onSelect;
        }

        return React.cloneElement(this.rowElement, props, this.rowElement.props.children);
    }

    renderHeader(header, i) {
        header.key = i;
        header.onSort = this.onSort;
        return (
            <Ui.List.Table.Header {...header}/>
        );
    }
}

Table.defaultProps = {
    data: [],
    type: 'simple',
    renderer() {
        const className = this.classSet([
            'table',
            'table-' + this.props.type
        ]);

        if (!this.props.data || !this.props.data.length) {
            return this.emptyElement;
        }

        let selectAll = null;
        if (this.props.onSelect) {
            selectAll = (
                <th>
                    <Ui.Checkbox valueLink={this.bindTo('selectAll', this.selectAll)}/>
                </th>
            );
        }

        return (
            <table className={className}>
                <thead>
                <tr>
                    {selectAll}
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