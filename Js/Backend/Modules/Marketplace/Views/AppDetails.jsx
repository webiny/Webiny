import React from 'react';
import Webiny from 'webiny';
import styles from './styles.css';
import InstallModal from '../Components/InstallModal';
import Sidebar from '../Components/AppDetails/Sidebar';
import Carousel from '../Components/AppDetails/Carousel';
import ContentBlock from '../Components/AppDetails/ContentBlock';

class AppDetails extends Webiny.Ui.View {
    componentWillMount() {
        super.componentWillMount();
        this.setState({loading: true});
        const id = Webiny.Router.getParams('id');
        new Webiny.Api.Endpoint('/services/webiny/marketplace').get(`apps/${id}`).then(apiResponse => {
            this.setState({loading: false, app: apiResponse.getData('entity')});
        })
    }
}

AppDetails.defaultProps = {
    renderer() {
        const {loading, app} = this.state;
        const {styles, Link, View, Grid, Button, Tabs, Loader} = this.props;

        if (loading) {
            return <Loader>Fetching app details...</Loader>;
        }

        return (
            <div className={styles.appDetails}>
                <div className={styles.header}>
                    <div className={styles.title}>
                        <img src={app.logo.src} className={styles.logo}/>
                        <div className={styles.titleBlock}>
                            <h2>{app.name}</h2>
                            <p>{app.shortDescription}</p>
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
                                <Carousel images={app.images.map(a => a.src)}/>
                                <ContentBlock title="About" content={app.longDescription}/>
                            </Grid.Col>
                            <Grid.Col all={4}>
                                <Sidebar app={app}/>
                            </Grid.Col>
                        </Grid.Row>
                    </Tabs.Tab>
                    <Tabs.Tab label="Installation" icon="fa-hdd-o">
                        <Grid.Row>
                            <Grid.Col all={8}>
                                <ContentBlock content={app.readme}/>
                            </Grid.Col>
                            <Grid.Col all={4}>
                                <Sidebar app={app}/>
                            </Grid.Col>
                        </Grid.Row>
                    </Tabs.Tab>
                </Tabs>
            </div>
        );
    }
};

export default Webiny.createComponent(AppDetails, {
    styles,
    modules: ['View', 'Link', 'Gravatar', 'Grid', 'Button', 'Tabs', 'Loader']
});