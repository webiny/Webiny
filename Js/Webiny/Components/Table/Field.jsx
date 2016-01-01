/**
 * This is the default output for each field - when no custom renderer method or existing
 * custom field exists (eg. Toggle) - first it checks if there is a mask defined,
 * after that it will apply filter if it was defined in the table config
 * @returns {XML}
 */
function outputDefault(row, field) {
    var output = _.get(row, field.props.name);
    if (field.props.mask) {
        output = outputTdMask(row, field, field.props.mask);
    }

    if (field.props.filter) {
        output = Webiny.Ui.Components.Filter.apply(output, field.props.filter);
    }

    return <td {...getTdProps(field)}>{output}</td>;
}

function outputTdMask(row, field, mask) {
    if (_.isFunction(mask)) {
        return mask(row);
    }

    var output = field.props.mask;
    var placeholders = output.match(/[^{}]+(?=\})/g);
    if (placeholders) {
        placeholders.forEach(placeholder => {
            output = output.replace('{' + placeholder + '}', _.get(row, placeholder));
        })
    }
    return output;
}

function getTdProps(field) {
    return {
        className: field.props.align ? 'text-' + field.props.align : 'text-center',
        key: 'table-tr-td-' + field.props.name
    };
}

class Field  {

    constructor(row, field, context, table) {
        this.row = row;
        this.field = field;
        this.context = context;
        this.table = table;
    }

    render() {
        var renderMethodName = 'field' + _.capitalize(this.field.props.name);
        if (this.context[renderMethodName]) {
            var element = this.context[renderMethodName](this.row, this);
            if (_.isString(element)) {
                Webiny.Console.warn(`Custom render method '${renderMethodName}' returned a string, it needs to return JSX.`);
            }
            return (
                <td {...getTdProps(this.field)}>
                    {React.cloneElement(element, {context: this.context}, element.props.children)}
                </td>
            );
        }

        var Field = Webiny.Ui.Components.Table.Field[_.capitalize(this.field.props.name)];
        if (Field) {
            return (
                <td {...getTdProps(this.field)}>
                    <Field data={this.row} context={this}/>
                </td>
            );
        }

        return outputDefault(this.row, this.field);
    }

}

export default Field;