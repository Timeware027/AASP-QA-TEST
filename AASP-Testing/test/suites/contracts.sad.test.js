import * as allure from "allure-js-commons";
import { setupDriver } from '../config/browser.config.js';
import { login } from '../happyPath/login/login.js';
import { setupEnvironment } from '../config/environment.js';
import { setupExecutor } from '../config/executor.js';
import { failedCreateContractWithFieldsEmpty } from '../sadPath/contracts/failedCreateContractWithFieldsEmpty.js';
import { failedCreateContractWithFieldNumber } from '../sadPath/contracts/failedCreateContractWithFieldNumber.js';
import { failedCreateContractWithInvalidDate } from '../sadPath/contracts/failedCreateContractWithInvalidDate.js'; 
import { failedUpdateContractWithoutRequired } from '../sadPath/contracts/failedUpdateContractWithoutRequired.js';
import { failedUpdateContractWithNumber } from '../sadPath/contracts/failedUpdateContractWithNumber.js';
import { failedUpdateContractInvalidDate } from '../sadPath/contracts/failedUpdateContractInvalidDate.js';
import fs from 'fs';
import path from 'path';

describe('Chrome', function() {
    this.timeout(1200000);
    let driver;
    let loginSuccessful = false;

    before(async function() {
        // Limpa apenas os resultados dos testes de contrato
        const resultsDir = 'allure-results';
        if (fs.existsSync(resultsDir)) {
            const files = fs.readdirSync(resultsDir);
            for (const file of files) {
                try {
                    const filePath = path.join(resultsDir, file);
                    const fileContent = fs.readFileSync(filePath, 'utf8');
                    // Verifica se o arquivo contém resultados de testes de contrato
                    if (fileContent.includes('TestContracts') && 
                        !file.startsWith('history') && 
                        !file.includes('categories.json')) {
                        fs.unlinkSync(filePath);
                    }
                } catch (error) {
                    console.warn(`Não foi possível processar ${file}: ${error.message}`);
                }
            }
        }

        // Se estiver rodando como parte do test:all, use o driver compartilhado
        if (global.sharedDriver && global.isLoggedIn) {
            driver = global.sharedDriver;
            loginSuccessful = true;
        } else {
            // Configuração normal para execução individual
            setupEnvironment();
            setupExecutor();
            driver = await setupDriver();
        }
    });

    beforeEach(async function() {
        if (!loginSuccessful) {
            try {
                await login(driver);
                loginSuccessful = true;
            } catch (error) {
                console.error('Login falhou');
                this.skip();
            }
        }
    });

    after(async function() {
        if (driver) {
            await driver.quit();
        }
    });

    it('Teste de erro ao criar contrato com campos vazios', async function() {
        console.log("Teste de erro ao criar contrato com campos vazios");
        allure.parentSuite("Chrome");
        allure.suite("TestFailedContract");
        allure.subSuite("TestFailedCreateContractWithFieldsEmpty");
        await failedCreateContractWithFieldsEmpty(driver);
    });

    it('Teste de erro ao criar contrato com número inválido', async function() {
        console.log("Teste de erro ao criar contrato com número inválido");
        allure.parentSuite("Chrome");
        allure.suite("TestFailedContract");
        allure.subSuite("TestFailedCreateContractWithFieldNumber");
        await failedCreateContractWithFieldNumber(driver);
    });

    it('Teste de erro ao criar contrato com data inválida', async function() {
        console.log("Teste de erro ao criar contrato com data inválida");
        allure.parentSuite("Chrome");
        allure.suite("TestFailedContract");
        allure.subSuite("TestFailedCreateContractWithInvalidDate");
        await failedCreateContractWithInvalidDate(driver);
    });
    
    it('Teste de erro ao atualizar contrato sem campos obrigatórios', async function() {
        console.log("Teste de erro ao atualizar contrato sem campos obrigatórios");
        allure.parentSuite("Chrome");
        allure.suite("TestFailedContract");
        allure.subSuite("TestFailedUpdateContractWithoutRequired");
        await failedUpdateContractWithoutRequired(driver);
    });

    it('Teste de erro ao atualizar contrato com número inválido', async function() {
        console.log("Teste de erro ao atualizar contrato com número inválido");
        allure.parentSuite("Chrome");
        allure.suite("TestFailedContract");
        allure.subSuite("TestFailedUpdateContractWithNumber");
        await failedUpdateContractWithNumber(driver);
    });

    it('Teste de erro ao atualizar contrato com data inválida', async function() {
        console.log("Teste de erro ao atualizar contrato com data inválida");
        allure.parentSuite("Chrome");
        allure.suite("TestFailedContract");
        allure.subSuite("TestFailedUpdateContractInvalidDate");
        await failedUpdateContractInvalidDate(driver);
    });

}); 