# On Frameworks
[Pages](#pages)
[Data Fetching)(#data-fetching)
[NPM dependency resolution](#NPM-dependency-resolution)

### Pages
A page is a react component that is exported from a /page/ directory. The routes can be dynamic such as `pages/posts/[id].js`.

**Layouts** - Layouts wrap the entire component tree and is reused when changing pages. 

**Pre-rendering** - HTML is generated in advance, rather than done client side, and then javascript runs on page load. **Static generation** generates the page at build time, whereas **server side rendering** generates HTML at request time. 

Static generation can be done with or without data, using **getStaticProps**. Static generation is a good idea if the page can be generated in advance, but isn't a good idea for pages that show frequently updated data or change on each request. In these cases you can use static generation with cleint side rendering, or server side rendering.  

To server side render, you define a function called **getServerSideProps** that fetches the props and passes it to the page server side.  

### Data Fetching
**getServerSideProps** - nextjs will prerender the page on each request using the returned data, runs at request time, on the server. If you make client side page transitions, nextjs will generate a server side request. This function can only be exported from a page.  
**getStaticProps** - Used to prerender at build time, use this when the data needed to render the page is independent of build. This always runs server side. Since its run at build time it does not have access to request data. It produces a JSON file that is used for client side routing so that the destination component has its prerendered html, reducing the number of requests.  
**Incremental Static Generation** - You can incrementally update static pages by rebuilding individual pages. Use the revalidate prop to call getStaticProps after an interval of time.  
**Client Side** - Useful when SEO indexing isn't needed and when the content of your pages needs to update frequently. Data is therefore fetched at component mount. Use SWR for data fetching.

### Working with Stylesheets
You can import a stylesheet within app.js and it will apply to all components and pages. You can also create local stylesheets with .module.css.

### Working with Images
You use 'next/image'. You can use it with a local image like so:

```
import Image from 'next/image'
import profilePic from '../public/me.png'

function Home() {
  return (
    <>
      <Image
        src={profilePic}
        alt="Picture of the author"
        ...
```

When using an image you can set className which will be set on the <img> tag. Alternatively you can pick the right layout mode in the image itself. Keep in mind `next/image`wraps in a span to prevent CLS.

### NPM dependency resolution

If module A depends on Module B v1.0, then it will instill module B at the top level of node-modules, say you then install module C, which relies on v2.0 of module B, then it will nest under Module C's version dependencies, since 1.0 already exists at the top level. Say if you then update module A to use module B v2.0, then npm will remove module B v1.0 frlom teh top level and install module B v2.0 instead! The problem is that the other modules still have B v2.0 as nested dependencies, so you can get rid of the deduplication by running npm dedupe. Install order from a package.json is always alphabetical. 


