React.createElement("div", {className: "col-sm-offset-2 col-sm-10"}, 
    React.createElement("div", {className: "checkbox"}, 
        React.createElement("label", null, 
            React.createElement("input", {disabled: this.props.disabled, type: "checkbox", ref: this.state.ref, onChange: this.onChange, checked: this.dynamic.checked}), " ", this.props.label
        )
    )
)