import { By, until } from 'selenium-webdriver';
import fs from 'fs';
import * as allure from "allure-js-commons";
import assert from 'assert';

async function failedCreatePerson(driver) {
    try {
        console.log("Iniciando cadastro de pessoa...");

        await allure.step("Acessando página de cadastro", async (ctx) => {
            try {
                await driver.get('https://aaspgerenciador.aasp.org.br/pessoas-empresas/pessoas/novo/');
                await ctx.parameter("Status", "200");
            } catch (error) {
                await ctx.parameter("Status", "400");
                await assert.fail('Erro ao acessar página de gerenciamento');
                console.error("Erro ao acessar a página de cadastro:", error.message);
                await takeScreenshot(driver, "Erro ao acessar a página de cadastro");
                throw error;
            }
        });

        await allure.step("Aguardando campo 'Nome' carregar", async (ctx) => {
            try {
                await driver.wait(until.elementLocated(By.css('.jss1399.jss1438.jss1446 .jss1531 .jss1576.jss1561.jss1379')), 15000);
                await ctx.parameter("Status", "200");
            } catch (error) {
                await ctx.parameter("Status", "400");
                await assert.fail('Erro ao esperar o campo Nome');
                console.error("Erro ao esperar o campo 'Nome':", error.message);
                await takeScreenshot(driver, "Erro ao esperar o campo 'Nome'");
                throw error;
            }
        });

        await allure.step("Preenchendo o campo 'Nome'", async (ctx) => {
            try {
                const nomeInput = await driver.findElement(By.css('.jss1399.jss1438.jss1446 .jss1531 .jss1576.jss1561.jss1379'));
                await nomeInput.clear();
                await nomeInput.sendKeys('');
                await ctx.parameter("Status", "200");
            } catch (error) {
                await ctx.parameter("Status", "400");
                console.error("Erro ao preencher o campo 'Nome':", error.message);
                await assert.fail('Erro ao preencher o campo Nome:');
                await takeScreenshot(driver, "Erro ao preencher o campo 'Nome'");
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

                

                if (textoMensagem == 'Empresa incluída com sucesso!') {
                    await ctx.parameter("Status", "200");
                    await assert.fail('Alerta de sucesso');
                } else {
                    await ctx.parameter("Status", "400");
                    await assert.fail('Alerta de sucesso');
                    throw new Error(`Texto do alerta não encontrado. Esperado: "Empresa incluída com sucesso!", mas encontrado: ${textoMensagem}`);
                }


            } catch (error) {
                await ctx.parameter("Status", "200");
                await assert.ok('Erro ao clicar no botão de registro');
                await takeScreenshot(driver, "Erro ao clicar no botão de registro");
            }
        });


        await allure.step("Finalizando cadastro", async (ctx) => {
            try {
                console.log("Cadastro de pessoa concluído!");
                await ctx.parameter("Status", "200");
            } catch (error) {
                await ctx.parameter("Status", "400");
                console.error("Erro durante a finalização do cadastro:", error.message);
                await assert.fail('Erro durante a finalização do cadastro:');
                await takeScreenshot(driver, "Erro durante a finalização do cadastro");
                throw error;
            }
        });

    } catch (error) {
        console.error("Erro ao tentar registrar a pessoa:", error);
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

export { failedCreatePerson };

