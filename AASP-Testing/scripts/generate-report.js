import fs from 'fs-extra';
import { execSync } from 'child_process';
import path from 'path';

const tempReportDir = 'temp-allure-report';
const customReportDir = 'allure-report';
const resultsDir = 'allure-results';
const historyDir = path.join(resultsDir, 'history');
const reportHistoryDir = path.join(customReportDir, 'history');

console.log('Preservando histórico para Trends...');
if (fs.existsSync(reportHistoryDir)) {
  fs.copySync(reportHistoryDir, historyDir, { overwrite: true });
  console.log('Histórico preservado!');
} else {
  console.log('Nenhum histórico anterior encontrado. Iniciando um novo histórico.');
}

console.log('Gerando relatório no diretório temporário...');
execSync(`allure generate ${resultsDir} --clean -o ${tempReportDir}`, { stdio: 'inherit' });

console.log('Copiando novos dados para o diretório do template...');
const dataFolders = [
  'data',
  'export',
  'plugins',
  'widgets',
  'history'
];

dataFolders.forEach((folder) => {
  const source = path.join(tempReportDir, folder);
  const destination = path.join(customReportDir, folder);

  if (fs.existsSync(source)) {
    fs.copySync(source, destination, { overwrite: true });
    console.log(`Pasta copiada: ${folder}`);
  }
});

console.log('Removendo diretório temporário...');
fs.removeSync(tempReportDir);

console.log(`Relatório atualizado com sucesso! Para visualizar, execute:\n\nallure open ${customReportDir}`);
