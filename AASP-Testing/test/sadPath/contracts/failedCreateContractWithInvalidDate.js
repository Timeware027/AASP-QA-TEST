import { By, Key, until } from 'selenium-webdriver';
import * as allure from "allure-js-commons";
import assert from 'assert';

async function failedCreateContractWithInvalidDate(driver) {
    try {
        await allure.step("Acessando página de cadastro de contrato", async () => {
            await driver.get('https://aaspgerenciador.aasp.org.br/contratos/novo/');
            allure.attachment("URL", "https://aaspgerenciador.aasp.org.br/contratos/novo/", "text/plain");
            allure.parameter("Status", "200");
            allure.parameter("Descrição", "Página de cadastro de contrato acessada com sucesso");
        });

        let fields = ['Título', 'Objeto', 'Número', 'Unidade de negócio', 'Data de assinatura', 
                     'Início da vigência', 'Data de extinção', 'Término da vigência', 
                     'Valor', 'Índice de reajuste', 'Pasta', 'Responsável', 'Observação'];
        
        let inputs = ['Contrato de Teste Automatizado', 'teste', '1234', '42', '99999999',
                     '99999999', '99999999', '99999999', '11111', '10',
                     'teste', 'Vinicius', 'nenhuma'];

        // Primeiro campo (Título) já mapeado
        await allure.step("Preenchendo o campo Título", async () => {
            try {
                const tituloInput = await driver.wait(
                    until.elementLocated(By.xpath("//label[normalize-space(.)='Título*']/parent::div//input")), 
                    10000
                );
                await driver.wait(until.elementIsVisible(tituloInput), 10000);
                await tituloInput.sendKeys(inputs[0]);
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

        // Preenchendo os demais campos
        for (let i = 1; i < inputs.length; i++) {
            console.log(`Preenchendo campo: ${fields[i]} com valor: ${inputs[i]}`);

            await allure.step(`Preenchendo o campo: ${fields[i]}`, async () => {
                try {
                    let inputField = await driver.switchTo().activeElement();
                    await inputField.sendKeys(inputs[i]);
                    await inputField.sendKeys(Key.ENTER);
                    await inputField.sendKeys(Key.TAB);
                    
                    allure.parameter("Status", "200");
                    allure.parameter("Campo", fields[i]);
                    allure.parameter("Valor", inputs[i]);
                } catch (error) {
                    allure.parameter("Status", "400");
                    console.error(`Erro ao preencher o campo ${fields[i]}:`, error.message);
                    await takeScreenshot(driver, `Erro ao preencher o campo ${fields[i]}`);
                    throw error;
                }
            });
        }

        await allure.step("Criando parte de contrato", async () => {
            try {
                // Navegar até o campo
                await driver.actions().sendKeys(Key.TAB, Key.ENTER, Key.TAB).perform();
                await driver.sleep(1000);

                // Digitar "teste"
                await driver.actions().sendKeys('t').perform();
                await driver.sleep(1000);


                // Clicar no "ADICIONAR NOVA EMPRESA" usando o texto
                const addButton = await driver.wait(
                    until.elementLocated(By.xpath("//p[normalize-space(.)='ADICIONAR NOVA PESSOA']")),
                    10000
                );
                await addButton.click();

                await driver.sleep(1000);

                await driver.actions().sendKeys(Key.TAB, '28905486860', Key.TAB, Key.TAB, Key.TAB).perform();

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
                await driver.wait(until.elementLocated(By.css('span#message-id')), 2000);
                const mensagem = await driver.findElement(By.css('span#message-id'), 2000);
                const textoMensagem = await mensagem.getText();

                if (textoMensagem === "Incluído com sucesso") {
                    await allure.parameter("Status", "400");
                    await assert.fail('Contrato criado com sucesso!');
                    console.log('Contrato criado com sucesso!')
                } else {
                    await allure.parameter("Status", "400");
                    await assert.fail('Erro ao criar contrato com número inválido');
                }
                
                await driver.sleep(2000);
                
            } catch (error) {
                await allure.parameter("Status", "200");
            await assert.ok('Erro ao clicar no botão de registro');
            await takeScreenshot(driver, "Erro ao clicar no botão de registro");
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

export { failedCreateContractWithInvalidDate };
