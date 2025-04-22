import * as allure from "allure-js-commons";
import { setupDriver } from '../config/browser.config.js';
import { login } from '../happyPath/login/login.js';
import { setupEnvironment } from '../config/environment.js';
import { setupExecutor } from '../config/executor.js';
import { createContract } from '../happyPath/contracts/createContract.js';
import { createContractRequired } from '../happyPath/contracts/createContractRequired.js';
import { searchContract } from '../happyPath/contracts/searchContract.js';
import { updateContract } from "../happyPath/contracts/updateContract.js";
import { updateContractObject } from "../happyPath/contracts/updateContractObj.js";
import { deleteContract } from "../happyPath/contracts/deleteContract.js";
import { createAditivo } from "../happyPath/contracts/aditivo/createAditivo.js";
import { updateAditivo } from "../happyPath/contracts/aditivo/updateAditivo.js";
import { updateAditivoObject } from "../happyPath/contracts/aditivo/updateAditivoObj.js";
import { deleteAditivo } from '../happyPath/contracts/aditivo/deleteAditivo.js';
import { readAditivo } from '../happyPath/contracts/aditivo/readAditivo.js';

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
        // Só tenta fazer login se não estiver usando o driver compartilhado
        if (!global.isLoggedIn && !loginSuccessful) {
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
        // Só fecha o driver se não estiver usando o compartilhado
        if (driver && !global.sharedDriver) {
            await driver.quit();
        }
    });

    it('should register contract', async function() {
        console.log("Create contract test");
        allure.parentSuite("Chrome");
        allure.suite("TestContracts");
        allure.subSuite("TestCreateContract");
        await createContract(driver);
    });

    it('should register contract required fields', async function() {
        console.log("Create contract required fields test");
        allure.parentSuite("Chrome");
        allure.suite("TestContracts");
        allure.subSuite("TestCreateContractRequiredFields");
        await createContractRequired(driver);
    });

    it('should search contract', async function() {
        console.log("Search contract test");
        allure.parentSuite("Chrome");
        allure.suite("TestContracts");
        allure.subSuite("TestSearchContract");
        await searchContract(driver);
    });

    it('should update contract', async function() {
        console.log("Update contract test");
        allure.parentSuite("Chrome");
        allure.suite("TestContracts");
        allure.subSuite("TestUpdateContract");
        await updateContract(driver);
    });

    it('should update contract object', async function() {
        console.log("Update contract object test");
        allure.parentSuite("Chrome");
        allure.suite("TestContracts");
        allure.subSuite("TestUpdateContractObject");
        await updateContractObject(driver);
    });

    it('should delete contract', async function() {
        console.log("Delete contract test");
        allure.parentSuite("Chrome");
        allure.suite("TestContracts");
        allure.subSuite("TestDeleteContract");
        await deleteContract(driver);
    });

    it('should create aditivo', async function() {
        console.log("Create aditivo test");
        allure.parentSuite("Chrome");
        allure.suite("TestContracts");
        allure.subSuite("TestCreateAditivo");
        await createAditivo(driver);
    });

    it('should update aditivo', async function() {
        console.log("Update aditivo test");
        allure.parentSuite("Chrome");
        allure.suite("TestContracts");
        allure.subSuite("TestUpdateAditivo");
        await updateAditivo(driver);
    });

    it('should update aditivo object', async function() {
        console.log("Update aditivo object test");
        allure.parentSuite("Chrome");
        allure.suite("TestContracts");
        allure.subSuite("TestUpdateAditivoObject");
        await updateAditivoObject(driver);
    });

    it('should delete aditivo', async function() {
        console.log("Delete aditivo test");
        allure.parentSuite("Chrome");
        allure.suite("TestContracts");
        allure.subSuite("TestDeleteAditivo");
        await createAditivo(driver);
        await deleteAditivo(driver);
    });

    it('should read aditivo', async function() {
        console.log("Read aditivo test");
        allure.parentSuite("Chrome");
        allure.suite("TestContracts");
        allure.subSuite("TestReadAditivo");
        await readAditivo(driver);
    });
}); 