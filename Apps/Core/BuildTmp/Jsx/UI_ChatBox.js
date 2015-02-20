<div className="component">
    <h3>ChatBox</h3>
    <FormInline name="form"><FormGroup><Input grid="8" ref="message" placeholder="Your message"/><div className="col-sm-4">
                <button className="btn btn-success" type="submit" onClick={this.postMessage}>Post</button>
            </div>
        </FormGroup><ul>
            
{this.state.messages.map(function(msg, i){return <li key={i}>
                    <span className="grey">{msg.time.getTime()} - </span>
                    <span>{msg.message}</span>
                </li>}.bind(this))}
        </ul></FormInline></div>