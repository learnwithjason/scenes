const fs = require("fs").promises;
const fsReg = require("fs");
const slugify = require("@sindresorhus/slugify");
const mdx = require("@mdx-js/mdx");
const util = require("util");
const vm = require("vm");
const rehypePrism = require("./rehype-prism-mdx");
const rehypeSlug = require("rehype-slug");
const rehypeLink = require("rehype-autolink-headings");
const parse = require("rehype-parse");
const unified = require("unified");
const globby = require("globby");
const chalk = require("chalk");

const {
  transformComponentForBrowser,
  transformComponentForNode,
} = require("toast/src/transforms");

const parseSvg = unified().use(parse, {
  emitParseErrors: true,
  duplicateAttribute: false,
});

// let parsedCorgi;
// try {
//   parsedCorgi = parseSvg.runSync(parseSvg.parse(corgi)).children[0].children[1]
//     .children;
// } catch (e) {
//   console.log(e);
// }

exports.sourceData = async ({ createPage, ...options }) => {
  const files = await globby("./content/posts", {
    expandDirectories: { extensions: ["mdx"] },
  });

  return Promise.all(
    files.map(async (filename) => {
      console.log("filename", filename);
      const file = await fs.readFile(filename, "utf-8");
      let compiledMDX;
      // console.log("compiled");
      try {
        compiledMDX = await mdx(file, {
          // remarkPlugins: [codeblocks],
          rehypePlugins: [
            rehypePrism,
            rehypeSlug,
            [
              rehypeLink,
              {
                properties: {
                  style: "position: absolute; right: calc(100% + 5px);",
                },
                content: {
                  type: "element",
                  tagName: "corgilink",
                  properties: { className: ["corgi-heading-link"] },
                  children: [],
                  // children: [parsedCorgi]
                },
              },
            ],
          ],
        });
      } catch (e) {
        console.log(e);
        throw e;
      }
      const component = await transformComponentForNode(compiledMDX);
      const context = { exports: {} };
      vm.createContext(context);
      const script = new vm.Script(component.code);
      script.runInNewContext(context);
      const { meta } = context.exports || {};
      if (!meta.slug && meta.title) {
        meta.slug = slugify(meta.title);
      }
      if (!meta.slug) {
        console.warn(
          chalk.red(`No slug found for file
        
  > ${filename}

put a slug in the meta export like:

\`\`\`
export const meta = {
  slug: "my-slug"
}
\`\`\`

current meta object is

\`\`\`
${JSON.stringify(meta, null, 2)}
\`\`\`
`)
        );
        throw new Error("No slug found");
      }

      // remove leading and trailing slashes
      meta.slug = meta.slug.replace(/^\//, "").replace(/\/$/, "");

      if (!meta.title) {
        console.warn(
          chalk.red(`file ${filename} must have a title in the meta export

\`\`\`
export const meta = {
  title: "Some Post Title"
}
\`\`\`

`)
        );
      }
      await createPage({
        module: `/** @jsx mdx */
            import {mdx} from '@mdx-js/preact';
            ${compiledMDX}`,
        slug: meta.slug,
        data: { ...meta },
      });
      // console.log(meta);
      // writeDataFile
      return {
        // id,
        // content,
        ...meta,
      };
    })
  );
};
