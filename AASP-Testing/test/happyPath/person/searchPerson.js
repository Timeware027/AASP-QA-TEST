import { By, until, Key } from 'selenium-webdriver';
import * as allure from "allure-js-commons";
import fs from 'fs';
import assert from 'assert';

async function searchPerson(driver, search) {
    try {
        await allure.step("Acessando Página de Registro", async (ctx) => {
            try {
                await driver.get('https://aaspgerenciador.aasp.org.br/pessoas-empresas');
                await ctx.parameter("Status", "200");
            } catch (error) {
                await assert.fail('Erro ao acessar página de gerenciamento');
                await ctx.parameter("Status", "400");
                await assert.fail('Página não carregada');
            }
        });

        await allure.step("Fechando popup de introdução", async (ctx) => {
            try {
                const closeButton = await driver.wait(
                    until.elementLocated(By.css(".reactour__helper button.sc-bxivhb")), 
                    5000
                );
                await driver.wait(until.elementIsVisible(closeButton), 5000);
                await closeButton.click();
                await ctx.parameter("Popup", "Fechado");
            } catch (error) {
                await ctx.parameter("Popup", "Não encontrado ou erro ao fechar");
                
            }
        });

        await allure.step("Clicando no input de pesquisa", async (ctx) => {
            try {
                const searchBar = await driver.wait(
                    until.elementLocated(By.css("input[placeholder='Buscar pessoas ou empresas']")));
                await driver.wait(until.elementIsVisible(searchBar));
                await searchBar.click();
                await ctx.parameter("Status", "200");
            } catch (error) {
                await ctx.parameter("Status", "400");
                await assert.fail('Input não encontrado');
            }
        });

        await allure.step("Pesquisando pelo nome do usuário", async (ctx) => {
            try {
                await driver.actions().sendKeys(search).perform();
                console.log('Inserindo empresa de pesquisa')
                await ctx.parameter("Status", "200");
            } catch (error) {
                await ctx.parameter("Status", "400");
                throw error;
            }
        });

        await allure.step("Clicando em pesquisar", async (ctx) => {
            try {
                await driver.sleep(2000);
                await driver.actions().sendKeys(Key.TAB).sendKeys(Key.TAB).sendKeys(Key.ENTER).perform();
                await driver.sleep(3000);
                await ctx.parameter("Status", "200");
            } catch (error) {
                await ctx.parameter("Status", "400");
                await assert.fail('Botão de pesquisa não econtrado');
            }
        });

        await allure.step("Rolando a página para visualizar resultados", async (ctx) => {
            try {
                await driver.executeScript("window.scrollBy(0, 800)");
                await driver.sleep(1000);
                await ctx.parameter("Status", "200");
            } catch (error) {
                await ctx.parameter("Status", "400");
                await assert.fail('Rolagem falhou');
            }
        });

        await driver.sleep(5000);

        await allure.step("Verificando resultados e tirando print", async (ctx) => {
            try {
                const results = await driver.findElements(By.css("td.jss592.jss594.jss600"));
                
                if (results.length = 3) {
                    console.log("Resultados encontrados, tirando screenshot...");
                    
                    const screenshot = await driver.takeScreenshot();
                    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                    const screenshotPath = `screenshots/resultado-pesquisa-${timestamp}.png`;
                    
                    if (!fs.existsSync('screenshots')) {
                        fs.mkdirSync('screenshots');
                    }
                    fs.writeFileSync(screenshotPath, screenshot, 'base64');
                    
                    await allure.attachment("Resultado da Pesquisa", Buffer.from(screenshot, 'base64'), 'image/png');
                    
                    await ctx.parameter("Resultados", `Encontrados: ${results.length} Empresas`);
                    await ctx.parameter("Screenshot", screenshotPath);
                } else {
                    console.log("Nenhum resultado encontrado com os seletores especificados.");
                    await assert.fail('Não encontrado os resultados');
                    await ctx.parameter("Resultados", "Não encontrados");
                }
            } catch (error) {
                await ctx.parameter("Erro na verificação", error.message);
                
                throw error;
            }
        });

    } catch (error) {
        console.error("Erro no processo de busca:", error);
    }
}

export { searchPerson };