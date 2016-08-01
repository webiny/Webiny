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
                {(errorData, filter, loader) => (
                    <Ui.List.ExpandableList.ExpandableList>
                        {errorData.list.map(row => {
                            return (
                                <Ui.List.ExpandableList.ElRow key={row.id}>
                                    <Ui.List.ExpandableList.ElField all={6}>{row.url}</Ui.List.ExpandableList.ElField>
                                    <Ui.List.ExpandableList.ElField all={4}>{row.date}</Ui.List.ExpandableList.ElField>

                                    <Ui.List.ExpandableList.ElRowDetailsContent title={row.url}>
                                        {() => {
                                            if (this.props.errorGroup.type == 'js') {
                                                return (<ErrorDetailsJs errorEntry={row}/>);
                                            } else {
                                                return (<ErrorDetailsApi errorEntry={row}/>);
                                            }
                                        }}
                                    </Ui.List.ExpandableList.ElRowDetailsContent>

                                    <Ui.List.ExpandableList.ElActionSet>
                                        <Ui.List.ExpandableList.ElAction label="Resolve Item" icon="icon-check"/>
                                    </Ui.List.ExpandableList.ElActionSet>

                                </Ui.List.ExpandableList.ElRow>
                            );
                        })}
                    </Ui.List.ExpandableList.ExpandableList>
                )}
            </Ui.Data>
        );
    }
};

export default ErrorGroup;