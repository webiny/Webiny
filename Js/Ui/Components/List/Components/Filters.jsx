import React from 'react';
import Webiny from 'Webiny';

class Filters extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.bindMethods('applyFilters');
    }

    applyFilters(filters) {
        this.props.onFilter(filters);
    }
}

Filters.defaultProps = {
    renderer() {
        const applyFilters = filters => () => this.applyFilters(filters);
        const resetFilters = () => () => this.applyFilters({});
        return (
            <webiny-list-filters>{this.props.children(applyFilters, resetFilters)}</webiny-list-filters>
        );
    }
};

export default Filters;