import firefox from 'selenium-webdriver/firefox.js';
import chrome from 'selenium-webdriver/chrome.js';
import { Builder } from 'selenium-webdriver';
import { getCurrentBrowser } from './global.config.js';
import 'chromedriver';

export async function setupDriver() {
    const browserType = getCurrentBrowser();
    let driver;
    
    switch(browserType) {
        case 'chrome':
            const chromeOptions = new chrome.Options();
            chromeOptions.addArguments('--start-maximized');
            chromeOptions.addArguments('--disable-gpu');
            chromeOptions.addArguments('--no-sandbox');
            chromeOptions.addArguments('--disable-dev-shm-usage');
            
            driver = await new Builder()
                .forBrowser('chrome')
                .setChromeOptions(chromeOptions)
                .build();
            break;
            
        case 'firefox':
        default:
            const firefoxOptions = new firefox.Options();
            firefoxOptions.addArguments('--start-maximized');
            
            driver = await new Builder()
                .forBrowser('firefox')
                .setFirefoxOptions(firefoxOptions)
                .build();
            break;
    }
    
    return driver;
} 