import Webiny from 'Webiny';

class Dashboard extends Webiny.Ui.Component {

}

Dashboard.defaultProps = {
    renderer() {
        return (
            <Webiny.Ui.LazyLoad modules={['View']}>
                {(Ui) => (
                    <Ui.View.Dashboard>
                        <Ui.View.Header
                            title="Welcome to Webiny!"
                            description="This is a demo dashboard! From here you can start developing your almighty app."/>
                    </Ui.View.Dashboard>
                )}
            </Webiny.Ui.LazyLoad>
        );
    }
};

export default Dashboard;