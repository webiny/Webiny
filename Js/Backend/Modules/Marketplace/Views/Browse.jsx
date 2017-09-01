import React from 'react';
import Webiny from 'webiny';
import styles from './styles.css';
import AppBox from './../Components/AppBox';
import LoginRegister from './LoginRegister';
import User from './../Components/User';

class Browse extends Webiny.Ui.View {
    constructor(props) {
        super(props);

        this.state = {
            apps: [],
            user: null,
            loadingUser: false
        };

        this.bindMethods('onUser');
    }

    componentWillMount() {
        super.componentWillMount();
        this.setState({loadingUser: true});
        new Webiny.Api.Endpoint('/services/webiny/marketplace').get('/me').then(apiResponse => {
            if (!apiResponse.isError()) {
                this.setState({user: apiResponse.getData()});
                this.loadApps();
            }
            this.setState({loadingUser: false});
        });
    }

    loadApps() {
        new Webiny.Api.Endpoint('/services/webiny/marketplace').get('/apps').then(apiResponse => {
            this.setState({apps: apiResponse.getData('list')});
        });
    }

    onUser(user) {
        this.setState({user});
    }

    renderBody() {
        const {styles, Grid, Loader} = this.props;
        if (this.state.loadingUser) {
            return <Loader/>;
        }

        if (!this.state.user) {
            return (
                <LoginRegister onUser={this.onUser}/>
            );
        }

        const {Link, View, Icon} = this.props;

        return (
            <div className={styles.browse}>
                <View.Dashboard>
                    <View.Header title="Marketplace">
                        <View.Header.Center>
                            <User user={this.state.user}/>
                        </View.Header.Center>
                        {this.props.appDetails ?
                            <Link type="default" route="Marketplace.Browse">Go Back</Link> :
                            <Link type="default" url="https://www.webiny.com/my-profile" newTab={true} renderIf={this.state.user}>
                                <Icon icon="fa-cog"/> Manage Account
                            </Link>
                        }
                    </View.Header>
                    <View.Body>
                        <Webiny.Ui.Placeholder name="Apps">
                            <Grid.Row className={styles.appList}>
                                {this.state.apps && this.state.apps.map(app => (
                                    <Grid.Col all={6} key={app.id}>
                                        <AppBox app={app}/>
                                    </Grid.Col>
                                ))}
                            </Grid.Row>
                        </Webiny.Ui.Placeholder>
                    </View.Body>
                </View.Dashboard>
            </div>
        );
    }
}

Browse.defaultProps = {
    renderer() {
        return this.renderBody();
    }
};

export default Webiny.createComponent(Browse, {styles, modules: ['View', 'Link', 'Icon', 'Grid', 'Loader']});