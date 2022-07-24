# On Frameworks
[Pages](#pages)
[Data Fetching)(#data-fetching)
[NPM dependency resolution](#NPM-dependency-resolution)

### Pages
A page is a react component that is exported from a /page/ directory. The routes can be dynamic such as `pages/posts/[id].js`.

**Pre-rendering** - HTML is generated in advance, rather than done client side, and then javascript runs on page load. **Static generation** generates the page at build time, whereas **server side rendering** generates HTML at request time. 

Static generation can be done with or without data, using **getStaticProps**. Static generation is a good idea if the page can be generated in advance, but isn't a good idea for pages that show frequently updated data or change on each request. In these cases you can use static generation with cleint side rendering, or server side rendering.

To server side render, you define a function called **getServerSideProps** that fetches the props and passes it to the page server side.

### Data Fetching
**getServerSideProps** - nextjs will prerender the page on each request using the returned data, runs at request time, on the server. If you make client side page transitions, nextjs will generate a server side request. This function can only be exported from a page.
**getStaticProps** - Used to prerender at build time, use this when the data needed to render the page is independent of build 



### NPM dependency resolution

If module A depends on Module B v1.0, then it will instill module B at the top level of node-modules, say you then install module C, which relies on v2.0 of module B, then it will nest under Module C's version dependencies, since 1.0 already exists at the top level. Say if you then update module A to use module B v2.0, then npm will remove module B v1.0 frlom teh top level and install module B v2.0 instead! The problem is that the other modules still have B v2.0 as nested dependencies, so you can get rid of the deduplication by running npm dedupe. Install order from a package.json is always alphabetical. 


