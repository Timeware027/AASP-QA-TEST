import { By, Key, until } from 'selenium-webdriver';
import * as allure from "allure-js-commons";
import assert from 'assert';

async function searchContract(driver) {
    try {
        await allure.step("Acessando página de contratos", async () => {
            await driver.get('https://aaspgerenciador.aasp.org.br/contratos');
            allure.attachment("URL", "https://aaspgerenciador.aasp.org.br/contratos", "text/plain");
            allure.parameter("Status", "200");
            allure.parameter("Descrição", "Página de contratos acessada com sucesso");
        });

        await allure.step("Fechando popup de introdução", async (ctx) => {
            try {
                const closeButton = await driver.wait(
                    until.elementLocated(By.css(".reactour__helper button.sc-bxivhb")), 
                    5000
                );
                await driver.wait(until.elementIsVisible(closeButton), 5000);
                await closeButton.click();
                await ctx.parameter("Popup", "Fechado");
            } catch (error) {
                await ctx.parameter("Popup", "Não encontrado ou erro ao fechar");
                
            }
        });

        await allure.step("Clicando no input de pesquisa", async (ctx) => {
            try {
                const searchBar = await driver.wait(
                    until.elementLocated(By.css("input[placeholder='Buscar contrato']")));
                await driver.wait(until.elementIsVisible(searchBar));
                await searchBar.click();
                await ctx.parameter("Status", "200");
            } catch (error) {
                await ctx.parameter("Status", "400");
                await assert.fail('Input não encontrado');
            }
        });

        await allure.step("Pesquisando pelo nome do contrato", async (ctx) => {
            try {
                await driver.actions().sendKeys('Contrato de Teste Automatizado').perform();
                console.log('Inserindo contrato de pesquisa')
                await ctx.parameter("Status", "200");
            } catch (error) {
                await ctx.parameter("Status", "400");
                throw error;
            }
        });

        await allure.step("Clicando em pesquisar", async (ctx) => {
            try {
                await driver.sleep(2000);
                await driver.actions().sendKeys(Key.TAB).sendKeys(Key.ENTER).perform();
                await driver.sleep(3000);
                await ctx.parameter("Status", "200");
            } catch (error) {
                await ctx.parameter("Status", "400");
                await assert.fail('Botão de pesquisa não encontrado');
            }
        });

        await allure.step("Rolando a página para visualizar resultados", async (ctx) => {
            try {
                await driver.executeScript("window.scrollBy(0, 800)");
                await ctx.parameter("Status", "200");
            } catch (error) {
                await ctx.parameter("Status", "400");
                await assert.fail('Rolagem falhou');
            }
        });

        await allure.step("Verificando resultado da busca", async (ctx) => {
            try {
                await driver.sleep(2000);
                await takeScreenshot(driver, "Resultado da busca de contrato");
                await ctx.parameter("Status", "200");
                await ctx.parameter("Descrição", "Screenshot do resultado capturado com sucesso");
            } catch (error) {
                await ctx.parameter("Status", "400");
                console.error("Erro ao capturar screenshot do resultado:", error.message);
                throw error;
            }
        });

    } catch (error) {
        allure.attachment("Error Screenshot", await driver.takeScreenshot(), "image/png");
        allure.attachment("Error", error.message, "text/plain");
        throw new Error("Falha ao buscar contrato: " + error.message);
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

export { searchContract }; 