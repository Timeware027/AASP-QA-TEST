import { By, Key, until } from 'selenium-webdriver';
import * as allure from "allure-js-commons";
import assert from 'assert';

async function deleteAditivo(driver) {

    await allure.step("Clicando no botão de excluir", async (ctx) => {
        try {
            const deleteButton = await driver.wait(
                until.elementLocated(By.css('div[title="Excluir"]')),
                10000
            );
            await driver.wait(until.elementIsVisible(deleteButton), 10000);
            await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", deleteButton);
            await driver.sleep(1000);
            await deleteButton.click();

            await driver.sleep(1000);

            await driver.actions().sendKeys(Key.TAB, Key.TAB, Key.ENTER).perform();

            await ctx.parameter("Status", "200");
            await ctx.parameter("Descrição", "Botão excluir clicado com sucesso");
        } catch (error) {
            await ctx.parameter("Status", "400");
            console.error("Erro ao clicar no botão excluir:", error);
            await takeScreenshot(driver, "Erro ao clicar no botão excluir");
            throw error;
        }
    });

    await allure.step("Verificando mensagem de sucesso", async (ctx) => {
        try {
            await driver.sleep(2000);
            await driver.wait(until.elementLocated(By.css('[role="alertdialog"] span#message-id')));
   
            const mensagem = await driver.findElement(By.css('[role="alertdialog"] span#message-id'));
            const textoMensagem = await mensagem.getText();
   
            if (textoMensagem === 'Aditivo excluído com sucesso') {
                console.log("Contrato excluído com sucesso");
                await ctx.parameter("Status", "200");
                await ctx.parameter("Descrição", "Aditivo excluído com sucesso");
            } else {
                await ctx.parameter("Status", "400");
                await assert.fail('Alerta de sucesso não encontrado');
                throw new Error(`Texto do alerta não encontrado. Esperado: "Excluído com sucesso", mas encontrado: ${textoMensagem}`);
            }
   
        } catch (error) {
            await ctx.parameter("Status", "400");
            await assert.fail('Erro ao verificar mensagem de sucesso');
            console.error("Erro ao verificar mensagem de sucesso:", error.message);
            await takeScreenshot(driver, "Erro ao verificar mensagem de sucesso");
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

export { deleteAditivo }; 