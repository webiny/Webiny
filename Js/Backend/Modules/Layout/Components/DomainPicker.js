import Webiny from 'Webiny';

class DomainPicker extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.state = {
            domains: [
                {name: 'www.booking.com'},
                {name: 'www.facebook.com'},
                {name: 'www.google.com'}
            ]
        };
    }

    renderDomain(item, key) {
        return (
            <li key={key} role="presentation"><a role="menuitem" href="#">{item.name}</a></li>
        );
    }
}

DomainPicker.defaultProps = {
    renderer() {
        return (
            <div className="domain-picker">
                <div className="dropdown">
                    <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown">
                        <span className="domain-name">{this.state.domains[0].name}</span>
                        <span className="caret"></span>
                    </button>
                    <ul className="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
                        <li role="presentation" className="spec"><a role="menuitem" href="#"> + {this.props.actionLabel}</a></li>
                        {this.state.domains.map(this.renderDomain)}
                    </ul>
                </div>
                {/* <w-link href="#" className="open">
                 <span className="icon-external-link icon"></span>
                 </w-link> */}
            </div>
        );
    }
};

export default DomainPicker;
