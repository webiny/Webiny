import CallbackPlugin from './CallbackPlugin';

export default (callback) => {
    return {
        name: 'callback',
        toolbar: <CallbackPlugin callback={callback} icon="fa-play"/>
    };
}