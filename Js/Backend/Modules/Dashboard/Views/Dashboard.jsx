import React from 'react';
import Webiny from 'webiny';
import _ from 'lodash';
import './style.scss'
import imgInfinify from 'Assets/images/infinity.png';
import Updates from './Components/Updates';

class Dashboard extends Webiny.Ui.View {
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

Dashboard.defaultProps = {
    renderer() {

        const {Gravatar, Button, Link, Icon} = this.props;

        return (
            <div className="master-content master-dashboard--lite">
                <div className="master-content__header">
                    <div className="master-content__left">
                        <h2 className="master-content__title">Dashboard</h2>
                    </div>
                    <div className="master-content__center">
                        <div className="user-welcome">
                            <div className="user-welcome__avatar">
                                <div className="avatar avatar--inline avatar--small">
                                    <span className="avatar-placeholder avatar-placeholder--no-border">
                                        <Gravatar className="avatar img-responsive" hash={this.state.user.gravatar} size="50" />
                                    </span>
                                </div>
                            </div>
                            <h3 className="user-welcome__message">Hi {this.getUserName()}</h3>
                        </div>
                    </div>
                    <div className="master-content__right">
                        <Button onClick={()=>Webiny.Router.goToRoute('Users.Account')}>Manage Account</Button>
                    </div>
                </div>

                <div className="dashboard-content dashboard-content--lite">

                    <Updates/>

                    <div className="row">
                        <div className="col-md-4">
                            <div className="block">
                                <div className="block-header block-header-outer">
                                    <h4 className="block-title">GET STARTED</h4>
                                    <div className="header-options">
                                    </div>
                                </div>
                                <div className="block-content">
                                    <div>
                                        <ul className="block-list">
                                            <li className="block-list__item">
                                                <div className="block-list__item-image">
                                                    <Icon icon="icon-keys" size="2x"/>
                                                </div>
                                                <a href="https://www.webiny.com/docs/current/components/must-know" className="block-list__item-text" target="_blank">
                                                    <strong>React Components</strong> - Learn what they do and how to implement them.

                                                </a>
                                            </li>
                                            <li className="block-list__item">
                                                <div className="block-list__item-image">
                                                    <Icon icon="fa-book " size="2x"/>
                                                </div>
                                                <a href="https://www.webiny.com/the-hub/tutorials" className="block-list__item-text" target="_blank">
                                                    <strong>Tutorials</strong> - How to setup Webiny and other applications.
                                                </a>
                                            </li>
                                            <li className="block-list__item">
                                                <div className="block-list__item-image">
                                                    <Icon icon="fa-graduation-cap" size="2x"/>
                                                </div>
                                                <a href="https://www.webiny.com/docs/current/reference-manual/environments" className="block-list__item-text" target="_blank">
                                                    <strong>Reference Manual</strong> - The nitty-gritty details of how the internal components work.
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="block block--the-hub">
                                <div className="block-header block-header-outer">
                                    <div className="header-options">
                                    </div>
                                </div>
                                <div className="block-content text-center">

                                    <div className="title-icon">
                                        <img src={imgInfinify} alt="Webiny Infinity"/>
                                    </div>

                                    <h3>The Hub</h3>
                                    <div className="block-list__item-text">
                                        Ask questions, present your work, start or join a discussion, view or contribute a tutorial.
                                    </div>
                                    <br/>
                                        <div className="text-center">
                                            <Link url="https://www.webiny.com/the-hub" newTab={true} type="primary">JOIN</Link>
                                        </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="block">
                                <div className="block-header block-header-outer">
                                    <h4 className="block-title">SOCIALIZE</h4>
                                    <div className="header-options">
                                    </div>
                                </div>
                                <div className="block-content block--the-hub">
                                    <div>
                                        <ul className="block-list">
                                            <li className="block-list__item">
                                                <div className="block-list__item-image">
                                                    <span className="icon icon-github icon-3x"></span>
                                                </div>
                                                <a href="https://github.com/Webiny" className="block-list__item-text" target="_blank">
                                                    <Icon icon="fa-github"/> GitHub
                                                </a>
                                            </li>
                                            <li className="block-list__item">
                                                <div className="block-list__item-image">
                                                    <span className="icon icon-twitter icon-3x"></span>
                                                </div>
                                                <a href="" className="block-list__item-text" target="_blank">
                                                    <Icon icon="fa-twitter"/> Twitter
                                                </a>
                                            </li>
                                            <li className="block-list__item">
                                                <div className="block-list__item-image">
                                                    <span className="icon icon-medium icon-3x"></span>
                                                </div>
                                                <a href="https://www.webiny.com/docs/current/components/must-know" className="block-list__item-text" target="_blank">
                                                    <Icon icon="fa-medium"/> Blog
                                                </a>
                                            </li>

                                            <li className="block-list__item">
                                                <div className="block-list__item-image">
                                                    <span className="icon icon-youtube icon-3x"></span>
                                                </div>
                                                <a href="https://www.webiny.com/docs/current/components/must-know" className="block-list__item-text" target="_blank">
                                                    <Icon icon="fa-youtube"/> YouTube
                                                </a>
                                            </li>

                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
};

export default Webiny.createComponent(Dashboard, {
    modules: ['Gravatar', 'Button', 'Link', 'Icon']
});