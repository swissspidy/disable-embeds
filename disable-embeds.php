<?php
/**
 * Plugin Name: Disable Embeds
 * Description: Don't like the enhanced embeds in WordPress 4.4? Easily disable the feature using this plugin.
 * Version:     1.0.0
 * Author:      Pascal Birchler
 * Author URI:  https://pascalbirchler.com
 * License:     GPLv2+
 *
 * @package disable-embeds
 */

/**
 * Disable embeds on init.
 *
 * - Removes the needed query vars.
 * - Disables oEmbed discovery.
 * - Completely removes the related JavaScript.
 *
 * @since 1.0.0
 */
function disable_embeds_init() {
	/* @var WP $wp */
	global $wp;

	$wp->public_query_vars = array_diff( $wp->public_query_vars, array(
		'embed',
		'oembed',
		'format',
		'url',
		'_jsonp',
		'maxwidth',
	) );

	add_filter( 'embed_oembed_discover', '__return_false' );

	remove_action( 'wp_head', 'wp_oembed_add_discovery_links' );

	remove_action( 'wp_head', 'wp_oembed_add_host_js' );
	add_action( 'tiny_mce_plugins', 'disable_embeds_tiny_mce_plugin' );
}

add_action( 'init', 'disable_embeds_init', 9999 );

/**
 * Removes the 'wpoembed' TinyMCE plugin.
 *
 * @since 1.0.0
 *
 * @param array $plugins List of TinyMCE plugins.
 * @return array The modified list.
 */
function disable_embeds_tiny_mce_plugin( $plugins ) {
	return array_diff( $plugins, array( 'wpoembed' ) );
}
