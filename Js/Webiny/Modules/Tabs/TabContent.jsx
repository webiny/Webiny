import Webiny from 'Webiny';

class TabContent extends Webiny.Ui.Component {

}

TabContent.defaultProps = {
    alwaysRender: true,
    active: false,
    disabled: false,
    renderer() {
        if (!this.props.disabled && (this.props.active || this.props.alwaysRender)) {
            const tabClass = this.classSet({active: this.props.active}, 'tab-pane');
            return (
                <div className={tabClass}>
                    {this.props.children}
                    <div className="clearfix"></div>
                </div>
            );
        }

        return null;
    }
};

export default TabContent;