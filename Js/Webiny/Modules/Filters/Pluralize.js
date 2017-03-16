import Webiny from 'Webiny';

class Pluralize extends Webiny.Ui.Component {

}

Pluralize.defaultProps = {
    suffix: 's',
    plural: null,
    count: null,
    noun: null,
    pattern: '$count$ $noun$',
    renderer() {
        let noun = this.props.noun;
        if (this.props.count !== 1) {
            if (this.props.plural) {
                noun = this.props.plural;
            } else {
                noun = this.props.noun + this.props.suffix;
            }
        }

        let result = this.props.pattern.replace('$count$', this.props.count);
        result = result.replace('$noun$', noun);

        return <span>{result}</span>
    }
};


export default Pluralize;
