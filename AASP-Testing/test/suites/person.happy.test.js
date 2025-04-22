import * as allure from "allure-js-commons";
import { setupDriver } from '../config/browser.config.js';
import { login } from '../happyPath/login/login.js';
import { createPersonRequired } from '../happyPath/person/createPersonRequired.js';
import { createPerson } from '../happyPath/person/createPerson.js';
import { updatePerson } from '../happyPath/person/updatePerson.js';
import { deletePerson } from '../happyPath/person/deletePerson.js';
import { searchPerson } from '../happyPath/person/searchPerson.js';
import { setupEnvironment } from '../config/environment.js';
import { setupExecutor } from '../config/executor.js';

describe('Person Happy Path Tests', function() {
    this.timeout(1200000);
    let driver;
    let loginSuccessful = false;

    before(async function() {
        if (global.sharedDriver && global.isLoggedIn) {
            driver = global.sharedDriver;
            loginSuccessful = true;
        } else {
            setupEnvironment();
            setupExecutor();
            driver = await setupDriver();
        }
    });

    beforeEach(async function() {
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
        if (driver && !global.sharedDriver) {
            await driver.quit();
        }
    });

    // Seus testes de pessoa (happy path)
    it('should register people(required)', async function() {
        if (!loginSuccessful) return;
        allure.parentSuite("Chrome");
        allure.suite("TestPerson");
        allure.subSuite("TestCreatePersonRequired");
        await createPersonRequired(driver);
    });

    it('should register people', async function() {
        if (!loginSuccessful) return;
        allure.parentSuite("Chrome");
        allure.suite("TestPerson");
        allure.subSuite("TestCreatePerson");
        await createPerson(driver);
    });
        
    it('should update person', async function() {
        if (!loginSuccessful) return;
        let search = "53279822890"
        allure.parentSuite("Chrome");
        allure.suite("TestPerson");
        allure.subSuite("TestUpdatePerson");
        await searchPerson(driver, search);
        await updatePerson(driver);
    });

    it('should delete person', async function() {
        if (!loginSuccessful) return;
        allure.parentSuite("Chrome");
        allure.suite("TestPerson");
        allure.subSuite("TestDeletePerson");
        await createPersonRequired(driver);
        await deletePerson(driver);
    });

    it('should search person', async function () {
        if(!loginSuccessful) return;
        let search = "Vinícius";
        allure.parentSuite("Chrome");
        allure.suite("TestPerson");
        allure.subSuite("TestSearchPerson");
        await searchPerson(driver, search);  
    });

    // ... outros testes de pessoa ...
}); 