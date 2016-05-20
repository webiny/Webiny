import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class ContainerError extends Webiny.Ui.Component {

}

ContainerError.defaultProps = {
    title: 'Oops!',
    type: 'error',
    renderer() {
        const error = this.props.container.getError();
        if (!error) {
            return null;
        }

        if (_.isFunction(this.props.children)) {
            return this.props.children(error);
        }

        const data = [];
        _.each(error.getData(), (value, key) => {
            data.push(<li key={key}><strong>{key}</strong>: {value}</li>);
        });

        return (
            <Ui.Alert title={this.props.title} type={this.props.type}>
                {error.getMessage()}
                {data && <ul>{data}</ul>}
            </Ui.Alert>
        );
    }
};

export default ContainerError;