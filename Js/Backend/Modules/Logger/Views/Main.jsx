import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import ListErrors from './ListErrors';

class Main extends Webiny.Ui.View {

}

Main.defaultProps = {
    renderer() {
        return (
            <Ui.View.List>
                <Ui.View.Header title="Logger"/>

                <Ui.View.Body noPadding={true}>

                    <Ui.Tabs size="large">
                        <Ui.Tabs.Tab label="JavaScript" icon="fa-code">
                            <ListErrors type="js"/>
                        </Ui.Tabs.Tab>

                        <Ui.Tabs.Tab label="PHP" icon="fa-file-code-o">
                            <ListErrors type="php"/>
                        </Ui.Tabs.Tab>

                        <Ui.Tabs.Tab label="Api" icon="fa-rocket">
                            <ListErrors type="api"/>
                        </Ui.Tabs.Tab>
                    </Ui.Tabs>

                </Ui.View.Body>
            </Ui.View.List>

        );
    }
};

export default Main;