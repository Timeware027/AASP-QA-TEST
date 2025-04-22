import { By, Key, until } from 'selenium-webdriver';
import * as allure from "allure-js-commons";
import assert from 'assert';

async function deleteCompany(driver) {

    await allure.step("Clicando na penúltima pessoa", async (ctx) => {
        try {
            const rows = await driver.findElements(By.css("tr.jss587.jss589"));

            if (rows.length === 0) {
                throw new Error("Nenhum resultado encontrado.");
            }
            if (rows.length < 2) {
                throw new Error("Menos de 2 resultados encontrados. Não há penúltimo.");
            }

            const penultimateRowIndex = rows.length - 1;
            console.log(`Quantidade de resultados: ${rows.length}`);
            console.log(`Clicando na penúltima pessoa (índice ${penultimateRowIndex})`);

            await driver.executeScript(
                "arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });",
                rows[penultimateRowIndex]
            );

            await driver.actions().sendKeys(Key.TAB, Key.TAB, Key.TAB, Key.TAB, Key.TAB, Key.TAB,
                Key.TAB, Key.ENTER
            ).perform();

            await driver.wait(until.elementIsVisible(rows[penultimateRowIndex]));
            await driver.wait(until.elementIsEnabled(rows[penultimateRowIndex]));

            await driver.actions().sendKeys(Key.ARROW_DOWN).perform();

            await driver.executeScript("arguments[0].click();", rows[penultimateRowIndex]);

            await ctx.parameter("Status", "200");
        } catch (error) {
            await ctx.parameter("Status", "400");
            console.error("Erro ao clicar na penúltima pessoa:", error);
            await assert.fail('Erro ao clicar na penúltima pessoa: ' + error.message);
            throw error;
        }
    });


    await allure.step("Clicando no botão de delete", async (ctx) => {
        try {

            await driver.wait(until.elementLocated(By.css('div[title="Excluir"]')), 10000);
            await driver.findElement(By.css('div[title="Excluir"]')).click();

            await driver.actions().sendKeys(Key.TAB).sendKeys(Key.TAB).sendKeys(Key.TAB).sendKeys(Key.ENTER).perform();
            await driver.sleep(1000);
            await ctx.parameter("Status", "200");

            await allure.step("Buscando botão de registro", async (ctx) => {
                try {
                    const mensagem = await driver.findElement(By.css('[role="alertdialog"] span#message-id'), 10000);
                    const textoMensagem = await mensagem.getText();

                    if (textoMensagem === 'Empresa excluída com sucesso!') {
                        await ctx.parameter("Status", "200");
                    } else {
                        await assert.fail('Alerta de sucesso não econtrado');
                        throw new Error(`Texto do alerta não encontrado. Esperado: "Empresa excluída com sucesso!", mas encontrado: ${textoMensagem}`);
                    }
                } catch (error) {
                    await ctx.parameter("Status", "400");
                    await assert.fail('Erro ao deletar Empresa');
                    throw error;
                }

            });
        } catch (error) {
            await ctx.parameter("Status", "400");
            console.error("Erro ao clicar em delete", error.message);
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

export { deleteCompany };
