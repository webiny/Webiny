import Webiny from 'Webiny';

class Editor extends Webiny.Ui.FormComponent {
    constructor(props) {
        super(props);

        this.editor = null;
        this.options = null;

        this.bindMethods('getTextareaElement');
    }

    componentDidMount() {
        super.componentDidMount();

        $.trumbowyg.svgPath = this.props.svgPath;

        const options = {
            btnsDef: {
                image: {
                    dropdown: ['insertImage', 'base64', 'noEmbed'],
                    ico: 'insertImage'
                }
            },
            btns: [
                ['viewHTML'],
                ['undo', 'redo'],
                ['formatting'],
                'btnGrp-design',
                ['link'],
                ['image'],
                'btnGrp-justify',
                'btnGrp-lists',
                ['foreColor', 'backColor'],
                ['preformatted'],
                ['horizontalRule'],
                ['fullscreen']
            ]
        };

        $(this.getTextareaElement()).trumbowyg(options).on('tbwchange', (content) => {
            this.props.valueLink.requestChange(content.currentTarget.value);
        });
    }

    componentWillReceiveProps(props) {
        if ($(this.getTextareaElement()).trumbowyg('html') !== props.valueLink.value && !_.isNull(props.valueLink.value)) {
            $(this.getTextareaElement()).trumbowyg('html', props.valueLink.value);
        }
    }

    shouldComponentUpdate() {
        return false;
    }

    getTextareaElement() {
        return $(ReactDOM.findDOMNode(this)).find('textarea')[0];
    }
}

Editor.defaultProps = {
    svgPath: Webiny.Assets('Core.Webiny', 'images/HTMLEditor/trumbowyg.svg'),
    renderer() {
        return (
            <div>
                <textarea></textarea>
            </div>
        );
    }
};

export default Editor;
