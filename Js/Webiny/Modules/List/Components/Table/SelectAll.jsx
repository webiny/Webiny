import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class SelectAll extends Webiny.Ui.Component {

}

SelectAll.defaultProps = {
    renderer() {
        return (
            <th className="small-col">
                <Ui.Checkbox state={this.props.value} onChange={this.props.onChange} className="checkbox--no-desc"/>
            </th>
        );
    }
};

export default SelectAll;