import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import AddCreditsModal from './AddCreditsModal';

class MyForm extends Ui.Form.Form {
    renderFields() {
        return (
            <fields>
                <Ui.Grid.Row>
                    <Ui.Grid.Col all={6}>
                        <Ui.Input label="First name" name="firstName" validate="required"/>
                    </Ui.Grid.Col>
                    <Ui.Grid.Col all={6}>
                        <Ui.Input label="Last name" name="lastName" validate="required"/>
                    </Ui.Grid.Col>
                    <Ui.Grid.Col all={12}>
                        <Ui.Input label="Email" name="email" validate="required,email" description="Your email"/>
                    </Ui.Grid.Col>
                    <Ui.Grid.Col all={12}>
                        <Ui.Textarea label="Notes" name="notes" description="User notes"/>
                    </Ui.Grid.Col>
                    <Ui.Grid.Col all={12}>
                        <Ui.Button type="primary" label="Add credits" onClick={this.ui('addCreditsModal:show')}/>
                        <AddCreditsModal ui="addCreditsModal"/>
                    </Ui.Grid.Col>
                </Ui.Grid.Row>
                <Ui.Grid.Row>
                    <Ui.Grid.Col all={12}>
                        <Ui.Switch label="Enabled" name="enabled"/>
                    </Ui.Grid.Col>
                </Ui.Grid.Row>
            </fields>
        );
    }
}

export default MyForm;