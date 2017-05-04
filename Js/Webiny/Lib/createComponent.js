import hoistNonReactStatics from 'hoist-non-react-statics';
import {Map} from 'immutable';
import LazyLoad from './Ui/LazyLoad';
import WebinyComponent from './Core/Component';
import ModalComponent from './Core/ModalComponent';
import Injector from './Core/Injector';

/**
 * This function creates a wrapper class around given component to allow component styling and lazy loading of dependencies
 *
 * @param Component
 * @param options
 * @returns {component}
 */
export default (Component, options = {}) => {
    // Create an immutable copy of styles to use as default styles
    const defaultStyles = Map(options.styles || {});

    // Automatically expose modal dialog methods
    if (Component.prototype instanceof ModalComponent) {
        _.assign(options, {api: ['show', 'hide', 'isAnimating', 'isShown']});
    }

    class ComponentWrapper extends WebinyComponent {
        constructor(props) {
            super(props);
            if (options.api) {
                options.api.forEach((method) => {
                    Object.defineProperty(this, method, {
                        get: () => this.component[method]
                    });
                })
            }
        }

        componentDidMount() {
            // Do nothing since this is a proxy component
            // 'onComponentDidMount' prop only needs to be handled by the actual component
        }

        static configure(config) {
            // TODO: think about merging: should 'modules' be merged or overwritten?
            _.merge(ComponentWrapper, config);
        }

        render() {
            const props = _.omit(this.props, ['styles']);
            props.ref = c => this.component = c;

            // Detect if component override is possible
            if (props.context) {
                const overrides = Injector.getByTag(props.context);
                if (overrides.length) {
                    const props = _.pick(this.props, ['value', 'children', 'onChange']);
                    if(this.props.contextProps) {
                        _.merge(props, this.props.contextProps);
                    }
                    const RenderComponent = overrides.pop().value;
                    const options = RenderComponent.options;

                    // If lazy loaded modules are defined - return LazyLoad wrapper
                    const modules = options.modules || {};
                    if (Object.keys(modules).length > 0) {
                        return (
                            <LazyLoad modules={modules}>
                                {(modules) => {
                                    return <RenderComponent {...props} {...modules}/>;
                                }}
                            </LazyLoad>
                        );
                    }

                    return <RenderComponent {...props}/>
                }
            }

            props.styles = defaultStyles.toJS();
            // If new styles are given, merge them with default styles
            if (_.isPlainObject(this.props.styles)) {
                _.merge(props.styles, this.props.styles);
            }

            // If lazy loaded modules are defined - return LazyLoad wrapper
            const modules = options.modules || {};
            if (Object.keys(modules).length > 0) {
                return (
                    <LazyLoad modules={modules}>
                        {(modules) => {
                            return <Component {...props} {...modules}/>;
                        }}
                    </LazyLoad>
                );
            }

            return <Component {...props}/>
        }
    }

    ComponentWrapper.__originalComponent = Component;
    ComponentWrapper.options = options;
    ComponentWrapper.defaultProps = _.assign({}, Component.defaultProps);

    return hoistNonReactStatics(ComponentWrapper, Component);
};