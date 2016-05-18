import Webiny from 'Webiny';

class Downloader extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.bindMethods('download');
    }

    componentDidUpdate() {
        super.componentDidUpdate();
        if (this.refs.downloader) {
            ReactDOM.findDOMNode(this.refs.downloader).submit();
        }
    }

    download(httpMethod, url, ids = null, filters = null) {
        this.setState({httpMethod, url, ids, filters});
    }
}

Downloader.defaultProps = {
    renderer() {
        if (!this.state.httpMethod) {
            return null;
        }

        let action = this.state.url;
        if (!action.startsWith('http')) {
            action = _apiUrl + action;
        }

        if (this.state.filters && !this.state.ids) {
            action += '?' + jQuery.param(this.state.filters);
        }

        let ids = null;
        if (this.state.ids) {
            ids = this.state.ids.map((id, index) => {
                return <input type="hidden" name="ids[]" value={id} key={index}/>;
            });
        }

        let authorization = null;
        if (this.state.httpMethod !== 'GET') {
            authorization = <input type="hidden" name="Authorization" value={Webiny.Cookies.get('webiny-token')}/>;
        }

        return (
            <form ref="downloader" action={action} method={this.state.httpMethod} target="_blank">
                {ids}
                {authorization}
                <input type="hidden" name="XDEBUG_SESSION_START" value="PHPSTORM"/>
            </form>
        );
    }
};

export default Downloader;