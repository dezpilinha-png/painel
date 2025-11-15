// google-sheets.js - CONEXÃO REAL COM GOOGLE SHEETS API

const sheetsIntegration = {
    isInitialized: false,
    config: null,
    allClients: [],
    
    initialize: function() {
        console.log("🔄 Inicializando integração com Google Sheets...");
        
        // ✅ CARREGAR CONFIGURAÇÃO
        if (typeof GOOGLE_SHEETS_CONFIG !== 'undefined' && typeof API_CONFIG !== 'undefined') {
            this.config = GOOGLE_SHEETS_CONFIG;
            console.log("✅ Configuração carregada - Planilha ID:", this.config.SPREADSHEET_ID);
            console.log("🔑 API Key:", API_CONFIG.API_KEY ? "Configurada" : "Não configurada");
        } else {
            console.error("❌ Configuração não encontrada! Verifique config-temp.js");
            this.showConfigError();
            return false;
        }
        
        // ✅ CARREGAR DADOS REAIS DA PLANILHA
        this.loadRealSheetData();
        
        this.isInitialized = true;
        return true;
    },
    
    loadRealSheetData: function() {
        console.log("📥 Carregando dados REAIS da planilha...");
        
        // ✅ CONEXÃO REAL COM GOOGLE SHEETS API
        const url = `${API_CONFIG.BASE_URL}/${this.config.SPREADSHEET_ID}/values/${this.config.SHEET_NAME}!${this.config.DATA_RANGE}?key=${API_CONFIG.API_KEY}`;
        
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("✅ Dados recebidos da API:", data);
                this.processSheetData(data.values);
            })
            .catch(error => {
                console.error("❌ Erro ao carregar dados da planilha:", error);
                this.showApiError(error);
            });
    },
    
    processSheetData: function(rows) {
        if (!rows || rows.length === 0) {
            console.error("❌ Planilha vazia ou sem dados");
            this.allClients = [];
            return;
        }
        
        // ✅ EXTRAIR CABEÇALHOS (primeira linha)
        const headers = rows[0];
        console.log("📋 Cabeçalhos encontrados:", headers);
        
        // ✅ PROCESSAR LINHAS DE DADOS
        this.allClients = rows.slice(1).map((row, index) => {
            const client = {};
            
            // Mapear cada coluna conforme configuração
            headers.forEach((header, colIndex) => {
                const value = row[colIndex] || '';
                
                // Mapear para os nomes de campos que o sistema espera
                switch(header.toLowerCase()) {
                    case 'nome': client.nome = value; break;
                    case 'numero': client.numero = value; break;
                    case 'email': client.email = value; break;
                    case 'usuario': client.usuario = value; break;
                    case 'senha': client.senha = value; break;
                    case 'url': client.url = value; break;
                    case 'link_de_pagamento': client.link_de_pagamento = value; break;
                    case 'vencimento': client.vencimento = value; break;
                    case 'valor': client.valor = value; break;
                    case 'telas': client.telas = value; break;
                    case 'hora do pagamento': client.hora_do_pagamento = value; break;
                    case 'remide_date': client.remide_date = value; break;
                    case 'espirou 5 dias': client.espirou_5_dias = value; break;
                    default: client[header] = value;
                }
            });
            
            return client;
        }).filter(client => client.email && client.email.trim() !== ''); // Filtrar por email
            
        console.log(`✅ ${this.allClients.length} clientes carregados da planilha real`);
        console.log("👥 Amostra de clientes:", this.allClients.slice(0, 2));
    },

    // ✅ MÉTODO ORIGINAL (para compatibilidade)
    findClient: function(usuario, senha, urlServidor) {
        console.log("🔍 Buscando cliente:", { usuario, urlServidor });
        
        return new Promise((resolve, reject) => {
            try {
                const usuarioClean = usuario.toString().toLowerCase().trim();
                const senhaClean = senha.toString().trim();
                const urlClean = urlServidor.toString().toLowerCase().trim();
                
                const clienteEncontrado = this.allClients.find(cliente => {
                    const clienteUsuario = cliente.usuario ? cliente.usuario.toString().toLowerCase().trim() : '';
                    const clienteSenha = cliente.senha ? cliente.senha.toString().trim() : '';
                    const clienteUrl = cliente.url ? cliente.url.toString().toLowerCase().trim() : '';
                    
                    return clienteUsuario === usuarioClean && 
                           clienteSenha === senhaClean && 
                           clienteUrl === urlClean;
                });
                
                if (clienteEncontrado) {
                    console.log("✅ Cliente encontrado:", clienteEncontrado.nome || clienteEncontrado.usuario);
                    resolve(clienteEncontrado);
                } else {
                    console.log("❌ Cliente não encontrado");
                    resolve(null);
                }
            } catch (error) {
                console.error("❌ Erro ao buscar cliente:", error);
                reject(error);
            }
        });
    },

    // ✅ MÉTODO NOVO - BUSCAR APENAS POR EMAIL
    findClientByEmail: function(email) {
        console.log("🔍 Buscando cliente por email:", email);
        
        return new Promise((resolve, reject) => {
            try {
                const emailClean = email.toString().toLowerCase().trim();
                
                const clienteEncontrado = this.allClients.find(cliente => {
                    const clienteEmail = cliente.email ? cliente.email.toString().toLowerCase().trim() : '';
                    return clienteEmail === emailClean;
                });
                
                if (clienteEncontrado) {
                    console.log("✅ Cliente encontrado por email:", clienteEncontrado.nome || clienteEncontrado.email);
                    resolve(clienteEncontrado);
                } else {
                    console.log("❌ Nenhum cliente encontrado com este email");
                    resolve(null);
                }
            } catch (error) {
                console.error("❌ Erro ao buscar por email:", error);
                reject(error);
            }
        });
    },
    
    showConfigError: function() {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background: #ff4444;
            color: white;
            padding: 15px;
            text-align: center;
            z-index: 10000;
            font-weight: bold;
        `;
        errorDiv.innerHTML = '❌ ERRO: Arquivo config-temp.js não encontrado ou não configurado.';
        document.body.appendChild(errorDiv);
    },
    
    showApiError: function(error) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50px;
            left: 0;
            width: 100%;
            background: #ff9800;
            color: white;
            padding: 15px;
            text-align: center;
            z-index: 10000;
            font-weight: bold;
        `;
        errorDiv.innerHTML = `❌ ERRO API: ${error.message}. Verifique console (F12) para detalhes.`;
        document.body.appendChild(errorDiv);
    },
    
    getData: function() {
        return Promise.resolve(this.allClients);
    }
};

// Inicialização automática
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 DOM Carregado - Inicializando Sheets Integration REAL");
    sheetsIntegration.initialize();
});

function initializeSheetsIntegration() {
    return sheetsIntegration.initialize();
}

console.log("📄 google-sheets.js (CONEXÃO REAL) carregado com sucesso!");