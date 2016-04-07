import Webiny from 'Webiny';
import data from './data';
const Ui = Webiny.Ui.Components;
const UiD = Webiny.Ui.Dispatcher;

class List extends Webiny.Ui.View {

    getConfig() {
        return {
            myInlineList: {
                defaultParams: {
                    category: 'joinedTeam'
                }
            }
        };
    }

    render() {
        return (
            <Webiny.Builder.View name="core-users-list" config={this.getConfig()}>
                <Ui.List.Container ui="myList" api="/core/users" fields="id,firstName,lastName,email,createdOn" connectToRouter={true}>
                    <Ui.Panel.Panel>
                        <Ui.Panel.Header title="List connected to router"/>
                        <Ui.Panel.Body>
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
                        </Ui.Panel.Body>
                    </Ui.Panel.Panel>
                </Ui.List.Container>
                <Ui.Grid.Row>
                    <Ui.Grid.Col all={6}>
                        <Ui.List.Container ui="myInlineList" data={data}>
                            <Ui.Panel.Panel>
                                <Ui.Panel.Header title="Static Activities List">
                                    <div className="pull-right" style={{marginTop: '-10px'}}>
                                        <Ui.Button onClick={this.ui('myInlineList:setFilters', {category: null})}>
                                            Show All
                                        </Ui.Button>
                                        <Ui.Button onClick={this.ui('myInlineList:setFilters', {category: 'joinedTeam'})}>
                                            Show Joined Team
                                        </Ui.Button>
                                    </div>
                                </Ui.Panel.Header>
                                <Ui.Panel.Body>
                                    <Ui.List.Table.Table>
                                        <Ui.List.Table.Row>
                                            <Ui.List.Table.Field name="category" align="left" sort="category" label="Category"/>
                                            <Ui.List.Table.Field name="createdOn" align="left" label="Created On" sort="createdOn.$date"/>
                                        </Ui.List.Table.Row>
                                        <Ui.List.Table.Footer/>
                                    </Ui.List.Table.Table>
                                    <Ui.List.Pagination/>
                                </Ui.Panel.Body>
                            </Ui.Panel.Panel>
                        </Ui.List.Container>
                    </Ui.Grid.Col>
                    <Ui.Grid.Col all={6}>
                        <Ui.List.Container ui="myInlineList2" api="/core/files" fields="id,src,name,type,size,createdOn">
                            <Ui.Panel.Panel>
                                <Ui.Panel.Header title="Inline File List">
                                    <div className="pull-right" style={{marginTop: '-10px'}}>
                                        <Ui.Button onClick={this.ui('myInlineList2:setFilters', {type: null})}>
                                            Show All
                                        </Ui.Button>
                                        <Ui.Button onClick={this.ui('myInlineList2:setFilters', {type: 'image/png'})}>
                                            Show PNG
                                        </Ui.Button>
                                    </div>
                                </Ui.Panel.Header>
                                <Ui.Panel.Body>
                                    <Ui.List.Table.Table>
                                        <Ui.List.Table.Row>
                                            <Ui.List.Table.Field name="name" align="left" label="Name"/>
                                            <Ui.List.Table.Field name="type" align="left" label="Type" sort="type"/>
                                            <Ui.List.Table.Field name="size" align="left" label="Size" sort="size"/>
                                        </Ui.List.Table.Row>
                                        <Ui.List.Table.Footer/>
                                    </Ui.List.Table.Table>
                                    <Ui.List.Pagination size="small"/>
                                </Ui.Panel.Body>
                            </Ui.Panel.Panel>
                        </Ui.List.Container>
                    </Ui.Grid.Col>
                </Ui.Grid.Row>
            </Webiny.Builder.View>
        );
    }
}

export default List;

/*<Ui.List.Filters>
 <div className="col-md-6 pull-left filters">
 <Ui.Button type="primary" onClick={this.ui('myList:setFilter', {location: 12})} label="Filter"/>
 </div>
 </Ui.List.Filters>
 <Ui.List.MultiActions>
 <div className="col-md-6 pull-right action">
 <Ui.Button type="primary" onClick={this.ui('myList:multiExport')} label="MultiAction"/>
 </div>
 </Ui.List.MultiActions>*/
