import { By, Key, until } from 'selenium-webdriver';
import * as allure from "allure-js-commons";
import assert from 'assert';

async function updateCompanyEmail(driver) {
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

           await allure.step("Marcando checkbox de aceite", async (ctx) => {
                       try {
                           await driver.wait(until.elementLocated(By.css('input[type="checkbox"]')), 10000);
                           await driver.findElement(By.css('input[type="checkbox"]')).click();
                           await driver.actions().sendKeys(Key.TAB, Key.ENTER).perform();
                           await ctx.parameter("Status", "200");
                       } catch (error) {
                           await ctx.parameter("Status", "400");
                           await takeScreenshot(driver, "Erro ao marcar checkbox");
                           await assert.fail('Erro ao marcar checkbox');
                           throw error;
                       }
                   });

    await allure.step("Atualizando endereço", async (ctx) => {
        await allure.step("Role a tela e clique no botão de editar", async (ctx) => {
            await driver.sleep(3000);
        });
        try {
            // Aumentando o tempo de espera inicial
            await driver.sleep(3000);

            // Rolando a página para baixo em etapas
            await driver.executeScript("window.scrollBy(0, 300);");
            await driver.sleep(500);
            await driver.executeScript("window.scrollBy(0, 300);");
            await driver.sleep(500);
            await driver.executeScript("window.scrollBy(0, 300);");
            await driver.sleep(500);

            // Tentando diferentes seletores para o botão de editar
            let editButton;
            try {
                editButton = await driver.findElement(
                    By.css('div[title="Editar"]')
                );
            } catch (error) {
                try {
                    editButton = await driver.findElement(
                        By.xpath("//div[@role='button'][@title='Editar']")
                    );
                } catch (error) {
                    editButton = await driver.findElement(
                        By.xpath("//div[contains(@class, 'jss2720')][@title='Editar']")
                    );
                }
            }



            // Garantindo que o botão esteja visível
            await driver.wait(until.elementIsVisible(editButton), 10000);
            await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", editButton);
            await driver.sleep(1000);

            // Tentando diferentes maneiras de clicar no botão
            try {
                await editButton.click();
            } catch (error) {
                try {
                    await driver.executeScript("arguments[0].click();", editButton);
                } catch (error) {
                    await driver.actions().move({origin: editButton}).click().perform();
                }
            }

            await allure.step("Alterando o campo de endereço", async (ctx) => {
                try {
                    // Esperando a página carregar
                    await driver.sleep(2000);

                    // Tirando screenshot antes de tentar localizar o elemento
                    await takeScreenshot(driver, "Antes_de_localizar_campo_contato");

                    // Tentando diferentes seletores para o campo
                    let campoContato;
                    try {
                        campoContato = await driver.findElement(
                            By.css('input[value="Contato Teste"]')
                        );
                    } catch (error) {
                        // Se não encontrar pelo valor, tenta pelas classes atualizadas
                        campoContato = await driver.findElement(
                            By.css('.jss2559.jss2583.jss2567 input')
                        );
                    }

                    // Tirando screenshot após encontrar o elemento
                    await takeScreenshot(driver, "Campo_contato_encontrado");

                    // Garantindo que o campo esteja visível
                    await driver.wait(until.elementIsVisible(campoContato), 5000);
                    await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", campoContato);
                    await driver.sleep(500);

                    // Clicando no campo
                    await campoContato.click();
                    await takeScreenshot(driver, "Apos_clicar_campo_contato");

                    await driver.actions().sendKeys(Key.TAB, Key.TAB, 'emailAtualizado@gmail.com', Key.ENTER).perform();
                    await takeScreenshot(driver, "Apos_preencher_email");

                    await driver.actions().sendKeys(Key.TAB, Key.TAB, Key.ENTER).perform();
                    await ctx.parameter("Status", "200");
                } catch (error) {
                    // Tirando screenshot no momento do erro
                    await takeScreenshot(driver, `Erro_${error.message.replace(/[^a-zA-Z0-9]/g, '_')}`);
                    console.error("Erro detalhado:", error.message);
                    await ctx.parameter("Status", "400");
                    await assert.fail(`Erro ao clicar no campo de contato: ${error.message}`);
                    throw error;
                }
            });

            await driver.sleep(1000);
            await ctx.parameter("Status", "200");
        } catch (error) {
            console.error("Erro detalhado:", error.message);
            await ctx.parameter("Status", "400");
            await assert.fail(`Erro ao atualizar endereço: ${error.message}`);
            await takeScreenshot(driver, "Erro ao atualizar endereço");
            throw error;
        }
    });
   
    await allure.step("Clicando no botão de atualizar", async (ctx) => {
        try {
            const botaoAtualizar = await driver.findElement(By.xpath("//button[contains(., 'Atualizar')]"));
   
            await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", botaoAtualizar);
   
            await botaoAtualizar.click();
   
            await driver.wait(until.elementLocated(By.css('[role="alertdialog"] span#message-id')));
   
            const mensagem = await driver.findElement(By.css('[role="alertdialog"] span#message-id'));
            const textoMensagem = await mensagem.getText();
   
            if (textoMensagem === 'Empresa alterada com sucesso!') {
                console.log("Empresa alterada com sucesso");
                await ctx.parameter("Status", "200");
            } else {
                await ctx.parameter("Status", "400");
                await assert.fail('Alerta de sucesso não encontrado');
                throw new Error(`Texto do alerta não encontrado. Esperado: "Empresa alterada com sucesso!", mas encontrado: ${textoMensagem}`);
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

export { updateCompanyEmail };
