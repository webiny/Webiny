import Webiny from 'Webiny';

class DataSource {

    constructor() {
        this.data = [];
        this.filters = {};
        this.sorters = {};
        this.page = 1;
        this.perPage = 10;
        this.searchQuery = null;
        this.searchFields = '';
        this.searchOperator = 'or';
        this.totalPages = 0;
        this.defaultParams = {};
        this.reservedKeywords = ['_page', '_perPage', '_sort', '_fields', '_searchQuery', '_searchFields', '_searchOperator'];
    }

    getTotalPages() {
        return this.totalPages;
    }

    getFilters() {
        const defaultFilters = _.omitBy(this.defaultParams, (value, name) => {
            return this.reservedKeywords.indexOf(name) > -1;
        });

        return _.assign(defaultFilters, this.filters);
    }

    setFilters(filters) {
        this.filters = _.omitBy(filters, _.isNull);
        return this;
    }

    getSorters() {
        let defaultSorters = _.get(this.defaultParams, '_sort', {});
        if (_.isString(defaultSorters)) {
            defaultSorters = Webiny.Router.sortersToObject(defaultSorters);
        }
        return _.assign({}, defaultSorters, this.sorters);
    }

    setSorters(sorters) {
        this.sorters = sorters;
        return this;
    }

    getPage() {
        return this.page;
    }

    setPage(page) {
        this.page = page;
        return this;
    }

    getPerPage() {
        return this.perPage;
    }

    setPerPage(perPage) {
        this.perPage = perPage;
        return this;
    }

    setSearchQuery(searchQuery) {
        this.searchQuery = searchQuery;
        return this;
    }

    setSearchFields(searchFields) {
        this.searchFields = searchFields;
        return this;
    }

    setSearchOperator(searchOperator) {
        this.searchOperator = searchOperator;
        return this;
    }
}

export default DataSource;