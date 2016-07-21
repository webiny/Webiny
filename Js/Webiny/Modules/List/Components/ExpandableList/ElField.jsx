import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class ElField extends Webiny.Ui.Component {

}

ElField.defaultProps = {
    renderer() {
        let content = this.props.children;
        if (_.isFunction(this.props.children)) {
            content = this.props.children.call(this, this.props.data, this);
        }

        let className = _.union([], ['expandable-list__row__fields__field'], [this.props.className]);
        className = _.join(className, ' ');

        return (
            <Ui.Grid.Col all={this.props.all} align={this.props.align} className={className}>{content}</Ui.Grid.Col>
        );
    }
};

export default ElField;