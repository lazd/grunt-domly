# Usage Examples

Compile all the templates in `source/templates/` to `App.templates` using the filename (minus the extension as the template name), storing the output in `dist/templates.js`.

```js
domly: {
  compile: {
    options: {
      namespace: 'App.templates'
    },
    files: {
      'dist/templates.js': 'source/templates/*.html'
    }
  }
}
```