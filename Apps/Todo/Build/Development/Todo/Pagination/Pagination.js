getTemplate(){ return '<Pagination count={this.state.itemCount} totalcount={this.state.totalItemCount}/>\
// pagesCount znam iz totalCount/perPage\
// activePage = _page\
// dropdown za odabir per-page = _perPage\
// offsetStart = _perPage*_page\
// offsetEnd = count\
\
TODO: className=parsanje probati izvesti da developer ne mora pisati {this.classSet({})}\
\
<w-list-pagination items="pages"><div className="left">\
        Showing pages: {pages._meta.offsetStart} to {pages._meta.offsetEnd} of {pages._meta.totalCount}\
    </div>\
    <div className="right">\
        <a className="prev" href="#" w-href="page.link">Prev</a>\
        <ul>\
{.map(function(item, index){return (<li key={index}><a href="#" w-href="page.link">page.num</a></li>)}.bind(this))}</ul><a className="next" href="#" w-href="page.link">Next</a>\
    </div>\
</w-list-pagination>';
	}

	