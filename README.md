# handledown - handlebars + markdown! for static site generation

## Usage

Run `handledown` from the root of your project.

Assumes a `pages` directory full of `.html` and `.md` files. Outputs to an `output` directory matching the structure of `pages`.

If a `templates` directory is present, the files in it will be loaded as [Handlebars partials](handlebarsjs.com#partials), available as the name of the file sans-extension, i.e. `box.html` will be available in templates as `{{> box }}`. In addition, if a partial named `frame.html` is present, it will be used as the outer template for all pages.

Handledown uses [showdown](https://github.com/showdownjs/showdown) for markdown processing. Showdown can be configured using a `handledown.config.json` file in the root of your project.

Sample `handledown.config.json`:

```json
{
  "markdown": {
    "strikethrough": true,
    "tables": true
  }
}
```

Additional showdown configuration options can be found here: https://github.com/showdownjs/showdown#valid-options
