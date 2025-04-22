import * as allure from "allure-js-commons";
import { setupDriver } from '../config/browser.config.js';
import { login } from '../happyPath/login/login.js';
import { searchCompany } from '../happyPath/company/searchCompany.js';
import { failedCreateCompany } from '../sadPath/company/failedCreateCompany.js';
import { failedUpdateCompanyCNPJ } from '../sadPath/company/failedUpdateCompanyCNPJ.js';
import { failedUpdateCompanyInvalidChars } from '../sadPath/company/failedUpdateCompanyInvalidChars.js';
import { failedDeleteCompanyWithContracts } from '../sadPath/company/failedDeleteCompanyWithContracts.js';
import { setupEnvironment } from '../config/environment.js';
import { setupExecutor } from '../config/executor.js';

describe('Company Sad Path Tests', function() {
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

    it('should failed register company(required)', async function() {
        console.log("Create failed company test");
        allure.parentSuite("Chrome");
        allure.suite("TestFailedCompany");
        allure.subSuite("TestFailedCreateCompanyRequired");
        await failedCreateCompany(driver);
    });

    it('should fail to update company with invalid CNPJ', async function() {
        console.log("Testing invalid CNPJ update");
        allure.parentSuite("Chrome");
        allure.suite("TestFailedCompany");
        allure.subSuite("TestFailedUpdateCompanyCNPJ");
        let search = "46.295.498/0001-68";
        await searchCompany(driver, search);
        await failedUpdateCompanyCNPJ(driver);
    });

    it('should fail to update company with invalid characters', async function() {
        console.log("Testing update with invalid characters");
        allure.parentSuite("Chrome");
        allure.suite("TestFailedCompany");
        allure.subSuite("TestFailedUpdateCompanyInvalidChars");
        let search = "46.295.498/0001-68";
        await searchCompany(driver, search);
        await failedUpdateCompanyInvalidChars(driver);
    });

    it('should fail to delete company with active contracts', async function() {
        console.log("Testing delete company with active contracts");
        allure.parentSuite("Chrome");
        allure.suite("TestFailedCompany");
        allure.subSuite("TestFailedDeleteCompanyWithContracts");
        let search = "46.295.498/0001-68";
        await searchCompany(driver, search);
        await failedDeleteCompanyWithContracts(driver);
    });
}); 