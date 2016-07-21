import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class ElRowDetailsList extends Webiny.Ui.Component {

}

ElRowDetailsList.defaultProps = {
    renderer() {
        let content = this.props.children;
        if (_.isFunction(this.props.children)) {
            content = this.props.children.call(this, this.props.data, this);
        }

        return (
            <Ui.Grid.Row>
                <Ui.Grid.Col all={12}>
                    {content}
                </Ui.Grid.Col>
            </Ui.Grid.Row>
        );
    }
};

export default ElRowDetailsList;