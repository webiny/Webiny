import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;


class ExpandableList extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.state = {
            zIndex: 1000
        };

        this.bindMethods(
            'renderHeader'
        );
    }

    renderHeader(header, i) {
        let className = '';

        if (_.get(header, 'className', false)) {
            className = header.className;
        }

        return (
            <div className={className + ' expandable-list__header__field flex-cell flex-width-' + header.all} key={i}>{header.name}</div>
        );
    }
}


ExpandableList.defaultProps = {
    data: [],
    type: 'simple',
    renderer() {
        if (!this.props.data || !this.props.data.length && this.props.showEmpty) {
            return this.emptyement || <Ui.List.Table.Empty/>;
        }

        // get row and extract the header info
        let headers = [];
        let actionSet = false;
        _.forEach(this.props.children, row => {
            if (row.type === Ui.ExpandableList.Row) {
                if (_.isObject(row)) {
                    _.forEach(row.props.children, val => {
                        if (val.type === Ui.ExpandableList.ActionSet) {
                            actionSet = true;
                        }

                        if (val.type === Ui.ExpandableList.Field && _.get(val.props, 'name', false)) {
                            headers.push(_.omit(val.props, ['children', 'renderer']));
                        }
                    });

                    if (headers.length > 0) {
                        if (actionSet) {
                            headers.push({key: 99, all: 2});
                        }
                        headers = <div className="expandable-list__header flex-row">{headers.map(this.renderHeader)}</div>;
                        return false; // exit foreach
                    }
                }
            }
        });

        // get rows
        const rows = [];
        _.forEach(this.props.children, row => {
            if (row.type === Ui.ExpandableList.Row) {
                rows.push(row);
            } else if (_.isArray(row)) {
                _.forEach(row, rowDetails => {
                    if (rowDetails.type === Ui.ExpandableList.Row) {
                        rows.push(rowDetails);
                    }
                });
                return false;
            }
        });

        return (
            <div className="expandable-list">
                {headers}
                <div className="expandable-list__content">
                    {rows}
                </div>
            </div>
        );
    }
};

export default ExpandableList;