import Component from './../../../Lib/Component';

class Month extends Component {

    render() {
        return (
            <Webiny.Ui.Components.Form.Select2 {...this.props}>
                <option value="1">01 - Jan</option>
                <option value="2">02 - Feb</option>
                <option value="3">03 - Mar</option>
                <option value="4">04 - Apr</option>
                <option value="5">05 - May</option>
                <option value="6">06 - Jun</option>
                <option value="7">07 - Jul</option>
                <option value="8">08 - Aug</option>
                <option value="9">09 - Sep</option>
                <option value="10">10 - Oct</option>
                <option value="11">11 - Nov</option>
                <option value="12">12 - Dec</option>
            </Webiny.Ui.Components.Form.Select2>
        );
    }
}

export default Month;