import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Dashboard extends Webiny.Ui.Component {

}

Dashboard.defaultProps = {
    renderer() {
        return (
            <Ui.View.Dashboard>
                <Ui.View.Header title="Welcome to Webiny!" description="This is a demo dashboard! From here you can start developing your almighty app."/>
            </Ui.View.Dashboard>
        );
    }
};

export default Dashboard;