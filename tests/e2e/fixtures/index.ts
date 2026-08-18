/**
 * External dependencies
 */
import { readFileSync, existsSync } from 'node:fs';

import { addCoverageReport } from 'monocart-reporter';
import type { V8CoverageEntry } from 'monocart-coverage-reports';

/**
 * WordPress dependencies
 */
import { test as base } from '@wordpress/e2e-test-utils-playwright';

const collectCoverage = process.env.COLLECT_COVERAGE === 'true';

/**
 * Attaches the source map of the plugin's build output to a coverage entry.
 *
 * `wp-scripts build` only emits source maps when `WP_DEVTOOL` is set, and even
 * then the map is not inlined, so it has to be resolved by hand.
 *
 * See https://github.com/cenfun/monocart-coverage-reports#manually-resolve-the-sourcemap.
 *
 * @param entry V8 coverage entry.
 * @return The coverage entry, with a source map attached where one was found.
 */
function withSourceMap( entry: V8CoverageEntry ): V8CoverageEntry {
	if ( entry.sourceMap ) {
		return entry;
	}

	// Turn http://localhost:8888/wp-content/plugins/disable-embeds/build/index.js?ver=1234
	// into build/index.js.
	const start = entry.url.indexOf( 'build/' );

	if ( start < 0 ) {
		return entry;
	}

	const filePath = entry.url.slice( start ).split( '?' )[ 0 ];

	if ( ! existsSync( `${ filePath }.map` ) ) {
		return entry;
	}

	entry.sourceMap = JSON.parse(
		readFileSync( `${ filePath }.map` ).toString( 'utf-8' )
	);

	return entry;
}

export const test = base.extend( {
	page: async ( { page, browserName }, use ) => {
		if ( ! collectCoverage || browserName !== 'chromium' ) {
			await use( page );
			return;
		}

		await page.coverage.startJSCoverage( { resetOnNavigation: false } );

		await use( page );

		const jsCoverage: V8CoverageEntry[] =
			await page.coverage.stopJSCoverage();

		await addCoverageReport( jsCoverage.map( withSourceMap ), test.info() );
	},
} );

export { expect } from '@wordpress/e2e-test-utils-playwright';
