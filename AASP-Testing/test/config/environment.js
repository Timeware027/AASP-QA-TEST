import fs from 'fs';
import path from 'path';

function setupEnvironment() {
    const environmentInfo = {
        "Browser": process.env.BROWSER || "Chrome",
        "Browser.Version": "latest",
        "Stand": "Production",
        "Node.Version": process.version,
        "OS": process.platform,
        "OS.Version": process.release.lts || process.version,
        "URL": "https://aaspgerenciador.aasp.org.br"
    };

    const allureResultsDir = 'allure-results';
    
    if (!fs.existsSync(allureResultsDir)) {
        fs.mkdirSync(allureResultsDir, { recursive: true });
    }

    fs.writeFileSync(
        path.join(allureResultsDir, 'environment.properties'),
        Object.entries(environmentInfo)
            .map(([key, value]) => `${key}=${value}`)
            .join('\n')
    );
}

export { setupEnvironment }; 