import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class ElRow extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.state = {
            active: false,
            mounted: false
        };

        this.bindMethods('hideRowDetails', 'showRowDetails', 'handleClickOutside', 'renderField', 'attachCloseListener', 'deatachCloseListener');
    }

    componentWillUnmount() {
        this.setState({mounted: false});
        this.deatachCloseListener();
    }

    componentWillMount() {
        this.setState({mounted: true});
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.active === true) {
            this.attachCloseListener();
        } else {
            this.deatachCloseListener();
        }

        return true;
    }

    attachCloseListener(){
        document.addEventListener('click', this.handleClickOutside, true);
    }

    deatachCloseListener(){
        document.removeEventListener('click', this.handleClickOutside, true);
    }

    handleClickOutside(e) {
        if (this.state.active === false || !this.state.mounted) {
            return true;
        }

        const domNode = ReactDOM.findDOMNode(this);

        if ($(domNode).has(e.target).length == 0 && !$(domNode).is(e.target)) {
            // clicked outside
            this.hideRowDetails();
        } else {
            // clicked inside
            return false;
        }
    }

    hideRowDetails() {
        if (this.state.active === false || !this.state.mounted) {
            return true;
        }

        // hide row details
        const details = $(ReactDOM.findDOMNode(this)).find('.expandable-list__row__details:first');
        $(ReactDOM.findDOMNode(this)).removeClass('expandable-list__row--active');
        details.hide();

        // show row content
        $(ReactDOM.findDOMNode(this)).find('div.expandable-list__row__fields:first').show();


        this.setState({active: false});
    }

    showRowDetails() {
        if (this.state.active === true) {
            return true;
        }

        // show row details
        const details = $(ReactDOM.findDOMNode(this)).find('.expandable-list__row__details:first');
        $(ReactDOM.findDOMNode(this)).addClass('expandable-list__row--active');
        details.show();

        // hide row content
        $(ReactDOM.findDOMNode(this)).find('div.expandable-list__row__fields:first').hide();

        this.setState({active: true});
    }

    renderField(field, i) {
        const props = _.omit(field.props, ['children']);
        _.assign(props, {
            data: this.data,
            key: i
        });

        return React.cloneElement(field, props);
    }
}

ElRow.defaultProps = {
    onClick: _.noop,
    renderer() {
        const fields = [];
        let details = '';
        this.props.children.map((child)=> {
            if (child.type == Ui.List.ExpandableList.ElField) {
                fields.push(child);
            } else {
                details = child;
            }
        });

        return (
            <div className="expandable-list__row" onClick={this.showRowDetails}>

                <Ui.Grid.Row className="expandable-list__row__fields">
                    {fields.map(this.renderField)}
                </Ui.Grid.Row>

                <Ui.Grid.Row className="expandable-list__row__details" style={{display: 'none'}}>
                    {this.state.active && details}
                </Ui.Grid.Row>

            </div>
        );
    }
};

export default ElRow;