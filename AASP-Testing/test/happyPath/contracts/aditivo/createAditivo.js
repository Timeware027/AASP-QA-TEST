import { By, Key, until } from 'selenium-webdriver';
import * as allure from "allure-js-commons";
import assert from 'assert';

async function createAditivo(driver) {
    await allure.step("Navegando até as ações do contrato", async (ctx) => {
        try {
            await driver.get('https://aaspgerenciador.aasp.org.br/contratos/17035/editar');

            await ctx.parameter("Status", "200");
            await ctx.parameter("Descrição", "Navegado até edição do contrato com sucesso");
        } catch (error) {
            await ctx.parameter("Status", "400");
            console.error("Erro ao navegar até edição:", error);
            await takeScreenshot(driver, "Erro ao navegar até edição");
            throw error;
        }
    });

    await allure.step("Criando aditivo", async (ctx) => {
        try {
            // Localizar o texto do contrato usando a estrutura completa
            const contratoSpan = await driver.wait(
                until.elementLocated(By.xpath("//div[contains(@class, 'jss290')]//p//span[contains(., 'Contrato de Teste Automatizado')]")),
                10000
            );
            await driver.wait(until.elementIsVisible(contratoSpan), 10000);
            await driver.sleep(2000); // Aguardar um pouco mais para garantir que a página carregou completamente
            await contratoSpan.click();
            
            // Navegar com TAB e ENTER até o botão de adicionar
            await driver.actions().sendKeys(Key.TAB).perform();
            await driver.sleep(1000);
            await driver.actions().sendKeys(Key.ENTER).perform();
            await driver.sleep(1000);
            await driver.actions().sendKeys(Key.ARROW_DOWN).perform();
            await driver.sleep(1000);
            await driver.actions().sendKeys(Key.ENTER).perform();
            await driver.sleep(1000);
            
            await ctx.parameter("Status", "200");
            await ctx.parameter("Descrição", "Botão de adicionar clicado com sucesso");
        } catch (error) {
            await ctx.parameter("Status", "400");
            await takeScreenshot(driver, "Erro ao clicar no botão de adicionar");
            throw error;
        }
    });

    await allure.step("Clicando no botão de criar", async (ctx) => {
        try {
            await driver.sleep(2000);
            
            // Rolar a página para baixo
            await driver.executeScript("window.scrollBy(0, 500);");
            await driver.sleep(1000);

            // Localizar e clicar no botão Criar
            const criarButton = await driver.wait(
                until.elementLocated(By.xpath("//span[normalize-space(.)='Criar']")),
                10000
            );
            await driver.wait(until.elementIsVisible(criarButton), 10000);
            await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", criarButton);
            await driver.sleep(1000);
            await criarButton.click();

            await driver.sleep(3000);

            await ctx.parameter("Status", "200");

        } catch (error) {
            await ctx.parameter("Status", "400");
            await assert.fail('Erro ao clicar em criar');
            console.error("Erro ao clicar no botão criar:", error.message);
            await takeScreenshot(driver, "Erro ao clicar no botão criar");
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

export { createAditivo }; 