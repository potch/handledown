const fs = require('fs');
const path = require('path');
const showdown = require('showdown');
const handlebars = require('handlebars');

class Renderer {
  constructor(options = {}) {
    this.inputDir = options.inputDir;
    this.outputDir = options.outputDir;
    this.partials = {};
    this.markdown = new showdown.Converter(options.markdownOptions);
    this.markdown.setFlavor('github');
    this.handlebars = handlebars.create();
  }

  wrap (s) {
    return this.handlebars.compile(
      this.partials.frame, { noEscape: true }
    )({ content: s });
  }

  addPartial (name, markup) {
    this.partials[name] = markup;
    this.handlebars.registerPartial(name, markup);
  }

  render (pagePath) {
    let outputParts = path.parse(pagePath);
    outputParts.base = outputParts.name + '.html';
    let outputPath = path.join(
      this.outputDir,
      path.relative(this.inputDir, path.format(outputParts))
    );
    let template = this.handlebars.compile(fs.readFileSync(pagePath).toString('utf8'));
    if (!fs.existsSync(path.dirname(outputPath))) {
      fs.mkdirSync(path.dirname(outputPath));
    }
    let rendered = template();
    fs.writeFileSync(outputPath, this.wrap(this.markdown.makeHtml(
      template(),
      { santize: false }
    )));
  }
}

module.exports = Renderer;
