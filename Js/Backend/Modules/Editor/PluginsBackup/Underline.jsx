import InlineStylePlugin from './InlineStylePlugin';

export default () => {
    return {
        name: 'underline',
        toolbar: <InlineStylePlugin icon="fa-underline" style="UNDERLINE"/>,
        customStyleMap: {
            'UNDERLINE': {
                color: 'green'
            }
        }
    };
}