// Settings for everything in blog/. Posts live in blog/posts/ (that folder holds only articles,
// so Sue's editor shows nothing else). Each post's address comes from its file name minus the
// date, e.g. blog/posts/2026-10-27-eat-slowly.md -> /blog/eat-slowly/
const isPost = (data) => data.page.inputPath.split("\\").join("/").includes("/blog/posts/");

module.exports = {
  eleventyComputed: {
    layout: (data) => (isPost(data) ? "post.njk" : data.layout),
    permalink: (data) => (isPost(data) ? `/blog/${data.page.fileSlug}/` : data.permalink)
  }
};
