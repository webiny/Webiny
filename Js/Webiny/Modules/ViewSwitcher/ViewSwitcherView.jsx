import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class ViewSwitcherView extends Webiny.Ui.Component {

    componentDidMount() {
        super.componentDidMount();

        if (this.props.modal) {
            setTimeout(this.refs.view.show, 100);
        }
    }
}

ViewSwitcherView.defaultProps = {
    renderer() {
        console.log("RENDER VIEW", this.props.view);
        this.content = this.props.children(this.props.container.showView, ...this.props.params);
        return React.cloneElement(this.content, {ref: 'view'});
    }
};

export default ViewSwitcherView;
