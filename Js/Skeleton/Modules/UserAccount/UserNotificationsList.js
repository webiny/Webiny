import React from 'react';
import Webiny from 'webiny';

class Notifications extends Webiny.Ui.View {

}

Notifications.defaultProps = {
    renderer() {
        const {View, List, List: {Table}, Container} = this.props;

        const listProps = {
            ref: ref => this.list = ref,
            api: '/services/webiny/app-notifications/',
            perPage: 10,
            connectToRouter: true
        };

        return (
            <View.List>
                <View.Header title="My Notifications"/>
                <View.Body>
                    <List {...listProps}>
                        <Table>
                            <Table.Row>
                                <Table.Field label="Notification">
                                    {({data}) => (
                                        <Container notification={data} onMarkedRead={() => this.list.loadData()}/>
                                    )}
                                </Table.Field>
                            </Table.Row>
                        </Table>
                        <List.Pagination/>
                    </List>
                </View.Body>
            </View.List>
        );
    }
};

export default Webiny.createComponent(Notifications, {
    modules: ['View', 'List', {Container: 'Webiny/Skeleton/Notifications/Container'}]
});