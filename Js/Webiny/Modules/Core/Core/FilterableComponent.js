import ApiEndpoint from './../Api/Endpoint';

class FilterableComponent {
    static extend(context) {
        if (!context.applyFilter) {
            console.warn('Warning: component "' + context.getClassName() + '" must implement an "applyFilter" method!');
            return;
        }

        if (context.props.filterBy) {
            // Assume the most basic form of filtering (single string)
            let name = context.props.filterBy;
            let filter = context.props.filterBy;
            let loadIfEmpty = true;

            // Check if filterBy is defined as array (0 => name of the input to watch, 1 => filter by field)
            if (_.isArray(context.props.filterBy)) {
                name = context.props.filterBy[0];
                filter = context.props.filterBy[1];
            }

            // Check if filterBy is defined as object
            if (_.isPlainObject(context.props.filterBy)) {
                name = context.props.filterBy.name;
                filter = context.props.filterBy.filter;
                loadIfEmpty = context.props.filterBy.loadIfEmpty;
            }

            context.unwatch = context.props.form.watch(name, newValue => context.applyFilter(newValue, name, filter, loadIfEmpty));
        }
    }
}

export default FilterableComponent;