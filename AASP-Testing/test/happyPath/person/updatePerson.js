import { By, Key, until } from 'selenium-webdriver';
import * as allure from "allure-js-commons";
import assert from 'assert';

async function updatePerson(driver) {
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
   
           await allure.step("Clicando no botão alterar", async (ctx) => {
                   try {
                   await allure.step("Preenchendo o campo 'Nome'", async (ctx) => {
                       try {
                           await driver.sleep(3000);
                           await driver.actions().sendKeys(Key.TAB).sendKeys(Key.TAB).sendKeys(Key.TAB).sendKeys(Key.TAB).sendKeys(Key.TAB)
                           .sendKeys(Key.TAB).sendKeys(Key.TAB).sendKeys(Key.TAB).sendKeys(Key.ENTER).perform();
                           await driver.actions().sendKeys('Vinícius Nascimento Borges Alterado').perform();
                           await ctx.parameter("Status", "200");
                       } catch (error) {
                           await ctx.parameter("Status", "400");
                           console.error("Erro ao preencher o campo 'Nome':", error.message);
                           await assert.fail('Erro ao preecher o campo Nome');
                           await takeScreenshot(driver, "Erro ao preencher o campo 'Nome'");
                           throw error;
                       }
                   });

                   await allure.step("Preenchendo o campo 'E-mail'", async (ctx) => {
                    try {
                        await driver.sleep(3000);
                        await driver.actions().sendKeys(Key.TAB, Key.TAB, Key.TAB, Key.TAB, Key.TAB, Key.TAB,
                            Key.TAB, Key.TAB, Key.TAB, Key.TAB, Key.TAB, Key.TAB, Key.TAB, Key.TAB, Key.TAB, Key.TAB,
                            Key.TAB
                        ).perform();

                        await driver.actions().sendKeys(Key.ENTER).perform();

                        const campoNome = await driver.findElement(By.xpath("//input[@value='01012-905']"));
                        await driver.wait(until.elementIsVisible(campoNome), 5000);
                        await campoNome.click();

                        await driver.actions().sendKeys(Key.TAB, Key.TAB, Key.TAB, Key.TAB, Key.TAB).perform();
                        await driver.actions().sendKeys("42", Key.ENTER, Key.TAB, Key.TAB, Key.TAB, Key.ENTER).perform();
                        await ctx.parameter("Status", "200");
                    } catch (error) {
                        await ctx.parameter("Status", "400");
                        console.error("Erro ao preencher o campo 'Nome':", error.message);
                        await assert.fail('Erro ao preecher o campo Nome');
                        await takeScreenshot(driver, "Erro ao preencher o campo 'Nome'");
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
   
                           if (textoMensagem === 'Pessoa alterada com sucesso!') {
                               console.log("Pessoa alterada com sucesso");
                               await ctx.parameter("Status", "200");
                           } else {
                               throw new Error(`Texto do alerta não encontrado. Esperado: "Pessoa alterada com sucesso!", mas encontrado: ${textoMensagem}`);
                           }
                   
                       } catch (error) {
                           await ctx.parameter("Status", "400");
                           console.error("Erro ao clicar no botão de atualizar:", error.message);
                           await assert.fail('Alerta de sucesso não econtrado');
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

export { updatePerson };
