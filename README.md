githook-scripts
===============

Use `package.json` scripts for git hooks

Example
-------

```
{
  "name": "your-package",
  "scripts": {
    "test": "mocha",
    "githook:pre-commit": "npm run test"
  },
  "devDependencies": {
    "githook-scripts": "latest"
  }
}
```
