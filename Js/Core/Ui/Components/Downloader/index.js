import Webiny from 'Webiny';

class Downloader extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.state = {};
        this.downloaded = true;

        this.bindMethods('download');
    }

    componentDidUpdate() {
        super.componentDidUpdate();
        if (this.refs.downloader) {
            ReactDOM.findDOMNode(this.refs.downloader).submit();
        }
    }

    download(httpMethod, url, body = null) {
        this.downloaded = false;
        this.setState({httpMethod, url, body: _.pickBy(body, f => !_.isUndefined(f))});
    }
}

Downloader.defaultProps = {
    debug: false,
    debugKey: 'PHPSTORM',
    tokenCookie: 'webiny-token',
    renderer() {
        if (this.downloaded) {
            return null;
        }

        let action = this.state.url;
        if (!action.startsWith('http')) {
            action = webinyApiPath + action;
        }

        let filters = null;
        if (this.state.body) {
            filters = [];
            _.each(this.state.body, (value, name) => {
                if (_.isArray(value)) {
                    value.map((v, index) => {
                        filters.push(
                            <input type="hidden" name={name + '[]'} value={v} key={index}/>
                        );
                    });
                    return;
                }
                filters.push(<input type="hidden" name={name} value={value} key={name}/>);
            });
        }

        let authorization = null;
        if (this.state.httpMethod !== 'GET') {
            authorization = <input type="hidden" name="X-Webiny-Authorization" value={Webiny.Cookies.get(this.props.tokenCookie)}/>;
        }

        this.downloaded = true;

        let debug = null;
        if (this.props.debug) {
            debug = <input type="hidden" name="XDEBUG_SESSION_START" value={this.props.debugKey}/>;
        }

        return (
            <form ref="downloader" action={action} method={this.state.httpMethod} target="_blank">
                {filters}
                {authorization}
                {debug}
            </form>
        );
    }
};

export default Webiny.createComponent(Downloader, {api: ['download']});