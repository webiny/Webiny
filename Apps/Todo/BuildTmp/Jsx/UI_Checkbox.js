<div className="col-sm-offset-2 col-sm-10">
    <div className="checkbox">
        <label>
            <input disabled={this.props.disabled} type="checkbox" ref={this.state.ref} onChange={this.onChange} checked={this.dynamic.checked}/> {this.props.label}
        </label>
    </div>
</div>