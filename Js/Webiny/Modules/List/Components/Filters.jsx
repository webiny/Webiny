import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Filters extends Webiny.Ui.Component {

    render() {
        return (
            <webiny-list-filters>{this.props.children}</webiny-list-filters>
        );
    }
}

export default Filters;