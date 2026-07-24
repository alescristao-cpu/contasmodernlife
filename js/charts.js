/**
 * Modern Life Residence - Financial Analytics & Charts Engine
 * Renders Chart.js visualization for transparency dashboard.
 */

class FinancialCharts {
  constructor() {
    this.categoryChart = null;
    this.revenueExpenseChart = null;
    this.balanceChart = null;
  }

  init() {
    const balancetes = window.dbStore.get('BALANCETES');
    if (!balancetes || balancetes.length === 0) return;

    this.renderCategoryChart(balancetes[0]); // Latest month
    this.renderRevenueVsExpenseChart(balancetes);
    this.renderBalanceEvolutionChart(balancetes);
  }

  renderCategoryChart(latestBalancete) {
    const ctx = document.getElementById('chartCategory');
    if (!ctx) return;

    const items = latestBalancete.itensDespesa || [
      { categoria: 'Pessoal & Encargos', valor: 48500 },
      { categoria: 'Segurança & Monitoramento', valor: 18500 },
      { categoria: 'Energia & Água', valor: 26000 },
      { categoria: 'Manutenção Elevadores/Predial', valor: 10650 },
      { categoria: 'Gestão Administrativa', valor: 8800 }
    ];

    // Group expenses by category
    const categoriesMap = {};
    items.forEach(item => {
      const cat = item.categoria || 'Geral';
      categoriesMap[cat] = (categoriesMap[cat] || 0) + item.valor;
    });

    const labels = Object.keys(categoriesMap);
    const dataValues = Object.values(categoriesMap);

    if (this.categoryChart) this.categoryChart.destroy();

    this.categoryChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: dataValues,
          backgroundColor: [
            '#1F4D30',
            '#2E6B42',
            '#3B82F6',
            '#F59E0B',
            '#10B981',
            '#8B5CF6'
          ],
          borderWidth: 2,
          borderColor: '#FFFFFF'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: (context) => {
                const val = context.raw || 0;
                return ` ${context.label}: R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
              }
            }
          }
        }
      }
    });
  }

  renderRevenueVsExpenseChart(balancetes) {
    const ctx = document.getElementById('chartRevenueVsExpense');
    if (!ctx) return;

    // Sort chronologically Jan -> Jun 2026
    const sorted = [...balancetes].reverse();
    const months = sorted.map(b => b.mes);
    const receitas = sorted.map(b => b.receita);
    const despesas = sorted.map(b => b.despesa);

    if (this.revenueExpenseChart) this.revenueExpenseChart.destroy();

    this.revenueExpenseChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Receita Total (R$)',
            data: receitas,
            backgroundColor: '#2E6B42',
            borderRadius: 6
          },
          {
            label: 'Despesa Total (R$)',
            data: despesas,
            backgroundColor: '#EF4444',
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' }
        },
        scales: {
          y: {
            ticks: {
              callback: (value) => `R$ ${(value / 1000).toFixed(0)}k`
            }
          }
        }
      }
    });
  }

  renderBalanceEvolutionChart(balancetes) {
    const ctx = document.getElementById('chartBalanceEvolution');
    if (!ctx) return;

    const sorted = [...balancetes].reverse();
    const months = sorted.map(b => b.mes);
    const saldos = sorted.map(b => b.saldo);

    if (this.balanceChart) this.balanceChart.destroy();

    this.balanceChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: 'Saldo Mensal do Condomínio (R$)',
          data: saldos,
          borderColor: '#1F4D30',
          backgroundColor: 'rgba(46, 107, 66, 0.15)',
          fill: true,
          tension: 0.35,
          pointRadius: 6,
          pointBackgroundColor: '#2E6B42'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' }
        },
        scales: {
          y: {
            ticks: {
              callback: (value) => `R$ ${value.toLocaleString('pt-BR')}`
            }
          }
        }
      }
    });
  }
}

window.financialCharts = new FinancialCharts();
