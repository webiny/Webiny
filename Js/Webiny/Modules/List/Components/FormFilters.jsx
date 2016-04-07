import Filters from './Filters';
const Ui = Webiny.Ui.Components;

class FormFilters extends Filters {

    render() {
        const applyFilters = () => (e) => this.refs.form.submit(e);
        const resetFilters = () => () => this.applyFilters({});

        return (
            <webiny-list-filters>
                <Ui.Form.Form ref="form" layout={false} data={this.props.filters} onSubmit={this.applyFilters}>
                    <fields>
                        {this.props.children(applyFilters, resetFilters)}
                    </fields>
                </Ui.Form.Form>
            </webiny-list-filters>
        );
    }
}

export default FormFilters;