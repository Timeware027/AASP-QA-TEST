import { By, Key, until } from 'selenium-webdriver';
import * as allure from "allure-js-commons";
import assert from 'assert';

async function failedUpdatePersonRequired(driver) {
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

    await allure.step("Tentando atualizar sem nome", async (ctx) => {
        try {
            // Navegando até o campo de nome
            await driver.sleep(500);
            await driver.actions()
                .sendKeys(Key.TAB).sendKeys(Key.TAB).sendKeys(Key.TAB)
                .sendKeys(Key.TAB).sendKeys(Key.TAB).sendKeys(Key.TAB)
                .sendKeys(Key.TAB).sendKeys(Key.TAB).sendKeys(Key.ENTER)
                .perform();

            // Limpando o campo nome
            await driver.actions()
                .keyDown(Key.CONTROL).sendKeys('a').keyUp(Key.CONTROL)
                .sendKeys(Key.BACK_SPACE)
                .perform();

            // Tirando screenshot do campo vazio
            await takeScreenshot(driver, "Campo_nome_vazio");

            // Clicando no botão de atualizar
            const botaoAtualizar = await driver.findElement(By.xpath("//button[contains(., 'Atualizar')]"));
            await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", botaoAtualizar);
            await botaoAtualizar.click();


            await driver.wait(until.elementLocated(By.css('span#message-id')), 5000, "Timeout ao esperar o alerta aparecer");

            const mensagem = await driver.findElement(By.css('span#message-id'));
            const textoMensagem = await mensagem.getText();



            if (textoMensagem == 'Pessoa atualizada com sucesso!') {
                await ctx.parameter("Status", "200");
                await assert.fail('Alerta de sucesso');
            } else {
                await ctx.parameter("Status", "400");
                await assert.fail('Alerta de sucesso');
                throw new Error(`Texto do alerta não encontrado. Esperado: "Empresa incluída com sucesso!", mas encontrado: ${textoMensagem}`);
            }

            // Verificando se as alterações não foram salvas
            await driver.sleep(1000);
            await takeScreenshot(driver, "Verificacao_alteracoes_nao_salvas");

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

export { failedUpdatePersonRequired }; 