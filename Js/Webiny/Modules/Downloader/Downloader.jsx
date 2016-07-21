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

    download(httpMethod, url, ids = null, filters = null) {
        this.downloaded = false;
        this.setState({httpMethod, url, ids, filters: _.pickBy(filters, f => !_.isUndefined(f))});
    }
}

Downloader.defaultProps = {
    debug: false,
    debugKey: 'PHPSTORM',
    renderer() {
        if (this.downloaded) {
            return null;
        }

        let action = this.state.url;
        if (!action.startsWith('http')) {
            action = webinyApiPath + action;
        }

        let filters = null;
        if (this.state.filters && !this.state.ids) {
            filters = [];
            _.each(this.state.filters, (value, name) => {
                filters.push(<input type="hidden" name={name} value={value} key={name}/>);
            });
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

        this.downloaded = true;

        let debug = null;
        if (this.props.debug) {
            debug = <input type="hidden" name="XDEBUG_SESSION_START" value={this.props.debugKey}/>;
        }

        return (
            <form ref="downloader" action={action} method={this.state.httpMethod} target="_blank">
                {ids}
                {filters}
                {authorization}
                {debug}
            </form>
        );
    }
};

export default Downloader;