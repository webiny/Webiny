import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const Table = Ui.List.Table;
import ErrorDetailsJs from './ErrorDetailsJs';
import ErrorDetailsApi from './ErrorDetailsApi';

class ErrorGroup extends Webiny.Ui.View {

}

ErrorGroup.defaultProps = {

    renderer() {

        const statProps = {
            api: '/entities/core/logger-entry',
            query: {errorGroup: this.props.errorGroup.id},
            fields: '*'
        };

        return (
            <Ui.Data {...statProps}>
                {(errorData, filter) => (
                    <Ui.ExpandableList>
                        {errorData.list.map(row => {
                            return (
                                <Ui.ExpandableList.Row key={row.id}>
                                    <Ui.ExpandableList.Field all={6}>{row.url}</Ui.ExpandableList.Field>
                                    <Ui.ExpandableList.Field all={4}>{row.date}</Ui.ExpandableList.Field>

                                    <Ui.ExpandableList.RowDetailsContent title={row.url}>
                                        {() => {
                                            if (this.props.errorGroup.type === 'js') {
                                                return (<ErrorDetailsJs errorEntry={row}/>);
                                            } else {
                                                return (<ErrorDetailsApi errorEntry={row}/>);
                                            }
                                        }}
                                    </Ui.ExpandableList.RowDetailsContent>

                                    <Ui.ExpandableList.ActionSet>
                                        <Ui.ExpandableList.Action label="Resolve Item" icon="icon-check"/>
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