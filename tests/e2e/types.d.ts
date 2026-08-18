declare module '@wordpress/scripts/config/playwright.config' {
	import type { PlaywrightTestConfig } from '@playwright/test';

	const config: PlaywrightTestConfig;

	export default config;
}
