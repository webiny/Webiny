import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const UiD = Webiny.Ui.Dispatcher;

class List extends Webiny.Ui.View {

    getConfig() {
        // Return an object containing config for each UI component (ui="myForm", ui="myList")
        return {
            // List config
            myList: {
                pageChange: (nextPage, currentPage) => {
                    // Handle list pagination
                },

                fieldTitle(){

                },

                actionEdit(){

                },

                multiActionExport(records){

                }
            }
        };
    }

    render() {

        return (
            <Webiny.Builder.View name="core-users-list" config={this.getConfig()}>
                {/*<Ui.ListContainer ui="myList" api="/core/users" fields="id,firstName,lastName,email,userGroups">
                    <Ui.Panel.Panel>
                        <Ui.Panel.Header title="Users List"/>
                        <Ui.Panel.Body>
                            <Ui.List.Filters>
                                <div className="filters">
                                    <Ui.Button type="primary" onClick={this.signal('myList:setFilter', {location: 12})} label="Filter"/>
                                </div>
                            </Ui.List.Fitlers>
                            <Ui.List.MultiActions>
                                <div className="action">
                                    <Ui.Button type="primary" onClick={this.signal('myList:multiExport')} label="Submit"/>
                                </div>
                            </Ui.List.MultiActions>
                            <Ui.List.Table>
                                <field name="title" align="left" label="Title" sort="title"/>
                                <field name="author" label="Author" mask="{author.firstName} {author.lastName}"/>
                                <field name="published" label="Published" sort="published"/>
                                <field name="publishedOn" label="Published On" sort="publishedOn"/>
                                <field name="createdOn" label="Created On" sort="createdOn"/>
                                <action name="view"/>
                                <action name="edit"/>
                                <action name="delete"/>
                            </Ui.List.Table>
                            <Ui.List.Pagination/>
                        </Ui.Panel.Body>
                    </Ui.Panel.Panel>
                </Ui.ListContainer>*/}
            </Webiny.Builder.View>
        );
    }
}

export default List;
