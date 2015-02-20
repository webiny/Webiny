<div className="col-sm-12">
    <Form name="form"><FormGroup><Label>Create new item</Label><Input grid="2" placeholder="New task" ref="newTask"/><button className="btn btn-primary col-sm-2" type="submit" onClick={this.addTask}>Add</button>
            <Label>Filter items</Label><Input grid="4" valueLink={this.linkState("filter")} placeholder="Filter..."/></FormGroup></Form>
    {function(){if(this.state.todos.length == 0){return <wdiv>No items available yet...</wdiv>}}.bind(this)()}
    <Table className={this.classSet({'table-hover': this.state.filter != ''})} class-obj={{'table-hover': this.state.filter != ''}}><Thead><Tr><Th>#</Th><Th>ID</Th><Th>Task</Th><Th>Created On</Th><Th>Actions</Th></Tr></Thead><Tbody>
            
{this.state.todos.map(function(item, i){return <Tr key={i} className={this.classSet({danger: item.important, success: item.completed})} class-obj={{danger: item.important, success: item.completed}}><Td>{i+1}</Td><Td>
                        {function(){if(item.id){return <wdiv>{item.id}</wdiv>}}.bind(this)()}
                    </Td><Td>{item.task}</Td><Td>{item.created}</Td><Td>
                        {function(){if(item.id){return <wdiv><Link className="btn btn-primary" href="/Todo/Todo/:id" params={item}>Edit</Link>
                            &nbsp;
                            <button className="btn btn-danger" onClick={this.removeTask.bind(this, item)}>Delete</button></wdiv>} else { return <wdiv>Saving...</wdiv>;}}.bind(this)()}
                    </Td></Tr>}.bind(this))}
        </Tbody></Table></div>