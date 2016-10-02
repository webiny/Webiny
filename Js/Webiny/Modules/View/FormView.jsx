import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class FormView extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.bindMethods('parseLayout');
    }

    parseLayout(children) {
        this.headerComponent = null;
        this.bodyComponent = null;
        this.footerComponent = null;
        this.errorComponent = null;

        if (typeof children !== 'object' || children === null) {
            return children;
        }

        // Loop through View elements and detect header/body/footer components
        React.Children.map(children, child => {
            if (child.type === Ui.View.Header) {
                this.headerComponent = child;
                return;
            }

            if (child.type === Ui.View.Body) {
                // Check if form loader exists in body
                let loader = null;
                React.Children.map(child.props.children, bodyChild => {
                    if (bodyChild.type === Ui.Form.Loader) {
                        loader = true;
                    }
                });

                if (loader) {
                    // We have our body element
                    this.bodyComponent = child;
                } else {
                    // We need to create form loader ourselves
                    const bodyChildren = React.Children.toArray(child.props.children);
                    bodyChildren.push(<Ui.Form.Loader key="loader" container={this.props.container}/>);
                    this.bodyComponent = React.cloneElement(child, child.props, bodyChildren);
                }
                return;
            }

            if (child.type === Ui.View.Footer) {
                this.footerComponent = child;
                return;
            }

            if (child.type === Ui.Form.Error) {
                this.errorComponent = React.cloneElement(child, _.merge(child.props, {container: this.props.container}));
                return;
            }
        });

        if (!this.errorComponent) {
            this.errorComponent = <Ui.Form.Error container={this.props.container}/>;
        }
    }

    componentWillMount() {
        super.componentWillMount();
        this.parseLayout(this.props.children);
    }

    componentWillUpdate(nextProps, nextState) {
        super.componentWillUpdate(nextProps, nextState);
        this.parseLayout(nextProps.children);
    }
}

FormView.defaultProps = {
    renderer() {
        return (
            <view>
                {this.headerComponent}
                <div className="view-content">
                    {this.errorComponent}
                    <Ui.Panel className={'panel--boxed'}>
                        {this.bodyComponent}
                        {this.footerComponent}
                    </Ui.Panel>
                </div>
            </view>
        );
    }
};

export default FormView;