// config-temp.js - COM NOME CORRETO DA ABA

const GOOGLE_SHEETS_CONFIG = {
    SPREADSHEET_ID: "1c9V-fkDdgHMVoq4FYgoP-3QU17ZIV23eBXIeH5PVQyk",
    SHEET_NAME: "Folha1", // ✅ NOME CORRETO DA ABA
    DATA_RANGE: "A:Z",
    COLUMNS: {
        NOME: "A",
        NUMERO: "B",  
        EMAIL: "C",
        USUARIO: "D",
        SENHA: "E",
        URL: "F",
        LINK_PAGAMENTO: "G",
        VENCIMENTO: "H",
        VALOR: "I",
        TELAS: "J",
        HORA_PAGAMENTO: "K",
        REMIDE_DATE: "L",
        ESPIROU_5_DIAS: "M"
    }
};

const API_CONFIG = {
    BASE_URL: "https://sheets.googleapis.com/v4/spreadsheets",
    API_KEY: "AIzaSyCVmsyFSko9HCC_b2nZy8Xku1tDZu4nvwI" // ← Sua nova API Key aqui
};

console.log("✅ Configuração do Google Sheets carregada!");