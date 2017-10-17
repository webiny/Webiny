import React from 'react';
import Webiny from 'webiny';
import _ from 'lodash';
import Container from './Container';

class Wizard extends Webiny.Ui.Component {
}

Wizard.defaultProps = {
    contentRenderer: undefined,
    actionsRenderer: undefined,
    loaderRenderer: undefined,
    layoutRenderer: undefined,
    initialStep: 0,
    onTransition: _.noop,
    onFinish: _.noop,
    onStart: _.noop,
    form: {},
    renderer() {
        const {Form} = this.props;
        return (
            <Form {...this.props.form}>
                {({form}) => (
                    <Container form={form} {..._.omit(this.props, ['Form', 'form', 'renderer', 'children'])}>
                        {this.props.children}
                    </Container>
                )}
            </Form>
        );
    }
};

export default Webiny.createComponent(Wizard, {modules: ['Form', 'Loader'], api: ['setStep', 'nextStep', 'previousStep']});