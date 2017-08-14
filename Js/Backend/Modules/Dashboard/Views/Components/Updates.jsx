import React from 'react';
import Webiny from 'webiny';
import _ from 'lodash';

class Updates extends Webiny.Ui.View {
    constructor(props) {
        super(props);

        this.state = {
            updates: [],
            loaded: false
        };
    }

    componentDidMount(){
        super.componentDidMount();
        this.getUpdates();
    }

    getUpdates() {
        // check local storage
        let updates = Webiny.LocalStorage.get('dashboardUpdates');
        if(updates){
            let lastUpdate = new Date() - new Date(Webiny.LocalStorage.get('dashboardLastUpdate'));
            if(lastUpdate < 86400000){ // 24h
                this.setState({updates: updates, loaded: true});
                return;
            }
        }

        // refresh dashboard updates
        return new Webiny.Api.Endpoint('/entities/webiny/dashboard-updates').get('/latest').then(apiResponse => {
            const updates = apiResponse.getData('list');
            if (updates && updates.length > 0) {
                this.setState({updates: updates, loaded: true});
            } else {
                this.setState({updates: [], loaded: true});
            }

            // store dashboard updates and the last update time
            Webiny.LocalStorage.set('dashboardUpdates', updates);
            Webiny.LocalStorage.set('dashboardLastUpdate', new Date());
        });
    }
}

Updates.defaultProps = {
    renderer() {

        const {Grid, Loader, Carousel, Link, Icon} = this.props;

        if(!this.state.loaded){
            return (
              <Grid.Row>
                  <Grid.Col all={12}>
                      <Loader className="fixed"/>
                  </Grid.Col>
              </Grid.Row>
            );
        }

        if(this.state.updates.length < 1){
            return (
                <Grid.Row>
                    <Grid.Col all={12}>
                    </Grid.Col>
                </Grid.Row>
            );
        }

        return (
            <Grid.Row>

                <Grid.Col all={12}>

                    <div className="block block--slider">

                        <div className="block-header">
                            <h4 className="block-title-light pull-left">Updates</h4>
                        </div>

                        <div className="block-content block-content--dynamic-height">
                            <div className="slider">
                                <div className="slides">

                                    <Carousel items={1} dots={true}>
                                        {_.get(this.state, 'updates') && this.state.updates.map(post => {
                                            let link = "http://demo.app/r/"+post.refId;
                                            return (
                                                <div className="slide slide--active" key={post.id}>
                                                    {post.image && (
                                                        <div className="slide__image">
                                                            <img src={post.image} />
                                                        </div>
                                                    )}
                                                    <div className="slide__content">
                                                        <div className="slide__title">
                                                            {post.hasLink === true ? <a href={link} target="_blank">{post.title}</a> : post.title}
                                                        </div>
                                                        <div className="slide__excerpt">{post.content}</div>
                                                    </div>
                                                    <div className="slide__button">
                                                        {post.hasLink && (<Link type="primary" url={link} newTab={true}>Learn more</Link>)}
                                                        <br/>
                                                        <Link className="dismiss">Dismiss</Link>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </Carousel>

                                </div>

                            </div>
                        </div>
                    </div>

                </Grid.Col>

            </Grid.Row>
        );
    }
};

export default Webiny.createComponent(Updates, {
    modules: ['Grid', 'Loader', 'Carousel', 'Link', 'Icon']
});