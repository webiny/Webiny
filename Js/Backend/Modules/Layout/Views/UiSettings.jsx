import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class UiSettings extends Webiny.Ui.Component {

    render() {
        const firstFormProps = {
            layout: false,
            ui: 'myForm',
            title: this.props.title,
            data: this.props.model,
            onSubmit: this.props.onSubmit
        };

        return (
            <Ui.Panel.Panel>
                <Ui.Panel.Header title={this.props.title}/>
                <Ui.Panel.Body>
                    <Ui.Form {...firstFormProps}>
                        <fields>
                            <Ui.Grid.Row>
                                <Ui.Grid.Col all={12}>
                                    <Ui.Input label="Email" name="email" validate="required,email"/>
                                </Ui.Grid.Col>
                            </Ui.Grid.Row>
                        </fields>
                    </Ui.Form>
                </Ui.Panel.Body>
                <Ui.Panel.Footer className="text-right">
                    <Ui.Button type="primary" onClick={this.signal('myForm:submit')} label="Submit"/>
                </Ui.Panel.Footer>
            </Ui.Panel.Panel>
        );
    }
}

export default UiSettings;