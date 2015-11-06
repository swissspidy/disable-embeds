<?php
/**
 * Plugin Name: Disable Embeds
 * Description: Don't like the enhanced embeds in WordPress 4.4? Easily disable the feature using this plugin.
 * Version:     1.2.0
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

	// Remove the embed query var.
	$wp->public_query_vars = array_diff( $wp->public_query_vars, array(
		'embed',
	) );

	// Remove the REST API endpoint.
	remove_action( 'rest_api_init', 'wp_oembed_register_route' );

	// Turn off oEmbed auto discovery.
	add_filter( 'embed_oembed_discover', '__return_false' );

	// Don't filter oEmbed results.
	remove_filter( 'oembed_dataparse', 'wp_filter_oembed_result', 10 );

	// Remove oEmbed discovery links.
	remove_action( 'wp_head', 'wp_oembed_add_discovery_links' );

	// Remove oEmbed-specific JavaScript from the front-end and back-end.
	remove_action( 'wp_head', 'wp_oembed_add_host_js' );
	add_filter( 'tiny_mce_plugins', 'disable_embeds_tiny_mce_plugin' );

	// Remove all embeds rewrite rules.
	add_filter( 'rewrite_rules_array', 'disable_embeds_rewrites' );
}

add_action( 'init', 'disable_embeds_init', 9999 );

/**
 * Removes the 'wpembed' TinyMCE plugin.
 *
 * @since 1.0.0
 *
 * @param array $plugins List of TinyMCE plugins.
 * @return array The modified list.
 */
function disable_embeds_tiny_mce_plugin( $plugins ) {
	return array_diff( $plugins, array( 'wpembed' ) );
}

/**
 * Remove all rewrite rules related to embeds.
 *
 * @since 1.2.0
 *
 * @param array $rules WordPress rewrite rules.
 * @return array Rewrite rules without embeds rules.
 */
function disable_embeds_rewrites( $rules ) {
	foreach ( $rules as $rule => $rewrite ) {
		if ( false !== strpos( $rewrite, 'embed=true' ) ) {
			unset( $rules[ $rule ] );
		}
	}

	return $rules;
}

// Flush rewrite rules on plugin activation and deactivation.
register_deactivation_hook( __FILE__, 'flush_rewrite_rules' );
register_activation_hook( __FILE__, 'flush_rewrite_rules' );