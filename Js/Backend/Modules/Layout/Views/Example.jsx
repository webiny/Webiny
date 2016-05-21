import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Example extends Webiny.Ui.View {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            domains: [],
            model: {
                email: 'pavel@webiny.com',
                name: '',
                brand: 'webiny'
            }
        };

        this.bindMethods('loadCms,submit');
        this.actions = Webiny.Apps.Core.Backend.Layout.Actions;
    }

    componentDidMount() {
        this.watch('Core.Layout', (data) => {
            this.setState(data);
        });

        if (!Webiny.Model.exists('Core.Layout'.split('.'))) {
            this.actions.loadData('Pavel');
        }
    }

    loadCms() {
        this.actions.loadCms().then(() => {
            Webiny.Router.reloadRoute();
        });
    }

    submit(model) {
        _.merge(this.state.model, model);
        this.setState(this.state, () => {
            console.log('NEW PARENT STATE', this.state.model);
        });
    }

    render() {
        const firstFormProps = {
            layout: false,
            ui: 'myForm',
            title: 'Webiny Form',
            data: this.state.model,
            onSubmit: this.submit,
            linkedForms: 'mySecondForm,myThirdForm',
            onReset: this.ui('tabs:selectTab', 0),
            onInvalid: this.ui('tabs:selectTab', 0)
        };

        const secondFormProps = {
            layout: false,
            ui: 'mySecondForm',
            data: this.state.model,
            onInvalid: this.ui('tabs:selectTab', 1)
        };

        const thirdFormProps = {
            layout: false,
            ui: 'myThirdForm',
            data: this.state.model,
            onInvalid: this.ui('tabs:selectTab', 2)
        };

        return (
            <div>
                <p>My name is "{this.state.name || 'Unknown'}" and my email is "{this.state.model.email}"</p>
                <ul>
                    {this.state.domains.map((item, i) => <li key={i}>{item}</li>)}
                </ul>

                <Ui.Button type="primary" onClick={this.loadCms} label="Load CMS"/>

                <Ui.Panel.Panel>
                    <Ui.Panel.Header title="Webiny Form"/>
                    <Ui.Panel.Body>
                        <Ui.Tabs.Tabs ui="tabs">
                            <Ui.Tabs.Tab label="First Tab">
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={12}>
                                        <Ui.Input label="Email" name="email" validate="required,email"/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                            </Ui.Tabs.Tab>
                            <Ui.Tabs.Tab label="Second tab">
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={12}>
                                        <Ui.Input label="Name" name="name" validate="required"/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                            </Ui.Tabs.Tab>
                            <Ui.Tabs.Tab label="Third tab">
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={12}>
                                        <Ui.Input label="Brand" name="brand" validate="required"/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                            </Ui.Tabs.Tab>
                        </Ui.Tabs.Tabs>
                    </Ui.Panel.Body>
                    <Ui.Panel.Footer className="text-right">
                        <Ui.Button type="default" onClick={this.ui('myForm:cancel')} label="Cancel"/>
                        <Ui.Button type="secondary" onClick={this.ui('myForm:reset')} label="Reset"/>
                        <Ui.Button type="primary" onClick={this.ui('myForm:submit')} label="Submit"/>
                    </Ui.Panel.Footer>
                </Ui.Panel.Panel>
            </div>
        );
    }
}

export default Example;
