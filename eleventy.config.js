// Eleventy builds the site into _site/. Static pages (index.html, privacy.html, 404.html)
// are processed with Nunjucks so they can share the header/footer and list the latest posts.
module.exports = function (eleventyConfig) {
  // Files copied as they are
  ["css", "js", "assets", "downloads", "robots.txt"].forEach((p) => eleventyConfig.addPassthroughCopy(p));
  eleventyConfig.addPassthroughCopy("google*.html"); // Google Search Console verification

  // Blog posts, newest first
  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob("blog/posts/*.md").sort((a, b) => b.date - a.date)
  );

  eleventyConfig.addFilter("readableDate", (d) =>
    new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
  );
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString().slice(0, 10));
  eleventyConfig.addFilter("readingTime", (html) => {
    const words = String(html || "").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200)) + " min read";
  });
  eleventyConfig.addFilter("exceptUrl", (posts, url) => posts.filter((p) => p.url !== url));
  eleventyConfig.addFilter("absoluteUrl", (path, base) => new URL(path, base).href);

  return {
    dir: { input: ".", includes: "_includes", data: "_data", output: "_site" },
    templateFormats: ["html", "njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: false
  };
};
