import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import Webiny from 'Webiny';

class CodeEditor extends Webiny.Ui.FormComponent {
    constructor(props) {
        super(props);

        this.delayedOnChange = null;
        this.codeMirror = null;
        this.options = {
            lineNumbers: true,
            htmlMode: true,
            mode: props.mode, // needs to be built into CodeMirror vendor
            theme: props.theme, // needs to be built into CodeMirror vendor
            readOnly: props.readOnly
        };

        this.bindMethods('getTextareaElement,setValue,focus');
    }

    componentDidMount() {
        super.componentDidMount();

        this.codeMirror = this.props.CodeMirror.fromTextArea(this.getTextareaElement(), this.options);

        this.codeMirror.on('change', () => {
            clearTimeout(this.delayedOnChange);
            this.delayedOnChange = setTimeout(() => {
                this.props.onChange(this.codeMirror.getValue());
            }, this.props.delay);
        });

        this.codeMirror.on('focus', () => {
            this.props.onFocus();
        });

        this.setValue(this.props);
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        this.setValue(props);

        const checkProps = ['mode', 'readOnly'];
        _.each(checkProps, (prop) => {
            if (this.props[prop] !== props[prop]) {
                this.codeMirror.setOption(prop, props[prop]);
            }
        });
    }

    shouldComponentUpdate() {
        return false;
    }

    setValue(props) {
        if (this.codeMirror.getValue() !== props.value && !_.isNull(props.value)) {
            // the "+ ''" sort a strange with splitLines method within CodeMirror
            this.codeMirror.setValue(props.value + '');
        }
    }

    getTextareaElement() {
        return ReactDOM.findDOMNode(this).querySelector('textarea');
    }

    focus() {
        this.codeMirror.focus();
    }
}

CodeEditor.defaultProps = _.merge({}, Webiny.Ui.FormComponent.defaultProps, {
    delay: 400,
    mode: 'text/html',
    theme: 'monokai',
    readOnly: false, // set 'nocursor' to disable cursor
    onFocus: _.noop,
    value: null,
    onChange: _.noop,
    renderer() {
        const props = _.pick(this.props, ['value', 'onChange', 'onFocus', 'theme', 'mode', 'readOnly']);

        _.assign(props, {
            ref: (editor) => this.editor = editor,
            onBlur: this.validate,
            className: 'inputGroup',
            placeholder: this.getPlaceholder()
        });

        const {FormGroup} = this.props;

        return (
            <FormGroup valid={this.state.isValid} className={this.props.className}>
                {this.renderLabel()}
                <textarea/>
                {this.renderDescription()}
                {this.renderValidationMessage()}
            </FormGroup>
        );
    }
});

export default Webiny.createComponent(CodeEditor, {
    modules: ['FormGroup', {CodeMirror: 'Webiny/Vendors/CodeMirror'}],
    api: ['focus']
});