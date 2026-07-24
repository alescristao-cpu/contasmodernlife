/**
 * Modern Life Residence - Authentication & Role Manager
 * Handles login, registration, administrator approval workflow, and role-based permissions.
 */

class AuthManager {
  constructor() {
    this.currentUser = JSON.parse(sessionStorage.getItem('mlr_current_user')) || null;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isLoggedIn() {
    return !!this.currentUser;
  }

  isAdmin() {
    return this.currentUser && this.currentUser.perfil === 'admin';
  }

  isConselheiro() {
    return this.currentUser && (this.currentUser.perfil === 'conselheiro' || this.currentUser.perfil === 'admin');
  }

  register(userData) {
    const users = window.dbStore.get('USERS');
    
    // Check if email already exists
    const existing = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      return { success: false, message: 'Este e-mail já está cadastrado no sistema.' };
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      nome: userData.nome,
      email: userData.email,
      senha: userData.senha,
      apartamento: userData.apartamento,
      bloco: userData.bloco,
      cpf: userData.cpf,
      telefone: userData.telefone,
      perfil: 'morador', // Default role
      status: 'pendente', // Requires admin approval
      dataCadastro: new Date().toISOString().split('T')[0]
    };

    window.dbStore.add('USERS', newUser);
    return { 
      success: true, 
      message: 'Cadastro realizado com sucesso! Aguarde a aprovação do Administrador/Síndico para acessar o portal.' 
    };
  }

  login(email, senha) {
    const users = window.dbStore.get('USERS');
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.senha === senha);

    if (!user) {
      return { success: false, message: 'E-mail ou senha incorretos.' };
    }

    if (user.status === 'pendente') {
      return { 
        success: false, 
        isPending: true,
        message: 'Seu cadastro ainda está AGUARDANDO APROVAÇÃO do Administrador. Tente novamente em breve.' 
      };
    }

    if (user.status === 'rejeitado') {
      return { success: false, message: 'Seu cadastro foi recusado pela administração. Entre em contato com a portaria.' };
    }

    // Success
    this.currentUser = user;
    sessionStorage.setItem('mlr_current_user', JSON.stringify(user));
    return { success: true, user };
  }

  logout() {
    this.currentUser = null;
    sessionStorage.removeItem('mlr_current_user');
    window.location.reload();
  }

  // Demo Switcher for fast testing
  switchDemoUser(role) {
    const users = window.dbStore.get('USERS');
    let target = null;

    if (role === 'admin') target = users.find(u => u.perfil === 'admin');
    else if (role === 'conselheiro') target = users.find(u => u.perfil === 'conselheiro');
    else if (role === 'morador') target = users.find(u => u.perfil === 'morador' && u.status === 'aprovado');
    else if (role === 'pendente') target = users.find(u => u.status === 'pendente');

    if (target) {
      if (target.status === 'pendente') {
        alert('Este usuário de teste está PENDENTE DE APROVAÇÃO. Faça login como Admin para aprová-lo!');
        return;
      }
      this.currentUser = target;
      sessionStorage.setItem('mlr_current_user', JSON.stringify(target));
      window.location.reload();
    }
  }
}

window.authManager = new AuthManager();
