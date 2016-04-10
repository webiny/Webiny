import Webiny from 'Webiny';
import BaseContainer from './BaseContainer';
const Ui = Webiny.Ui.Components;

class StaticContainer extends BaseContainer {

    componentWillMount() {
        super.componentWillMount();
        this.prepare(_.clone(this.props));
        this.loadData();
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        this.prepare(_.clone(props));
        this.loadData();
    }

    loadData() {
        let data = _.isEmpty(this.filters) ? this.props.data : _.filter(this.props.data, this.filters);
        const fields = [];
        const order = [];
        _.each(this.sorters, (sort, field) => {
            fields.push(field);
            order.push(sort === 1 ? 'asc' : 'desc');
        });
        data = _.orderBy(data, fields, order);

        const meta = {
            currentPage: this.page,
            perPage: this.perPage,
            totalCount: data.length,
            totalPages: Math.ceil(data.length / this.perPage)
        };

        this.totalPages = meta.totalPages;

        const from = (this.page - 1) * this.perPage;

        this.setState({
            list: data.slice(from, from + this.perPage),
            meta,
            sorters: this.sorters,
            filters: this.filters,
            page: this.page,
            perPage: this.perPage,
            searchQuery: this.searchQuery,
            searchOperator: this.searchOperator,
            searchFields: this.searchFields
        });
    }

    onRecordUpdate(id, attributes) {
        return this.api.patch(id, attributes).then(this.loadData);
    }

    onRecordDelete(id) {
        return this.api.delete(id).then(this.loadData);
    }
}

StaticContainer.defaultProps = {
    connectToRouter: false,
    defaultParams: {},
    page: 1,
    perPage: 10,
    layout: function () {
        return (
            <div className="col-xs-12">
                <filters/>
                <table/>
                <pagination/>
            </div>
        );
    },
    renderer: function renderer() {
        this.prepareList(this.props.children);

        const layout = this.props.layout.bind(this)();

        if (React.Children.toArray(layout.props.children).length) {
            const render = [];
            React.Children.map(layout, (item, index) => {
                render.push(React.cloneElement(this.replacePlaceholders(item), {key: index}));
            });
            return <webiny-list>{render}</webiny-list>;
        }

        const layoutProps = {
            filters: this.filtersElement,
            table: this.tableElement,
            pagination: this.paginationElement,
            container: this
        };
        return React.cloneElement(layout, layoutProps);
    }
};

export default StaticContainer;