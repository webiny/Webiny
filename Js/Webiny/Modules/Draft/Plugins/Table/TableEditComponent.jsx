import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import Editor from './../../Editor';

class TableEditComponent extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        const entityData = Draft.Entity.get(props.block.getEntityAt(0)).get('data');

        this.state = {
            rows: entityData.rows || [[]],
            headers: entityData.headers || [],
            numberOfColumns: entityData.numberOfColumns || 1,
            focusedEditor: null
        };

        this.bindMethods();
    }

    updateRowData(editorState, rowI, colI) {
        this.state.rows[rowI][colI] = editorState;
        this.setState({rows: this.state.rows}, () => {
            const block = this.props.block;
            const entityKey = block.getEntityAt(0);
            const entityData = Draft.Entity.get(entityKey).get('data');
            entityData.rows[rowI][colI] = Draft.convertToRaw(editorState.getCurrentContent());
            Draft.Entity.mergeData(entityKey, entityData);
        });
    }

    updateHeaderData(editorState, colI) {
        this.state.headers[colI] = editorState;
        this.setState({headers: this.state.headers}, () => {
            const block = this.props.block;
            const entityKey = block.getEntityAt(0);
            const entityData = Draft.Entity.get(entityKey).get('data');
            entityData.headers[colI] = Draft.convertToRaw(editorState.getCurrentContent());
            Draft.Entity.mergeData(entityKey, entityData);
        });
    }

    setFocus(key) {
        if(this.state.focusedEditor !== key){
            this.setState({focusedEditor: key});
        }
    }
}

TableEditComponent.defaultProps = {
    renderer() {
        const {headers, rows, numberOfColumns} = this.state;
        const columns = Array.from(new Array(numberOfColumns), (x, i) => i);

        return (
            <table className="table table-striped">
                <thead>
                <tr>
                    {columns.map((col, colI) => {
                        return (
                            <th key={colI} onMouseDown={() => this.setFocus(`head-${0}-${colI}`)}>
                                <Editor
                                    toolbar={false}
                                    value={headers[colI]}
                                    onChange={editorState => this.updateHeaderData(editorState, colI)}/>
                            </th>
                        );
                    })}
                </tr>
                </thead>
                <tbody>
                {rows.map((row, rowI) => {
                    return (
                        <tr key={rowI}>
                            {columns.map((col, colI) => {
                                return (
                                    <td key={colI} onMouseDown={() => this.setFocus(`body-${rowI}-${colI}`)}>
                                        <Editor
                                            toolbar={false}
                                            value={row[colI]}
                                            onChange={editorState => this.updateRowData(editorState, rowI, colI)}/>
                                    </td>
                                );
                            })}
                        </tr>
                    );
                })}
                </tbody>
            </table>
        );
    }
};

export default TableEditComponent;