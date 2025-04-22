import { By, Key, until } from 'selenium-webdriver';
import * as allure from "allure-js-commons";
import assert from 'assert';

async function failedDeleteCompanyWithContracts(driver) {
    await allure.step("Clicando na última empresa", async (ctx) => {
        try {
            const rows = await driver.findElements(By.css("tr.jss587.jss589"));
    
            if (rows.length === 0) {
                throw new Error("Nenhum resultado encontrado.");
            }
    
            let lastRowIndex = rows.length - 1;
            console.log(`Quantidade de resultados: ${rows.length}`);
            console.log(`Clicando na última empresa: ${lastRowIndex}`);
    
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

    await allure.step("Tentando excluir empresa com contratos", async (ctx) => {
        try {
            // Esperando a página carregar
            await driver.sleep(2000);

            // Rolando a página para baixo para encontrar o botão de excluir
            await driver.executeScript("window.scrollBy(0, 300);");
            await driver.sleep(500);

            // Localizando e clicando no botão de excluir
            const deleteButton = await driver.findElement(
                By.css('div[title="Excluir"]')
            );

            await driver.wait(until.elementIsVisible(deleteButton), 5000);
            await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", deleteButton);
            await driver.sleep(500);
            await deleteButton.click();

            // Verificando a mensagem de erro
            await driver.wait(until.elementLocated(By.css('p.jss3660.jss3697.jss3678.jss3693')), 10000);
            const mensagem = await driver.findElement(By.css('p.jss3660.jss3697.jss3678.jss3693'));
            const textoMensagem = await mensagem.getText();

            if (textoMensagem.includes('Não é possível excluir uma empresa com contratos ativos')) {
                console.log("Teste de validação de exclusão com contratos passou com sucesso");
                await ctx.parameter("Status", "200");

                // Clicando no botão OK do diálogo de erro
                const botaoOK = await driver.findElement(
                    By.css('button.jss3726.jss3700.jss3702.jss3705.jss1020.jss3699')
                );
                await botaoOK.click();
            } else {
                throw new Error(`Mensagem de erro incorreta. Esperado mensagem sobre contratos ativos, mas encontrado: ${textoMensagem}`);
            }

            // Verificando se a empresa ainda existe na lista
            await driver.sleep(1000);
            const empresaAinda = await driver.findElements(By.css("tr.jss587.jss589"));
            if (empresaAinda.length === 0) {
                throw new Error("Empresa foi excluída mesmo tendo contratos ativos");
            }

            await takeScreenshot(driver, "Empresa_nao_excluida");
            await ctx.parameter("Status", "200");

        } catch (error) {
            await ctx.parameter("Status", "400");
            await takeScreenshot(driver, "Erro_ao_tentar_excluir_empresa");
            await assert.fail(`Erro ao tentar excluir empresa com contratos: ${error.message}`);
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

export { failedDeleteCompanyWithContracts }; 