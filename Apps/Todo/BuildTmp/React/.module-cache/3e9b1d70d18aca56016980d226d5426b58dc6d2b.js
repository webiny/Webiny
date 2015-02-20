React.createElement("div", {className: "master minimized"}, 
    React.createElement("div", {className: "master-content container-fluid"}, 
        function(){return ComponentLoader.getComponents("MainContent");}.bind(this)()
    ), 
    React.createElement("footer", null, 
        function(){return ComponentLoader.getComponents("Footer");}.bind(this)()
    )
)