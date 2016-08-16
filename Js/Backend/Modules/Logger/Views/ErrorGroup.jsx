import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import ErrorDetailsJs from './ErrorDetailsJs';
import ErrorDetailsApi from './ErrorDetailsApi';
import ErrorDetailsPhp from './ErrorDetailsPhp';

class ErrorGroup extends Webiny.Ui.View {

    resolveError(error, list) {
        const api = new Webiny.Api.Endpoint('/entities/core/logger-entry');
        api.get('resolve/' + error.id).then((response) => {
            if (response.data.data.errorCount < 1) {
                this.props.errorGroupList.loadData();
            } else {
                list.loadData();
            }
        });
    }
}

ErrorGroup.defaultProps = {

    renderer() {
        const statProps = {
            api: '/entities/core/logger-entry',
            query: {errorGroup: this.props.errorGroup.id, '_sort': '-createdOn'},
            fields: '*',
            layout: null
        };

        const ErrorDetails = {
            js: ErrorDetailsJs,
            php: ErrorDetailsPhp,
            api: ErrorDetailsApi
        };

        return (
            <Ui.List.ApiContainer {...statProps}>
                {(errorData, meta, list) => (
                    <Ui.ExpandableList>
                        {errorData.map(row => {
                            return (
                                <Ui.ExpandableList.Row key={row.id}>
                                    <Ui.ExpandableList.Field all={6}>{row.url}</Ui.ExpandableList.Field>
                                    <Ui.ExpandableList.Field all={4}>
                                        <Ui.Filters.DateTime value={row.date}/>
                                    </Ui.ExpandableList.Field>

                                    <Ui.ExpandableList.RowDetailsContent title={row.url}>
                                        {() => {
                                            return React.createElement(ErrorDetails[this.props.errorGroup.type], {errorEntry: row});
                                        }}
                                    </Ui.ExpandableList.RowDetailsContent>

                                    <Ui.ExpandableList.ActionSet>
                                        <Ui.ExpandableList.Action
                                            label="Resolve Item"
                                            icon="icon-check"
                                            onClick={()=>this.resolveError(row, list)}/>
                                    </Ui.ExpandableList.ActionSet>

                                </Ui.ExpandableList.Row>
                            );
                        })}
                    </Ui.ExpandableList>
                )}
            </Ui.List.ApiContainer>
        );
    }
};

export default ErrorGroup;