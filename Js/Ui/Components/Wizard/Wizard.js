import _ from 'lodash';
import Webiny from 'webiny';
import React from 'react';
import Step from './Step';

/**
 * Wizard component, makes it easier to create wizards, without worrying about common features like steps, navigation, content etc.
 */
class Content extends Webiny.Ui.Component {
    constructor(props) {
        super(props);
        this.state = {
            steps: {current: null},
            loading: false
        };

        this.form = props.form;

        this.bindMethods('setStep', 'nextStep', 'previousStep');
    }

    /**
     * Returns total count of all valid steps.
     * @returns {number}
     */
    countSteps() {
        let count = 0;
        React.Children.forEach(this.props.children, component => Webiny.isElementOfType(component, Step) && count++);
        return count;
    }

    /**
     * Returns index of current step
     * @returns {number}
     */
    getCurrentStepIndex() {
        return this.state.steps.current === null ? this.props.initialStep : this.state.steps.current;
    }

    /**
     * Tells us whether current step is the first one or not.
     * @returns {boolean}
     */
    isFirstStep() {
        return this.getCurrentStepIndex() === 0;
    }

    /**
     * Tells us whether current step is the last one or not.
     * @returns {boolean}
     */
    isLastStep() {
        const lastIndex = this.countSteps() - 1;
        return this.getCurrentStepIndex() === lastIndex;
    }

    /**
     * Parses all steps passed as immediate children to the Wizard component.
     * @returns {Object}
     */
    parseSteps() {
        const output = [];
        const components = this.props.children({wizard: this, form: this.form, model: this.form.getModel()});
        React.Children.forEach(components.props.children, (component, index) => {
            if (Webiny.isElementOfType(component, Step)) {
                output.push(this.parseStep(component, index));
            }
        });
        return output;
    }

    /**
     * Parses given step, a React component, into a JSON object.
     * @param step
     * @param index
     */
    parseStep(step, index) {
        const output = _.assign(
            _.pick(step.props, _.keys(Step.defaultProps)),
            {
                index,
                current: index === this.getCurrentStepIndex(),
                completed: index < this.getCurrentStepIndex(),
                actions: [],
                content: null
            });

        React.Children.forEach(step.props.children, component => {
            if (Webiny.isElementOfType(component, Step.Content)) {
                output.content = component.props.children;
                return;
            }

            if (Webiny.isElementOfType(component, Step.Actions)) {
                React.Children.forEach(component.props.children, (action, actionIndex) => {
                    output.actions.push(React.cloneElement(action, _.assign({}, action.props, {key: actionIndex, wizard: this})));
                });
            }
        });

        return output;
    }

    /**
     * Sets current step.
     * @param index
     * @returns {Promise.<void>}
     */
    async setStep(index) {
        const steps = this.parseSteps();

        const previous = steps[this.getCurrentStepIndex()];
        const next = steps[index];

        this.setState({loading: true});
        previous && await previous.onLeave({wizard: this, previous, next});

        this.setState(state => {
            state.loading = false;
            state.steps.current = index;
            return state;
        }, next.onEnter);
    }

    /**
     * Switches to next step.
     */
    nextStep() {
        if (this.isLastStep()) {
            return;
        }
        this.setStep(this.getCurrentStepIndex() + 1);
    }

    /**
     * Switches to previous step.
     */
    previousStep() {
        if (this.isFirstStep()) {
            return;
        }
        this.setStep(this.getCurrentStepIndex() - 1);
    }

    async finish() {
    }
}

Content.defaultProps = {
    form: null,
    initialStep: 0,
    navigationRenderer(params) {
        return (
            <ul>
                {params.steps.list.map((step, index) => <li key={index}>{step.index + 1} {step.title}</li>)}
            </ul>
        );
    },
    contentRenderer(params) {
        return (
            <div className="content">
                {params.steps.current.content}
            </div>
        );
    },
    actionsRenderer(params) {
        return (
            <div className="actions">
                {params.steps.current.actions}
            </div>
        );
    },
    loaderRenderer() {
        const Loader = this.props.Loader;
        return this.state.loading && <Loader/>;
    },
    layoutRenderer({loader, navigation, content, actions}) {
        return (
            <webiny-wizard>
                {loader}
                {navigation}
                {content}
                {actions}
            </webiny-wizard>
        );
    },
    renderer() {
        const params = {
            wizard: this,
            form: this.form,
            model: this.form.getModel(),
            steps: {list: [], current: null}
        };

        params.steps.list = this.parseSteps();
        params.steps.current = params.steps.list[this.getCurrentStepIndex()];

        return this.props.layoutRenderer.call(this, _.assign(params, {
            navigation: this.props.navigationRenderer.call(this, params),
            content: this.props.contentRenderer.call(this, params),
            actions: this.props.actionsRenderer.call(this, params),
            loader: this.props.loaderRenderer.call(this, params)
        }));
    }
};

class Wizard extends Webiny.Ui.Component {
}

Wizard.defaultProps = {
    contentRenderer: undefined,
    actionsRenderer: undefined,
    loaderRenderer: undefined,
    layoutRenderer: undefined,
    initialStep: 0,
    form: {},
    renderer() {
        const {Form} = this.props;
        return (
            <Form {...this.props.form}>
                {({form}) => (
                    <Content form={form} {..._.omit(this.props, ['Form', 'form', 'renderer', 'children'])}>
                        {this.props.children}
                    </Content>
                )}
            </Form>
        );
    }
};

export default Webiny.createComponent(Wizard, {modules: ['Form', 'Loader'], api: ['setStep', 'nextStep', 'previousStep']});