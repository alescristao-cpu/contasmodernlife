/**
 * Modern Life Residence - Data Layer & Persistence Store
 * LocalStorage resilience with Firebase Firestore / Storage integration hooks.
 */

const STORAGE_KEYS = {
  USERS: 'mlr_users',
  BALANCETES: 'mlr_balancetes',
  CONTRATOS: 'mlr_contratos',
  DOCUMENTOS: 'mlr_documentos',
  BLOG: 'mlr_blog',
  RECLAMACOES: 'mlr_reclamacoes',
  RESERVAS: 'mlr_reservas',
  EVENTOS: 'mlr_eventos',
  NOTIFICACOES: 'mlr_notificacoes'
};

// Initial Seed Data for 2026 Financial Year & Condo Management
const INITIAL_DATA = {
  users: [
    {
      id: 'usr_admin',
      nome: 'Carlos Eduardo Silva',
      email: 'admin@modernlife.com.br',
      senha: '123',
      apartamento: '101',
      bloco: 'A',
      cpf: '123.456.789-00',
      telefone: '(11) 98765-4321',
      perfil: 'admin',
      status: 'aprovado',
      dataCadastro: '2026-01-10'
    },
    {
      id: 'usr_conselho',
      nome: 'Dra. Mariana Costa',
      email: 'conselho@modernlife.com.br',
      senha: '123',
      apartamento: '504',
      bloco: 'B',
      cpf: '234.567.890-11',
      telefone: '(11) 97654-3210',
      perfil: 'conselheiro',
      status: 'aprovado',
      dataCadastro: '2026-01-15'
    },
    {
      id: 'usr_morador1',
      nome: 'Roberto Albuquerque',
      email: 'morador@modernlife.com.br',
      senha: '123',
      apartamento: '302',
      bloco: 'A',
      cpf: '345.678.901-22',
      telefone: '(11) 96543-2109',
      perfil: 'morador',
      status: 'aprovado',
      dataCadastro: '2026-02-01'
    },
    {
      id: 'usr_pendente1',
      nome: 'Ana Beatriz Lima',
      email: 'ana.lima@gmail.com',
      senha: '123',
      apartamento: '803',
      bloco: 'B',
      cpf: '456.789.012-33',
      telefone: '(11) 95432-1098',
      perfil: 'morador',
      status: 'pendente',
      dataCadastro: '2026-07-20'
    }
  ],

  balancetes: [
    {
      id: 'bal_2026_06',
      mes: 'Junho',
      ano: 2026,
      receita: 145800.00,
      despesa: 112450.00,
      saldo: 33350.00,
      status: 'Aprovado em Assembleia',
      pdfUrl: '#balancete-junho-2026',
      itensReceita: [
        { desc: 'Taxa Condominial Ordinária (120 aptos)', valor: 132000.00 },
        { desc: 'Fundo de Reserva (5%)', valor: 6600.00 },
        { desc: 'Reserva Salão de Festas & Churrasqueira', valor: 2800.00 },
        { desc: 'Multas e Juros de Mora', valor: 440.00 }
      ],
      itensDespesa: [
        { desc: 'Folha de Pagamento & Encargos (Portaria e Limpeza)', categoria: 'Pessoal', valor: 48500.00 },
        { desc: 'Energia Elétrica (Concessionária Enel)', categoria: 'Utilidades', valor: 14200.00 },
        { desc: 'Água e Esgoto (Sabesp)', categoria: 'Utilidades', valor: 11800.00 },
        { desc: 'Manutenção Preventiva de Elevadores (Otis)', categoria: 'Manutenção', valor: 6400.00 },
        { desc: 'Segurança Armada & Monitoramento 24h', categoria: 'Segurança', valor: 18500.00 },
        { desc: 'Material de Limpeza & Conservação', categoria: 'Insumos', valor: 4250.00 },
        { desc: 'Honórários de Gestão e Contabilidade', categoria: 'Administrativo', valor: 8800.00 }
      ]
    },
    {
      id: 'bal_2026_05',
      mes: 'Maio',
      ano: 2026,
      receita: 144200.00,
      despesa: 118900.00,
      saldo: 25300.00,
      status: 'Aprovado pelo Conselho',
      pdfUrl: '#balancete-maio-2026',
      itensReceita: [
        { desc: 'Taxa Condominial Ordinária', valor: 132000.00 },
        { desc: 'Fundo de Reserva', valor: 6600.00 },
        { desc: 'Aluguel de Vagas Adicionais', valor: 5600.00 }
      ],
      itensDespesa: [
        { desc: 'Pessoal e Encargos', categoria: 'Pessoal', valor: 47900.00 },
        { desc: 'Manutenção e Pintura de Fachada', categoria: 'Obras', valor: 15400.00 },
        { desc: 'Utilidades (Luz/Água)', categoria: 'Utilidades', valor: 24500.00 },
        { desc: 'Segurança e Sistema CFTV', categoria: 'Segurança', valor: 19100.00 },
        { desc: 'Outras Despesas Operacionais', categoria: 'Diversos', valor: 12000.00 }
      ]
    },
    {
      id: 'bal_2026_04',
      mes: 'Abril',
      ano: 2026,
      receita: 142500.00,
      despesa: 109800.00,
      saldo: 32700.00,
      status: 'Aprovado em Assembleia',
      pdfUrl: '#balancete-abril-2026'
    },
    {
      id: 'bal_2026_03',
      mes: 'Março',
      ano: 2026,
      receita: 141000.00,
      despesa: 114200.00,
      saldo: 26800.00,
      status: 'Aprovado em Assembleia',
      pdfUrl: '#balancete-marco-2026'
    },
    {
      id: 'bal_2026_02',
      mes: 'Fevereiro',
      ano: 2026,
      receita: 140800.00,
      despesa: 108300.00,
      saldo: 32500.00,
      status: 'Aprovado em Assembleia',
      pdfUrl: '#balancete-fevereiro-2026'
    },
    {
      id: 'bal_2026_01',
      mes: 'Janeiro',
      ano: 2026,
      receita: 139500.00,
      despesa: 107100.00,
      saldo: 32400.00,
      status: 'Aprovado em Assembleia',
      pdfUrl: '#balancete-janeiro-2026'
    }
  ],

  contratos: [
    {
      id: 'cnt_001',
      empresa: 'Otis Elevadores S/A',
      objeto: 'Manutenção preventiva e corretiva dos 4 elevadores sociais e de serviço',
      valorMensal: 6400.00,
      vigencia: '01/01/2026 a 31/12/2027',
      status: 'Ativo',
      pdfUrl: '#contrato-otis'
    },
    {
      id: 'cnt_002',
      empresa: 'Viva Segurança & Portaria Virtual',
      objeto: 'Monitoramento 24h, controle de acesso facial e câmeras CFTV',
      valorMensal: 18500.00,
      vigencia: '15/03/2025 a 15/03/2027',
      status: 'Ativo',
      pdfUrl: '#contrato-viva-seguranca'
    },
    {
      id: 'cnt_003',
      empresa: 'VerdeLimpo Jardinagem & Paisagismo',
      objeto: 'Manutenção mensal das áreas verdes, poda de árvores e plantas',
      valorMensal: 3800.00,
      vigencia: '01/02/2026 a 31/01/2027',
      status: 'Ativo',
      pdfUrl: '#contrato-verdelimpo'
    },
    {
      id: 'cnt_004',
      empresa: 'Porto Seguro Cia de Seguros',
      objeto: 'Seguro obrigatório contra incêndio, vendaval e danos elétricos',
      valorMensal: 2950.00,
      vigencia: '10/05/2026 a 10/05/2027',
      status: 'Ativo',
      pdfUrl: '#contrato-porto-seguro'
    }
  ],

  documentos: [
    {
      id: 'doc_01',
      nome: 'Convenção do Condomínio Modern Life Residence.pdf',
      categoria: 'Convenção',
      data: '2024-03-15',
      tamanho: '4.2 MB',
      descricao: 'Documento jurídico fundacional contendo os direitos e deveres dos condôminos.'
    },
    {
      id: 'doc_02',
      nome: 'Regimento Interno Atualizado 2026.pdf',
      categoria: 'Regimento Interno',
      data: '2026-01-20',
      tamanho: '2.1 MB',
      descricao: 'Regras de convivência, horários de barulho, uso das áreas de lazer e garagem.'
    },
    {
      id: 'doc_03',
      nome: 'Manual do Proprietário e Garantia da Construtora.pdf',
      categoria: 'Manual do Proprietário',
      data: '2024-03-15',
      tamanho: '8.5 MB',
      descricao: 'Orientações técnicas sobre estrutura, hidráulica e elétrica do imóvel.'
    },
    {
      id: 'doc_04',
      nome: 'Ata da Assembleia Geral Ordinária - Março 2026.pdf',
      categoria: 'Atas',
      data: '2026-03-28',
      tamanho: '1.4 MB',
      descricao: 'Aprovação das contas de 2025 e eleição do novo síndico e conselho fiscal.'
    },
    {
      id: 'doc_05',
      nome: 'Comunicado Oficial - Regras de Uso da Piscina Aquecida.pdf',
      categoria: 'Comunicados',
      data: '2026-06-10',
      tamanho: '680 KB',
      descricao: 'Novas diretrizes para exames médicos e reserva de espreguiçadeiras.'
    }
  ],

  blog: [
    {
      id: 'post_01',
      titulo: 'Instalação do Novo Sistema de Câmeras com Inteligência Artificial',
      sindico: 'Carlos Eduardo (Síndico)',
      data: '2026-07-15',
      imagem: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
      conteudo: 'Estimados moradores, concluímos esta semana a modernização do nosso sistema de CFTV. Foram instaladas 16 novas câmeras de altíssima resolução com inteligência artificial para leitura de placas e detecção automática de movimentos nas perimetrais.',
      anexos: ['Relatório_Técnico_Câmeras.pdf'],
      comentarios: [
        { autor: 'Roberto (Apto 302A)', data: '15/07/2026 14:30', texto: 'Excelente iniciativa! A segurança aumentou muito no nosso portão principal.' },
        { autor: 'Dra. Mariana (Apto 504B)', data: '15/07/2026 16:10', texto: 'Parabéns pela transparência na apresentação do orçamento da instalação.' }
      ]
    },
    {
      id: 'post_02',
      titulo: 'Manutenção Preventiva das Bombas d’Água e Limpeza das Caixas',
      sindico: 'Carlos Eduardo (Síndico)',
      data: '2026-06-28',
      imagem: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
      conteudo: 'Informamos que no próximo sábado faremos a higienização semestral dos reservatórios superiores e inferiores. Não haverá interrupção no abastecimento, pois utilizaremos o reservatório de apoio.',
      anexos: ['Laudo_Potabilidade_Agua.pdf'],
      comentarios: []
    }
  ],

  reclamacoes: [
    {
      id: 'rec_101',
      moradorId: 'usr_morador1',
      moradorNome: 'Roberto Albuquerque',
      apartamento: '302 A',
      categoria: 'Reclamação',
      assunto: 'Barulho de salto alto e música no 402 após 22h',
      descricao: 'Segunda-feira passada houve festa até 1h da manhã com ruído acima do permitido pelo Regimento.',
      data: '2026-07-18',
      status: 'Em análise',
      historico: [
        { data: '2026-07-18 09:00', evento: 'Chamado registrado no portal' },
        { data: '2026-07-19 11:30', evento: 'Síndico enviou notificação orientativa ao apartamento 402 A' }
      ]
    },
    {
      id: 'rec_102',
      moradorId: 'usr_conselho',
      moradorNome: 'Dra. Mariana Costa',
      apartamento: '504 B',
      categoria: 'Sugestão',
      assunto: 'Instalação de tomadas de carregamento para carros elétricos',
      descricao: 'Sugiro estudarmos na próxima assembleia a implantação de medidores individuais para carregadores EV nas garagens.',
      data: '2026-07-02',
      status: 'Respondido',
      respostaSindico: 'Ótima sugestão! Incluiremos a pauta de viabilidade técnica no edital da próxima AGO.',
      historico: [
        { data: '2026-07-02 10:00', evento: 'Sugestão enviada ao Conselho' },
        { data: '2026-07-05 14:00', evento: 'Analisado pelo conselho e síndico' }
      ]
    }
  ],

  reservas: [
    {
      id: 'res_01',
      espaco: 'Salão de Festas',
      moradorNome: 'Roberto Albuquerque',
      apartamento: '302 A',
      data: '2026-08-15',
      periodo: '18:00 às 23:59',
      status: 'Confirmada'
    },
    {
      id: 'res_02',
      espaco: 'Churrasqueira Gourmet',
      moradorNome: 'Dra. Mariana Costa',
      apartamento: '504 B',
      data: '2026-08-08',
      periodo: '11:00 às 17:00',
      status: 'Confirmada'
    }
  ],

  eventos: [
    { id: 'ev_01', titulo: 'Assembleia Geral Extraordinária', data: '2026-08-20', tipo: 'Assembleia', local: 'Salão de Festas' },
    { id: 'ev_02', titulo: 'Manutenção Trimestral de Elevadores', data: '2026-08-10', tipo: 'Manutenção', local: 'Torres A e B' },
    { id: 'ev_03', titulo: 'Festa de Confraternização Junina', data: '2026-06-24', tipo: 'Evento', local: 'Quadra / Quiosque' }
  ]
};

// Data Store Controller
class DataStore {
  constructor() {
    this.init();
  }

  init() {
    // Populate localStorage with initial seed data if not present
    Object.keys(INITIAL_DATA).forEach(key => {
      const storageKey = STORAGE_KEYS[key.toUpperCase()];
      if (!localStorage.getItem(storageKey)) {
        localStorage.setItem(storageKey, JSON.stringify(INITIAL_DATA[key]));
      }
    });
  }

  get(collectionName) {
    const key = STORAGE_KEYS[collectionName.toUpperCase()];
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  save(collectionName, items) {
    const key = STORAGE_KEYS[collectionName.toUpperCase()];
    localStorage.setItem(key, JSON.stringify(items));
  }

  add(collectionName, newItem) {
    const items = this.get(collectionName);
    newItem.id = newItem.id || 'id_' + Date.now();
    items.unshift(newItem);
    this.save(collectionName, items);
    return newItem;
  }

  update(collectionName, id, updatedFields) {
    const items = this.get(collectionName);
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updatedFields };
      this.save(collectionName, items);
      return items[index];
    }
    return null;
  }

  delete(collectionName, id) {
    const items = this.get(collectionName);
    const filtered = items.filter(item => item.id !== id);
    this.save(collectionName, filtered);
  }
}

// Global Store Instance
window.dbStore = new DataStore();
