# Toast Example Site

This repo is an implementation of the experimental [Toast](https://github.com/christopherBiscardi/toast) package. It will be updated as Toast is updated with new features. [![](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ChristopherBiscardi/new-toast-site)

![Toast](./static/toast.jpg)

## Try it out:

```shell
git clone git@github.com:ChristopherBiscardi/new-toast-site.git
cd new-toast-site
yarn
yarn build
npx serve public
```

## Info

This site includes

- First-class MDX support
- Server-side rendered syntax highlighting
- Codeblock highlighting
- MDXProvider usage
- babel-plugin-preval examples
- static/ folder usage
- src/pages for .js files
- When selecting text on the page, a tweetable selection will pop up.
- Styling is done with [emotion]() although this can be replaced with Tailwind or whatever you prefer
- Preact

## More Examples

- [Benjamin Lannon](https://twitter.com/lannonbr) wrote [a Toast starter](https://github.com/lannonbr/toast-digital-garden-starter) that includes automatic image upload to cloudinary via [jlengstorf's rehype plugin](https://github.com/jlengstorf/rehype-local-image-to-cloudinary)

Existing Toast sites can be found in the wild at the following locations. Feel free to check out the network traffic to see what an ESM-first approach looks like in practice.

- [Chris Biscardi's](https://www.christopherbiscardi.com/)
- [Benjamin Lannon's](https://lannonbr.com/)

## Feedback

Please file issues. Toast is still in early development (there is no documentation yet). There is no official plugins API, no baked-in data fetching (ex: like Gatsby has it's GraphQL layer). This repo works and will be kept updated with new features and bug fixes. If there's functionality you want to see, [file a feature request](https://github.com/ChristopherBiscardi/new-toast-site/issues/new)
