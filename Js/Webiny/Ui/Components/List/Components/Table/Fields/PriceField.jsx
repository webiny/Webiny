import Field from './../Field';
import {accounting} from 'accounting';

class PriceField extends Field {

}

PriceField.defaultProps = _.merge({}, Field.defaultProps, {
    renderer() {
        const value = _.get(this.props.data, this.props.name);

        return (
            <td className={this.getTdClasses()}>{value ? accounting.formatMoney(value) : this.props.default}</td>
        );
    }
});

export default PriceField;