import Webiny from 'Webiny';
import SelectAll from './SelectAll';
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
            selectedData: props.selectedData
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
        this.setState({selectedData: props.selectedData});
        this.tempProps = props; // assign props to tempProps to be accessible without passing through method args
        this.prepareChildren(props.children);
    }

    selectAll(selected) {
        let data = this.state.selectedData;
        if (selected) {
            data = new Set(this.props.data);
        } else {
            data.clear();
        }

        this.setState({
            selectAll: selected,
            selectedData: data
        }, () => {
            if (this.props.onSelect) {
                this.props.onSelect(this.state.selectedData);
            }
        });
    }

    onSelect(data, selected) {
        const selectedData = this.state.selectedData;
        if (selected) {
            selectedData.add(data);
        } else {
            selectedData.delete(data);
        }
        this.setState({selectedData});
        this.props.onSelect(selectedData);
    }

    onSort(name, sort) {
        this.selectAll(false);
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
            selected: this.state.selectedData.has(data),
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
    onSelect: null,
    selectedData: new Set(),
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