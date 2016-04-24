import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class SelectAll extends Webiny.Ui.Component {

}

SelectAll.defaultProps = {
    renderer() {
        return (
            <Ui.Checkbox state={this.props.value} onChange={this.props.onChange}/>
        );
    }
};

export default SelectAll;