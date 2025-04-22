import firefox from 'selenium-webdriver/firefox.js';
import * as allure from "allure-js-commons";
import fs from 'fs';

import { Builder } from 'selenium-webdriver';
import { login } from './happyPath/login/login.js';
import { createPersonRequired } from './happyPath/person/createPersonRequired.js';
import { createPerson } from './happyPath/person/createPerson.js';
import { createCompanyRequired } from './happyPath/company/createCompanyRequired.js';
import { createCompany } from './happyPath/company/createCompany.js';
import { deleteCompany } from './happyPath/company/deleteCompany.js';
import { deletePerson } from './happyPath/person/deletePerson.js';
import { updatePerson } from './happyPath/person/updatePerson.js';          
import { updateCompany } from './happyPath/company/updateCompany.js';
import { updateCompanyEmail } from './happyPath/company/updateCompanyEmail.js';
import { searchPerson } from './happyPath/person/searchPerson.js';
import { searchCompany } from './happyPath/company/searchCompany.js';
import { failedCreateCompany } from './sadPath/company/failedCreateCompany.js';
import { failedCreatePerson } from './sadPath/person/failedCreatePerson.js';
import { failedUpdatePerson } from './sadPath/person/failedUpdatePerson.js';
import { failedUpdateCompanyCNPJ } from './sadPath/company/failedUpdateCompanyCNPJ.js';
import { failedUpdatePersonRequired } from './sadPath/person/failedUpdatePersonRequired.js';
import { failedUpdateCompanyInvalidChars } from './sadPath/company/failedUpdateCompanyInvalidChars.js';
import { failedDeleteCompanyWithContracts } from './sadPath/company/failedDeleteCompanyWithContracts.js';
import { failedDeletePersonWithRecords } from './sadPath/person/failedDeletePersonWithRecords.js';

describe('Test Suite', function() {
    this.timeout(1200000);

    let driver;
    let loginSuccessful = false;

    before(async function() {
        try {
            let options = new firefox.Options();
            options.addArguments('--start-maximized');
    
            driver = await new Builder()
                .forBrowser('firefox')
                .setFirefoxOptions(options)
                .build();
    
            fs.writeFileSync('allure-results/environment.properties', 
                `URL_BASE=https://aaspgerenciador.aasp.org.br\nBROWSER=Firefox\nENVIRONMENT=Staging\nEXECUTOR=Node.js Executor`);
            
            const executorInfo = {
                "name": "Node.js Executor",
                "type": "nodejs",
                "url": "https://nodejs.org/",
                "buildOrder": 1,
                "buildName": "build #1",
                "buildUrl": "",
                "reportUrl": "",
                "reportName": "Allure Report"
            };
            
            fs.writeFileSync('allure-results/executor.json', JSON.stringify(executorInfo));
        } catch (error) {
            console.error('Erro ao inicializar o driver:', error);
            throw error;
        }
    });

    beforeEach(async function() {
        if (!loginSuccessful) {
            try {
                await login(driver);
                loginSuccessful = true;
            } catch (error) {
                console.error('Login falhou, pulando todos os testes');
                this.skip();
            }
        }
    });

    after(async function() {
        if (driver) {
            await driver.quit();
        }
    });

    it('should login', async function() {
        allure.parentSuite("Chrome");
        allure.subSuite("TestLogin");
        if (!loginSuccessful) {
            throw new Error('Login falhou');
        }
    });

     //COMPANY

     it('should register company(required)', async function() {
        if (!loginSuccessful) return;
        console.log("Create company(required) test");
        allure.parentSuite("Chrome");
        allure.suite("TestCompany");
        allure.subSuite("TestCreateCompanyRequired");
        await createCompanyRequired(driver);
    });

    it('should failed register company(required)', async function() {
        if (!loginSuccessful) return;
        console.log("Create failed company test");
        allure.parentSuite("Chrome");
        allure.suite("TestFailedCompany");
        allure.subSuite("TestFailedCreateCompanyRequired");
        await failedCreateCompany(driver);
    });

    it('should register company', async function() {
        if (!loginSuccessful) return;
        console.log("Create company test");
        allure.parentSuite("Chrome");
        allure.suite("TestCompany");
        allure.subSuite("TestCreateCompany");
        await createCompany(driver);
    });

    it('should update company', async function() {
        if (!loginSuccessful) return;
        console.log("Update company test");
        let search = "46.295.498/0001-68";
        allure.parentSuite("Chrome");
        allure.suite("TestCompany");
        allure.subSuite("TestUpdateCompany");
        await searchCompany(driver, search);
        await updateCompany(driver);
    });

    it('should update company address', async function() {
        if (!loginSuccessful) return;
        console.log("Update company address test");
        let search = "46.295.498/0001-68";
        allure.parentSuite("Chrome");
        allure.suite("TestCompany");
        allure.subSuite("TestUpdateCompanyAddress");
        await searchCompany(driver, search);
        await updateCompanyEmail(driver);
    });
    
    it('should delete company', async function() {
        if (!loginSuccessful) return;
    console.log("Delete company test");
        let search = "Tech Soluções"
        allure.parentSuite("Chrome");
        allure.suite("TestCompany");
        allure.subSuite("TestDeleteCompany");
        await createCompanyRequired(driver);
        await searchCompany(driver, search);
        await deleteCompany(driver);
    });
    
    //PERSON

    it('should register people(required)', async function() {
        if (!loginSuccessful) return;
        allure.parentSuite("Chrome");
        allure.suite("TestPerson");
        allure.subSuite("TestCreatePersonRequired");
        await createPersonRequired(driver);
    });

    it('should failed register person(required)', async function() {
        if (!loginSuccessful) return;
        allure.parentSuite("Chrome");
        allure.suite("TestFailedPerson");
        allure.subSuite("TestFailedCreatePersonRequired");
        await failedCreatePerson(driver);
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

    it('should fail to update person with long name', async function() {
        if (!loginSuccessful) return;
        allure.parentSuite("Chrome");
        allure.suite("TestFailedPerson");
        allure.subSuite("TestFailedUpdatePerson");
        let search = "53279822890"; // CPF da pessoa que será editada
        await searchPerson(driver, search);
        await failedUpdatePerson(driver);
    });

    it('should fail to update company with invalid CNPJ', async function() {
        if (!loginSuccessful) return;
        console.log("Testing invalid CNPJ update");
        allure.parentSuite("Chrome");
        allure.suite("TestFailedCompany");
        allure.subSuite("TestFailedUpdateCompanyCNPJ");
        let search = "46.295.498/0001-68"; // CNPJ da empresa que será editada
        await searchCompany(driver, search);
        await failedUpdateCompanyCNPJ(driver);
    });

    it('should fail to update person without required name', async function() {
        if (!loginSuccessful) return;
        console.log("Testing update without required name");
        allure.parentSuite("Chrome");
        allure.suite("TestFailedPerson");
        allure.subSuite("TestFailedUpdatePersonRequired");
        let search = "53279822890"; // CPF da pessoa que será editada
        await searchPerson(driver, search);
        await failedUpdatePersonRequired(driver);
    });

    it('should fail to update company with invalid characters', async function() {
        if (!loginSuccessful) return;
        console.log("Testing update with invalid characters");
        allure.parentSuite("Chrome");
        allure.suite("TestFailedCompany");
        allure.subSuite("TestFailedUpdateCompanyInvalidChars");
        let search = "46.295.498/0001-68"; // CNPJ da empresa que será editada
        await searchCompany(driver, search);
        await failedUpdateCompanyInvalidChars(driver);
    });

    it('should fail to delete company with active contracts', async function() {
        if (!loginSuccessful) return;
        console.log("Testing delete company with active contracts");
        allure.parentSuite("Chrome");
        allure.suite("TestFailedCompany");
        allure.subSuite("TestFailedDeleteCompanyWithContracts");
        let search = "46.295.498/0001-68"; // CNPJ da empresa com contratos ativos
        await searchCompany(driver, search);
        await failedDeleteCompanyWithContracts(driver);
    });

    it('should fail to delete person with financial records', async function() {
        if (!loginSuccessful) return;
        console.log("Testing delete person with financial records");
        allure.parentSuite("Chrome");
        allure.suite("TestFailedPerson");
        allure.subSuite("TestFailedDeletePersonWithRecords");
        let search = "53279822890"; // CPF da pessoa com registros financeiros
        await searchPerson(driver, search);
        await failedDeletePersonWithRecords(driver);
    });

});
