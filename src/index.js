const fs = require('fs');
const path = require('path');
const log = require('./log');
const Renderer = require('./renderer');

function loadPartials(baseDir) {
  let partials = [];
  let templatesPath = path.join(baseDir, 'templates');
  if (fs.existsSync(templatesPath) && fs.lstatSync(templatesPath).isDirectory()) {
    let templates = fs.readdirSync(templatesPath);
    templates.forEach(t => {
      partials.push({
        name: path.parse(t).name,
        markup: fs.readFileSync(path.join(templatesPath, t)).toString('utf8')
      });
    });
    log.success(`loaded ${templates.length} partials`);
  } else {
    log.warn('no templates directory found');
  }
  return partials;
}

function loadPages(searchPath) {
  let pageList = [];

  function walk(currentPath) {
    let files = fs.readdirSync(currentPath);
    files.forEach(function(file) {
      let filePath = path.join(currentPath, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        walk(filePath);
      } else {
        pageList.push(filePath);
      }
    });
  }

  walk(searchPath);

  return pageList;
}

function build(baseDir) {
  let configPath = path.join(baseDir, 'handledown.config.json');
  let outputPath = path.join(baseDir, 'output');
  let pagesPath = path.join(baseDir, 'pages');
  let config = {};

  if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath).toString('utf8'));
  }

  let renderer = new Renderer({
    inputDir: pagesPath,
    outputDir: outputPath,
    markdownOptions: config.markdown
  });

  loadPartials(baseDir).forEach(p => {
    renderer.addPartial(p.name, p.markup)
  });

  if (!fs.existsSync(pagesPath)) {
    log.error('pages path not found');
    process.exit(1);
  }

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
  }
  if (fs.lstatSync(outputPath).isDirectory()) {
    let pages = loadPages(pagesPath);
    pages.forEach(page => renderer.render(page));
    return pages.length;
  } else {
    log.error('output path not a directory!');
    process.exit(1);
  }
}

module.exports = build;
