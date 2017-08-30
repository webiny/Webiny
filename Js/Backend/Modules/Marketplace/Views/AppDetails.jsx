import React from 'react';
import Webiny from 'webiny';
import _ from 'lodash';
import styles from './styles.css';
import appImage from 'Assets/mp-images/app-image.png';
import InstallModal from '../Components/InstallModal';
import Sidebar from '../Components/AppDetails/Sidebar';
import Carousel from '../Components/AppDetails/Carousel';
import ContentBlock from '../Components/AppDetails/ContentBlock';
import ss1 from 'Assets/mp-images/ss1.png';
import ss2 from 'Assets/mp-images/ss2.png';
import ss3 from 'Assets/mp-images/ss3.png';
import ss4 from 'Assets/mp-images/ss4.png';
import ss5 from 'Assets/mp-images/ss5.png';

class AppDetails extends Webiny.Ui.View {
    constructor(props) {
        super(props);

        this.state = {
            user: {},
            images: [ss1, ss2, ss3, ss4, ss5]
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

AppDetails.defaultProps = {

    renderer() {

        const {styles, Link, View, Gravatar, Icon, Grid, Section, Button, Tabs} = this.props;

        return (
            <div className={styles.appDetails}>
                <View.Dashboard>
                    <View.Header title="Notification Manager">
                        <Link type="default" route="Marketplace.Browse">Go Back</Link>
                    </View.Header>

                    <View.Body noPadding={true}>

                        <div className={styles.header}>
                            <div className={styles.title}>
                                <img src={appImage} className={styles.logo}/>
                                <div className={styles.titleBlock}>
                                    <h2>Notification Manager</h2>
                                    <p>Manage permissions, create users and assign roles. Create API tokens and monitor requests and
                                        responses for each of them individually.</p>
                                </div>
                            </div>
                            <div className={styles.action}>
                                <Button type="secondary" icon="fa-download" label="Install" onClick={() => this.installModal.show()}/>
                                <InstallModal ref={ref => this.installModal = ref}/>
                            </div>
                        </div>


                        <Tabs>
                            <Tabs.Tab label="Details" icon="fa-home">
                                <Grid.Row>
                                    <Grid.Col all={8}>
                                        <Carousel images={this.state.images}/>
                                        <ContentBlock/>
                                    </Grid.Col>
                                    <Grid.Col all={4}>
                                        <Sidebar/>
                                    </Grid.Col>
                                </Grid.Row>
                            </Tabs.Tab>
                            <Tabs.Tab label="Installation" icon="fa-hdd-o">
                                <Grid.Row>
                                    <Grid.Col all={8}>
                                        <ContentBlock/>
                                    </Grid.Col>
                                    <Grid.Col all={4}>
                                        <Sidebar/>
                                    </Grid.Col>
                                </Grid.Row>
                            </Tabs.Tab>
                        </Tabs>
                    </View.Body>
                </View.Dashboard>
            </div>
        );
    }
};

export default Webiny.createComponent(AppDetails, {
    styles,
    modules: ['View', 'Link', 'Gravatar', 'Icon', 'Grid', 'Section', 'Button', 'Tabs']
});