const { promises: fs } = require("fs");
const path = require("path");
const MDXPostsSource = require("./fetch-mdx-post-files");

exports.sourceData = async ({ withCache, createPage }) => {
  return Promise.all([
    withCache("mdx-posts", MDXPostsSource.sourceData({ createPage })),
  ]);
};

exports.prepData = async ({ cacheDir, publicDir }) => {
  // have to make sure the directory we want to write in exists
  // We can probably avoid this by offering some kind of "non-filesystem"-based
  // API for adding data to paths
  await fs.mkdir(path.resolve(publicDir, "src/pages"), { recursive: true });

  // prep page data for index and post pages
  const mdxPostsData = require(path.resolve(cacheDir, "mdx-posts.json"));

  const allPostsData = mdxPostsData.map(({ title, date, slug, tags }) => ({
    title,
    updatedAt: date,
    slug,
    tags,
    contentType: "blog-post",
  }));

  await fs.writeFile(
    path.resolve(publicDir, "src/pages/garden.json"),
    JSON.stringify({ posts: allPostsData })
  );

  // index.html

  const curatedPostsData = allPostsData
    .sort((b, a) => {
      const da = new Date(a.updatedAt).getTime();
      const db = new Date(b.updatedAt).getTime();
      if (da < db) return -1;
      if (da === db) return 0;
      if (da > db) return 1;
    })
    .filter(({ contentType }) => contentType === "blog-post")
    .slice(0, 5);

  await fs.writeFile(
    path.resolve(publicDir, "src/pages/index.json"),
    JSON.stringify({ posts: curatedPostsData })
  );
};
