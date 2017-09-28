import Webiny from 'webiny';

class MoneyModifier {
    getName() {
        return 'money';
    }

    execute(value) {
        return Webiny.I18n.money(value)
    }
}

export default MoneyModifier;