import { By, Key, until } from 'selenium-webdriver';
import * as allure from "allure-js-commons";
import assert from 'assert';

async function updateCompany(driver) {
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

   
           await allure.step("Clicando no botão alterar", async (ctx) => {
                   try {
                   await allure.step("Preenchendo o campo 'Razão social'", async (ctx) => {
                       try {
                           await driver.sleep(10000);
                           await driver.actions().sendKeys(Key.TAB).sendKeys(Key.TAB).sendKeys(Key.ENTER).perform();
                           await driver.actions().sendKeys('Nova Tech Solutions Ltda').perform();
                           await ctx.parameter("Status", "200");
                       } catch (error) {
                           await ctx.parameter("Status", "400");
                           console.error("Erro ao preencher o campo 'Nome':", error.message);
                           await takeScreenshot(driver, "Erro ao preencher o campo 'Nome'");
                           await assert.fail('Erro ao preencher o campo Nome');
                           throw error;
                       }
                   });

                    await allure.step("Alterando campo telefone", async (ctx) => {
                        try {
                            await driver.sleep(500);
                            await driver.actions().sendKeys(Key.TAB, Key.TAB, Key.TAB, Key.TAB, Key.TAB,
                                Key.TAB, Key.TAB).sendKeys(Key.ENTER).perform();

                                await driver.sleep(2000);

                                const campoNome = await driver.findElement(By.css('.jss2500.jss2485.jss2271'));
                                
                                await driver.wait(until.elementIsVisible(campoNome), 5000);
                                
                                await campoNome.click();

                            await driver.actions().sendKeys(Key.TAB, "11991234567", Key.ENTER).perform();

                            await driver.actions().sendKeys(Key.TAB, Key.TAB, Key.TAB, Key.ENTER).perform();

                            await ctx.parameter("Status", "200");
                        } catch (error) {
                            await ctx.parameter("Status", "400");
                            console.error("Erro ao preencher o campo 'telefone':", error.message);
                            await takeScreenshot(driver, "Erro ao atualizar telefone");
                            await assert.fail('Erro ao atualizar telefone');
                            throw error;
                        }
                    })
   
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
                            await assert.fail('Alerta de sucesso não econtrado');
                            throw new Error(`Texto do alerta não encontrado. Esperado: "Pessoa alterada com sucesso!", mas encontrado: ${textoMensagem}`);
                           }
                   
                       } catch (error) {
                           await ctx.parameter("Status", "400");
                           await assert.fail('Erro ao clicar em atualizar');
                           console.error("Erro ao clicar no botão de atualizar:", error.message);
                           await takeScreenshot(driver, "Erro ao clicar no botão de atualizar");
                           throw error;
                       }
                   });
        } catch (error) {
            await ctx.parameter("Status", "400");
            console.error("Erro ao clicar em atualizar", error.message);
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

export { updateCompany };
