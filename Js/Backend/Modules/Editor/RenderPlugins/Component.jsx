import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const {Entity, RichUtils} = Draft;
import DraftUtils from './../DraftUtils';

const TestComponent2 = () => {
    const props = {
        api: '/entities/core/user-roles',
        fields: 'slug,name,id,createdOn',
        sort: 'name',
        checkboxLabelRenderer() {
            return (
                <span><strong>{this.props.label}</strong> ({moment(this.props.option.data.createdOn).format('DD-MM-YYYY')})</span>
            );
        }
    };

    return (
        <Ui.Form>
            {(model) => (
                <Ui.Grid.Row>
                    <Ui.Grid.Col all={6}>
                        <Ui.CheckboxGroup label="Choose your favorite fruit:" name="fruits" validate="minLength:2" {...props}/>
                    </Ui.Grid.Col>
                    <Ui.Grid.Col all={6}>
                        Form model:
                        <pre>{JSON.stringify(model, null, 4)}</pre>
                    </Ui.Grid.Col>
                </Ui.Grid.Row>
            )}
        </Ui.Form>
    );
};

const TestComponent = () => {
    return (
        <Ui.Form>
            {(model) => (
                <Ui.Grid.Row>
                    <Ui.Grid.Col all={6}>
                        <Ui.CheckboxGroup label="Choose your favorite fruit:" name="fruits" validate="minLength:2">
                            <option value="strawberry">Strawberry</option>
                            <option value="blackberry">Blackberry</option>
                            <option value="mango">Mango</option>
                            <option value="banana">Banana</option>
                            <validator name="minLength">Please select at least 2 options</validator>
                        </Ui.CheckboxGroup>
                    </Ui.Grid.Col>
                    <Ui.Grid.Col all={6}>
                        Form model:
                        <pre>{JSON.stringify(model, null, 4)}</pre>
                    </Ui.Grid.Col>
                </Ui.Grid.Row>
            )}
        </Ui.Form>
    );
};

class Component extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.state = {
            code: ''
        }
    }
}

Component.defaultProps = {
    renderer() {
        let code = _.noop();
        try {
            code = eval(Babel.transform(this.state.code, {presets: ['react', 'es2015']}).code);
        } catch (e) {
            console.error(e)
        }
        return (
            <Ui.Grid.Row>
                <Ui.Grid.Col all={12}>
                    <Ui.CodeEditor {...this.bindTo('code')} label="Enter React code"/>
                </Ui.Grid.Col>
                <Ui.Hide if={!React.isValidElement(code)}>
                    <Ui.Grid.Col all={12}>
                        <div className="component-plugin-wrapper">
                            <Ui.Form key={_.uniqueId('demo-form')}>
                                {(model) => (
                                    <Ui.Grid.Row>
                                        <Ui.Grid.Col all={6}>
                                            {React.isValidElement(code) && code}
                                        </Ui.Grid.Col>
                                        <Ui.Grid.Col all={6}>
                                            Form model:
                                            <pre>{JSON.stringify(model, null, 4)}</pre>
                                        </Ui.Grid.Col>
                                    </Ui.Grid.Row>
                                )}
                            </Ui.Form>
                        </div>
                    </Ui.Grid.Col>
                </Ui.Hide>
            </Ui.Grid.Row>
        );
    }
};

class ComponentAction extends Webiny.Ui.Component {
    getComponent() {
        const editorState = this.props.editor.getEditorState();
        this.props.editor.setEditorState(DraftUtils.insertDataBlock(editorState, {component: 'TestComponent', plugin: 'component'}));
    }
}

ComponentAction.defaultProps = {
    renderer(){
        return (
            <Ui.Button disabled={this.props.editor.getReadOnly()} onClick={this.getComponent.bind(this)} icon="fa-puzzle-piece"/>
        );
    }
};

export default () => {
    return {
        name: 'component',
        toolbar: <ComponentAction/>,
        blockRendererFn: (contentBlock) => {
            const type = contentBlock.getType();
            const dataType = contentBlock.getData().toObject().plugin;
            if (type === 'atomic' && dataType === 'component') {
                return {
                    component: Component
                };
            }
        }
    };
}