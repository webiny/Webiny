export default () => {
    return {
        name: 'link',
        decorators: [
            {
                strategy: 'LINK',
                component: (props) => {
                    const data = Draft.Entity.get(props.entityKey).getData();
                    return (
                        <a href={data.url} target={data.target}>{props.children}</a>
                    );
                }
            }
        ]
    };
}