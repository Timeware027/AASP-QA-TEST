// Arquivo para armazenar configurações globais
import fs from 'fs';
import path from 'path';

const CONFIG_FILE = path.join(process.cwd(), 'test', 'config', 'browser-choice.json');

export function setBrowser(browserName) {
    const config = {
        browser: browserName.toLowerCase()
    };
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    console.log(`Navegador configurado para: ${browserName}`);
}

export function getCurrentBrowser() {
    try {
        if (fs.existsSync(CONFIG_FILE)) {
            const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
            return config.browser;
        }
    } catch (error) {
        console.log('Arquivo de configuração não encontrado, usando Firefox como padrão');
    }
    return 'firefox'; // navegador padrão
} 