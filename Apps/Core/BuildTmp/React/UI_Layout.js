React.createElement("div", {className: "component container"}, 
    React.createElement("h4", null, "Core-View-Layout"), 
    React.createElement(Link, {className: "btn btn-primary", href: "/"}, "Left"), 
    " ", 
    React.createElement(Link, {className: "btn btn-primary", href: "/box"}, "Right"), 
    React.createElement("hr", null), 
    function(){return ComponentLoader.getComponents("MainContent");}.bind(this)(), 
    React.createElement("div", {className: "col-sm-6"}, 
        React.createElement("hr", null), 
        function(){return ComponentLoader.getComponents("LeftContent");}.bind(this)()
    ), 
    React.createElement("div", {className: "col-sm-6"}, 
        React.createElement("hr", null), 
        function(){return ComponentLoader.getComponents("RightContent");}.bind(this)()
    )
)