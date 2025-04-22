import { By, Key, until } from 'selenium-webdriver';
import * as allure from "allure-js-commons";
import assert from 'assert';

async function createContractRequired(driver) {
    try {
        await allure.step("Acessando página de cadastro de contrato", async () => {
            await driver.get('https://aaspgerenciador.aasp.org.br/contratos/novo/');
            allure.attachment("URL", "https://aaspgerenciador.aasp.org.br/contratos/novo/", "text/plain");
            allure.parameter("Status", "200");
            allure.parameter("Descrição", "Página de cadastro de contrato acessada com sucesso");
        });

        // Preenchendo apenas o campo Título
        await allure.step("Preenchendo o campo Título", async () => {
            try {
                const tituloInput = await driver.wait(
                    until.elementLocated(By.xpath("//label[normalize-space(.)='Título*']/parent::div//input")), 
                    10000
                );
                await driver.wait(until.elementIsVisible(tituloInput), 10000);
                await tituloInput.sendKeys('Contrato de Teste Automatizado - Campos Obrigatórios');
                await tituloInput.sendKeys(Key.ENTER);
                await tituloInput.sendKeys(Key.TAB);
                allure.parameter("Status", "200");
                allure.parameter("Descrição", "Campo título preenchido com sucesso");
            } catch (error) {
                allure.parameter("Status", "400");
                console.error("Erro ao preencher o campo Título:", error.message);
                await takeScreenshot(driver, "Erro ao preencher o campo Título");
                throw error;
            }
        });

        // Navegando pelos campos com TAB
        await allure.step("Navegando pelos campos", async () => {
            try {
                for (let i = 0; i < 12; i++) {
                    await driver.actions().sendKeys(Key.TAB).perform();
                    await driver.sleep(500);
                }
                allure.parameter("Status", "200");
                allure.parameter("Descrição", "Navegação pelos campos realizada com sucesso");
            } catch (error) {
                allure.parameter("Status", "400");
                console.error("Erro ao navegar pelos campos:", error.message);
                await takeScreenshot(driver, "Erro ao navegar pelos campos");
                throw error;
            }
        });

        await allure.step("Criando parte de contrato", async () => {
            try {
                // Navegar até o campo
                await driver.actions().sendKeys(Key.TAB, Key.ENTER, Key.TAB).perform();
                await driver.sleep(1000);

                // Digitar "teste"
                await driver.actions().sendKeys('t').perform();
                await driver.sleep(1000);

                // Clicar no "ADICIONAR NOVA PESSOA" usando o texto
                const addButton = await driver.wait(
                    until.elementLocated(By.xpath("//p[normalize-space(.)='ADICIONAR NOVA PESSOA']")),
                    10000
                );
                await addButton.click();

                await driver.sleep(1000);

                await driver.actions().sendKeys(Key.TAB, '62395813800', Key.TAB, Key.TAB, Key.TAB).perform();

                await driver.sleep(3000);

                await driver.actions().sendKeys(Key.ENTER).perform();
                // Localizar e preencher o campo posição
                const posicaoInput = await driver.wait(
                    until.elementLocated(By.name('posicao')),
                    10000
                );
                await posicaoInput.click();
                await posicaoInput.sendKeys('adm', Key.ENTER);
                await driver.sleep(1000);

                // Clicar na checkbox "Esta parte é cliente"
                const clienteCheckbox = await driver.wait(
                    until.elementLocated(By.xpath("//label[contains(., 'Esta parte é cliente')]//input[@type='checkbox']")),
                    10000
                );
                await clienteCheckbox.click();
                await driver.sleep(1000);

                // Clicar no botão Adicionar usando o texto
                const addButton2 = await driver.wait(
                    until.elementLocated(By.xpath("//span[normalize-space(.)='Adicionar']")),
                    10000
                );

                await addButton2.click();

                allure.parameter("Status", "200");
                allure.parameter("Descrição", "Parte do contrato selecionada com sucesso");
            } catch (error) {
                allure.parameter("Status", "400");
                console.error("Erro ao criar parte do contrato:", error.message);
                await takeScreenshot(driver, "Erro ao criar parte do contrato");
                throw error;
            }
        });

        // Clicando no botão Salvar
        await allure.step("Clicando no botão Salvar", async () => {
            try {
                await driver.sleep(2000);
                
                const saveButton = await driver.findElement(By.xpath("//span[normalize-space(.)='Salvar']/parent::button"));
                await driver.wait(until.elementIsVisible(saveButton), 10000);
                await saveButton.click();

                // Verificar mensagem de sucesso
                await driver.wait(until.elementLocated(By.css('span#message-id')));
                const mensagem = await driver.findElement(By.css('span#message-id'));
                const textoMensagem = await mensagem.getText();

                if (textoMensagem === "Incluído com sucesso") {
                    await allure.parameter("Status", "200");
                    console.log('Contrato criado com sucesso!')
                } else {
                    throw new Error(`Texto do alerta não encontrado. Esperado: "Incluído com sucesso", mas encontrado: ${textoMensagem}`);
                }
                
                await driver.sleep(2000);
                
                allure.parameter("Status", "200");
                allure.parameter("Descrição", "Botão Salvar clicado com sucesso");
            } catch (error) {
                allure.parameter("Status", "400");
                console.error("Erro ao clicar no botão Salvar:", error.message);
                await takeScreenshot(driver, "Erro ao clicar no botão Salvar");
                throw error;
            }
        });

    } catch (error) {
        allure.attachment("Error Screenshot", await driver.takeScreenshot(), "image/png");
        allure.attachment("Error", error.message, "text/plain");
        throw new Error("Falha ao criar contrato: " + error.message);
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

export { createContractRequired }; 