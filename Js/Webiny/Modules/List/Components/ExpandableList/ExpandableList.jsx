import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;


class ExpandableList extends Webiny.Ui.Component {
    
}


ExpandableList.defaultProps = {
    data: [],
    type: 'simple',
    renderer() {
        if (!this.props.data || !this.props.data.length && this.props.showEmpty) {
            return this.emptyElement || <Ui.List.Table.Empty/>;
        }

        return (
            <div className="expandable-list">
                {this.props.name && <h4 className="expandable-list__title">{this.props.name}</h4>}
                <div className="expandable-list__content">
                    {this.props.children}
                </div>
            </div>
        );
    }
};

export default ExpandableList;