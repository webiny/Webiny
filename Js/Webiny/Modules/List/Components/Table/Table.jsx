import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Table extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.rowComponent = null;
        this.footerComponent = null;
        this.headers = [];

        this.bindMethods('prepareChildren,prepareChild,renderRow,renderHeader,onSort');
    }

    componentWillMount() {
        super.componentWillMount();
        this.prepareChildren(this.props.children)
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        this.prepareChildren(props.children);
    }

    onSort(name, sort) {
        const sorters = this.props.sorters;
        if(sort !== 0){
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
            this.rowComponent = child;
            // Parse Row fields to extract headers
            this.headers = [];
            React.Children.map(child.props.children, rowChild => {
                if (rowChild.type === Ui.List.Table.Field) {
                    this.headers.push({
                        name: rowChild.props.name,
                        label: rowChild.props.label,
                        align: rowChild.props.align || 'center',
                        sortable: rowChild.props.sort || false,
                        sorted: this.props.sorters[rowChild.props.name] || 0
                    });
                }
            });
        } else if (child.type === Ui.List.Table.Footer) {
            this.footerComponent = child;
        }
    }

    prepareChildren(children) {
        if (typeof children !== 'object' || children === null) {
            return children;
        }
        return React.Children.map(children, this.prepareChild);
    }

    renderRow(data, index) {
        const props = _.clone(this.rowComponent.props);
        props.table = this;
        props.key = index;
        props.data = data;
        props.sorters = this.props.sorters;
        return React.cloneElement(this.rowComponent, props);
    }

    renderHeader(header, i) {
        header.key = i;
        header.onSort = this.onSort;
        return <Ui.List.Table.Header {...header}/>
    }
}

Table.defaultProps = {
    data: [],
    renderer: function renderer() {
        return (
            <div className="table-responsive">
                <table className="table table-simple">
                    <thead>
                    <tr>
                        {this.headers.map(this.renderHeader)}
                    </tr>
                    </thead>
                    <tbody>
                    {this.props.data.map(this.renderRow)}
                    </tbody>
                </table>
            </div>
        );
    }
};

export default Table;