import Webiny from 'Webiny';
import data from './data';
const Ui = Webiny.Ui.Components;
const UiD = Webiny.Ui.Dispatcher;
import CustomLayout from './CustomLayout';

class List extends Webiny.Ui.View {

    getConfig() {
        return {
            myInlineList: {
                defaultParams: {
                    category: 'joinedTeam'
                },
                layout: function () {
                    return (
                        <div>
                            <h3>Custom function layout</h3>
                            <hr/>
                            <table/>
                            <div className="pull-left">
                                <pagination/>
                            </div>
                        </div>
                    );
                }
            },
            myInlineList2: {
                layout: <CustomLayout/>
            }
        };
    }

    render() {
        return (
            <Webiny.Builder.View name="core-users-list" config={this.getConfig()}>
                <Ui.List.Container ui="myList" api="/core/users" fields="id,firstName,lastName,email,createdOn" connectToRouter={true}>
                    <Ui.List.Table.Table>
                        <Ui.List.Table.Row detailsRenderer={null} onShowDetails={null}>
                            <Ui.List.Table.Field name="firstName" align="left" label="First Name" sort="firstName"/>
                            <Ui.List.Table.Field name="lastName" align="left" sort="lastName" label="Last Name"/>
                            <Ui.List.Table.Field name="email" align="left" sort="email" label="Email"/>
                            <Ui.List.Table.Field name="createdOn" align="left" label="Created On" sort="createdOn"/>
                        </Ui.List.Table.Row>
                        <Ui.List.Table.Footer/>
                    </Ui.List.Table.Table>
                    <Ui.List.Pagination/>
                </Ui.List.Container>
                <Ui.Grid.Row>
                    <Ui.Grid.Col all={6}>
                        <Ui.List.Container ui="myInlineList" data={data}>
                            <Ui.List.Filters>
                                <Ui.Button onClick={this.signal('myInlineList:setFilters', {category: null})} label="Show All"/>
                                <Ui.Button onClick={this.signal('myInlineList:setFilters', {category: 'joinedTeam'})} label="Show Joined Team"/>
                            </Ui.List.Filters>
                            <Ui.List.Table.Table>
                                <Ui.List.Table.Row>
                                    <Ui.List.Table.Field name="category" align="left" sort="category" label="Category"/>
                                    <Ui.List.Table.Field name="createdOn" align="left" label="Created On" sort="createdOn.$date"/>
                                </Ui.List.Table.Row>
                                <Ui.List.Table.Footer/>
                            </Ui.List.Table.Table>
                            <Ui.List.Pagination/>
                        </Ui.List.Container>
                    </Ui.Grid.Col>
                    <Ui.Grid.Col all={6}>
                        <Ui.List.Container ui="myInlineList2" api="/core/files" fields="id,src,name,type,size,createdOn" searchFields="name">
                            <Ui.List.Filters>
                                <Ui.Button onClick={this.signal('myInlineList2:setFilters', {type: null})} label="Show All"/>
                                <Ui.Button onClick={this.signal('myInlineList2:setFilters', {type: 'image/png'})} label="Show PNG"/>
                            </Ui.List.Filters>
                            <Ui.List.Table.Table>
                                <Ui.List.Table.Row>
                                    <Ui.List.Table.Field name="name" align="left" label="Name"/>
                                    <Ui.List.Table.Field name="type" align="left" label="Type" sort="type"/>
                                    <Ui.List.Table.Field name="size" align="left" label="Size" sort="size"/>
                                </Ui.List.Table.Row>
                                <Ui.List.Table.Footer/>
                            </Ui.List.Table.Table>
                            <Ui.List.Pagination size="small"/>
                        </Ui.List.Container>
                    </Ui.Grid.Col>
                </Ui.Grid.Row>
            </Webiny.Builder.View>
        );
    }
}

export default List;