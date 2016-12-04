import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import Editor from './../../Editor';
import TabHandler from './TabHandler';
import TableShortcuts from './TableShortcuts';

class TableEditComponent extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: props.entity.data.rows || [{
                key: Draft.genKey(), columns: [
                    {key: Draft.genKey(), data: null}
                ]
            }],
            headers: props.entity.data.headers || [{key: Draft.genKey(), data: null}],
            numberOfColumns: props.entity.data.numberOfColumns || 1,
            focusedEditor: null,
            readOnly: true
        };

        this.bindMethods(
            'editRow',
            'insertRowBefore',
            'insertRowAfter',
            'deleteRow',
            'insertColumnBefore',
            'insertColumnAfter',
            'deleteColumn',
            'editColumn',
            'selectNextEditor',
            'selectPrevEditor'
        );

        this.plugins = () => [
            new Webiny.Draft.Plugins.Bold(),
            new Webiny.Draft.Plugins.Italic(),
            new Webiny.Draft.Plugins.Underline(),
            new Webiny.Draft.Plugins.Alignment(),
            new Webiny.Draft.Plugins.Link(),
            new Webiny.Draft.Plugins.Code(),
            new TabHandler({selectNextEditor: this.selectNextEditor, selectPrevEditor: this.selectPrevEditor}),
            new TableShortcuts({insertRow: this.insertRowAfter, deleteRow: this.deleteRow})
        ];
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        this.setState({readOnly: !props.editor.getReadOnly()});
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(nextProps.entity.data, this.props.entity.data) || !_.isEqual(this.state, nextState);
    }

    selectNextEditor() {
        const columns = this.state.numberOfColumns - 1;
        const rows = this.state.rows.length - 1;
        const {type, row, col} = this.state.focusedEditor;
        if (type === 'head' && col === columns) {
            return this.setFocus('body', 0, 0, true);
        }

        if (col < columns) {
            return this.setFocus(type, row, col + 1, true);
        } else if (col === columns && row < rows) {
            return this.setFocus(type, row + 1, 0, true);
        }

        return false;
    }

    selectPrevEditor() {
        const columns = this.state.numberOfColumns - 1;
        const {type, row, col} = this.state.focusedEditor;
        if (type === 'body' && row === 0 && col === 0) {
            return this.setFocus('head', 0, columns, true);
        }

        if (col > 0) {
            return this.setFocus(type, row, col - 1, true);
        } else if (col === 0) {
            return this.setFocus(type, row - 1, columns, true);
        }

        return false;
    }

    updateRowData(editorState, rowI, colI) {
        this.state.rows[rowI].columns[colI].data = editorState;
        this.setState({rows: this.state.rows}, () => {
            const entityData = this.props.entity.data;
            entityData.rows[rowI].columns[colI].data = Draft.convertToRaw(editorState.getCurrentContent());
            Draft.Entity.mergeData(this.props.entity.key, entityData);
        });
    }

    updateHeaderData(editorState, colI) {
        this.setState('headers.' + colI + '.data', editorState, () => {
            const entityData = this.props.entity.data;
            entityData.headers[colI].data = Draft.convertToRaw(editorState.getCurrentContent());
            Draft.Entity.mergeData(this.props.entity.key, entityData);
        });
    }

    setFocus(type, row, col, moveFocusToEnd = false) {
        if (!_.isEqual(this.state.focusedEditor, {type, row, col})) {
            this.setState({focusedEditor: {type, row, col}}, () => {
                if (moveFocusToEnd) {
                    setTimeout(() => {
                        if (type === 'head') {
                            this.refs[this.state.headers[col].key].moveFocusToEnd();
                        } else {
                            this.refs[this.state.rows[row].columns[col].key].moveFocusToEnd();
                        }
                    });
                }
            });
        }
        return true;
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
        const rows = _.cloneDeep(this.state.rows);
        // Insert a new column into each row
        _.each(rows, row => {
            const spliceArgs = insert ? [index, 0, {key: Draft.genKey(), data: null}] : [index, 1];
            row.columns.splice(...spliceArgs);
        });

        // Insert header column
        const headers = _.cloneDeep(this.state.headers);
        const spliceArgs = insert ? [index, 0, {key: Draft.genKey(), data: null}] : [index, 1];
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
        let spliceArgs = [index, 1];
        if (insert) {
            const columns = Array.from(new Array(this.state.numberOfColumns), (x, i) => i);
            spliceArgs = [index, 0, {
                key: Draft.genKey(), columns: columns.map(() => {
                    return {key: Draft.genKey(), data: null};
                })
            }];
        }
        const rows = _.cloneDeep(this.state.rows);
        const entityData = this.props.entity.data;
        rows.splice(...spliceArgs);
        this.setState({rows}, () => {
            entityData.rows = rows;
            Draft.Entity.mergeData(this.props.entity.key, entityData);

            // Focus first cell of the next available row
            if (rows.length < index + 1) {
                index = rows.length - 1;
            }
            this.setFocus('body', index, 0, true);
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
                    <Ui.Dropdown.Header title="Row" renderIf={isBody}/>
                    <Ui.Dropdown.Link onClick={this.insertRowBefore} icon="fa-plus" title="Insert before" renderIf={isBody}/>
                    <Ui.Dropdown.Link onClick={this.insertRowAfter} icon="fa-plus" title="Insert after" renderIf={isBody}/>
                    <Ui.Dropdown.Link onClick={this.deleteRow} icon="fa-remove" title="Delete" renderIf={isBody && rows.length > 1}/>
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
                                <th key={headers[colI].key} onMouseDown={() => this.setFocus('head', 0, colI)}>
                                    <Editor
                                        ref={headers[colI].key}
                                        preview={this.props.editor.getPreview()}
                                        readOnly={readOnly}
                                        toolbar="floating"
                                        plugins={this.plugins()}
                                        value={headers[colI].data}
                                        convertToRaw={false}
                                        delay={1}
                                        stripPastedStyles={true}
                                        onChange={editorState => this.updateHeaderData(editorState, colI)}/>
                                </th>
                            );
                        })}
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map((row, rowI) => {
                        return (
                            <tr key={row.key}>
                                {columns.map((col, colI) => {
                                    let readOnly = !this.props.editor.getReadOnly();
                                    if (!readOnly) {
                                        const key = {type: 'body', row: rowI, col: colI};
                                        readOnly = !_.isEqual(this.state.focusedEditor, key);
                                    }

                                    return (
                                        <td key={row.columns[colI].key} onMouseDown={() => this.setFocus('body', rowI, colI)}>
                                            <Editor
                                                stripPastedStyles={true}
                                                ref={row.columns[colI].key}
                                                preview={this.props.editor.getPreview()}
                                                readOnly={readOnly}
                                                toolbar="floating"
                                                plugins={this.plugins()}
                                                value={row.columns[colI].data}
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