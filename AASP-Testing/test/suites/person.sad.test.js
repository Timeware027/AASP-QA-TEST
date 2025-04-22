import * as allure from "allure-js-commons";
import { setupDriver } from '../config/browser.config.js';
import { login } from '../happyPath/login/login.js';
import { searchPerson } from '../happyPath/person/searchPerson.js';
import { failedCreatePerson } from '../sadPath/person/failedCreatePerson.js';
import { failedUpdatePerson } from '../sadPath/person/failedUpdatePerson.js';
import { failedUpdatePersonRequired } from '../sadPath/person/failedUpdatePersonRequired.js';
import { failedDeletePersonWithRecords } from '../sadPath/person/failedDeletePersonWithRecords.js';
import { setupEnvironment } from '../config/environment.js';
import { setupExecutor } from '../config/executor.js';

describe('Person Sad Path Tests', function() {
    this.timeout(1200000);
    let driver;
    let loginSuccessful = false;

    before(async function() {
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
        // Se estiver rodando como parte do test:all, não precisa fazer login novamente
        if (global.isLoggedIn) {
            return;
        }
        
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
        // Só fecha o driver se não estiver usando o compartilhado
        if (driver && !global.sharedDriver) {
            await driver.quit();
        }
    });

    it('should failed register person(required)', async function() {
        allure.parentSuite("Chrome");
        allure.suite("TestFailedPerson");
        allure.subSuite("TestFailedCreatePersonRequired");
        await failedCreatePerson(driver);
    });

    it('should fail to update person with long name', async function() {
        allure.parentSuite("Chrome");
        allure.suite("TestFailedPerson");
        allure.subSuite("TestFailedUpdatePerson");
        let search = "53279822890";
        await searchPerson(driver, search);
        await failedUpdatePerson(driver);
    });

    it('should fail to update person without required name', async function() {
        console.log("Testing update without required name");
        allure.parentSuite("Chrome");
        allure.suite("TestFailedPerson");
        allure.subSuite("TestFailedUpdatePersonRequired");
        let search = "53279822890";
        await searchPerson(driver, search);
        await failedUpdatePersonRequired(driver);
    });

    it('should fail to delete person with financial records', async function() {
        console.log("Testing delete person with financial records");
        allure.parentSuite("Chrome");
        allure.suite("TestFailedPerson");
        allure.subSuite("TestFailedDeletePersonWithRecords");
        let search = "53279822890";
        await searchPerson(driver, search);
        await failedDeletePersonWithRecords(driver);
    });
}); 