import Webiny from 'Webiny';

const Ui = Webiny.Ui.Components;

export default {
    layout: function layout() {
        let title = this.props.title;
        if(_.isFunction(title)){
            title = title();
        }

        return (
            <Ui.Panel.Panel>
                <Ui.Panel.Header title={title} icon={this.props.icon}/>
                <Ui.Panel.Body>
                    <fields/>
                </Ui.Panel.Body>
                <Ui.Panel.Footer className="text-right">
                    <actions/>
                </Ui.Panel.Footer>
            </Ui.Panel.Panel>
        );
    },
    renderer: function renderer() {
        const loader = this.props.showLoader ? null : null;
        const css = this.props.layout === 'horizontal' ? 'form-horizontal' : '';

        const render = [];

        const formProps = {
            id: this.props.id,
            autoComplete: 'off',
            className: this.classSet(css, this.props.className),
            onSubmit: this.submit,
            ref: this.props.name,
            name: this.props.name
        };

        React.Children.map(this.layout, (item, index) => {
            render.push(React.cloneElement(this.replacePlaceholders(item), {key: index}));
        });

        return (
            <form {...formProps}>
                {loader}
                {render}
                <button style={{position: 'absolute', left: '-5000px'}} type="submit"></button>
            </form>
        );
    }
};