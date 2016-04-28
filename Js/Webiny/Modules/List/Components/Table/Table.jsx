import Webiny from 'Webiny';
import SelectAll from './SelectAll';
const Ui = Webiny.Ui.Components;

class Table extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.rowElement = null;
        this.rowDetailsElement = null;
        this.footerElement = null;
        this.emptyElement = null;
        this.headers = [];

        this.state = {
            selectAll: false,
            selectedRows: props.selectedRows,
            expandedRows: []
        };

        this.bindMethods('prepareChildren,prepareChild,renderRow,renderHeader,onSort,onSelect,selectAll,showRowDetails,hideRowDetails');
    }

    componentWillMount() {
        super.componentWillMount();
        this.tempProps = this.props; // assign props to tempProps to be accessible without passing through method args
        this.prepareChildren(this.props.children);
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        this.setState({selectedRows: props.selectedRows});
        this.tempProps = props; // assign props to tempProps to be accessible without passing through method args
        this.prepareChildren(props.children);
    }

    selectAll(selected) {
        let data = this.state.selectedRows;
        if (selected) {
            data = new Set(this.props.data);
        } else {
            data.clear();
        }

        this.setState({
            selectAll: selected,
            selectedRows: data
        }, () => {
            if (this.props.onSelect) {
                this.props.onSelect(this.state.selectedRows);
            }
        });
    }

    onSelect(data, selected) {
        const selectedRows = this.state.selectedRows;
        if (selected) {
            selectedRows.add(data);
        } else {
            selectedRows.delete(data);
        }
        this.setState({selectedRows});
        this.props.onSelect(selectedRows);
    }

    onSort(name, sort) {
        this.selectAll(false);
        this.setState({expandedRows: []});
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
        } else if (child.type === Ui.List.Table.RowDetails) {
            this.rowDetailsElement = child;
        }
    }

    showRowDetails(rowIndex) {
        return () => {
            this.state.expandedRows.push(rowIndex);
            console.log("SHOW DETAILS", rowIndex);
            this.setState({expandedRows: this.state.expandedRows});
        }
    }

    hideRowDetails(rowIndex) {
        return () => {
            this.state.expandedRows.splice(this.state.expandedRows.indexOf(rowIndex), 1);
            console.log("HIDE DETAILS", rowIndex);
            this.setState({expandedRows: this.state.expandedRows});
        };
    }

    prepareChildren(children) {
        if (typeof children !== 'object' || children === null) {
            return children;
        }
        return React.Children.map(children, this.prepareChild);
    }

    renderRow(data, index, element, key) {
        const props = _.omit(element.props, ['children']);
        _.assign(props, {
            table: this,
            index,
            key,
            data,
            fieldsCount: this.headers.length,
            expanded: this.state.expandedRows.indexOf(index) > -1,
            selected: this.state.selectedRows.has(data),
            sorters: _.clone(this.props.sorters),
            actions: _.assign({}, this.props.actions, {
                showRowDetails: this.showRowDetails,
                hideRowDetails: this.hideRowDetails
            })
        });

        if (this.props.onSelect) {
            props.onSelect = this.onSelect;
        }

        return React.cloneElement(element, props, element.props.children);
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
    onSelect: null,
    selectedRows: new Set(),
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
                    <SelectAll value={this.state.selectAll} onChange={this.selectAll}/>
                </th>
            );
        }

        const rows = [];
        this.props.data.map((data, index) => {
            rows.push(this.renderRow(data, index, this.rowElement, index));
            if (this.rowDetailsElement) {
                rows.push(this.renderRow(data, index, this.rowDetailsElement, 'details-' + index));
            }
        });

        return (
            <table className={className}>
                <thead>
                <tr>
                    {selectAll}
                    {this.headers.map(this.renderHeader)}
                </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        );
    }
};

export default Table;