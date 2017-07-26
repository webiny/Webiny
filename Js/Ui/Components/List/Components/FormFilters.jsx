import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';
import Filters from './Filters';

class FormFilters extends Filters {

    constructor(props) {
        super(props);

        this.bindMethods('getFilters,submit');
    }

    shouldComponentUpdate(nextProps) {
        return !_.isEqual(nextProps, this.props);
    }

    getFilters() {
        return this.refs.form.getModel();
    }

    submit(model, form) {
        if(_.isFunction(this.props.onSubmit)) {
            this.props.onSubmit(model, form, this.applyFilters);
        } else {
            this.applyFilters(model);
        }
    }
}

FormFilters.defaultProps = {
    defaultModel: null,
    onSubmit: (model, form, applyFilters) => {
        applyFilters(model);
    },
    renderer() {
        const applyFilters = () => (e) => this.refs.form.submit(e);
        const resetFilters = () => () => this.applyFilters({});
        const {Form} = this.props;

        return (
            <Form ref="form" defaultModel={this.props.defaultModel} model={this.props.filters} onSubmit={this.submit}>
                {() => this.props.children(applyFilters, resetFilters)}
            </Form>
        );
    }
};

export default Webiny.createComponent(FormFilters, {modules: ['Form']});