/**
 * External dependencies
 */
import type {
	CoverageReportOptions,
	V8CoverageEntry,
} from 'monocart-coverage-reports';
import { defineConfig, devices } from '@playwright/test';
import type { ReporterDescription } from '@playwright/test';

/**
 * WordPress dependencies
 */
import baseConfig from '@wordpress/scripts/config/playwright.config';

/**
 * The Playground runtime only ever spins up a single environment, which is
 * served on the `port` configured in `.wp-env.json`, whereas `wp-scripts
 * test-playwright` defaults to the Docker-only tests environment on port 8889.
 *
 * `@wordpress/e2e-test-utils-playwright` reads the site URL from `WP_BASE_URL`
 * rather than from Playwright's `baseURL`, so it needs to be set here as well.
 */
process.env.WP_BASE_URL ||= 'http://localhost:8888';

const baseURL = process.env.WP_BASE_URL;
const { port } = new URL( baseURL );

const collectCoverage = process.env.COLLECT_COVERAGE === 'true';

const reporter: ReporterDescription[] = [
	process.env.CI ? [ 'github' ] : [ 'list' ],
];

if ( collectCoverage ) {
	reporter.push( [
		'monocart-reporter',
		{
			name: 'Disable Embeds E2E coverage',
			outputFile: './artifacts/e2e-coverage/report.html',
			coverage: {
				reports: [ [ 'codecov' ], [ 'v8' ], [ 'console-summary' ] ],
				entryFilter: ( entry: V8CoverageEntry ) =>
					entry.url.includes( 'plugins/disable-embeds/build/' ),
				sourceFilter: ( sourcePath: string ) =>
					sourcePath.startsWith( 'src/' ) &&
					! sourcePath.includes( 'node_modules/' ) &&
					! sourcePath.includes( 'webpack/' ),
				sourcePath: ( filePath: string ) =>
					filePath.replace( 'disable-embeds/', '' ),
			},
		} as CoverageReportOptions,
	] );
}

export default defineConfig( {
	...baseConfig,
	reporter,
	testDir: './specs',
	use: {
		...baseConfig.use,
		baseURL,
	},
	webServer: {
		...baseConfig.webServer,
		command: 'npm run wp-env -- start --runtime=playground',
		port: Number( port ),
		// Booting Playground downloads the WordPress and PHP WebAssembly
		// bundles on first run, which can take a while on cold CI caches.
		timeout: 300_000,
		reuseExistingServer: true,
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices[ 'Desktop Chrome' ] },
		},
	],
} );
