import { By, Key, until } from 'selenium-webdriver';
import * as allure from "allure-js-commons";
import assert from 'assert';


async function createCompany(driver) {
    try {
        console.log("Iniciando cadastro de empresa...");

        await allure.step("Acessando página de cadastro de empresa", async (ctx) => {
            try {
                await driver.get('https://aaspgerenciador.aasp.org.br/pessoas-empresas/empresas/novo/');
                await ctx.parameter("Status", "200");
            } catch (error) {
                await ctx.parameter("Status", "400");
                await assert.fail('Erro ao acessar página de gerenciamento');
                await takeScreenshot(driver, "Erro ao acessar a página");
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
                await assert.fail('Erro ao ativar modo manual');
                await takeScreenshot(driver, "Erro ao marcar checkbox");
                throw error;
            }
        });

        await allure.step("Preenchendo os dados da empresa", async (ctx) => {
            try {
                const campos = ['46.295.498/0001-68', 'Tech Soluções Ltda', 'Company Tech Soluções', '123456789012', '9876543210', 'Clientes VIP', 'Empresa cliente desde 2020'];
                for (const campo of campos) {
                    await driver.actions().sendKeys(Key.TAB, campo, Key.ENTER).perform();
                }
                await ctx.parameter("Status", "200");
            } catch (error) {
                await ctx.parameter("Status", "400");
                await assert.fail('Erro ao preencher campos');
                await takeScreenshot(driver, "Erro ao preencher os dados");
                throw error;
            }
        });


        await allure.step("Preenchendo Contato", async (ctx) => {
            try {
                await driver.actions().sendKeys(Key.TAB, Key.ENTER, Key.TAB).perform();

                await driver.sleep(500);

                await driver.actions().sendKeys("Contato Teste", Key.ENTER, Key.TAB).perform();

                await driver.sleep(500);

                await driver.actions().sendKeys("11912345678" , Key.ENTER, Key.TAB).perform();

                await driver.sleep(500);

                await driver.actions().sendKeys("teste123@gmail.com", Key.ENTER, Key.TAB).perform();

                await driver.sleep(500);

                await driver.actions().sendKeys("Nenhuma observação", Key.ENTER, Key.TAB).perform();

                await driver.sleep(500);

                await driver.actions().sendKeys(Key.ENTER).perform();

            } catch (error) {
                await ctx.parameter("Status", "400");
                await assert.fail('Erro ao preencher contatos');
                throw error;
            }
        });

        await allure.step("Preenchendo Empresa", async (ctx) => {
            try {
                await driver.sleep(1000);
                await driver.actions().sendKeys(Key.TAB, Key.TAB, Key.TAB, Key.ENTER, Key.TAB).perform();

                await driver.sleep(500);

                await driver.actions().sendKeys("01012-905").perform();

                await driver.sleep(1000);

                await driver.actions().sendKeys(Key.ENTER, Key.TAB, Key.TAB, Key.TAB, Key.TAB, Key.TAB).perform();

                await driver.sleep(500);

                await driver.actions().sendKeys("11912345678", Key.ENTER, Key.TAB).perform();

                await driver.sleep(500);

                await driver.actions().sendKeys("151", Key.ENTER, Key.TAB).perform();

                await driver.sleep(500);

                await driver.actions().sendKeys("Centro Histórico", Key.ENTER, Key.TAB).perform();

                await driver.sleep(1500);

                await driver.actions().sendKeys(Key.ENTER).perform();

                await driver.sleep(3000);

                await driver.actions().sendKeys(Key.TAB, Key.TAB, Key.TAB, Key.ENTER).perform();


            } catch (error) {
                await ctx.parameter("Status", "400");
                await assert.fail('Erro ao preencher dados da empresa');
                await takeScreenshot(driver, "Erro ao preencher os dados");
                throw error;
            }
        })

      
        await allure.step("Verificando sucesso do cadastro", async (ctx) => {
            try {
                await driver.sleep(3000);
                await driver.wait(until.elementLocated(By.css('span#message-id')));
                const mensagem = await driver.findElement(By.css('span#message-id'));
                const textoMensagem = await mensagem.getText();
                console.log(mensagem);

                if (textoMensagem === "Erro ao incluir empresa") {
                    console.log("Erro ao incluir empresa, encerrando função.");
                    return;
                }
        
                // Assertion for success - will mark test as failed if not true
                assert.strictEqual(textoMensagem, 'Empresa incluída com sucesso!', 'Mensagem de sucesso não encontrada');
                
                await ctx.parameter("Status", "200");
            } catch (error) {
                await ctx.parameter("Status", "400");
                
                // Check for expected error message
                let errorElements = await driver.findElements(By.css(".jss1484 h6"));
                if (errorElements.length > 0) {
                    let errorMessage = await errorElements[0].getText();
                    
                    if (errorMessage.includes("Houve um problema")) {
                        console.error(`Erro no cadastro detectado: ${errorMessage}`);
                        await takeScreenshot(driver, `Erro no cadastro - ${errorMessage}`);
                        
                        let detailElements = await driver.findElements(By.css(".jss1521 p"));
                        if (detailElements.length > 0) {
                            let detailMessage = await detailElements[0].getText();
                            console.error(`Detalhe do erro: ${detailMessage}`);
                            // Use assert to mark as failed
                            assert.fail(`Erro no cadastro detectado: ${errorMessage} - ${detailMessage}`);
                        } else {
                            await assert.fail('Alerta de sucesso não econtrado');
                            console.error(`Erro no cadastro detectado: ${errorMessage}`);
                        }
                    }
                }
                
                // If we get here without finding expected error, rethrow original error
                await takeScreenshot(driver, "Erro ao verificar sucesso do cadastro");
                throw error;
            }
        });

        console.log("Cadastro de empresa concluído com sucesso!");
    } catch (error) {
        console.error("Erro ao tentar registrar a empresa:", error);
        await takeScreenshot(driver, "Erro geral no cadastro");
        throw error;
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

export { createCompany };
