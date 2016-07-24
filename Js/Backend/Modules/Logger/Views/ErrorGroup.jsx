import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const Table = Ui.List.Table;
import ErrorDetails from './ErrorDetails';

class ErrorGroup extends Webiny.Ui.View {

}

ErrorGroup.defaultProps = {

    renderer() {

        console.log('render group:' + this.props.errorGroupId);

        const statProps = {
            api: '/entities/core/logger-entry',
            query: {errorGroup: this.props.errorGroupId},
            fields: '*'
        };

        return (
            <Ui.Data {...statProps}>
                {errorData => (
                    <Ui.List.ExpandableList.ExpandableList name={this.props.errorGroupName}>
                        {errorData.list.map(row => {
                            return (
                                <Ui.List.ExpandableList.ElRow key={row.id}>
                                    <Ui.List.ExpandableList.ElField all={8}>{row.url}</Ui.List.ExpandableList.ElField>
                                    <Ui.List.ExpandableList.ElField all={2}>{row.date}</Ui.List.ExpandableList.ElField>

                                    <Ui.List.ExpandableList.ElRowDetailsContent>
                                        <ErrorDetails errorEntry={row.id} url={row.url}/>
                                    </Ui.List.ExpandableList.ElRowDetailsContent>

                                    <Ui.List.ExpandableList.ElActionSet>
                                        <Ui.List.ExpandableList.ElAction label="Resolve Item" icon="icon-check" />
                                    </Ui.List.ExpandableList.ElActionSet>

                                </Ui.List.ExpandableList.ElRow>
                            );
                        })}
                        <Ui.List.ExpandableList.ElActionSet>
                            <Ui.List.ExpandableList.ElAction label="Resolve Group" icon="icon-check" />
                        </Ui.List.ExpandableList.ElActionSet>
                    </Ui.List.ExpandableList.ExpandableList>
                )}
            </Ui.Data>
        );
    }
};

export default ErrorGroup;