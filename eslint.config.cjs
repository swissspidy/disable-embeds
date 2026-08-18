/**
 * WordPress dependencies
 */
const defaultConfig = require( '@wordpress/scripts/config/eslint.config.cjs' );

module.exports = [
	...defaultConfig,
	{
		ignores: [ '**/artifacts/**' ],
	},
	{
		files: [ 'tests/e2e/**/*.ts' ],
		rules: {
			// Playwright fixtures receive a `use()` callback, which the React
			// Hooks rule mistakes for a hook call.
			'react-hooks/rules-of-hooks': 'off',
		},
	},
];
