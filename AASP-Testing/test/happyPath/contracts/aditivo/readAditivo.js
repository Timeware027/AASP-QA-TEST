import { By, Key, until } from 'selenium-webdriver';
import * as allure from "allure-js-commons";
import assert from 'assert';

async function readAditivo(driver) {
    await allure.step("Tirando print dos aditivos e o contrato", async (ctx) => {
        try {
            await driver.get('https://aaspgerenciador.aasp.org.br/contratos/17035/editar');

            await takeScreenshot(driver, "Navegado até edição do contrato com sucesso");

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
            
            
            await ctx.parameter("Status", "200");
            await ctx.parameter("Descrição", "Botão de adicionar clicado com sucesso");
        } catch (error) {
            await ctx.parameter("Status", "400");
            await takeScreenshot(driver, "Erro ao clicar no botão de adicionar");
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

export { readAditivo }; 