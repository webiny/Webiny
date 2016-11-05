import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import Editor from './../../Editor';

class TableEditComponent extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: props.entity.data.rows || [[]],
            headers: props.entity.data.headers || [],
            numberOfColumns: props.entity.data.numberOfColumns || 1,
            focusedEditor: null
        };

        this.bindMethods(
            'editRow',
            'insertRowBefore',
            'insertRowAfter',
            'deleteRow',
            'insertColumnBefore',
            'insertColumnAfter',
            'deleteColumn',
            'editColumn'
        );

        this.plugins = () => [
            new Webiny.Draft.Plugins.Bold(),
            new Webiny.Draft.Plugins.Italic(),
            new Webiny.Draft.Plugins.Underline(),
            new Webiny.Draft.Plugins.AlignLeft(),
            new Webiny.Draft.Plugins.AlignCenter(),
            new Webiny.Draft.Plugins.AlignRight(),
            new Webiny.Draft.Plugins.Link(),
            new Webiny.Draft.Plugins.Code()
        ];
    }

    updateRowData(editorState, rowI, colI) {
        this.state.rows[rowI][colI] = editorState;
        this.setState({rows: this.state.rows}, () => {
            const entityData = this.props.entity.data;
            entityData.rows[rowI][colI] = Draft.convertToRaw(editorState.getCurrentContent());
            Draft.Entity.mergeData(this.props.entity.key, entityData);
        });
    }

    updateHeaderData(editorState, colI) {
        this.state.headers[colI] = editorState;
        this.setState({headers: this.state.headers}, () => {
            const entityData = this.props.entity.data;
            entityData.headers[colI] = Draft.convertToRaw(editorState.getCurrentContent());
            Draft.Entity.mergeData(this.props.entity.key, entityData);
        });
    }

    setFocus(type, row, col) {
        if (!_.isEqual(this.state.focusedEditor, {type, row, col})) {
            this.setState({focusedEditor: {type, row, col}});
        }
    }

    insertColumnBefore() {
        this.editColumn(this.state.focusedEditor.col);
    }

    insertColumnAfter() {
        this.editColumn(this.state.focusedEditor.col + 1);
    }

    deleteColumn() {
        this.editColumn(this.state.focusedEditor.col, false);
    }

    editColumn(index, insert = true) {
        let spliceArgs = [index, 0, null];
        if (!insert) {
            spliceArgs = [index, 1];
        }
        const rows = _.cloneDeep(this.state.rows);
        _.each(rows, row => {
            row.splice(...spliceArgs);
        });

        const headers = _.cloneDeep(this.state.headers);
        headers.splice(...spliceArgs);
        const numberOfColumns = headers.length;
        const entityData = this.props.entity.data;
        this.setState({rows, headers, numberOfColumns}, () => {
            entityData.rows = rows;
            entityData.headers = headers;
            entityData.numberOfColumns = numberOfColumns;
            Draft.Entity.mergeData(this.props.entity.key, entityData);
            const editorState = this.props.editor.getEditorState();
            this.props.editor.setEditorState(Draft.EditorState.push(editorState, editorState.getCurrentContent(), `insert-column`));
        });
    }

    insertRowBefore() {
        this.editRow(this.state.focusedEditor.row);
    }

    insertRowAfter() {
        this.editRow(this.state.focusedEditor.row + 1);
    }

    deleteRow() {
        this.editRow(this.state.focusedEditor.row, false);
    }

    editRow(index, insert = true) {
        let spliceArgs = [index, 0, []];
        if (!insert) {
            spliceArgs = [index, 1];
        }
        const rows = _.cloneDeep(this.state.rows);
        const entityData = this.props.entity.data;
        rows.splice(...spliceArgs);
        this.setState({rows}, () => {
            entityData.rows = rows;
            Draft.Entity.mergeData(this.props.entity.key, entityData);
        });
    }
}

TableEditComponent.defaultProps = {
    renderer() {
        const {headers, rows, numberOfColumns} = this.state;
        const columns = Array.from(new Array(numberOfColumns), (x, i) => i);
        const isBody = _.get(this.state.focusedEditor, 'type') === 'body';

        return (
            <div className="table-wrapper">
                <Ui.Dropdown title="Actions" className="balloon" align="right" renderIf={!this.props.editor.getPreview()}>
                    <Ui.Dropdown.Header title="Column"/>
                    <Ui.Dropdown.Link onClick={this.insertColumnBefore} icon="fa-plus" title="Insert before"/>
                    <Ui.Dropdown.Link onClick={this.insertColumnAfter} icon="fa-plus" title="Insert after"/>
                    <Ui.Dropdown.Link onClick={this.deleteColumn} icon="fa-remove" title="Delete" renderIf={headers.length > 1}/>
                    <Ui.Dropdown.Header title="Row" renderIf={isBody && rows.length > 1}/>
                    <Ui.Dropdown.Link onClick={this.insertRowBefore} icon="fa-plus" title="Insert before" renderIf={isBody}/>
                    <Ui.Dropdown.Link onClick={this.insertRowAfter} icon="fa-plus" title="Insert after" renderIf={isBody}/>
                    <Ui.Dropdown.Link onClick={this.deleteRow} icon="fa-remove" title="Delete" renderIf={isBody}/>
                </Ui.Dropdown>
                <table className="table table-striped">
                    <thead>
                    <tr>
                        {columns.map((col, colI) => {
                            let readOnly = !this.props.editor.getReadOnly();
                            if (!readOnly) {
                                const key = {type: 'head', row: 0, col: colI};
                                readOnly = !_.isEqual(this.state.focusedEditor, key);
                            }
                            return (
                                <th key={colI} onMouseDown={() => this.setFocus('head', 0, colI)}>
                                    <Editor
                                        preview={this.props.editor.getPreview()}
                                        readOnly={readOnly}
                                        toolbar="floating"
                                        plugins={this.plugins()}
                                        value={headers[colI]}
                                        convertToRaw={false}
                                        delay={1}
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
                                    let readOnly = !this.props.editor.getReadOnly();
                                    if (!readOnly) {
                                        const key = {type: 'body', row: rowI, col: colI};
                                        readOnly = !_.isEqual(this.state.focusedEditor, key);
                                    }

                                    return (
                                        <td key={colI} onMouseDown={() => this.setFocus('body', rowI, colI)}>
                                            <Editor
                                                preview={this.props.editor.getPreview()}
                                                readOnly={readOnly}
                                                toolbar="floating"
                                                plugins={this.plugins()}
                                                value={row[colI]}
                                                convertToRaw={false}
                                                delay={1}
                                                onChange={editorState => this.updateRowData(editorState, rowI, colI)}/>
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        );
    }
};

export default TableEditComponent;