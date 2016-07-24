import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;


class ExpandableList extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.bindMethods(
            'renderHeader'
        );
    }

    renderHeader(header, i) {
        header.key = i;
        header.onSort = this.onSort;
        return (
            <Ui.Grid.Col {...header}>{header.name}</Ui.Grid.Col>
        );
    }
}


ExpandableList.defaultProps = {
    data: [],
    type: 'simple',
    renderer() {
        if (!this.props.data || !this.props.data.length && this.props.showEmpty) {
            return this.emptyElement || <Ui.List.Table.Empty/>;
        }

        // get row and extract the header info
        let headers = [];
        _.forEach(this.props.children, (row)=> {
            if (row.type == Ui.List.ExpandableList.ElRow) {
                if (_.isObject(row)) {
                    _.forEach(row.props.children, (val)=> {
                        if (_.get(val.props, 'name', false)) {
                            headers.push(_.omit(val.props, ['children', 'renderer']));
                        }
                    });

                    if (headers.length > 0) {
                        headers =
                            <div className="expandable-list__header"><Ui.Grid.Row>{headers.map(this.renderHeader)}</Ui.Grid.Row></div>;
                        return false; // exit foreach
                    }
                }
            }
        });

        // get row and extract actions
        let actionSet = false;
        _.forEach(this.props.children, (row)=> {
            if (row.type == Ui.List.ExpandableList.ElActionSet) {
                actionSet = row;
            }
        });

        // combine title and action sets
        let titleAction = false;
        if (_.get(this.props, 'name', false) || actionSet) {
            titleAction = (<Ui.Grid.Row>
                {this.props.name && <Ui.Grid.Col className="expandable-list__title" all={10}><h4>{this.props.name}</h4></Ui.Grid.Col>}
                {actionSet && <Ui.Grid.Col className="expandable-list__action-set" all={2}>{actionSet}</Ui.Grid.Col>}
            </Ui.Grid.Row>);
        }

        // get rows
        let rows = [];
        _.forEach(this.props.children, (row)=> {
            if (row.type == Ui.List.ExpandableList.ElRow) {
                rows.push(row);
            } else if (_.isArray(row)) {
                _.forEach(row, (rowDetails)=> {
                    if (rowDetails.type == Ui.List.ExpandableList.ElRow) {
                        rows.push(rowDetails);
                    }
                });
                return false;
            }
        });

        return (
            <div className="expandable-list">
                {titleAction}
                {headers}
                <div className="expandable-list__content">
                    {rows}
                </div>
            </div>
        );
    }
};

export default ExpandableList;