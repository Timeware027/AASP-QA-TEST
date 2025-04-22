import * as allure from "allure-js-commons";
import { setupDriver } from './config/browser.config.js';
import { login } from './happyPath/login/login.js';
import { setupEnvironment } from './config/environment.js';
import { setupExecutor } from './config/executor.js';

// Importar todos os testes diretamente
import './suites/contracts.happy.test.js';
import './suites/contracts.sad.test.js';
import './suites/person.happy.test.js';
import './suites/person.sad.test.js';
import './suites/company.happy.test.js';
import './suites/company.sad.test.js';

describe('Test Suite Principal', function() {
    let driver;

    // Executar uma vez antes de todos os testes
    before(async function() {
        console.log("Iniciando suite de testes completa...");
        setupEnvironment();
        setupExecutor();
        
        driver = await setupDriver();
        
        try {
            console.log("Realizando login único para todos os testes...");
            await login(driver);
            // Compartilhar o driver e status de login globalmente
            global.sharedDriver = driver;
            global.isLoggedIn = true;
        } catch (error) {
            console.error('Login inicial falhou:', error);
            throw error;
        }
    });

    after(async function() {
        if (driver) {
            console.log("Finalizando todos os testes...");
            await driver.quit();
            global.sharedDriver = null;
            global.isLoggedIn = false;
        }
    });
}); 