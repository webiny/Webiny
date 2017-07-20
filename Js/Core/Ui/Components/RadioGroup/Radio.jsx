import React from 'react';
import _ from 'lodash';
import Webiny from 'Webiny';
import styles from './styles.css';

class Radio extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.id = _.uniqueId('radio-');
        this.bindMethods('onChange');
    }

    onChange() {
        this.props.onChange(this.props.option);
    }
}

Radio.defaultProps = {
    disabled: false,
    label: '',
    className: '',
    option: null,
    optionIndex: null,
    value: false,
    renderer() {
        const css = this.classSet(this.props.styles.radio, this.props.className, 'col-sm-' + this.props.grid);

        return (
            <div className={css}>
                <input type="radio" disabled={this.props.disabled} onChange={this.onChange} checked={this.props.value} id={this.id}/>
                <label htmlFor={this.id}>{this.props.label}</label>
            </div>
        );
    }
};

export default Webiny.createComponent(Radio, {styles});