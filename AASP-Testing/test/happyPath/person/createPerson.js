import { By, Key, until } from 'selenium-webdriver';
import * as allure from 'allure-js-commons';
import assert from 'assert';

async function createPerson(driver) {
    try {
        await allure.step("Acessando Página de Registro", async (ctx) => {
            try {
                await driver.get('https://aaspgerenciador.aasp.org.br/pessoas-empresas/pessoas/novo/');
                await ctx.parameter("Status", "200");
            } catch (error) {
                await ctx.parameter("Status", "400");
                console.error("Erro ao acessar a página:", error.message);
                await assert.fail('Erro ao acessar página de gerenciamento');
                await takeScreenshot(driver, "Erro ao acessar a página");
                throw error;
            }
        });

        let fields = ['CPF', 'RG', 'orgão emissor', 'PIS/PASEP', 'nome', 'data de nascimento', 'nacionalidade', 'Sexo', 'estado civil', 'profissao', 'Nome da mãe', 'Nome do pai', 'pasta', 'Observações'];
        let inputs = ['53279822890', '12.345.678-9', 'SSP-SP', '12345678901', 'Vinícius Nascimento Borges', '01/08/1961', 'Brasileira', 'Masculino', 'Casado(a)', 'Advogado', 'Maria de Souza Borges', 'João Carlos Borges', 'Documentos Gerais', 'Nenhuma observação extra.'];

        await allure.step("Aguardando o campo de CPF carregar", async (ctx) => {
            try {
                await driver.wait(until.elementLocated(By.css('.jss1576.jss1561.jss1379')), 10000);
                await ctx.parameter("Status", "200");
            } catch (error) {
                await ctx.parameter("Status", "400");
                console.error("Erro ao esperar o campo CPF:", error.message);
                await assert.fail('Erro ao esperar o campo CPF');
                await takeScreenshot(driver, "Erro ao esperar o campo CPF");
                throw error;
            }
        });

        await allure.step("Preenchendo o campo CPF", async (ctx) => {
            try {
                let inputField = await driver.findElement(By.css('.jss1576.jss1561.jss1379'));
                await inputField.click();
                await inputField.sendKeys(inputs[0]);
                await inputField.sendKeys(Key.TAB);
                await ctx.parameter("Status", "200");
            } catch (error) {
                await ctx.parameter("Status", "400");
                console.error("Erro ao preencher o campo CPF:", error.message);
                await assert.fail('Erro ao preencher o campo CPF');
                await takeScreenshot(driver, "Erro ao preencher o campo CPF");
                throw error;
            }
        });

        for (let i = 1; i < inputs.length; i++) {
            await driver.sleep(500);
            console.log(`Preenchendo campo: ${fields[i]} com valor: ${inputs[i]}`);

            await allure.step(`Preenchendo o campo: ${fields[i]}`, async (ctx) => {
                try {
                    if (fields[i] === 'Sexo') {
                        let sexoDropdown = await driver.findElement(By.xpath("//*[contains(text(), 'Sexo')]/following-sibling::div"));

                        await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", sexoDropdown);

                        await sexoDropdown.click();

                        if (inputs[i] === 'Masculino') {
                            await driver.actions().sendKeys(Key.ENTER).sendKeys(Key.TAB).perform();
                        } else if (inputs[i] === 'Feminino') {
                            await driver.actions().sendKeys(Key.ARROW_DOWN).sendKeys(Key.ENTER).sendKeys(Key.TAB).perform();
                        }
                    } else if (fields[i] === 'nacionalidade' || fields[i] === 'estado civil' || fields[i] === 'profissao' || fields[i] === 'pasta') {
                        if (fields[i] === 'estado civil') {
                            fields[i] = 'estadoCivil';
                        }
                        let dropdown = await driver.findElement(By.css(`input[name="${fields[i]}"]`));
                        await dropdown.click();
                        await dropdown.sendKeys(inputs[i]);
                        await dropdown.sendKeys(Key.ENTER);
                        await dropdown.sendKeys(Key.TAB);
                    } else {
                        let inputField = await driver.switchTo().activeElement();
                        await inputField.sendKeys(inputs[i]);
                        await inputField.sendKeys(Key.TAB);
                    }

                    await ctx.parameter("Status", "200");
                } catch (error) {
                    await ctx.parameter("Status", "400");
                    await assert.fail('Erro ao preencher o campos');
                    console.error(`Erro ao preencher o campo ${fields[i]}:`, error.message);
                    await takeScreenshot(driver, `Erro ao preencher o campo ${fields[i]}`);
                    throw error;
                }
            });
        }

        await allure.step("Preenchendo registro profissional", async (ctx) => {
            try {
                await driver.actions().sendKeys(Key.ENTER).perform();

                await driver.actions().sendKeys(Key.TAB, "Adm", Key.ENTER, Key.TAB).perform();

                await driver.actions().sendKeys("1234", Key.ENTER, Key.TAB).perform();

                await driver.actions().sendKeys(Key.ENTER, Key.ENTER).perform();

                await driver.actions().sendKeys(Key.TAB, Key.ENTER).perform();

                await driver.sleep(1000);

                await driver.wait(until.elementLocated(By.css('span#message-id')));
                const mensagem = await driver.findElement(By.css('span#message-id'));

                const textoMensagem = await mensagem.getText();

                if (textoMensagem === "Registro Profissional criado com sucesso!") {
                    await ctx.parameter("Status", "200");
                    console.log('Registro Profissional criado com sucesso!')
                } else {
                    throw new Error(`Texto do alerta não encontrado. Esperado: "Registro Profissional criado com sucesso!", mas encontrado: ${textoMensagem}`);
                }
            } catch (error) {
                await ctx.parameter("Status", "400");
                console.error("Erro ao criar registro profissional", error.message);
                await assert.fail('Alerta de sucesso não econtrado');
                await takeScreenshot(driver, "Erro ao criar registro profissional");

                throw new Error(`FAILED: Erro ao criar registro profissional - ${error.message}`);
            }
        });

        await driver.sleep(3000);

        await allure.step("Preenchendo telefone", async (ctx) => {
            try {
                await driver.actions().sendKeys(Key.TAB, Key.TAB).perform();

                await driver.actions().sendKeys(Key.ENTER).perform();

                await driver.actions().sendKeys(Key.TAB, "11912345678", Key.ENTER, Key.TAB).perform();

                await driver.actions().sendKeys(Key.ENTER, Key.ARROW_DOWN, Key.ENTER).perform();

                await driver.actions().sendKeys(Key.TAB, Key.ENTER).perform();

                await driver.sleep(3000);

                await driver.wait(until.elementLocated(By.css('span#message-id')));
                const mensagem = await driver.findElement(By.css('span#message-id'));

                const textoMensagem = await mensagem.getText();

                if (textoMensagem === "Telefone criado com sucesso!") {
                    await ctx.parameter("Status", "200");
                    console.log('Telefone inserido com sucesso!')
                } else {
                    throw new Error(`Texto do alerta não encontrado. Esperado: "Telefone criado com sucesso!", mas encontrado: ${textoMensagem}`);
                }
            } catch (error) {
                await ctx.parameter("Status", "400");
                console.error("Erro ao inserir telefone", error.message);
                await assert.fail('Alerta de sucesso não econtrado');
                await takeScreenshot(driver, "Erro ao inserir telefone");

                throw new Error(`FAILED: Erro ao inserir telefone - ${error.message}`);
            }
        });

        await driver.sleep(3000);

        await allure.step("Preenchendo e-mail", async (ctx) => {
            try {
                await driver.actions().sendKeys(Key.TAB, Key.TAB).perform();

                await driver.actions().sendKeys(Key.ENTER).perform();

                await driver.actions().sendKeys(Key.TAB, "vinicius@email.com", Key.ENTER, Key.TAB).perform();

                await driver.actions().sendKeys(Key.ENTER, Key.ARROW_DOWN, Key.ENTER).perform();

                await driver.actions().sendKeys(Key.TAB, Key.ENTER).perform();

                await driver.sleep(1000);

                await driver.wait(until.elementLocated(By.css('span#message-id')));
                const mensagem = await driver.findElement(By.css('span#message-id'));

                const textoMensagem = await mensagem.getText();

                if (textoMensagem === "E-mail criado com sucesso!") {
                    await ctx.parameter("Status", "200");
                    console.log('E-mail criado com sucesso!')
                } else {
                    throw new Error(`Texto do alerta não encontrado. Esperado: "E-mail criado com sucesso!", mas encontrado: ${textoMensagem}`);
                }
            } catch (error) {
                await ctx.parameter("Status", "400");
                console.error("Erro ao inserir e-mail", error.message);
                await assert.fail('Alerta de sucesso não econtrado');
                await takeScreenshot(driver, "Erro ao inserir e-mail");

                throw new Error(`FAILED: Erro ao inserir e-mail - ${error.message}`);
            }
        });

        await driver.sleep(3000);

        await allure.step("Preenchendo Endereço", async (ctx) => {
            try {
                await driver.actions().sendKeys(Key.TAB, Key.TAB).perform();

                await driver.actions().sendKeys(Key.ENTER).perform();

                await driver.actions().sendKeys(Key.TAB, "01012-905", Key.ENTER ).perform();

                await driver.sleep(500);

                await driver.actions().sendKeys(Key.TAB, Key.TAB, Key.TAB, Key.TAB, Key.TAB).perform();

                await driver.sleep(500);

                await driver.actions().sendKeys("11912345678", Key.ENTER, Key.TAB).perform();

                await driver.sleep(500);

                await driver.actions().sendKeys("151", Key.ENTER, Key.TAB).perform();

                await driver.sleep(500);

                await driver.actions().sendKeys("Centro Histórico", Key.ENTER, Key.TAB).perform();

                await driver.sleep(500);

                await driver.actions().sendKeys(Key.ENTER).perform();

                await driver.sleep(3000);

                await driver.actions().sendKeys(Key.TAB, Key.TAB, Key.TAB, Key.ENTER).perform();

            } catch (error) {
                await ctx.parameter("Status", "400");
                await assert.fail('Erro ao preencher dados de pessoa');
                await takeScreenshot(driver, "Erro ao preencher os dados");
                throw error;
            }
        });

        await driver.sleep(3000);

        await allure.step("Clicando no botão de registro", async (ctx) => {
            try {
                await driver.wait(until.elementLocated(By.css('span#message-id')), 3000, "Timeout ao esperar o alerta aparecer");

                const mensagem = await driver.findElement(By.css('span#message-id'));
                const textoMensagem = await mensagem.getText();

                if (textoMensagem === 'Pessoa incluída com sucesso!') {
                    await ctx.parameter("Status", "200");
                } else {
                    throw new Error(`Texto do alerta não encontrado. Esperado: "Pessoa incluída com sucesso!", mas encontrado: ${textoMensagem}`);
                }

            } catch (error) {
                await ctx.parameter("Status", "failed");
                console.error("Erro ao clicar no botão de registro:", error.message);
                await assert.fail('Alerta de sucesso não econtrado');
                await takeScreenshot(driver, "Erro ao clicar no botão de registro");

                throw new Error(`FAILED: Erro ao clicar no botão de registro - ${error.message}`);
            }
        });

        console.log('Registro efetuado com sucesso');
    } catch (error) {
        console.error('Erro durante o registro:', error.message);
        await takeScreenshot(driver, "Erro durante o registro");
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

export { createPerson };
