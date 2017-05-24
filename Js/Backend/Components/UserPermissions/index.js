import Webiny from 'Webiny';

class UserPermissions extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.state = {
            permissions: []
        };
    }

    componentWillMount() {
        super.componentWillMount();
        new Webiny.Api.Endpoint(this.props.api).get('/', {_perPage: 1000, _sort: 'name'}).then(apiResponse => {
            this.setState({permissions: apiResponse.getData('list')});
        });
    }

    onChange(index, permission, enabled) {
        const value = this.props.value || [];
        if (enabled) {
            value.push(permission);
        } else {
            value.splice(index, 1);
        }
        this.props.onChange(value);
    }
}

UserPermissions.defaultProps = {
    api: '/entities/webiny/user-permissions',
    value: [],
    onChange: _.noop,
    renderer() {
        const {List, Switch} = this.props;
        return (
            <List.Table data={this.state.permissions}>
                <List.Table.Row>
                    <List.Table.Field style={{width: 140}}>
                        {(permission) => {
                            const checkedIndex = _.findIndex(this.props.value, {id: permission.id});
                            return (
                                <Switch value={checkedIndex > -1} onChange={enabled => this.onChange(checkedIndex, permission, enabled)}/>
                            );
                        }}
                    </List.Table.Field>
                    <List.Table.Field label="Permission">
                        {(permission) => (
                            <span><strong>{permission.name}</strong><br/>{permission.slug}</span>
                        )}
                    </List.Table.Field>
                    <List.Table.Field label="Description" name="description"/>
                </List.Table.Row>
            </List.Table>
        );
    }
};

export default Webiny.createComponent(UserPermissions, {modules: ['List', 'Switch']});