# On Frameworks
[Routing](#routing)
[Linking between pages](#linking-between-pages)
[getServerSideProps](#getServerSideProps)
[NPM dependency resolution](#NPM-dependency-resolution

### Prerendering
**Static generation** - HTML is generated at build time and reused on each request
**Server side rendering** - HTML is generated on each request

### Routing
A page is a react component exported from a `/page` directory. The router will automatically route to the index.js file under the directory. 

**Dynamic Routing** - You can create catch all routes such as `pages/post/[pid].js`, which would everything under `/post`, and accept pid as a parameter.
Any url depth can be captured with `pages/post/[...slug].js`, which would catch any url path after `/post` including `/post/a` or `/post/a/b/c`.
Catch all routes can be made optional with `[[...slug]].js`. Order of precedence: Prefined route > dynamic routes > catch all routes. 

### Linking between pages
You use `import Link from 'next/link'` to do client side routing between pages.

### getServerSideProps
If a function with the following signature is exported, Next.js will know to prerender the page with the data returned from this function.  
```
export async function getServerSideProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  }
}
```
The context object contains important things like the request, response, and query parameters. 

### NPM dependency resolution

If module A depends on Module B v1.0, then it will instill module B at the top level of node-modules, say you then install module C, which relies on v2.0 of module B, then it will nest under Module C's version dependencies, since 1.0 already exists at the top level. Say if you then update module A to use module B v2.0, then npm will remove module B v1.0 frlom teh top level and install module B v2.0 instead! The problem is that the other modules still have B v2.0 as nested dependencies, so you can get rid of the deduplication by running npm dedupe. Install order from a package.json is always alphabetical. 