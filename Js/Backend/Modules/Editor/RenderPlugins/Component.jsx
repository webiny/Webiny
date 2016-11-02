import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const {Entity, RichUtils} = Draft;
import DraftUtils from './../DraftUtils';

class Component extends Webiny.Ui.Component {

}

Component.defaultProps = {
    renderer() {
        let code = null;
        try {
            code = eval(Babel.transform(this.props.data.code, {presets: ['react', 'es2015']}).code);
        } catch (e) {
            console.error(e)
        }
        return (
            <Ui.Grid.Row>
                <Ui.Grid.Col all={6} className="component-code-editor">
                    <Editor {...editorProps}/>
                </Ui.Grid.Col>
                <Ui.Hide if={!React.isValidElement(code)}>
                    <Ui.Grid.Col all={6}>
                        <div className="component-plugin-wrapper">
                            <Ui.Form>
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