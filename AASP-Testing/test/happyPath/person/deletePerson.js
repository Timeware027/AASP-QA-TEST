import { By, Key, until } from 'selenium-webdriver';
import * as allure from "allure-js-commons";
import assert from 'assert';

async function deletePerson(driver) {

    await allure.step("Clicando no botão de delete", async (ctx) => {
        try {
            await driver.wait(until.elementLocated(By.css('div[title="Excluir"]')), 10000);
            await driver.findElement(By.css('div[title="Excluir"]')).click();

            await driver.sleep(1000);

            await driver.actions().sendKeys(Key.TAB).sendKeys(Key.TAB).sendKeys(Key.TAB).sendKeys(Key.ENTER).perform();
            await driver.sleep(2000);
            await ctx.parameter("Status", "200");

            await allure.step("Buscando botão de registro", async (ctx) => {
                try {
                    const mensagem = await driver.findElement(By.css('[role="alertdialog"] span#message-id'));
                    const textoMensagem = await mensagem.getText();

                    if (textoMensagem === 'Pessoa excluída com sucesso!') {
                        await ctx.parameter("Status", "200");
                    } else {
                        throw new Error(`Texto do alerta não encontrado. Esperado: "Empresa excluída com sucesso!", mas encontrado: ${textoMensagem}`);
                    }
                } catch (error) {
                    await ctx.parameter("Status", "400");
                    await assert.fail('Alerta de sucesso não econtrado');
                    throw error;
                }

            });
        } catch (error) {
            await ctx.parameter("Status", "400");
            console.error("Erro ao clicar em delete", error.message);
            await assert.fail('Erro ao clicar no delete');
            await takeScreenshot(driver, "Erro ao acessar a página de cadastro de empresa");
            throw error;
        }
    });

    async function takeScreenshot(driver, stepName) {
        try {
            const screenshot = await driver.takeScreenshot();

            const timestamp = new Date().toISOString().replace(/[^\w]/g, '-');
            const screenshotName = `${stepName}_${timestamp}.png`;

            allure.attachment(screenshotName, Buffer.from(screenshot, 'base64'), 'image/png');
            console.log(`Screenshot capturada para o passo: ${stepName}`);
        } catch (screenshotError) {
            console.error('Erro ao capturar screenshot:', screenshotError.message);
        }
    }
}

export { deletePerson };
