import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import ErrorDetailsJs from './ErrorDetailsJs';
import ErrorDetailsApi from './ErrorDetailsApi';
import ErrorDetailsPhp from './ErrorDetailsPhp';

class ErrorGroup extends Webiny.Ui.View {

    resolveError(error) {
        /*const api = new Webiny.Api.Endpoint('/entities/logger-entry');
         api.get('resolve/' + error.id).then((response) => {

         });*/
    }

}

ErrorGroup.defaultProps = {

    renderer() {
        const statProps = {
            api: '/entities/core/logger-entry',
            query: {errorGroup: this.props.errorGroup.id, '_sort': '-createdOn'},
            fields: '*'
        };

        return (
            <Ui.Data {...statProps}>
                {(errorData, filter) => (
                    <Ui.ExpandableList>
                        {errorData.list.map(row => {
                            return (
                                <Ui.ExpandableList.Row key={row.id} ui={'error-' + row.id}>
                                    <Ui.ExpandableList.Field all={6}>{row.url}</Ui.ExpandableList.Field>
                                    <Ui.ExpandableList.Field all={4}>
                                        <Ui.Filters.DateTime value={row.date}/>
                                    </Ui.ExpandableList.Field>

                                    <Ui.ExpandableList.RowDetailsContent title={row.url}>
                                        {() => {
                                            if (this.props.errorGroup.type === 'js') {
                                                return (<ErrorDetailsJs errorEntry={row}/>);
                                            } else if (this.props.errorGroup.type === 'php') {
                                                return (<ErrorDetailsPhp errorEntry={row}/>);
                                            } else {
                                                return (<ErrorDetailsApi errorEntry={row}/>);
                                            }
                                        }}
                                    </Ui.ExpandableList.RowDetailsContent>

                                    <Ui.ExpandableList.ActionSet>
                                        <Ui.ExpandableList.Action label="Resolve Item" icon="icon-check"
                                                                  onClick={()=>this.resolveError(row)}/>
                                    </Ui.ExpandableList.ActionSet>

                                </Ui.ExpandableList.Row>
                            );
                        })}
                    </Ui.ExpandableList>
                )}
            </Ui.Data>
        );
    }
};

export default ErrorGroup;