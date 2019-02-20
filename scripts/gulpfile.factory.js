module.exports = function factory({
  elementName,
  className,
  precompile = []
} = {}) {
  const { task, src, dest, watch, parallel, series } = require("gulp");

  const browser_support = [
    "last 2 versions",
    "Firefox > 40",
    "iOS > 5"
  ];

  const paths = {
    source: "./src",
    compiled: "./",
    temp: "./tmp"
  };

  // Tooling
  const fs = require("fs");
  const path = require("path");
  const replace = require("gulp-replace");
  const clean = require("gulp-clean");

  // Rollup
  const shell = require("gulp-shell");

  // JavaScript
  const banner = require("gulp-banner");
  const rename = require("gulp-rename");

  // Styles
  const sass = require("gulp-sass");
  sass.compiler = require("node-sass");

  const postcss = require('gulp-postcss');
  const sourcemaps = require("gulp-sourcemaps");
  const autoprefixer = require("autoprefixer");
  const cssnano = require("gulp-cssnano");

  // Markup
  const trim = require("trim");
  const decomment = require("decomment");

  // Compile the sass into css, compress, autoprefix
  task("compile:sass", () => {
    return src(path.join(paths.source, "**/*.{scss,css}"))
      .pipe(sourcemaps.init())
      // Compile the Sass into CSS
      .pipe(
        sass({
          outputStyle: "expanded"
        }).on("error", sass.logError)
      )
      // Adds autoprefixing to the compiled sass
      .pipe(
        postcss([
          autoprefixer(browser_support)
        ])
      )
      // Write the sourcemap
      .pipe(sourcemaps.write(paths.compiled))
      // Output the unminified file
      .pipe(dest(paths.compiled));
  });

  task("minify:css", () => {
    return src(["*.css"], {
      cwd: paths.compiled
    })
      // Minify the file
      .pipe(
        cssnano({
          autoprefixer: {
            browsers: browser_support,
            add: false
          }
        })
      )
      // Add the .min suffix
      .pipe(rename({
        suffix: ".min"
      }))
      // Output the minified file
      .pipe(dest(paths.compiled));
  });

  task("fallback:css", () => {
    const classRegex = new RegExp(`\.${elementName}__(\w+)(.*){`, "gi");
    return src(["*.css"], {
      cwd: paths.compiled
    })
      // Replace host with the element tag
      .pipe(
        replace(":host ", `${elementName} `)
      )
      .pipe(
        replace(/:host\((.*)\)/g, `${elementName}$1`)
      )
      // Try to approximate class name to possible slot name
      .pipe(
        replace(/\.([\w|-]+)__(\w+)(.*){/g, `${elementName}[slot="$1--$2"]$3{`)
      )
      // Replace slotted with slot reference
      .pipe(
        replace(/\:\:slotted\(\[slot\=\"(.*)\"\](.*)\)/g, `${elementName}[slot="$1"]$2`)
      )
      // Replace slotted with slot reference
      .pipe(
        replace(/\:\:slotted\((.*)\)/g, `${elementName}[slot] > $1`)
      )
      // Add the .fallback suffix
      .pipe(rename({
        suffix: "-fallback"
      }))
      // Output the updated file
      .pipe(dest(paths.compiled));
  });
 
  // Delete the temp directory
  task("clean", () => {
      return src([
        `${elementName}*.{js,css,map}`
      ], {
        cwd: paths.compiled,
        read: false,
        allowEmpty: true
      })
        .pipe(clean());
  });

  // Returns a string with the cleaned up HTML
  const htmlCompiler = (htmlFile) => {
    return decomment(
      fs.readFileSync(htmlFile)
      .toString()
      .trim());
  };

  const getURLs = (string, types) => {
    let urls = {};
    types.forEach(type => {
      const re = new RegExp(
        `get\\s+${type}Url\\([^)]*\\)\\s*{\\s*return\\s+"([^"]+)"`,
        "g"
      );
      const parse = re.exec(string);
      urls[type] =
        typeof parse === "object" && parse !== null ? parse[1] : null;
    });
    return urls;
  };

  task("merge", () => {
    return src(path.join(paths.source, "**/*.js"))
      .pipe(
        replace(
          /extends\s+PFElement\s+{/g,
          (classStatement, character, jsFile) => {
            // Extract the urls for template, style, and schema
            // -- Would prefer to do this by require'ing and asking it directly, but without
            //    node.js support for ES modules, we're stuck with this.
            const oneLineFile = jsFile
              .slice(character)
              .split("\n")
              .join(" ");

            let url = getURLs(oneLineFile, ["template", "style", "schema"]);
            let html = "";
            let cssResult = "";
            let properties = "";
            let slots = "";

            // Check for the html template
            let is_defined = url.template !== null;
            let file_exists = fs.existsSync(path.join(paths.source, url.template || ""));
            if (is_defined && file_exists) {
              html = htmlCompiler(path.join(paths.source, url.template || ""));
            }

            // Check for the stylesheet template
            is_defined = url.style !== null;
            file_exists = fs.existsSync(path.join(paths.source, url.style || ""));
            if (is_defined && file_exists) {
              let result = "";
              // Get the compiled css styles from the source directory
              let css_styles = path.join(paths.source, `${path.basename(url.style, ".scss")}.min.css`);
              // Read in the content of the compiled file
              if(fs.existsSync(css_styles)) {
                result = fs.readFileSync(css_styles);
              } else {
                console.warn("Compiled CSS assets cannot be found.");
              }
              // If the string is not empty, add to the results variable
              if (result.toString() !== "") {
                cssResult = `<style>${result}</style>`;
              }
            }

            is_defined = url.schema !== null;
            file_exists = fs.existsSync(path.join(paths.source, url.schema || ""));
            if (is_defined && file_exists) {
              properties = "{}";
              slots = "{}";
              let schemaObj = JSON.parse(
                fs.readFileSync(path.join(paths.source, url.schema))
              );
              if (schemaObj && typeof schemaObj === "object") {
                if (schemaObj.properties.attributes) {
                  properties = schemaObj.properties.attributes.properties;
                  properties = JSON.stringify(properties);
                }
                if (schemaObj.properties.slots) {
                  slots = schemaObj.properties.slots.properties;
                  slots = JSON.stringify(slots);
                }
              }
            }

            let template = classStatement;
            if(cssResult || html) {
              template += `

  get html() {
    return \`${cssResult}${html}\`;
  }`;
            }
            if(properties) {
              template += `

  static get properties() {
    return ${properties};
  }`;
            }
            if(slots) {
              template += `

  static get slots() {
    return ${slots};
  }`;
            }

            return template;
          }
        )
      )
      .pipe(
        banner(
          `/*\n * @license\n${fs
            .readFileSync("LICENSE.txt", "utf8")
            .split("\n")
            .map(line => ` * ${line}\n`)
            .join("")}*/\n\n`
        )
      )
      .pipe(dest(paths.compiled));
  });

  task("compile", () => {
    return src(`./${elementName}.js`)
      .pipe(
        replace(
          /^(import .*?)(['"]\.\.\/(?!\.\.\/).*)\.js(['"];)$/gm,
          "$1$2.umd$3"
        )
      )
      .pipe(
        rename({
          suffix: ".umd"
        })
      )
      .pipe(dest(paths.compiled));
  });

  task("bundle", shell.task("../../node_modules/.bin/rollup -c"));

  task("build", series("clean", ...precompile, "compile:sass", "fallback:css", "minify:css", "merge", parallel("compile", "bundle")));

  task("watch", () => {
    return watch(path.join(paths.source, "*"), series("build")); 
  });

  task("dev", parallel("build", "watch"));

  task("default", series("build"));
};
