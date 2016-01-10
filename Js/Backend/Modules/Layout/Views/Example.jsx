import Webiny from 'Webiny';

class Example extends Webiny.Ui.View {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            domains: []
        };

        this.bindMethods('loadCms');
        this.actions = Webiny.Apps.Core.Backend.Layout.Actions;
    }

    componentDidMount() {
        this.watch('Core.Layout', (data) => {
            this.setState(data);
        });

        if (!Webiny.Model.exists('Core.Layout'.split('.'))) {
            this.actions.loadData();
        }
    }

    loadCms() {
        this.actions.loadCms().then(() => {
            Webiny.Router.reloadRoute();
        });
    }

    render() {
        return (
            <div>
                <p>My name is "{this.state.name || 'Unknown'}"</p>
                <ul>
                    {this.state.domains.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
                <Webiny.Ui.Input label="Email" placeholder="Enter anything"/>
                <button onClick={this.loadCms} className="btn btn-primary">Load CMS app</button>
            </div>
        );
    }
}

export default Example;
