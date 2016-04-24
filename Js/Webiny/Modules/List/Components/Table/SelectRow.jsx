import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class SelectRow extends Webiny.Ui.Component {

}

SelectRow.defaultProps = {
    renderer() {
        return (
            <Ui.Checkbox state={this.props.value} onChange={this.props.onChange}/>
        );
    }
};

export default SelectRow;