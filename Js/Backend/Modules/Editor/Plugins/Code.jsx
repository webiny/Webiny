import InlineStylePlugin from './InlineStylePlugin';

export default () => {
    return {
        name: 'code',
        toolbar: <InlineStylePlugin icon="fa-code" style="CODE"/>,
        customStyleMap: {
            'CODE': {
                fontFamily: 'monospace',
                wordBreak: 'break-all',
                backgroundColor: 'rgb(244, 244, 244)',
                boxShadow: 'rgb(187, 187, 187) 0px -1px 0px inset',
                padding: '2px 4px',
                borderRadius: '5px',
                margin: '0 2px',
                border: '1px solid rgb(204, 204, 204)'
            }
        }
    };
}