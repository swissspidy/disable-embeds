# Disable Embeds

WordPress plugin that disables the feature to embed WordPress posts from your site and others.

If you don't like the enhanced embeds that were introduced in WordPress 4.4 you can disable the feature using this plugin.

What this plugin does:

* Prevents others from embedding your site.
* Prevents you from embedding other non-whitelisted sites.
* Disables all JavaScript related to the feature.

Just activate the plugin and you’re good to go.

Want embeds back again? Simply deactivate the plugin.

## Development

Requires [Node.js](https://nodejs.org/) (see [`.nvmrc`](.nvmrc) for the expected version).

```bash
npm install
npm run build
```

### Tests

End-to-end tests are written with [Playwright](https://playwright.dev/) and run against a
WordPress instance provided by [`@wordpress/env`](https://www.npmjs.com/package/@wordpress/env).
They use the experimental [WordPress Playground](https://wordpress.github.io/wordpress-playground/)
runtime, which runs WordPress in WebAssembly and therefore does not require Docker.

```bash
npm run build
npm run test:e2e
```

The environment is started automatically, but it can also be controlled manually:

```bash
npm run wp-env -- start --runtime=playground
npm run wp-env -- stop
```

To collect JavaScript code coverage while running the tests, build with source maps and set
`COLLECT_COVERAGE`. The report is written to `artifacts/e2e-coverage`.

```bash
WP_DEVTOOL=source-map npm run build
COLLECT_COVERAGE=true npm run test:e2e
```
