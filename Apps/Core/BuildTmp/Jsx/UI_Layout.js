<div className="component container">
    <h4>Core-View-Layout</h4>
    <Link className="btn btn-primary" href="/">Left</Link>
    &nbsp;
    <Link className="btn btn-primary" href="/box">Right</Link>
    <hr/>
    {function(){return ComponentLoader.getComponents("MainContent");}.bind(this)()}
    <div className="col-sm-6">
        <hr/>
        {function(){return ComponentLoader.getComponents("LeftContent");}.bind(this)()}
    </div>
    <div className="col-sm-6">
        <hr/>
        {function(){return ComponentLoader.getComponents("RightContent");}.bind(this)()}
    </div>
</div>