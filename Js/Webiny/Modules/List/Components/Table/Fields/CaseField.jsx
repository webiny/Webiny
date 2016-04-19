import Field from './../Field';

class CaseField extends Field {

}

CaseField.defaultProps = {
    includeTd: true,
    renderer() {
        let content = null;
        let defaultContent = null;
        _.each(React.Children.toArray(this.props.children), child => {
            if (child.type === 'default') {
                defaultContent = child.props.children;
                return;
            }
            const value = child.props.value;
            if (_.isFunction(value) && value(this.props.data) === true || value === _.get(this.props.data, this.props.name)) {
                content = child.props.children;
            }
        });

        if (!content) {
            content = defaultContent;
        }

        if (_.isFunction(content)) {
            content = content.call(this);
        }

        if (this.props.includeTd) {
            return <td className={this.getTdClasses()}>{content}</td>;
        }

        return content;
    }
};

export default CaseField;