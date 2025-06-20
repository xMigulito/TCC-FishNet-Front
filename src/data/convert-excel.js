const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Função para converter Excel para JSON
function convertExcelToJson(excelFile, outputFile) {
  try {
    // Lê o arquivo Excel
    const workbook = XLSX.readFile(excelFile);
    
    // Pega a primeira planilha
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    // Converte para JSON
    const jsonData = XLSX.utils.sheet_to_json(sheet);
    
    // Salva o arquivo JSON
    fs.writeFileSync(
      outputFile,
      JSON.stringify(jsonData, null, 2),
      'utf8'
    );
    
    console.log(`Arquivo convertido com sucesso: ${outputFile}`);
    return jsonData;
  } catch (error) {
    console.error('Erro ao converter arquivo:', error);
    return null;
  }
}

// Exemplo de uso
const excelFile = path.join(__dirname, 'dados.xlsx');
const outputFile = path.join(__dirname, 'dados.json');

convertExcelToJson(excelFile, outputFile); 