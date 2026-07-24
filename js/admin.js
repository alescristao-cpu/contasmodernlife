/**
 * Modern Life Residence - Administrative Control Panel
 * Exclusive functions for Admin/Syndic management.
 */

class AdminPanel {
  renderPendingUsers() {
    const users = window.dbStore.get('USERS');
    const pendingUsers = users.filter(u => u.status === 'pendente');
    const container = document.getElementById('adminPendingUsersList');
    if (!container) return;

    if (pendingUsers.length === 0) {
      container.innerHTML = `
        <div style="padding: 2rem; text-align: center; color: var(--text-muted);">
          <i class="fas fa-check-circle" style="font-size: 2.5rem; color: var(--color-success); margin-bottom: 0.5rem;"></i>
          <p>Não há cadastros pendentes de aprovação no momento.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <table class="custom-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Apto / Bloco</th>
            <th>CPF</th>
            <th>Contato</th>
            <th>Data Cadastro</th>
            <th style="text-align: right;">Ações</th>
          </tr>
        </thead>
        <tbody>
          ${pendingUsers.map(u => `
            <tr>
              <td><strong>${u.nome}</strong><br><small style="color: var(--text-muted);">${u.email}</small></td>
              <td>Apto ${u.apartamento} - Bloco ${u.bloco}</td>
              <td>${u.cpf || 'Não informado'}</td>
              <td>${u.telefone || 'Sem fone'}</td>
              <td>${u.dataCadastro}</td>
              <td style="text-align: right;">
                <button onclick="window.adminPanel.approveUser('${u.id}')" class="btn btn-success btn-sm">
                  <i class="fas fa-check"></i> Aprovar
                </button>
                <button onclick="window.adminPanel.rejectUser('${u.id}')" class="btn btn-danger btn-sm">
                  <i class="fas fa-times"></i> Rejeitar
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  approveUser(userId) {
    window.dbStore.update('USERS', userId, { status: 'aprovado' });
    window.app.showToast('Sucesso', 'Cadastro de morador APROVADO com sucesso!', 'success');
    this.renderPendingUsers();
    window.app.refreshBadgeCounts();
  }

  rejectUser(userId) {
    if (confirm('Tem certeza de que deseja rejeitar este cadastro?')) {
      window.dbStore.update('USERS', userId, { status: 'rejeitado' });
      window.app.showToast('Aviso', 'Cadastro de morador rejeitado.', 'warning');
      this.renderPendingUsers();
      window.app.refreshBadgeCounts();
    }
  }

  // Add new Balancete
  saveBalancete(formData) {
    const newBal = {
      mes: formData.mes,
      ano: parseInt(formData.ano),
      receita: parseFloat(formData.receita),
      despesa: parseFloat(formData.despesa),
      saldo: parseFloat(formData.receita) - parseFloat(formData.despesa),
      status: formData.status || 'Aprovado em Assembleia',
      pdfUrl: '#balancete-' + formData.mes.toLowerCase() + '-' + formData.ano
    };
    window.dbStore.add('BALANCETES', newBal);
    window.app.showToast('Publicado', 'Novo balancete cadastrado com sucesso!', 'success');
    window.app.renderBalancetes();
    window.financialCharts.init();
  }

  // Add new Contract
  saveContrato(formData) {
    const newContract = {
      empresa: formData.empresa,
      objeto: formData.objeto,
      valorMensal: parseFloat(formData.valorMensal),
      vigencia: formData.vigencia,
      status: formData.status || 'Ativo',
      pdfUrl: '#contrato-' + Date.now()
    };
    window.dbStore.add('CONTRATOS', newContract);
    window.app.showToast('Contrato Salvo', 'Novo contrato registrado com sucesso!', 'success');
    window.app.renderContratos();
  }

  // Publish Blog Post
  saveBlogPost(formData) {
    const newPost = {
      titulo: formData.titulo,
      sindico: 'Carlos Eduardo (Síndico)',
      data: new Date().toISOString().split('T')[0],
      imagem: formData.imagem || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
      conteudo: formData.conteudo,
      anexos: formData.anexo ? [formData.anexo] : [],
      comentarios: []
    };
    window.dbStore.add('BLOG', newPost);
    window.app.showToast('Publicado', 'Comunicado do síndico publicado!', 'success');
    window.app.renderBlog();
  }

  // Respond to Resident Ticket
  respondReclamacao(ticketId, resposta, novoStatus) {
    const ticket = window.dbStore.get('RECLAMACOES').find(t => t.id === ticketId);
    if (!ticket) return;

    const hist = ticket.historico || [];
    hist.push({
      data: new Date().toLocaleString('pt-BR'),
      evento: `Status alterado para [${novoStatus}]. Resposta: ${resposta}`
    });

    window.dbStore.update('RECLAMACOES', ticketId, {
      respostaSindico: resposta,
      status: novoStatus,
      historico: hist
    });

    window.app.showToast('Atualizado', 'Ocorrência respondida e status atualizado!', 'success');
    window.app.renderReclamacoes();
  }
}

window.adminPanel = new AdminPanel();
