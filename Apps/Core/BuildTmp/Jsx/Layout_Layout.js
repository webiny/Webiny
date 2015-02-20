<div className="master minimized">
    <Navigation/>
    <div className="master-content container-fluid">
        {function(){return ComponentLoader.getComponents("MasterContent");}.bind(this)()}
    </div>
    <Footer/>
</div>