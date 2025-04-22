import { By, Key, until } from 'selenium-webdriver';
import * as allure from "allure-js-commons";
import assert from 'assert';

async function failedUpdateContractInvalidDate(driver) {
    await allure.step("Navegando até as ações do contrato", async (ctx) => {
        try {
            await driver.get('https://aaspgerenciador.aasp.org.br/contratos/17040/editar');

            await ctx.parameter("Status", "200");
            await ctx.parameter("Descrição", "Navegado até edição do contrato com sucesso");
        } catch (error) {
            await ctx.parameter("Status", "400");
            console.error("Erro ao navegar até edição:", error);
            await takeScreenshot(driver, "Erro ao navegar até edição");
            throw error;
        }
    });

    await allure.step("Atualizando título e número", async (ctx) => {
        try {
            await allure.step("Alterando o título", async (ctx) => {
                try {
                    await driver.sleep(2000);
                    const tituloInput = await driver.wait(
                        until.elementLocated(By.xpath("//label[normalize-space(.)='Título*']/parent::div//input")),
                        10000
                    );
                    await driver.wait(until.elementIsVisible(tituloInput), 10000);
                    await tituloInput.clear();
                    await tituloInput.sendKeys('Contrato de Teste Automatizado - caminho triste');
                    await tituloInput.sendKeys(Key.ENTER);
                    await tituloInput.sendKeys(Key.TAB, Key.TAB, Key.TAB);
                    await driver.sleep(2000);
                    await ctx.parameter("Status", "200");
                    await ctx.parameter("Descrição", "Campo título atualizado com sucesso");
                } catch (error) {
                    await ctx.parameter("Status", "400");
                    await takeScreenshot(driver, "Erro ao atualizar título");
                    throw error;
                }
            });

            // Atualizando o número
            await allure.step("Alterando o número", async (ctx) => {
                try {
                    await driver.actions().sendKeys(Key.TAB).perform();
                    await driver.actions().sendKeys('99999999').perform();
                    await driver.actions().sendKeys(Key.ENTER).perform();
                    await driver.actions().sendKeys(Key.TAB).perform();
                    await driver.actions().sendKeys('99999999').perform();
                    await driver.actions().sendKeys(Key.ENTER).perform();
                    await driver.actions().sendKeys(Key.TAB).perform();
                    await driver.actions().sendKeys('99999999').perform();
                    await driver.actions().sendKeys(Key.ENTER).perform();
                    await driver.actions().sendKeys(Key.TAB).perform();
                    await driver.actions().sendKeys('99999999').perform();

                    await ctx.parameter("Status", "200");
                } catch (error) {
                    await ctx.parameter("Status", "400");
                    await takeScreenshot(driver, "Erro ao atualizar número");
                    throw error;
                }
            });

            await driver.sleep(1000);
            await ctx.parameter("Status", "200");
        } catch (error) {
            console.error("Erro detalhado:", error.message);
            await ctx.parameter("Status", "400");
            await assert.fail(`Erro ao atualizar contrato: ${error.message}`);
            await takeScreenshot(driver, "Erro ao atualizar contrato");
            throw error;
        }
    });

    await allure.step("Clicando no botão de atualizar", async (ctx) => {
        try {
            await driver.sleep(2000);

            const botaoAtualizar = await driver.findElement(By.xpath("//button[contains(., 'Salvar')]"));

            await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", botaoAtualizar);

            await botaoAtualizar.click();

            await driver.sleep(2000);

            await driver.wait(until.elementLocated(By.css('[role="alertdialog"] span#message-id')), 2000);

            const mensagem = await driver.findElement(By.css('[role="alertdialog"] span#message-id'), 2000);
            const textoMensagem = await mensagem.getText();

            if (textoMensagem === "Alterado com sucesso") {
                await allure.parameter("Status", "400");
                await assert.fail('Contrato alterado com sucesso!');
                console.log('Contrato alterado com sucesso!')
            } else {
                await allure.parameter("Status", "200");
                await assert.ok('Erro ao atualizar contrato com número inválido');
            }

        } catch (error) {
            await ctx.parameter("Status", "200");
            await assert.ok('Erro ao clicar no botão de registro');
            await takeScreenshot(driver, "Erro ao clicar no botão de registro");
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

export { failedUpdateContractInvalidDate }; 