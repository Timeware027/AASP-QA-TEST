import { By, Key, until } from 'selenium-webdriver';
import fs from 'fs';
import * as allure from "allure-js-commons";
import assert from 'assert';

async function createCompanyRequired(driver) {
    try {
        console.log("Iniciando cadastro de empresa...");

        await allure.step("Acessando página de cadastro de empresa", async (ctx) => {
            try {
                await driver.get('https://aaspgerenciador.aasp.org.br/pessoas-empresas/empresas/novo/');
                await ctx.parameter("Status", "200");
            } catch (error) {
                await ctx.parameter("Status", "400");
                console.error("Erro ao acessar a página de cadastro de empresa:", error.message);
                await assert.fail('Erro ao acessar página de gerenciamento');
                await takeScreenshot(driver, "Erro ao acessar a página de cadastro de empresa");
                throw error;
            }
        });

        await allure.step("Marcando checkbox de aceite", async (ctx) => {
            try {
                await driver.wait(until.elementLocated(By.css('input[type="checkbox"]')), 15000);
                await driver.findElement(By.css('input[type="checkbox"]')).click();

                await driver.actions().sendKeys(Key.TAB, Key.ENTER, 10000).perform();
                await ctx.parameter("Status", "200");
            } catch (error) {
                await ctx.parameter("Status", "failed");
                console.error("Erro ao marcar checkbox:", error.message);
                await takeScreenshot(driver, "Erro ao marcar checkbox");
                await assert.fail('Erro ao ativar modo manual');
                throw new Error(`Test failed: ${error.message}`);
            }
        });

        await allure.step("Preenchendo os dados da empresa", async (ctx) => {
            try {
                await driver.actions().sendKeys(Key.TAB, Key.TAB, 'Tech Solutions Ltda').perform();
                await driver.actions().sendKeys(Key.TAB, 'Tech Soluções').perform();
                await driver.sleep(1500);
                await ctx.parameter("Status", "200");
            } catch (error) {
                await ctx.parameter("Status", "400");
                console.error("Erro ao preencher os dados da empresa:", error.message);
                await assert.fail('Erro ao preencher campos');
                throw error;
            }
        });

        await allure.step("Clicando no botão de registro", async (ctx) => {
            try {
                const botao = await driver.findElement(By.css('.jss126.jss174.jss176.jss179.jss273'));
                await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", botao);
                await botao.click();

                await driver.wait(until.elementLocated(By.css('.jss2922.jss2930.jss2958.jss2966.jss2985.jss1545')), 5000, "Timeout ao esperar o alerta aparecer");

                const mensagem = await driver.findElement(By.css('.jss2922.jss2930.jss2958.jss2966.jss2985.jss1545 #message-id'));
                const textoMensagem = await mensagem.getText();

                

                if (textoMensagem === 'Empresa incluída com sucesso!') {
                    await ctx.parameter("Status", "200");
                } else {
                    await ctx.parameter("Status", "400");
                    await assert.fail('Alerta de sucesso não econtrado');
                    throw new Error(`Texto do alerta não encontrado. Esperado: "Empresa incluída com sucesso!", mas encontrado: ${textoMensagem}`);
                }


            } catch (error) {
                await ctx.parameter("Status", "400");
                console.error("Erro ao clicar no botão de registro:", error.message);
                await assert.fail('Erro ao clicar no botão de registro');
                await takeScreenshot(driver, "Erro ao clicar no botão de registro");
                throw error;
            }
        });

        await allure.step("Finalizando cadastro", async (ctx) => {
            try {
                console.log("Cadastro de pessoa concluído!");
                await ctx.parameter("Status", "200");
            } catch (error) {
                await ctx.parameter("Status", "400");
                await assert.fail('Erro durante a finalização ao cadastro');
                console.error("Erro durante a finalização do cadastro:", error.message);
                await takeScreenshot(driver, "Erro durante a finalização do cadastro");
                throw error;
            }
        });


    } catch (error) {
        console.error("Erro ao tentar registrar a empresa:", error);
        const screenshot = await driver.takeScreenshot();
        fs.writeFileSync("error_screenshot.png", screenshot, "base64");
        console.log("Screenshot do erro salva como 'error_screenshot.png'");
        throw error;
    }
}

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

export { createCompanyRequired };
