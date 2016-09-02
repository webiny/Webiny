import Webiny from 'Webiny';
import Filters from './Filters';
const Ui = Webiny.Ui.Components;

class FormFilters extends Filters {

    constructor(props) {
        super(props);

        this.bindMethods('getFilters');
    }

    shouldComponentUpdate(nextProps) {
        return !_.isEqual(nextProps, this.props);
    }

    getFilters() {
        return this.refs.form.getModel();
    }
}

FormFilters.defaultProps = {
    defaultModel: null,
    renderer() {
        const applyFilters = () => (e) => this.refs.form.submit(e);
        const resetFilters = () => () => this.applyFilters({});

        return (
            <Ui.Form.Container ref="form" defaultModel={this.props.defaultModel} model={this.props.filters} onSubmit={this.applyFilters}>
                {() => this.props.children(applyFilters, resetFilters)}
            </Ui.Form.Container>
        );
    }
};

export default FormFilters;