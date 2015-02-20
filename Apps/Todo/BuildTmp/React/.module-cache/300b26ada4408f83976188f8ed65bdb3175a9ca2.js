React.createElement("div", {className: "component"}, 
    React.createElement("h3", null, "ChatBox"), 
    React.createElement(FormInline, {name: "form"}, React.createElement(FormGroup, null, React.createElement(Input, {grid: "8", ref: "message", placeholder: "Your message"}), React.createElement("div", {className: "col-sm-4"}, 
                React.createElement("button", {className: "btn btn-success", type: "submit", onClick: this.postMessage}, "Post")
            )
        ), React.createElement("ul", null, 
            
this.state.messages.map(function(msg, i){return React.createElement("li", {key: i}, 
                    React.createElement("span", {className: "grey"}, msg.time.getTime(), " - "), 
                    React.createElement("span", null, msg.message)
                )}.bind(this))
        )))