import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class EditModalAction extends Webiny.Ui.Component {

}

EditModalAction.defaultProps = {
    label: 'Edit',
    renderer() {
        const $this = this;
        return (
            <Ui.List.Table.ModalAction {..._.pick($this.props, 'data', 'actions', 'label', 'hide')}>
                {function render(data, actions, modal) {
                    const props = _.omit($this.props.children.props, ['key', 'ref']);
                    _.assign(props, {data, actions, modal});
                    return React.cloneElement($this.props.children, props);
                }}
            </Ui.List.Table.ModalAction>
        );
    }
};

export default EditModalAction;