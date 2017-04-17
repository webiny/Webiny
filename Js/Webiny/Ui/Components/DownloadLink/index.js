import Webiny from 'Webiny';

class DownloadLink extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.dialog = null;
        this.state = {
            showDialog: false
        };

        this.bindMethods('getDialog');
    }

    componentDidUpdate() {
        super.componentDidUpdate();
        if (this.state.showDialog && !this.refs.dialog.isShown()) {
            this.refs.dialog.show();
        }
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        if (this.dialog) {
            this.getDialog();
        }
    }

    getDialog() {
        const result = this.props.download(this.refs.downloader.download, this.props.data || null);
        if (Webiny.isElementOfType(result, Ui.Modal.Dialog)) {
            this.dialog = result;
        }
    }
}

DownloadLink.defaultProps = {
    method: 'GET',
    renderer() {
        const {Downloader, Link, ...props} = this.props;
        const downloader = <Downloader ref="downloader"/>;
        props.onClick = () => {
            if (_.isString(this.props.download)) {
                this.refs.downloader.download(this.props.method, this.props.download);
            } else {
                this.getDialog();
                this.setState({showDialog: true});
            }
        };
        delete props['download'];

        let dialog = null;
        if (this.dialog) {
            const onHidden = () => {
                this.dialog = null;
                this.setState({showDialog: false});
            };
            dialog = React.cloneElement(this.dialog, {onHidden, ref: 'dialog'});
        }

        return (
            <Link {..._.omit(props, ['renderer'])}>
                {this.props.children}
                {downloader}
                {dialog}
            </Link>
        );
    }
};

export default Webiny.createComponent(DownloadLink, {modules: ['Downloader', 'Link']});