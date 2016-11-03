import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

const ImageComponent = (props) => {
    return (
        <div className="readonly-image-plugin-wrapper" style={{padding: 10}}>
            <img src={props.data.url} alt={props.data.caption} title={props.data.caption}/>
            <figcaption>{props.data.caption}</figcaption>
            <Ui.Button type="secondary" onClick={() => alert('Woof woof!')} label="Bark!"/>
        </div>
    );
};

export default () => {
    return {
        name: 'image',
        blockRendererFn: (contentBlock) => {
            const type = contentBlock.getType();
            const dataType = contentBlock.getData().toObject().plugin;
            if (type === 'atomic' && dataType === 'image') {
                return {
                    component: ImageComponent,
                    editable: false
                };
            }
        }
    };
}