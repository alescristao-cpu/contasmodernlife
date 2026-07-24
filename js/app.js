/**
 * Modern Life Residence - Core Application Controller
 * SPA Navigation, Search, Dark Mode, Renderers & Event Handlers
 */

class AppController {
  constructor() {
    this.currentView = 'dashboardView';
    this.isDarkMode = localStorage.getItem('mlr_dark_mode') === 'true';
  }

  init() {
    this.applyDarkMode();
    this.setupEventListeners();
    this.checkAuthUI();
    this.renderCurrentView();
    this.refreshBadgeCounts();
  }

  applyDarkMode() {
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
      const icon = document.getElementById('darkModeIcon');
      if (icon) icon.className = 'fas fa-sun';
    } else {
      document.body.classList.remove('dark-mode');
      const icon = document.getElementById('darkModeIcon');
      if (icon) icon.className = 'fas fa-moon';
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('mlr_dark_mode', this.isDarkMode);
    this.applyDarkMode();
  }

  setupEventListeners() {
    // Navigation Links
    document.querySelectorAll('.nav-link[data-target]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = link.getAttribute('data-target');
        this.navigateTo(targetView);
        
        // On mobile, close sidebar
        document.querySelector('.sidebar')?.classList.remove('mobile-open');
      });
    });

    // Mobile Sidebar Toggle
    document.getElementById('mobileToggle')?.addEventListener('click', () => {
      document.querySelector('.sidebar')?.classList.toggle('mobile-open');
    });

    // Global Search Bar
    document.getElementById('globalSearchInput')?.addEventListener('input', (e) => {
      this.handleGlobalSearch(e.target.value.toLowerCase());
    });

    // Notifications Dropdown
    document.getElementById('notifyBtn')?.addEventListener('click', () => {
      const drop = document.getElementById('notificationsDropdown');
      if (drop) drop.classList.toggle('show');
    });
  }

  checkAuthUI() {
    const user = window.authManager.getCurrentUser();
    const userCard = document.getElementById('sidebarUserCard');
    const loginModalBtn = document.getElementById('headerLoginBtn');
    const adminMenuCategory = document.getElementById('adminMenuCategory');
    const adminNavLink = document.getElementById('adminNavLink');

    if (user) {
      if (userCard) {
        userCard.style.display = 'flex';
        document.getElementById('userNameDisplay').textContent = user.nome;
        document.getElementById('userRoleDisplay').textContent = user.perfil.toUpperCase() + ` (Apto ${user.apartamento}${user.bloco})`;
        document.getElementById('userAvatarDisplay').textContent = user.nome.charAt(0);
      }
      if (loginModalBtn) loginModalBtn.style.display = 'none';

      // Admin options visibility
      if (window.authManager.isAdmin()) {
        if (adminMenuCategory) adminMenuCategory.style.display = 'block';
        if (adminNavLink) adminNavLink.style.display = 'flex';
      } else {
        if (adminMenuCategory) adminMenuCategory.style.display = 'none';
        if (adminNavLink) adminNavLink.style.display = 'none';
      }
    } else {
      if (userCard) userCard.style.display = 'none';
      if (loginModalBtn) loginModalBtn.style.display = 'inline-flex';
      if (adminMenuCategory) adminMenuCategory.style.display = 'none';
      if (adminNavLink) adminNavLink.style.display = 'none';
    }
  }

  navigateTo(viewId) {
    // Check permission for admin view
    if (viewId === 'adminView' && !window.authManager.isAdmin()) {
      this.showToast('Acesso Negado', 'Área restrita exclusivamente ao Administrador/Síndico.', 'danger');
      return;
    }

    document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

    const targetSec = document.getElementById(viewId);
    if (targetSec) {
      targetSec.classList.add('active');
      this.currentView = viewId;

      const activeLink = document.querySelector(`.nav-link[data-target="${viewId}"]`);
      if (activeLink) activeLink.classList.add('active');

      // Execute view specific renderers
      this.renderCurrentView();
    }
  }

  renderCurrentView() {
    switch (this.currentView) {
      case 'dashboardView':
        this.renderDashboard();
        break;
      case 'prestacaoView':
      case 'balancetesView':
        this.renderBalancetes();
        break;
      case 'contratosView':
        this.renderContratos();
        break;
      case 'transparenciaView':
        window.financialCharts.init();
        break;
      case 'documentosView':
        this.renderDocumentos();
        break;
      case 'blogView':
        this.renderBlog();
        break;
      case 'reclamacoesView':
        this.renderReclamacoes();
        break;
      case 'reservasView':
        this.renderReservas();
        break;
      case 'agendaView':
        this.renderAgenda();
        break;
      case 'galeriaView':
        this.renderGaleria();
        break;
      case 'adminView':
        window.adminPanel.renderPendingUsers();
        break;
    }
  }

  renderDashboard() {
    const balancetes = window.dbStore.get('BALANCETES');
    const reclamacoes = window.dbStore.get('RECLAMACOES');
    const eventos = window.dbStore.get('EVENTOS');
    const docs = window.dbStore.get('DOCUMENTOS');

    // KPI Values
    if (balancetes.length > 0) {
      const b = balancetes[0];
      document.getElementById('dashUltimoBalanceteVal').textContent = `R$ ${b.saldo.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
      document.getElementById('dashUltimoBalanceteSub').textContent = `${b.mes} / ${b.ano} - ${b.status}`;
    }

    document.getElementById('dashChamadosAbertosVal').textContent = reclamacoes.filter(r => r.status !== 'Finalizado').length;
    document.getElementById('dashProximaAssembleiaVal').textContent = eventos[0] ? eventos[0].data : 'A definir';
    document.getElementById('dashDocRecentesVal').textContent = `${docs.length} Arquivos`;

    // Render Recent Notices
    const blog = window.dbStore.get('BLOG');
    const noticesContainer = document.getElementById('dashComunicadosList');
    if (noticesContainer) {
      noticesContainer.innerHTML = blog.slice(0, 2).map(p => `
        <div class="card" style="margin-bottom: 1rem; border-left: 4px solid var(--color-primary);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <strong style="color: var(--color-primary);">${p.titulo}</strong>
            <span style="font-size: 0.78rem; color: var(--text-muted);">${p.data}</span>
          </div>
          <p style="font-size: 0.9rem; color: var(--text-main);">${p.conteudo.substring(0, 140)}...</p>
        </div>
      `).join('');
    }
  }

  renderBalancetes() {
    const balancetes = window.dbStore.get('BALANCETES');
    const yearFilter = document.getElementById('filterAnoBalancete')?.value || 'all';
    const monthFilter = document.getElementById('filterMesBalancete')?.value || 'all';

    let filtered = balancetes;
    if (yearFilter !== 'all') filtered = filtered.filter(b => b.ano == yearFilter);
    if (monthFilter !== 'all') filtered = filtered.filter(b => b.mes.toLowerCase() == monthFilter.toLowerCase());

    const container = document.getElementById('balancetesTableBody');
    if (!container) return;

    container.innerHTML = filtered.map(b => `
      <tr>
        <td><strong>${b.mes} ${b.ano}</strong></td>
        <td style="color: var(--color-primary); font-weight: 700;">R$ ${b.receita.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
        <td style="color: var(--color-danger); font-weight: 700;">R$ ${b.despesa.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
        <td style="color: var(--color-primary-dark); font-weight: 800;">R$ ${b.saldo.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
        <td><span class="badge badge-success">${b.status || 'Consolidado'}</span></td>
        <td style="text-align: right;">
          <button onclick="window.exportManager.printBalancetePDF('${b.id}')" class="btn btn-secondary btn-sm">
            <i class="fas fa-file-pdf" style="color: #E11D48;"></i> Baixar PDF
          </button>
          <button onclick="window.exportManager.exportToCSV('Balancete_${b.mes}_${b.ano}', b.itensDespesa || [])" class="btn btn-secondary btn-sm">
            <i class="fas fa-file-excel" style="color: #059669;"></i> Planilha
          </button>
        </td>
      </tr>
    `).join('');
  }

  renderContratos() {
    const contratos = window.dbStore.get('CONTRATOS');
    const container = document.getElementById('contratosGrid');
    if (!container) return;

    container.innerHTML = contratos.map(c => `
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="fas fa-file-contract" style="color: var(--color-primary);"></i> ${c.empresa}</span>
          <span class="badge ${c.status === 'Ativo' ? 'badge-success' : 'badge-danger'}">${c.status}</span>
        </div>
        <p style="font-size: 0.92rem; color: var(--text-main); margin-bottom: 1rem;">${c.objeto}</p>
        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-muted); border-top: 1px solid var(--border-color); padding-top: 0.75rem;">
          <span>Vigência: <strong>${c.vigencia}</strong></span>
          <span>Valor: <strong style="color: var(--color-primary-dark);">R$ ${c.valorMensal.toLocaleString('pt-BR', {minimumFractionDigits:2})}/mês</strong></span>
        </div>
        <div style="margin-top: 1rem; text-align: right;">
          <a href="${c.pdfUrl}" onclick="alert('Fazendo download do contrato assinado de ${c.empresa}...')" class="btn btn-secondary btn-sm">
            <i class="fas fa-download"></i> Contrato PDF
          </a>
        </div>
      </div>
    `).join('');
  }

  renderDocumentos() {
    const docs = window.dbStore.get('DOCUMENTOS');
    const cat = document.getElementById('filterDocCategory')?.value || 'all';
    
    let filtered = docs;
    if (cat !== 'all') filtered = filtered.filter(d => d.categoria.toLowerCase() === cat.toLowerCase());

    const container = document.getElementById('documentosListBody');
    if (!container) return;

    container.innerHTML = filtered.map(d => `
      <tr>
        <td>
          <i class="fas fa-file-pdf" style="color: #EF4444; margin-right: 8px; font-size: 1.2rem;"></i>
          <strong>${d.nome}</strong>
          <br><small style="color: var(--text-muted);">${d.descricao || ''}</small>
        </td>
        <td><span class="badge badge-info">${d.categoria}</span></td>
        <td>${d.data}</td>
        <td>${d.tamanho}</td>
        <td style="text-align: right;">
          <button onclick="alert('Iniciando download do documento: ${d.nome}')" class="btn btn-primary btn-sm">
            <i class="fas fa-download"></i> Download
          </button>
        </td>
      </tr>
    `).join('');
  }

  renderBlog() {
    const posts = window.dbStore.get('BLOG');
    const container = document.getElementById('blogPostsContainer');
    if (!container) return;

    container.innerHTML = posts.map(p => `
      <div class="blog-post-card">
        <img src="${p.imagem}" alt="${p.titulo}" class="blog-post-img" />
        <div class="blog-post-content">
          <div class="blog-meta">
            <span><i class="fas fa-user-shield"></i> ${p.sindico}</span>
            <span>•</span>
            <span><i class="fas fa-calendar-alt"></i> ${p.data}</span>
          </div>
          <h2 style="font-size: 1.4rem; margin-bottom: 0.75rem;">${p.titulo}</h2>
          <p style="font-size: 0.98rem; line-height: 1.6; color: var(--text-main); margin-bottom: 1.25rem;">${p.conteudo}</p>
          
          ${p.anexos && p.anexos.length > 0 ? `
            <div style="background: var(--color-primary-soft); padding: 0.75rem 1rem; border-radius: var(--radius-md); margin-bottom: 1.25rem; display: flex; align-items: center; justify-content: space-between;">
              <span><i class="fas fa-paperclip" style="color: var(--color-primary);"></i> Anexo: <strong>${p.anexos[0]}</strong></span>
              <button onclick="alert('Baixando anexo: ${p.anexos[0]}')" class="btn btn-secondary btn-sm"><i class="fas fa-download"></i> Baixar</button>
            </div>
          ` : ''}

          <!-- Comments Thread -->
          <div class="blog-comments-section">
            <h4 style="font-size: 0.95rem; margin-bottom: 0.75rem;"><i class="fas fa-comments"></i> Comentários dos Moradores (${p.comentarios.length})</h4>
            ${p.comentarios.map(c => `
              <div style="background: var(--bg-card); padding: 0.75rem; border-radius: var(--radius-sm); margin-bottom: 0.5rem; border: 1px solid var(--border-color);">
                <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.25rem;">
                  <strong>${c.autor}</strong>
                  <span>${c.data}</span>
                </div>
                <p style="font-size: 0.88rem; margin: 0;">${c.texto}</p>
              </div>
            `).join('')}

            <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
              <input type="text" id="commentInput_${p.id}" class="form-control" placeholder="Escreva seu comentário..." style="flex: 1;" />
              <button onclick="window.app.addBlogComment('${p.id}')" class="btn btn-primary btn-sm">Enviar</button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  addBlogComment(postId) {
    const user = window.authManager.getCurrentUser();
    if (!user) {
      this.showToast('Login necessário', 'Você precisa estar logado para comentar.', 'warning');
      return;
    }

    const input = document.getElementById(`commentInput_${postId}`);
    if (!input || !input.value.trim()) return;

    const posts = window.dbStore.get('BLOG');
    const post = posts.find(p => p.id === postId);
    if (post) {
      post.comentarios.push({
        autor: `${user.nome} (Apto ${user.apartamento}${user.bloco})`,
        data: new Date().toLocaleString('pt-BR'),
        texto: input.value.trim()
      });
      window.dbStore.save('BLOG', posts);
      this.showToast('Comentário', 'Seu comentário foi publicado.', 'success');
      this.renderBlog();
    }
  }

  renderReclamacoes() {
    const tickets = window.dbStore.get('RECLAMACOES');
    const user = window.authManager.getCurrentUser();

    // Residents see their tickets, Admin sees all tickets
    let displayTickets = tickets;
    if (user && !window.authManager.isAdmin()) {
      displayTickets = tickets.filter(t => t.moradorId === user.id || t.apartamento === `${user.apartamento} ${user.bloco}`);
    }

    const container = document.getElementById('reclamacoesListContainer');
    if (!container) return;

    container.innerHTML = displayTickets.map(t => `
      <div class="card" style="margin-bottom: 1.5rem;">
        <div class="card-header">
          <div>
            <span class="badge ${t.categoria === 'Reclamação' ? 'badge-danger' : 'badge-info'}" style="margin-right: 8px;">${t.categoria}</span>
            <strong style="font-size: 1.1rem;">${t.assunto}</strong>
          </div>
          <span class="badge ${t.status === 'Finalizado' ? 'badge-success' : 'badge-warning'}">${t.status}</span>
        </div>
        <p style="font-size: 0.95rem; color: var(--text-main); margin-bottom: 1rem;">${t.descricao}</p>
        
        <div style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 1rem;">
          Enviado por: <strong>${t.moradorNome}</strong> (Apto ${t.apartamento}) em ${t.data}
        </div>

        ${t.respostaSindico ? `
          <div style="background: var(--color-primary-soft); padding: 1rem; border-radius: var(--radius-md); border-left: 4px solid var(--color-primary); margin-bottom: 1rem;">
            <strong style="color: var(--color-primary); font-size: 0.9rem;"><i class="fas fa-reply"></i> Resposta da Administração:</strong>
            <p style="font-size: 0.9rem; margin-top: 0.35rem; color: var(--text-main);">${t.respostaSindico}</p>
          </div>
        ` : ''}

        <!-- Admin Response Action -->
        ${window.authManager.isAdmin() ? `
          <div style="display: flex; gap: 0.5rem; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
            <input type="text" id="adminResp_${t.id}" class="form-control" placeholder="Responder este morador..." style="flex: 1;" />
            <select id="adminStatus_${t.id}" class="form-select" style="width: 140px;">
              <option value="Em análise">Em análise</option>
              <option value="Respondido">Respondido</option>
              <option value="Finalizado">Finalizado</option>
            </select>
            <button onclick="window.adminPanel.respondReclamacao('${t.id}', document.getElementById('adminResp_${t.id}').value, document.getElementById('adminStatus_${t.id}').value)" class="btn btn-primary btn-sm">Enviar Resposta</button>
          </div>
        ` : ''}
      </div>
    `).join('');
  }

  renderReservas() {
    const reservas = window.dbStore.get('RESERVAS');
    const container = document.getElementById('reservasMinhasList');
    if (!container) return;

    container.innerHTML = reservas.map(r => `
      <div class="card" style="margin-bottom: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h4 style="color: var(--color-primary);">${r.espaco}</h4>
            <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 0.25rem;">
              Data: <strong>${r.data}</strong> | Horário: <strong>${r.periodo}</strong>
            </p>
            <p style="font-size: 0.8rem; color: var(--text-muted);">Reservado por: ${r.moradorNome} (${r.apartamento})</p>
          </div>
          <span class="badge badge-success">${r.status}</span>
        </div>
      </div>
    `).join('');
  }

  renderAgenda() {
    const eventos = window.dbStore.get('EVENTOS');
    const container = document.getElementById('agendaEventosList');
    if (!container) return;

    container.innerHTML = eventos.map(e => `
      <div style="display: flex; gap: 1rem; padding: 1rem; background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 0.75rem;">
        <div style="background: var(--color-primary-dark); color: white; padding: 0.5rem 0.85rem; border-radius: var(--radius-md); text-align: center; min-width: 70px;">
          <span style="font-size: 0.75rem; text-transform: uppercase; display: block;">${e.data.split('-')[1]}</span>
          <strong style="font-size: 1.4rem;">${e.data.split('-')[2]}</strong>
        </div>
        <div>
          <span class="badge badge-info" style="margin-bottom: 0.25rem;">${e.tipo}</span>
          <h4 style="margin: 0; font-size: 1.05rem;">${e.titulo}</h4>
          <span style="font-size: 0.85rem; color: var(--text-muted);"><i class="fas fa-map-marker-alt"></i> ${e.local}</span>
        </div>
      </div>
    `).join('');
  }

  renderGaleria() {
    const container = document.getElementById('galeriaGridContainer');
    if (!container) return;

    const fotos = [
      { titulo: 'Piscina Adulto e Infantil', cat: 'Piscina', img: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=600&q=80' },
      { titulo: 'Academia Completa Equipada', cat: 'Academia', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80' },
      { titulo: 'Salão de Festas Climatizado', cat: 'Salão', img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80' },
      { titulo: 'Playground Infantil Seguro', cat: 'Playground', img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80' },
      { titulo: 'Fachada Principal Modern Life', cat: 'Fachada', img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80' },
      { titulo: 'Espaço Churrasqueira Gourmet', cat: 'Eventos', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80' }
    ];

    container.innerHTML = fotos.map(f => `
      <div class="gallery-card" onclick="alert('${f.titulo} - Categoria: ${f.cat}')">
        <img src="${f.img}" alt="${f.titulo}" />
        <div class="gallery-overlay">
          <div>
            <span style="font-size: 0.75rem; text-transform: uppercase; background: rgba(0,0,0,0.5); padding: 2px 6px; border-radius: 4px;">${f.cat}</span>
            <h4 style="margin-top: 4px; font-size: 1rem;">${f.titulo}</h4>
          </div>
        </div>
      </div>
    `).join('');
  }

  refreshBadgeCounts() {
    const users = window.dbStore.get('USERS');
    const pendingCount = users.filter(u => u.status === 'pendente').length;
    const badge = document.getElementById('adminPendingBadge');
    if (badge) {
      badge.textContent = pendingCount;
      badge.style.display = pendingCount > 0 ? 'inline-block' : 'none';
    }
  }

  showToast(title, message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `card`;
    toast.style.cssText = `
      position: fixed; bottom: 2rem; right: 2rem; z-index: 300; width: 320px;
      border-left: 4px solid ${type === 'success' ? '#10B981' : type === 'danger' ? '#EF4444' : '#2E6B42'};
      box-shadow: var(--shadow-lg); animation: fadeIn 0.3s ease-out;
    `;
    toast.innerHTML = `
      <strong style="color: var(--text-main); font-size: 0.95rem;">${title}</strong>
      <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">${message}</p>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }

  handleGlobalSearch(query) {
    if (!query) return;
    const docs = window.dbStore.get('DOCUMENTOS');
    const match = docs.filter(d => d.nome.toLowerCase().includes(query) || d.categoria.toLowerCase().includes(query));
    if (match.length > 0) {
      this.navigateTo('documentosView');
      const input = document.getElementById('filterDocCategory');
      if (input) input.value = 'all';
      this.renderDocumentos();
    }
  }
}

// Global App Instance
window.app = new AppController();

document.addEventListener('DOMContentLoaded', () => {
  window.app.init();
});
