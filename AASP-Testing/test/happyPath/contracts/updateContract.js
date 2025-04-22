import { By, Key, until } from 'selenium-webdriver';
import * as allure from "allure-js-commons";
import assert from 'assert';

async function updateContract(driver) {
    await allure.step("Navegando até as ações do contrato", async (ctx) => {
        try {
            await driver.get('https://aaspgerenciador.aasp.org.br/contratos/17000/editar');

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
                    await tituloInput.sendKeys('Contrato de Teste Automatizado - Atualizado');
                    await tituloInput.sendKeys(Key.ENTER);
                    await tituloInput.sendKeys(Key.TAB);
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
                    const numeroInput = await driver.switchTo().activeElement();
                    await numeroInput.clear();
                    await numeroInput.sendKeys('9999');
                    await numeroInput.sendKeys(Key.ENTER);
                    await numeroInput.sendKeys(Key.TAB);
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
   
            await driver.wait(until.elementLocated(By.css('[role="alertdialog"] span#message-id')));
   
            const mensagem = await driver.findElement(By.css('[role="alertdialog"] span#message-id'));
            const textoMensagem = await mensagem.getText();
   
            if (textoMensagem === 'Alterado com sucesso') {
                console.log("Contrato alterado com sucesso");
                await ctx.parameter("Status", "200");
            } else {
                await ctx.parameter("Status", "400");
                await assert.fail('Alerta de sucesso não encontrado');
                throw new Error(`Texto do alerta não encontrado. Esperado: "Alterado com sucesso!", mas encontrado: ${textoMensagem}`);
            }
   
        } catch (error) {
            await ctx.parameter("Status", "400");
            await assert.fail('Erro ao clicar em atualizar');
            console.error("Erro ao clicar no botão de atualizar:", error.message);
            await takeScreenshot(driver, "Erro ao clicar no botão de atualizar");
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

export { updateContract }; 