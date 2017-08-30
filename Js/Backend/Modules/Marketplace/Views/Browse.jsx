import React from 'react';
import Webiny from 'webiny';
import _ from 'lodash';
import styles from './styles.css';
import AppBox from './../Components/AppBox';


class Browse extends Webiny.Ui.View {
    constructor(props) {
        super(props);

        this.state = {
            user: {}
        };
    }

    componentDidMount() {
        super.componentDidMount();
        this.watch('User', user => {
            this.setState({user});
        });
    }

    getUserName() {
        const user = this.state.user;
        if (_.get(user, 'firstName', '') === '') {
            return _.get(user, 'email', '');
        }

        return _.get(user, 'firstName', '');
    }
}

Browse.defaultProps = {

    renderer() {

        const {styles, Link, View, Gravatar, Icon, Grid} = this.props;

        return (
            <div className={styles.browse}>
                <View.Dashboard>
                    <View.Header title="Browse">
                        <View.Header.Center>
                            <div className="user-welcome">
                                <div className="user-welcome__avatar">
                                    <div className="avatar avatar--inline avatar--small">
                                    <span className="avatar-placeholder avatar-placeholder--no-border">
                                        <Gravatar className="avatar img-responsive" hash={this.state.user.gravatar} size="50"/>
                                    </span>
                                    </div>
                                </div>
                                <h3 className="user-welcome__message">Hi {this.getUserName()}</h3>
                            </div>
                        </View.Header.Center>
                        <Link type="default" url="https://www.webiny.com/my-profile" newTab={true}><Icon icon="fa-cog"/> Manage Account</Link>
                    </View.Header>

                    <View.Body>
                        <Grid.Row className={styles.appList}>
                            <Grid.Col all={6}>
                                <AppBox/>
                            </Grid.Col>
                        </Grid.Row>
                    </View.Body>
                </View.Dashboard>
            </div>
        );
    }
};

export default Webiny.createComponent(Browse, {styles, modules: ['View', 'Link', 'Gravatar', 'Icon', 'Grid']});