import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class ContainerError extends Webiny.Ui.Component {

}

ContainerError.defaultProps = {
    renderer() {
        const error = this.props.container.getError();
        if (!error) {
            return null;
        }

        const data = [];
        _.each(error.getData(), (value, key) => {
            data.push(<li><strong>{key}</strong>: {value}</li>);
        });

        return (
            <Ui.Alert title="Save failed" type="error">
                {error.getMessage()}
                {data && <ul>{data}</ul>}
            </Ui.Alert>
        );
    }
};

export default ContainerError;