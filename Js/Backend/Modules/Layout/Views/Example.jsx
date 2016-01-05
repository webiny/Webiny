import Webiny from 'Webiny';

class Example extends Webiny.Ui.View {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            domains: []
        };

        Webiny.Model.set({
            Core: {
                Layout: {
                    name: 'Unknown',
                    domains: [
                        'selecto.app',
                        'huckletree.app',
                        'webiny.app'
                    ]
                }
            }
        });

        this.bindMethods('loadCms');
    }

    componentDidMount() {
        this.watch('Core.Layout', (data) => {
            this.setState(data);
        });
    }

    loadCms(){
        // Load other backend apps
        const api = new Webiny.Api.Service('/apps');
        return api.get('/backend').then(res => {
            let apps = Q();
            _.forIn(res.getData(), config => {
                apps = apps.then(() => {
                    return WebinyBootstrap.includeApp(config.name, config).then(appInstance => {
                        appInstance.addModules(config.modules);
                        _.set(Webiny.Apps, config.name, appInstance);
                        return appInstance.run();
                    });
                });
            });
            return apps.then(() => {
                console.log("RELOADING ROUTE");
                Webiny.Router.reloadRoute();
            });
        });
    }

    render() {
        return (
            <div>
                <p>My name is "{this.state.name || 'Unknown'}"</p>
                <ul>
                    {this.state.domains.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
                <button onClick={this.loadCms} className="btn btn-primary">Load CMS app</button>
            </div>
        );
    }
}

export default Example;
