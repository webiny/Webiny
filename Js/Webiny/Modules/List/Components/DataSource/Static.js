import Webiny from 'Webiny';
import DataSource from './DataSource';

class Static extends DataSource {

    constructor(data, defaultParams = {}) {
        super();

        this.data = data;
        this.defaultParams = defaultParams;
    }

    getData() {
        const filters = this.getFilters();
        let data = _.isEmpty(filters) ? this.data : _.filter(this.data, filters);
        const fields = [];
        const order = [];
        _.each(this.getSorters(), (sort, field) => {
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
        return Q({
            meta,
            list: data.slice(from, from + this.perPage)
        });
    }
}

export default Static;