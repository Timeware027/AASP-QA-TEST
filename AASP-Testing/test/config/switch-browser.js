import { setBrowser } from './global.config.js';

const browser = process.argv[2]?.toLowerCase();

if (!browser || (browser !== 'firefox' && browser !== 'chrome')) {
    console.log('Por favor, especifique o navegador: firefox ou chrome');
    process.exit(1);
}

setBrowser(browser); 