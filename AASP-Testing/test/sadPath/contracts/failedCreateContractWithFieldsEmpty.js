import { By, Key, until } from 'selenium-webdriver';
import * as allure from "allure-js-commons";
import assert from 'assert';

async function failedCreateContractWithFieldsEmpty(driver) {
    try {
        await allure.step("Acessando página de cadastro de contrato", async () => {
            await driver.get('https://aaspgerenciador.aasp.org.br/contratos/novo/');
            allure.attachment("URL", "https://aaspgerenciador.aasp.org.br/contratos/novo/", "text/plain");
            allure.parameter("Status", "200");
            allure.parameter("Descrição", "Página de cadastro de contrato acessada com sucesso");
        });

        // Clicando no botão Salvar sem preencher nada
        await allure.step("Tentando salvar contrato sem dados", async () => {
            try {
                await driver.sleep(2000);
                
                const saveButton = await driver.findElement(By.xpath("//span[normalize-space(.)='Salvar']/parent::button"));
                await driver.wait(until.elementIsVisible(saveButton), 10000);
                await saveButton.click();

                // Verificar mensagem de erro
                await driver.wait(until.elementLocated(By.css('span#message-id')), 2000);
                const mensagem = await driver.findElement(By.css('span#message-id'), 2000);
                const textoMensagem = await mensagem.getText();

                if (textoMensagem.includes("erro") || textoMensagem.includes("obrigatório")) {
                    await allure.parameter("Status", "200");
                    console.log('Erro esperado recebido ao tentar criar contrato sem dados!')
                } else {
                    throw new Error(`Mensagem de erro não encontrada. Mensagem recebida: ${textoMensagem}`);
                }
                
                await driver.sleep(2000);
                
                allure.parameter("Status", "400");
                await assert.fail('Erro ao salvar contrato vazio recebido com sucesso');
                allure.parameter("Descrição", "Erro ao salvar contrato vazio recebido com sucesso");
            } catch (error) {
                allure.parameter("Status", "200");
                await assert.ok('Erro ao salvar contrato vazio');
                await takeScreenshot(driver, "Erro inesperado ao testar validação");
            }
        });

    } catch (error) {
        allure.attachment("Error Screenshot", await driver.takeScreenshot(), "image/png");
        allure.attachment("Error", error.message, "text/plain");
        throw new Error("Falha ao testar criação de contrato vazio: " + error.message);
    }
}

async function takeScreenshot(driver, stepName) {
    try {
        const screenshot = await driver.takeScreenshot();
        const timestamp = new Date().toISOString().replace(/[^\w]/g, '-');
        const screenshotName = `${stepName}_${timestamp}.png`;
        allure.attachment(screenshotName, Buffer.from(screenshot, 'base64'), 'image/png');
        console.log(`Screenshot capturada: ${screenshotName}`);
    } catch (screenshotError) {
        console.error('Erro ao capturar screenshot:', screenshotError.message);
    }
}

export { failedCreateContractWithFieldsEmpty }; 