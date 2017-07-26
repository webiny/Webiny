import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';

class ContainerError extends Webiny.Ui.Component {

}

ContainerError.defaultProps = {
    error: null,
    title: 'Oops',
    type: 'error',
    message: null,
    className: null,
    close: true,
    renderer() {
        const {error, close, title, type, className, message} = this.props;
        if (!error) {
            return null;
        }

        if (_.isFunction(this.props.children)) {
            return this.props.children(error);
        }

        const {Alert} = this.props;

        if (_.isString(error)) {
            return <Alert title={title} type={type} close={close}>{error}</Alert>;
        }

        const data = [];
        _.each(error.getData(), (value, key) => {
            data.push(<li key={key}><strong>{key}</strong> {value}</li>);
        });

        return (
            <Alert
                title={title}
                type={type}
                close={close}
                className={className}>
                {message || error.getMessage()}
                {data.length > 0 && <ul>{data}</ul>}
            </Alert>
        );
    }
};

export default Webiny.createComponent(ContainerError, {modules: ['Alert']});