const { algoliasearch, instantsearch } = window;

const searchClient = algoliasearch('LQHCWSO314', '28cd8221b3560f5ad15e4b22bfe3dad8');

const search = instantsearch({
  indexName: 'blog_xxytime_top_lqhcwso314_pages',
  searchClient,
  future: { preserveSharedStateOnUnmount: true },
  
});


search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: (hit, { html, components }) => html`
<article>
  <img src=${ hit.image } alt=${ hit.title } />
  <div>
    <h1>${components.Highlight({hit, attribute: "title"})}</h1>
    <p>${components.Highlight({hit, attribute: "description"})}</p>
    <p>${components.Highlight({hit, attribute: "keywords"})}</p>
  </div>
</article>
`,
    },
  }),
  instantsearch.widgets.configure({
    hitsPerPage: 8,
  }),
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),
]);

search.start();

