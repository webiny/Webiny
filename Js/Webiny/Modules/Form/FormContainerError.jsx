import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class ContainerError extends Webiny.Ui.Component {

}

ContainerError.defaultProps = {
    error: null,
    title: 'Oops',
    type: 'error',
    message: null,
    renderer() {
        const error = this.props.error;
        if (!error) {
            return null;
        }

        if (_.isFunction(this.props.children)) {
            return this.props.children(error);
        }

        if (_.isString(error)) {
            return <Ui.Alert title={this.props.title} type={this.props.type}>{error}</Ui.Alert>;
        }

        const data = [];
        _.each(error.getData(), (value, key) => {
            data.push(<li key={key}><strong>{key}</strong> {value}</li>);
        });

        return (
            <Ui.Alert title={this.props.title} type={this.props.type}>
                {this.props.message || error.getMessage()}
                {data.length > 0 && <ul>{data}</ul>}
            </Ui.Alert>
        );
    }
};

export default ContainerError;