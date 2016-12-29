import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import SelectRowField from './Fields/SelectRowField';

class Table extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.rowElement = null;
        this.selectAllRowsElement = null;
        this.rowDetailsElement = null;
        this.footerElement = null;
        this.emptyElement = null;
        this.headers = [];
        this.rows = {};

        this.state = {
            selectAll: false,
            selectedRows: props.selectedRows,
            expandedRows: []
        };

        this.bindMethods(
            'attachToTable',
            'prepareChildren',
            'prepareChild',
            'renderRow',
            'renderHeader',
            'onSort',
            'onSelect',
            'selectAll',
            'showRowDetails',
            'hideRowDetails',
            'toggleRowDetails'
        );
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

    attachToTable(row, index) {
        this.rows[index] = row;
    }

    selectAll(selected) {
        let data = [];
        if (selected) {
            Object.values(this.rows).map(row => {
                if (!row.isDisabled()) {
                    data.push(row.props.data);
                }
            });
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
            selectedRows.push(data);
        } else {
            selectedRows.splice(_.findIndex(selectedRows, data), 1);
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
                if ((rowChild.type === Ui.List.Table.Field || rowChild.type.prototype instanceof Ui.List.Table.Field)) {
                    if (rowChild.type === SelectRowField || rowChild.type.prototype instanceof SelectRowField) {
                        this.selectAllRowsElement = true;
                    }

                    if (rowChild.props.hide) {
                        return;
                    }

                    const headerProps = _.omit(rowChild.props, ['renderer', 'headerRenderer']);
                    headerProps.sortable = headerProps.sort || false;
                    headerProps.sorted = this.tempProps.sorters[headerProps.sort] || 0;
                    headerProps.children = React.Children.map(rowChild.props.children, ch => {
                        if (ch.type === Ui.List.Table.FieldInfo) {
                            return ch;
                        }
                    });

                    if (_.has(rowChild.props, 'headerRenderer')) {
                        headerProps.renderer = rowChild.props.headerRenderer;
                    }
                    this.headers.push(headerProps);
                }

                if (rowChild.type === Ui.List.Table.Actions && !rowChild.props.hide) {
                    this.headers.push({});
                }
            });

            if (this.props.onSelect && !this.selectAllRowsElement) {
                this.headers.splice(0, 0, {renderer: SelectRowField.defaultProps.headerRenderer});
            }
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
            this.setState({expandedRows: this.state.expandedRows});
        };
    }

    hideRowDetails(rowIndex) {
        return () => {
            this.state.expandedRows.splice(this.state.expandedRows.indexOf(rowIndex), 1);
            this.setState({expandedRows: this.state.expandedRows});
        };
    }

    toggleRowDetails(rowIndex) {
        return () => {
            if (this.state.expandedRows.indexOf(rowIndex) > -1) {
                this.hideRowDetails(rowIndex)();
            } else {
                this.showRowDetails(rowIndex)();
            }
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
            attachToTable: this.attachToTable,
            index,
            key,
            data,
            fieldsCount: this.headers.length + (this.props.onSelect ? 1 : 0),
            expanded: this.state.expandedRows.indexOf(index) > -1,
            selected: _.find(this.state.selectedRows, {id: data.id}) ? true : false,
            sorters: _.clone(this.props.sorters),
            actions: _.assign({}, this.props.actions, {
                showRowDetails: this.showRowDetails,
                hideRowDetails: this.hideRowDetails,
                toggleRowDetails: this.toggleRowDetails
            }),
            onSelect: this.props.onSelect ? this.onSelect : null,
            onSelectAll: this.selectAll
        });

        if (this.props.onSelect) {
            props.onSelect = this.onSelect;
        }

        return React.cloneElement(element, props, element.props.children);
    }

    renderHeader(header, i) {
        header.key = i;
        header.onSort = this.onSort;
        header.allRowsSelected = this.state.selectAll;
        header.onSelectAll = this.selectAll;
        return (
            <Ui.List.Table.Header {...header}/>
        );
    }
}

Table.defaultProps = {
    data: [],
    type: 'simple',
    onSelect: null,
    selectedRows: [],
    sorters: {},
    showHeader: true,
    className: null,
    renderer() {
        const className = this.classSet([
            'table',
            'table-' + this.props.type,
            this.props.className
        ]);

        if (!this.props.data || !this.props.data.length && this.props.showEmpty) {
            return this.emptyElement || <Ui.List.Table.Empty/>;
        }

        const rows = [];
        this.props.data.map((data, index) => {
            rows.push(this.renderRow(data, data.id || index, this.rowElement, data.id || index));
            if (this.rowDetailsElement) {
                rows.push(this.renderRow(data, data.id || index, this.rowDetailsElement, 'details-' + (data.id || index)));
            }
        });

        let header = null;
        if (this.props.showHeader) {
            header = (
                <thead>
                <tr>
                    {this.headers.map(this.renderHeader)}
                </tr>
                </thead>
            );
        }

        return (
            <table className={className}>
                {header}
                <tbody>{rows}</tbody>
            </table>
        );
    }
};

export default Table;