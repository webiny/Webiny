import Webiny from 'Webiny';

class RowDetails extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: props.data,
            loading: false,
            loaded: false
        };

        this.bindMethods('loadData,isLoading');

        Webiny.Mixins.ApiComponent.extend(this);
    }

    isLoading() {
        return this.state.loading;
    }

    loadData() {
        return this.api.execute().then(apiResponse => {
            this.setState({loading: false});
            if (apiResponse.isError()) {
                this.props.actions.hideRowDetails(this.props.index);
                return Webiny.Growl.danger(apiResponse.getError(), 'Failed to load data', true);
            }
            this.setState({data: apiResponse.getData(), loaded: true})
        });
    }

    componentWillUpdate(nextProps, nextState) {
        super.componentWillUpdate(nextProps, nextState);
        const newData = !_.isEqual(nextProps.data, this.props.data);
        if (newData || (nextProps.expanded && !this.props.expanded && this.props.api && !this.state.loaded && !this.isLoading())) {
            this.setState({loading: true});
            this.loadData();
        }
    }
}

RowDetails.defaultProps = {
    fieldsCount: 0,
    className: null,
    renderer() {
        return (
            <tr className={this.classSet(this.props.className)} style={{display: this.props.expanded ? 'table-row' : 'none'}}>
                <td colSpan={this.props.fieldsCount}>
                    {this.props.children(this.state.data, this)}
                </td>
            </tr>
        );
    }
};

export default RowDetails;