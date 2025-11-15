// Gerenciador de Pagamentos - TopCine Brasil (Versão Simplificada - Apenas Email)
class PaymentHandler {
    constructor() {
        this.currentClient = null;
        this.init();
    }

    init() {
        this.modifyLoginForm();
        this.initializeSheets();
    }

    initializeSheets() {
        // Aguardar a configuração ser validada
        setTimeout(() => {
            if (typeof sheetsIntegration !== 'undefined' && sheetsIntegration) {
                console.log("✅ sheetsIntegration carregado com sucesso");
                if (typeof initializeSheetsIntegration === 'function') {
                    initializeSheetsIntegration();
                }
            } else {
                console.error("❌ sheetsIntegration não está disponível");
                this.showMessage('Sistema de integração não carregado. Recarregue a página.', 'error');
            }
        }, 1000);
    }

    modifyLoginForm() {
        document.addEventListener('DOMContentLoaded', () => {
            const loginForm = document.querySelector('.login-form');
            if (loginForm) {
                loginForm.addEventListener('submit', this.handleLogin.bind(this));
            }
        });
    }

    async handleLogin(event) {
        event.preventDefault();
        
        const inputs = event.target.querySelectorAll('input');
        const email = inputs[0]?.value || '';

        // Validação básica
        if (!email) {
            this.showMessage('Por favor, digite seu email', 'error');
            return;
        }

        // Verificar se a integração está configurada
        if (typeof sheetsIntegration === 'undefined' || !sheetsIntegration) {
            this.showMessage('Sistema não configurado. Verifique o arquivo google-sheets.js e recarregue a página.', 'error');
            return;
        }

        this.showLoading();

        try {
            console.log('🔐 Buscando cliente por email:', { email });
            
            // Buscar cliente apenas pelo email
            const client = await sheetsIntegration.findClientByEmail(email);
            
            if (client) {
                this.currentClient = client;
                this.handleClientFound(client);
            } else {
                this.handleClientNotFound();
            }
        } catch (error) {
            console.error('❌ Erro na busca:', error);
            this.showMessage('Erro ao verificar dados: ' + error.message, 'error');
        } finally {
            this.hideLoading();
        }
    }

    handleClientFound(client) {
        console.log('✅ Cliente encontrado:', client.nome || client.email);
        
        if (client.link_de_pagamento && client.link_de_pagamento.startsWith('http')) {
            this.showClientDetails(client);
        } else {
            this.showMessage('Cliente encontrado, mas link de pagamento inválido', 'warning');
            this.showClientDetails(client);
        }
    }

    handleClientNotFound() {
        this.showMessage(
            'Cliente não encontrado. Verifique:<br>• Email digitado corretamente<br>• Se o email está cadastrado em nossa base',
            'error'
        );
    }

    // ✅ MÉTODO CORRIGIDO - CONSULTAR OUTRO CLIENTE
    consultAnotherClient() {
        console.log("🔄 Consultando outro cliente...");
        
        // Fechar modal atual
        this.closeCurrentModal();
        
        // Limpar dados do cliente atual
        this.currentClient = null;
        
        // Mostrar formulário de login novamente
        setTimeout(() => {
            this.showLoginForm();
        }, 300);
    }

    // ✅ MÉTODO PARA FECHAR MODAL ATUAL
    closeCurrentModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // ✅ MÉTODO CORRIGIDO - MOSTRAR FORMULÁRIO DE LOGIN
    showLoginForm() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            // Restaurar o formulário original
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2><i class="fas fa-user-shield"></i> Área do Cliente</h2>
                        <button class="close-btn" onclick="closeLogin()">&times;</button>
                    </div>
                    <form class="login-form" style="padding: 2rem;">
                        <div class="input-group">
                            <i class="fas fa-envelope"></i>
                            <input type="email" placeholder="Digite seu email cadastrado" required>
                        </div>
                        <button type="submit" class="login-btn">
                            <i class="fas fa-search"></i>
                            Consultar Minha Conta
                        </button>
                        
                        <div class="info-box">
                            <p>
                                <i class="fas fa-info-circle"></i>
                                Digite o email utilizado no cadastro
                            </p>
                        </div>
                    </form>
                </div>
            `;
            
            // Reaplicar o event listener ao formulário
            const newForm = modal.querySelector('.login-form');
            if (newForm) {
                newForm.addEventListener('submit', this.handleLogin.bind(this));
            }
            
            // Mostrar o modal
            modal.style.display = 'block';
            
            // Focar no campo de email
            const emailInput = modal.querySelector('input[type="email"]');
            if (emailInput) {
                emailInput.focus();
            }
        }
    }

    // MOSTRAR DETALHES COMPLETOS DO CLIENTE
    showClientDetails(client) {
        const modal = document.getElementById('loginModal');
        if (!modal) return;

        // Formatar dados para exibição - DATA CORRIGIDA
        const vencimento = client.vencimento ? this.formatDateCorrect(client.vencimento) : 'Não informado';
        const valor = client.valor ? `R$ ${client.valor}` : 'Não informado';
        const status = this.getStatus(client);
        const telas = client.telas || 'Não informado';
        const email = client.email || 'Não informado';
        const numero = client.numero || 'Não informado';
        const usuario = client.usuario || 'Não informado';

        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-user-circle"></i> Dados do Cliente</h2>
                    <button class="close-btn" onclick="closeLogin()">&times;</button>
                </div>
                <div style="padding: 2rem; max-height: 70vh; overflow-y: auto;">
                    <!-- Cabeçalho com Status -->
                    <div style="text-align: center; margin-bottom: 2rem;">
                        <div style="width: 80px; height: 80px; background: ${status.color}; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 2rem;">
                            <i class="fas ${status.icon}"></i>
                        </div>
                        <h3 style="color: white; margin-bottom: 0.5rem; font-size: 1.5rem;">${client.nome || 'Cliente'}</h3>
                        <p style="color: #a0aec0;">
                            <span style="background: ${status.color}; padding: 6px 16px; border-radius: 20px; font-size: 0.9rem; font-weight: 600; color: white;">
                                ${status.text}
                            </span>
                        </p>
                    </div>
                    
                    <!-- Informações Pessoais -->
                    <div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; border: 1px solid #2d3748;">
                        <h4 style="color: white; margin-bottom: 1rem; display: flex; align-items: center; gap: 10px;">
                            <i class="fas fa-id-card"></i>
                            Informações Pessoais
                        </h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div>
                                <p style="color: #a0aec0; margin-bottom: 0.5rem; font-size: 0.9rem;">Nome</p>
                                <p style="color: white; font-weight: 600;">${client.nome || 'Não informado'}</p>
                            </div>
                            <div>
                                <p style="color: #a0aec0; margin-bottom: 0.5rem; font-size: 0.9rem;">Email</p>
                                <p style="color: white; font-weight: 600;">${email}</p>
                            </div>
                            <div>
                                <p style="color: #a0aec0; margin-bottom: 0.5rem; font-size: 0.9rem;">Telefone</p>
                                <p style="color: white; font-weight: 600;">${numero}</p>
                            </div>
                            <div>
                                <p style="color: #a0aec0; margin-bottom: 0.5rem; font-size: 0.9rem;">Usuário</p>
                                <p style="color: white; font-weight: 600;">${usuario}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Informações da Assinatura -->
                    <div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; border: 1px solid #2d3748;">
                        <h4 style="color: white; margin-bottom: 1rem; display: flex; align-items: center; gap: 10px;">
                            <i class="fas fa-crown"></i>
                            Assinatura
                        </h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div>
                                <p style="color: #a0aec0; margin-bottom: 0.5rem; font-size: 0.9rem;">Vencimento</p>
                                <p style="color: white; font-weight: 600;">${vencimento}</p>
                            </div>
                            <div>
                                <p style="color: #a0aec0; margin-bottom: 0.5rem; font-size: 0.9rem;">Valor</p>
                                <p style="color: white; font-weight: 600;">${valor}</p>
                            </div>
                            <div>
                                <p style="color: #a0aec0; margin-bottom: 0.5rem; font-size: 0.9rem;">Telas</p>
                                <p style="color: white; font-weight: 600;">${telas}</p>
                            </div>
                            <div>
                                <p style="color: #a0aec0; margin-bottom: 0.5rem; font-size: 0.9rem;">Status</p>
                                <p style="color: ${status.color}; font-weight: 600;">${status.text}</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Link de Pagamento -->
                    ${client.link_de_pagamento ? `
                    <div style="background: rgba(255,107,0,0.1); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; border: 2px solid #ff6b00;">
                        <h4 style="color: white; margin-bottom: 1rem; display: flex; align-items: center; gap: 10px;">
                            <i class="fas fa-credit-card"></i>
                            Pagamento
                        </h4>
                        <p style="color: #a0aec0; margin-bottom: 1rem;">Clique abaixo para acessar sua página de pagamento:</p>
                        
                        <button onclick="paymentHandler.openPaymentLink('${client.link_de_pagamento}')" 
                                style="width: 100%; padding: 16px; background: linear-gradient(135deg, #ff6b00 0%, #ff8c00 100%); color: white; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; margin-bottom: 1rem; font-size: 1.1rem; box-shadow: 0 4px 15px rgba(255,107,0,0.4);">
                            <i class="fas fa-external-link-alt"></i>
                            ABRIR PÁGINA DE PAGAMENTO
                        </button>
                        
                        <!-- Link copiável -->
                        <div style="background: rgba(255,107,0,0.05); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,107,0,0.3); margin-bottom: 1rem;">
                            <p style="color: #a0aec0; font-size: 0.8rem; margin-bottom: 5px; font-weight: 600;">LINK DE PAGAMENTO:</p>
                            <p style="color: white; font-size: 0.8rem; word-break: break-all; font-family: monospace;">${client.link_de_pagamento}</p>
                        </div>
                        
                        <p style="color: #a0aec0; font-size: 0.8rem; text-align: center;">
                            <i class="fas fa-info-circle"></i>
                            O link abrirá em uma nova aba
                        </p>
                    </div>
                    ` : `
                    <div style="background: rgba(239,68,68,0.1); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; text-align: center; border: 1px solid rgba(239,68,68,0.3);">
                        <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem; color: #ef4444;"></i>
                        <h4 style="color: white; margin-bottom: 0.5rem;">Link de Pagamento Indisponível</h4>
                        <p style="color: #a0aec0;">Entre em contato com o suporte para regularizar sua assinatura.</p>
                    </div>
                    `}
                    
                    <!-- Ações CORRIGIDAS -->
                    <div class="action-buttons">
                        <button onclick="closeLogin()" class="action-btn btn-close">
                            <i class="fas fa-times"></i>
                            Fechar
                        </button>
                        
                        <!-- ✅ BOTÃO CONSULTAR OUTRO CLIENTE CORRIGIDO -->
                        <button onclick="paymentHandler.consultAnotherClient()" class="action-btn btn-new-search">
                            <i class="fas fa-search"></i>
                            Consultar Outro Cliente
                        </button>
                        
                        ${client.link_de_pagamento ? `
                        <button onclick="paymentHandler.copyPaymentLink('${client.link_de_pagamento}')" class="action-btn btn-copy">
                            <i class="fas fa-copy"></i>
                            Copiar Link
                        </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
        
        // Garantir que o modal está visível
        modal.style.display = 'block';
    }

    // Determinar status do cliente
    getStatus(client) {
        // Verificar se expirou
        if (client.espirou_5_dias && client.espirou_5_dias.toString().toLowerCase().includes('sim')) {
            return { text: 'EXPIRADO', color: '#ef4444', icon: 'fa-exclamation-triangle' };
        }
        
        // Verificar vencimento
        if (client.vencimento) {
            try {
                const vencimento = this.parseDate(client.vencimento);
                const hoje = new Date();
                
                if (vencimento && vencimento < hoje) {
                    return { text: 'VENCIDO', color: '#f59e0b', icon: 'fa-clock' };
                }
            } catch (e) {
                console.warn('Erro ao verificar vencimento:', e);
            }
        }
        
        return { text: 'ATIVO', color: '#10b981', icon: 'fa-check' };
    }

    // ✅ MÉTODO NOVO - FORMATAR DATA CORRETAMENTE (DIA/MÊS/ANO)
    formatDateCorrect(dateString) {
        if (!dateString) return 'Não informado';
        
        try {
            // Tentar formato brasileiro (DD/MM/AAAA)
            if (dateString.includes('/')) {
                const partes = dateString.split('/');
                if (partes.length === 3) {
                    const dia = partes[0].padStart(2, '0');
                    const mes = partes[1].padStart(2, '0');
                    const ano = partes[2];
                    
                    // Verificar se é uma data válida
                    const data = new Date(`${ano}-${mes}-${dia}`);
                    if (!isNaN(data.getTime())) {
                        return `${dia}/${mes}/${ano}`;
                    }
                }
            }
            
            // Tentar formato ISO (AAAA-MM-DD)
            const dataISO = new Date(dateString);
            if (!isNaN(dataISO.getTime())) {
                const dia = dataISO.getDate().toString().padStart(2, '0');
                const mes = (dataISO.getMonth() + 1).toString().padStart(2, '0');
                const ano = dataISO.getFullYear();
                return `${dia}/${mes}/${ano}`;
            }
            
            // Retornar original se não conseguir formatar
            return dateString;
        } catch {
            return dateString;
        }
    }

    // ✅ MÉTODO PARA CONVERTER DATA PARA COMPARAÇÃO
    parseDate(dateString) {
        if (!dateString) return null;
        
        try {
            // Formato brasileiro (DD/MM/AAAA)
            if (dateString.includes('/')) {
                const partes = dateString.split('/');
                if (partes.length === 3) {
                    return new Date(partes[2], partes[1] - 1, partes[0]);
                }
            }
            
            // Formato ISO (AAAA-MM-DD)
            return new Date(dateString);
        } catch {
            return null;
        }
    }

    // ❌ MÉTODO ANTIGO (mantido para compatibilidade)
    formatDate(dateString) {
        return this.formatDateCorrect(dateString);
    }

    openPaymentLink(link) {
        if (link && link.startsWith('http')) {
            window.open(link, '_blank');
            this.showMessage('🔗 Abrindo página de pagamento...', 'success');
        } else {
            this.showMessage('❌ Link de pagamento inválido', 'error');
        }
    }

    copyPaymentLink(link) {
        navigator.clipboard.writeText(link).then(() => {
            this.showMessage('✅ Link copiado para a área de transferência!', 'success');
        }).catch(() => {
            this.showMessage('❌ Erro ao copiar link', 'error');
        });
    }

    showLoading() {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loading-spinner';
        loadingDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(5, 10, 24, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(5px);
        `;
        loadingDiv.innerHTML = `
            <div style="background: rgba(255,255,255,0.1); padding: 3rem; border-radius: 16px; text-align: center; border: 1px solid #2d3748; box-shadow: 0 10px 30px rgba(0,0,0,0.5); backdrop-filter: blur(10px);">
                <div style="width: 60px; height: 60px; border: 3px solid #2d3748; border-top: 3px solid #ff6b00; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1.5rem;"></div>
                <h3 style="color: white; margin-bottom: 0.5rem;">Consultando Base de Dados</h3>
                <p style="color: #a0aec0;">Verificando suas credenciais...</p>
            </div>
        `;
        document.body.appendChild(loadingDiv);
    }

    hideLoading() {
        const loadingDiv = document.getElementById('loading-spinner');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }

    showMessage(message, type = 'info') {
        // Remover mensagens anteriores
        const existingMessages = document.querySelectorAll('.message-toast');
        existingMessages.forEach(msg => msg.remove());

        const bgColor = type === 'error' ? '#ef4444' : 
                        type === 'success' ? '#10b981' : 
                        type === 'warning' ? '#f59e0b' : '#3b82f6';
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message-toast';
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            max-width: 400px;
            animation: slideIn 0.3s ease;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.1);
        `;
        messageDiv.innerHTML = message;
        document.body.appendChild(messageDiv);

        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    if (messageDiv.parentNode) {
                        messageDiv.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
}

// Instância global
const paymentHandler = new PaymentHandler();

// Adicionar animações CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);