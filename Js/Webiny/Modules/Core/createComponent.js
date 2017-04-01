import hoistNonReactStatics from 'hoist-non-react-statics';
import {Map} from 'immutable';
import LazyLoad from './Ui/LazyLoad';
import WebinyComponent from './Core/Component';

export default (Component, options = {}) => {
    // Create an immutable copy of styles to use as default styles
    const defaultStyles = Map(options.styles || {});

    const ComponentWrapper = class extends WebinyComponent {
        render() {
            const props = _.omit(this.props, ['styles']);
            props.styles = defaultStyles.toJS();
            // If new styles are given, merge them with default styles
            if (_.isPlainObject(this.props.styles)) {
                _.merge(props.styles, this.props.styles);
            }

            // If lazy loaded modules are defined - return LazyLoad wrapper
            const modules = options.modules || {};
            if (Object.keys(modules).length > 0) {
                return (
                    <LazyLoad modules={modules || []}>
                        {(modules) => (
                            <Component {...props} {...modules}/>
                        )}
                    </LazyLoad>
                );
            }

            return <Component {...props}/>
        }
    };

    ComponentWrapper.__originalComponent = Component;

    return hoistNonReactStatics(ComponentWrapper, Component);
};