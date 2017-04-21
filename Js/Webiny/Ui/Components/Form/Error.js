import Webiny from 'Webiny';

class ContainerError extends Webiny.Ui.Component {

}

ContainerError.defaultProps = {
    error: null,
    title: 'Oops',
    type: 'error',
    message: null,
    className: null,
    renderer() {
        const error = this.props.error;
        if (!error) {
            return null;
        }

        if (_.isFunction(this.props.children)) {
            return this.props.children(error);
        }

        const {Alert} = this.props;

        if (_.isString(error)) {
            return <Alert title={this.props.title} type={this.props.type}>{error}</Alert>;
        }

        const data = [];
        _.each(error.getData(), (value, key) => {
            data.push(<li key={key}><strong>{key}</strong> {value}</li>);
        });

        return (
            <Alert
                title={this.props.title}
                type={this.props.type}
                className={this.props.className}>
                {this.props.message || error.getMessage()}
                {data.length > 0 && <ul>{data}</ul>}
            </Alert>
        );
    }
};

export default Webiny.createComponent(ContainerError, {modules: ['Alert']});