import * as allure from "allure-js-commons";
import { setupDriver } from '../config/browser.config.js';
import { login } from '../happyPath/login/login.js';
import { setupEnvironment } from '../config/environment.js';
import { setupExecutor } from '../config/executor.js';
import { createCompanyRequired } from '../happyPath/company/createCompanyRequired.js';
import { createCompany } from '../happyPath/company/createCompany.js';
import { updateCompany } from '../happyPath/company/updateCompany.js';
import { updateCompanyEmail } from '../happyPath/company/updateCompanyEmail.js';
import { deleteCompany } from '../happyPath/company/deleteCompany.js';
import { searchCompany } from '../happyPath/company/searchCompany.js';

describe('Company Happy Path Tests', function() {
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

    it('should register company(required)', async function() {
        console.log("Create company(required) test");
        allure.parentSuite("Chrome");
        allure.suite("TestCompany");
        allure.subSuite("TestCreateCompanyRequired");
        await createCompanyRequired(driver);
    });

    it('should register company', async function() {
        console.log("Create company test");
        allure.parentSuite("Chrome");
        allure.suite("TestCompany");
        allure.subSuite("TestCreateCompany");
        await createCompany(driver);
    });

    it('should update company', async function() {
        console.log("Update company test");
        let search = "46.295.498/0001-68";
        allure.parentSuite("Chrome");
        allure.suite("TestCompany");
        allure.subSuite("TestUpdateCompany");
        await searchCompany(driver, search);
        await updateCompany(driver);
    });

    it('should update company address', async function() {
        console.log("Update company address test");
        let search = "46.295.498/0001-68";
        allure.parentSuite("Chrome");
        allure.suite("TestCompany");
        allure.subSuite("TestUpdateCompanyAddress");
        await searchCompany(driver, search);
        await updateCompanyEmail(driver);
    });
    
    it('should delete company', async function() {
        console.log("Delete company test");
        let search = "Tech Soluções"
        allure.parentSuite("Chrome");
        allure.suite("TestCompany");
        allure.subSuite("TestDeleteCompany");
        await createCompanyRequired(driver);
        await searchCompany(driver, search);
        await deleteCompany(driver);
    });
}); 