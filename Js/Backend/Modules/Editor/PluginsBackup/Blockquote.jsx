import BlockTypePlugin from './BlockTypePlugin';

export default () => {
    return {
        name: 'blockquote',
        toolbar: <BlockTypePlugin icon="fa-quote-right" block="blockquote"/>
    };
}