import ValidationError from './ValidationError';

class Validator {

    constructor() {
        this.validators = {};
    }

    addValidator(name, callable) {
        if (!_.has(this.validators[name])) {
            this.validators[name] = callable;
        }
        return this;
    }

    getValidator(name) {
        if (!this.validators[name]) {
            throw new ValidationError('Validator `' + name + '` does not exist!', name);
        }
        return this.validators[name];
    }

    parseValidateProperty(validators) {
        if (!validators) {
            return false;
        }
        const validate = validators.split(',');
        validators = {};
        validate.forEach(v => {
            const validator = v.split(':');
            const vName = validator.shift();
            validators[vName] = validator;
        });
        return validators;
    }

    parseCustomValidationMessages(elements) {
        const customMessages = {};

        if (!elements) {
            return customMessages;
        }

        const isArray = elements instanceof Array;
        if (!isArray) {
            elements = [elements];
        }

        elements.forEach(item => {
            if (item.type === 'validator' && item.props.children) {
                customMessages[item.props.name] = item.props.children;
            }
        });

        return customMessages;
    }

    validate(value, validators, formInputs) {
        if (!validators) {
            validators = {};
        }
        const _this = this;
        let chain = Q({valid: true});
        Object.keys(validators).forEach(v => {
            const args = _.clone(validators[v]);
            this.parseArgs(args, formInputs);
            args.unshift(value);
            chain = chain.then(function validationLink() {
                return Q.when(_this.getValidator(v)(...args)).then(valid => {
                    if (valid !== true) {
                        throw new ValidationError(valid, v);
                    }
                    return valid;
                });
            });
        });
        return chain;
    }

    /**
     * Insert dynamic values into validator arguments
     *
     * @param args
     * @param formInputs
     */
    parseArgs(args, formInputs) {
        _.each(args, (value, index) => {
            if (value.indexOf('@') === 0) {
                const inputName = _.trimStart(value, '@');
                args[index] = formInputs[inputName].component.getValue();
            }
        });
    }
}

const formValidator = new Validator();

formValidator.addValidator('required', (value) => {
    if (!(!value || value === '')) {
        return true;
    }
    return 'This field is required';
});

formValidator.addValidator('eq', (value, equalTo) => {
    if (!value || value === equalTo) {
        return true;
    }
    return 'This field must be equal to ' + equalTo;
});

formValidator.addValidator('minLength', (value, length) => {
    if (_.isObject(value)) {
        value = Webiny.Tools.keys(value);
    }
    if (value.length && value.length >= length) {
        return true;
    }
    return 'This field requires at least ' + length + ' characters';
});

formValidator.addValidator('maxLength', (value, length) => {
    if (_.isObject(value)) {
        value = Webiny.Tools.keys(value);
    }

    if (value.length && value.length <= length) {
        return true;
    }
    return 'This field requires ' + length + ' characters at most';
});

formValidator.addValidator('gt', (value, min) => {
    if (!value || parseFloat(value) > parseFloat(min)) {
        return true;
    }
    return 'This field needs to be greater than ' + min;
});

formValidator.addValidator('lt', (value, max) => {
    if (!value || parseFloat(value) < parseFloat(max)) {
        return true;
    }

    return 'This field needs to be less than ' + max;
});

formValidator.addValidator('gte', (value, min) => {
    if (!value || parseFloat(value) >= parseFloat(min)) {
        return true;
    }
    return 'This field needs to be greater than or equal to ' + min;
});

formValidator.addValidator('lte', (value, max) => {
    if (!value || parseFloat(value) <= parseFloat(max)) {
        return true;
    }

    return 'This field needs to be less than or equal to ' + max;
});

formValidator.addValidator('number', (value) => {
    const re = new RegExp('^\-?[0-9.]+$');
    if (!value || (re.test(value))) {
        return true;
    }
    return 'This field needs to be a number';
});

formValidator.addValidator('integer', (value) => {
    const re = new RegExp('^\-?[0-9]+$');
    if (!value || (re.test(value))) {
        return true;
    }
    return 'This field needs to be an integer';
});

formValidator.addValidator('email', (value) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!value || (value.length && re.test(value))) {
        return true;
    }
    return 'Please enter a valid email address';
});

formValidator.addValidator('password', (value) => {
    if (!value || ['dev', 'admin'].indexOf(value) > -1) {
        return true;
    }

    const test = value.match(/^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d).*$/);
    if (test === null) {
        return 'Password must contain at least 8 characters, minimum one letter and one number';
    }
    return true;
});

formValidator.addValidator('phone', (value) => {
    if (!value || value.match(/^[-+0-9()\s]+$/)) {
        return true;
    }
    return 'Please enter a valid phone number';
});


formValidator.addValidator('url', (value) => {
    const regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if (!value || regex.test(value)) {
        return true;
    }

    return 'Please enter a valid URL';
});

formValidator.addValidator('creditCard', (value) => {
    if (!value) {
        return true;
    }

    if (value.length < 12) {
        return 'Credit card number too short';
    }

    if (/[^0-9-\s]+/.test(value)) return 'Credit card number invalid';

    let nCheck = 0;
    let nDigit = 0;
    let bEven = false;

    value = value.replace(/ /g, '');
    value = value.replace(/\D/g, '');

    for (let n = value.length - 1; n >= 0; n--) {
        const cDigit = value.charAt(n);
        nDigit = parseInt(cDigit);

        if (bEven) {
            nDigit *= 2;
            if (nDigit > 9) {
                nDigit -= 9;
            }
        }

        nCheck += nDigit;
        bEven = !bEven;
    }

    return (nCheck % 10) === 0 ? true : 'Credit card number invalid';
});

formValidator.addValidator('creditCardExpiration', (value) => {
    if (_.isPlainObject(value) && !isNaN(parseInt(value.month)) && !isNaN(parseInt(value.year))) {
        return true;
    }

    return 'Please select month and year';
});

export default formValidator;