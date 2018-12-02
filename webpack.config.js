const externals = {};

// Define WordPress dependencies
const wpDependencies = [
	'blocks',
];

/**
 * Given a string, returns a new string with dash separators converted to
 * camel-case equivalent. This is not as aggressive as `_.camelCase` in
 * converting to uppercase, where Lodash will convert letters following
 * numbers.
 *
 * @param {string} string Input dash-delimited string.
 *
 * @return {string} Camel-cased string.
 */
function camelCaseDash( string ) {
	return string.replace(
		/-([a-z])/,
		( match, letter ) => letter.toUpperCase()
	);
}

wpDependencies.forEach( ( name ) => {
	externals[ `@wordpress/${ name }` ] = {
		this: [ 'wp', camelCaseDash( name ) ],
	};
} );

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
	mode: isProduction ? 'production' : 'development',

	devtool: isProduction ? undefined : 'inline-source-map',

	// https://webpack.js.org/configuration/entry-context/
	entry: {
		'editor': './js/src/editor.js',
	},

	// https://webpack.js.org/configuration/output/
	output: {
		path: __dirname + '/js/',
		filename: '[name].js',
		library: 'DisableEmbeds',
		libraryTarget: 'this',
	},

	// https://webpack.js.org/configuration/externals/
	externals,

	// https://github.com/babel/babel-loader#usage
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: 'babel-loader',
			},
		],
	},
};
