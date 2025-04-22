import { By, Key, until } from 'selenium-webdriver';
import * as allure from "allure-js-commons";
import assert from 'assert';

async function failedUpdatePerson(driver) {
    await allure.step("Clicando na última pessoa", async (ctx) => {
        try {
            const rows = await driver.findElements(By.css("tr.jss587.jss589"));
    
            if (rows.length === 0) {
                throw new Error("Nenhum resultado encontrado.");
            }
    
            let lastRowIndex = rows.length - 1;
            console.log(`Quantidade de resultados: ${rows.length}`);
            console.log(`Clicando na última pessoa: ${lastRowIndex}`);
    
            await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", rows[lastRowIndex]);
    
            await driver.wait(until.elementIsVisible(rows[lastRowIndex]));
            await driver.wait(until.elementIsEnabled(rows[lastRowIndex]));
    
            await driver.executeScript("arguments[0].click();", rows[lastRowIndex]);
    
            await ctx.parameter("Status", "200");
        } catch (error) {
            await ctx.parameter("Status", "400");
            console.error("Erro ao clicar no último resultado:", error);
            await assert.fail('Erro ao clicar no último resultado:');
            throw error;
        }
    });


    await allure.step("Tentando atualizar com nome muito longo", async (ctx) => {
        try {
            // Nome com mais de 80 caracteres
            const nomeGrande = "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua";
            
            // Navegando até o campo de nome
            await driver.sleep(500);
            await driver.actions().sendKeys(Key.TAB).sendKeys(Key.TAB).sendKeys(Key.TAB).sendKeys(Key.TAB).sendKeys(Key.TAB)
                .sendKeys(Key.TAB).sendKeys(Key.TAB).sendKeys(Key.TAB).sendKeys(Key.ENTER).perform();
            
            // Limpando o campo e inserindo o nome grande
            await driver.actions().keyDown(Key.CONTROL).sendKeys('a').keyUp(Key.CONTROL).sendKeys(Key.BACK_SPACE).perform();
            await driver.actions().sendKeys(nomeGrande).perform();
            
            // Clicando no botão de atualizar
            const botaoAtualizar = await driver.findElement(By.xpath("//button[contains(., 'Atualizar')]"));
            await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", botaoAtualizar);
            await botaoAtualizar.click();

            // Verificando a mensagem de erro
            await driver.wait(until.elementLocated(By.css('[role="alertdialog"] span#message-id')));
            const mensagem = await driver.findElement(By.css('[role="alertdialog"] span#message-id'));
            const textoMensagem = await mensagem.getText();

            if (textoMensagem === 'Erro: O nome não pode exceder 80 caracteres') {
                console.log("Teste de validação de nome longo passou com sucesso");
                await ctx.parameter("Status", "200");
            } else {
                throw new Error(`Mensagem de erro incorreta. Esperado: "Erro: O nome não pode exceder 80 caracteres", mas encontrado: ${textoMensagem}`);
            }
        } catch (error) {
            await ctx.parameter("Status", "400");
            await takeScreenshot(driver, "Erro ao tentar atualizar com nome longo");
            await assert.fail(`Erro ao tentar atualizar com nome longo: ${error.message}`);
            throw error;
        }
    });
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

export { failedUpdatePerson }; 