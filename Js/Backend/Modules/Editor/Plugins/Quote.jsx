import Webiny from 'Webiny';
import EntityPlugin from './EntityPlugin';

class QuoteAction extends EntityPlugin {
    createEntity(){
        return Draft.Entity.create(this.props.entity, 'MUTABLE');
    }
}

QuoteAction.defaultProps = _.merge({}, EntityPlugin.defaultProps, {
    entity: 'CODE-QUOTE',
    icon: 'fa-terminal'
});

const style = {
    fontFamily: 'monospace',
    wordBreak: 'break-all',
    backgroundColor: 'rgb(244, 244, 244)',
    boxShadow: 'rgb(187, 187, 187) 0px -1px 0px inset',
    padding: '2px 4px',
    borderRadius: '5px',
    margin: '0 2px',
    border: '1px solid rgb(204, 204, 204)'
};

export default () => {
    return {
        name: 'quote',
        toolbar: <QuoteAction/>,
        decorators: [
            {
                strategy: 'CODE-QUOTE',
                component: (props) => {
                    return (
                        <code style={style}>{props.children}</code>
                    );
                }
            }
        ]
    };
}