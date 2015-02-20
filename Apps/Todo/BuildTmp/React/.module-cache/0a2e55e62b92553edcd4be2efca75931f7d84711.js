React.createElement("div", {className: "master minimized"}, 
    
    React.createElement("div", {className: "master-content container-fluid"}, 
        function(){return ComponentLoader.getComponents("MainContent");}.bind(this)()), 
    React.createElement("footer", null, React.createElement("div", {className: "developer-mode"}, 
            React.createElement("span", null, "Developer mode"), 
            React.createElement("input", {type: "checkbox", name: "my-checkbox", className: "switcher", checked: "checked"})), 
        React.createElement("ul", {className: "links"}, React.createElement("li", null, React.createElement("a", {href: "#"}, "Webiny 2.2")), 
            React.createElement("li", null, React.createElement("a", {href: "#"}, "Legal")), 
            React.createElement("li", null, React.createElement("a", {href: "#"}, "Copyright")), 
            React.createElement("li", null, React.createElement("a", {href: "#"}, "Support"))
        ), React.createElement("ul", {className: "links secondary"}, React.createElement("li", null, React.createElement("a", {href: "#"}, "Help")), 
            React.createElement("li", null, React.createElement("a", {href: "#"}, "Documentation")), 
            React.createElement("li", null, React.createElement("a", {href: "#"}, "GitHub"))
        ), React.createElement("div", {className: "dropdown sort feedback-wrap"}, 
            React.createElement("button", {className: "btn btn-default dropdown-toggle feedback", type: "button", onClick: "alert('Opens a modalbox')"}, 
                React.createElement("span", {className: "icon icon-comments"}), 
                React.createElement("span", null, "HELP US WITH FEEDBACK")
            )
        )
    ))