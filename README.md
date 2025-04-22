# AASP Testing - Documentação do Projeto

Este projeto contém testes automatizados para o sistema AASP utilizando Selenium WebDriver, Mocha e Allure para relatórios.

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

1. **Node.js** (versão 14 ou superior)
2. **NPM** (gerenciador de pacotes do Node.js)
3. **Chrome** ou **Firefox** (navegador para execução dos testes)
4. **ChromeDriver** ou **GeckoDriver** (driver do Selenium para o navegador escolhido)

### Instalação do ChromeDriver/GeckoDriver

#### Windows:
1. Baixe o ChromeDriver compatível com sua versão do Chrome em: https://chromedriver.chromium.org/downloads
2. Extraia o arquivo e adicione o caminho ao PATH do sistema

#### Linux/Mac:
```bash
# Para ChromeDriver
npm install -g chromedriver

# Para GeckoDriver
npm install -g geckodriver
```

## 🚀 Configuração do Projeto

1. Clone o repositório
2. Navegue até a pasta do projeto:
```bash
cd AASP-Testing
```

3. Instale as dependências:
```bash
npm install
```

4. Configure o navegador desejado:
```bash
# Para Chrome
npm run set:chrome

# Para Firefox
npm run set:firefox
```

## 📊 Geração de Relatórios

O projeto utiliza Allure para gerar relatórios detalhados dos testes. Para configurar:

1. Instale o Allure Command Line:
```bash
npm install -g allure-commandline
```

2. Para gerar o relatório:
```bash
npm run allure:report
```

3. Para visualizar o relatório:
```bash
npm run allure:open
```

## 🧪 Execução dos Testes

O projeto possui diferentes suites de testes que podem ser executadas individualmente ou em conjunto:

### Testes de Pessoa (Person)
- Executar todos os testes de pessoa:
```bash
npm run test:person
```
- Executar apenas casos felizes:
```bash
npm run test:person:happy
```
- Executar apenas casos de erro:
```bash
npm run test:person:sad
```

### Testes de Empresa (Company)
- Executar todos os testes de empresa:
```bash
npm run test:company
```
- Executar apenas casos felizes:
```bash
npm run test:company:happy
```
- Executar apenas casos de erro:
```bash
npm run test:company:sad
```

### Testes de Contratos (Contracts)
- Executar todos os testes de contratos:
```bash
npm run test:contracts
```
- Executar apenas casos felizes:
```bash
npm run test:contracts:happy
```
- Executar apenas casos de erro:
```bash
npm run test:contracts:sad
```

### Executar Todos os Testes
- Executar todos os testes (casos felizes e de erro):
```bash
npm run test:all
```
- Executar apenas todos os casos felizes:
```bash
npm run test:all:happy
```
- Executar apenas todos os casos de erro:
```bash
npm run test:all:sad
```

## 📝 Descrição dos Testes

### Testes de Pessoa (Person)
- **Casos Felizes (person.happy.test.js)**
  - Cadastro de nova pessoa
  - Edição de dados de pessoa
  - Consulta de pessoa
  - Listagem de pessoas

- **Casos de Erro (person.sad.test.js)**
  - Tentativa de cadastro com dados inválidos
  - Tentativa de edição com dados inválidos
  - Tentativa de consulta de pessoa inexistente

### Testes de Empresa (Company)
- **Casos Felizes (company.happy.test.js)**
  - Cadastro de nova empresa
  - Edição de dados da empresa
  - Consulta de empresa
  - Listagem de empresas

- **Casos de Erro (company.sad.test.js)**
  - Tentativa de cadastro com dados inválidos
  - Tentativa de edição com dados inválidos
  - Tentativa de consulta de empresa inexistente

### Testes de Contratos (Contracts)
- **Casos Felizes (contracts.happy.test.js)**
  - Criação de novo contrato
  - Edição de contrato
  - Consulta de contrato
  - Listagem de contratos
  - Assinatura de contrato

- **Casos de Erro (contracts.sad.test.js)**
  - Tentativa de criação com dados inválidos
  - Tentativa de edição com dados inválidos
  - Tentativa de consulta de contrato inexistente
  - Tentativa de assinatura com dados inválidos

## ⚠️ Observações Importantes

1. Os testes têm diferentes timeouts configurados:
   - Testes individuais: 30 segundos
   - Testes completos: 20 minutos

2. Certifique-se de que o navegador escolhido está atualizado e que o driver correspondente é compatível

3. Em caso de falha nos testes, screenshots são automaticamente capturados e salvos na pasta `screenshots/`

4. Os relatórios do Allure são gerados na pasta `allure-results/` e podem ser visualizados após a execução dos testes

## 🔧 Troubleshooting

Se encontrar problemas:

1. Limpe o cache do npm:
```bash
npm cache clean --force
```

2. Reinstale as dependências:
```bash
rm -rf node_modules
npm install
```

3. Verifique se o ChromeDriver/GeckoDriver está no PATH do sistema

4. Verifique os logs de erro no console durante a execução dos testes
