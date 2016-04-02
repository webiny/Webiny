import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class CustomLayout extends Webiny.Ui.Component {

    constructor(props){
        super(props);

        this.state = {
            search: props.container.getSearchQuery()
        };
    }

    render() {
        return (
            <Ui.Panel.Panel>
                <Ui.Panel.Header title="Custom element layout">
                    <Ui.Button style={{marginTop: '-10px'}} className="pull-right" type="secondary" label="Page 2" onClick={this.props.container.setPage.bind(null, 2)}/>
                </Ui.Panel.Header>
                <Ui.Panel.Body>
                    <Ui.Input onEnter={e => this.props.container.setSearchQuery(e.target.value)} placeholder="Search..." valueLink={this.bindTo('search')}/>
                    {this.props.table}
                    {this.props.pagination}
                </Ui.Panel.Body>
                <Ui.Panel.Footer>
                    Filters: {this.props.filters}
                </Ui.Panel.Footer>
            </Ui.Panel.Panel>
        );
    }
}

export default CustomLayout;