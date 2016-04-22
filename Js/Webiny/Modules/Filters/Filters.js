class Filters {

	constructor() {
		this.filters = {};
	}

	addFilter(name, callable) {
		if (!_.has(this.filters[name])) {
			this.filters[name] = callable;
		}
		return this;
	}

	getFilter(filter) {
		return this.filters[filter];
	}

	parseFilters(filters) {
		if (!filters) {
			return {};
		}
		const splitFilters = filters.split(',');
		filters = {};
		splitFilters.forEach(v => {
			const filter = v.split(':');
			const vName = filter.shift();
			filters[vName] = filter;
		});
		return filters;
	}

	filter(value, filters) {
		_.forEach(this.parseFilters(filters), (params, filter) => {
			value = this.getFilter(filter)(value, ...params);
		});
		return value;
	}
}

const filter = new Filters();

export default filter;