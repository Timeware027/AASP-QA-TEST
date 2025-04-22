await allure.step("Tentando salvar contrato sem dados", async () => {
    try {
        await driver.sleep(2000);
        
        const saveButton = await driver.findElement(By.xpath("//span[normalize-space(.)='Salvar']/parent::button"));
        await driver.wait(until.elementIsVisible(saveButton), 10000);
        await saveButton.click();

        // Verificar mensagem de erro
        await driver.wait(until.elementLocated(By.css('span#message-id')), 2000);
        const mensagem = await driver.findElement(By.css('span#message-id'));
        const textoMensagem = await mensagem.getText();

        if (textoMensagem === "Incluído com sucesso") {
            allure.parameter("Status", "400");
            await assert.fail('O contrato foi criado quando deveria ter falhado!');
        } else {
            allure.parameter("Status", "200");
            console.log('Erro esperado recebido:', textoMensagem);
        }
        
        await driver.sleep(2000);

    } catch (error) {
        allure.parameter("Status", "400");
        console.error("Erro inesperado:", error.message);
        await takeScreenshot(driver, "Erro inesperado ao testar validação");
        throw error;
    }
}); 