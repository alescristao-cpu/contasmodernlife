/**
 * Modern Life Residence - Export & PDF Generator Engine
 * Exports data to CSV/Excel format and triggers formatted printable PDF views.
 */

class ExportManager {
  exportToCSV(filename, rows) {
    if (!rows || !rows.length) return;

    const separator = ';';
    const keys = Object.keys(rows[0]);
    let csvContent = keys.join(separator) + '\n';

    rows.forEach(row => {
      const line = keys.map(k => {
        let val = row[k] === null || row[k] === undefined ? '' : row[k];
        if (typeof val === 'string') val = `"${val.replace(/"/g, '""')}"`;
        return val;
      }).join(separator);
      csvContent += line + '\n';
    });

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  printBalancetePDF(balanceteId) {
    const balancetes = window.dbStore.get('BALANCETES');
    const item = balancetes.find(b => b.id === balanceteId) || balancetes[0];

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Balancete ${item.mes} ${item.ano} - Modern Life Residence</title>

        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #222; padding: 40px; margin: 0; }
          .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #1F4D30; padding-bottom: 20px; margin-bottom: 30px; }
          .logo-box h1 { color: #1F4D30; margin: 0; font-size: 24px; }
          .logo-box p { color: #2E6B42; margin: 5px 0 0 0; font-weight: 600; }
          .meta-box { text-align: right; font-size: 14px; color: #555; }
          .title { font-size: 20px; font-weight: bold; margin-bottom: 20px; color: #1F4D30; border-bottom: 1px solid #ccc; padding-bottom: 8px; }
          .summary-grid { display: flex; gap: 20px; margin-bottom: 30px; }
          .summary-card { flex: 1; background: #F4F4F4; border: 1px solid #D9D9D9; border-radius: 8px; padding: 15px; text-align: center; }
          .summary-card span { font-size: 12px; text-transform: uppercase; color: #666; font-weight: bold; }
          .summary-card h2 { margin: 10px 0 0 0; font-size: 22px; }
          .val-receita { color: #2E6B42; }
          .val-despesa { color: #C53030; }
          .val-saldo { color: #1F4D30; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px; }
          th { background: #1F4D30; color: white; padding: 10px; text-align: left; }
          td { padding: 10px; border-bottom: 1px solid #eee; }
          .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #ddd; padding-top: 20px; }
          .signatures { display: flex; justify-content: space-around; margin-top: 60px; }
          .sig-line { width: 220px; border-top: 1px solid #222; text-align: center; padding-top: 5px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo-box">
            <h1>MODERN LIFE RESIDENCE</h1>
            <p>PORTAL DA TRANSPARÊNCIA E PRESTAÇÃO DE CONTAS</p>
          </div>
          <div class="meta-box">
            <p><strong>Emissão:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
            <p><strong>Status:</strong> ${item.status || 'Consolidado'}</p>
          </div>
        </div>

        <div class="title">Demonstrativo Financeiro - ${item.mes} / ${item.ano}</div>

        <div class="summary-grid">
          <div class="summary-card">
            <span>Receita Arrecadada</span>
            <h2 class="val-receita">R$ ${item.receita.toLocaleString('pt-BR', {minimumFractionDigits:2})}</h2>
          </div>
          <div class="summary-card">
            <span>Despesa Executada</span>
            <h2 class="val-despesa">R$ ${item.despesa.toLocaleString('pt-BR', {minimumFractionDigits:2})}</h2>
          </div>
          <div class="summary-card">
            <span>Saldo Líquido</span>
            <h2 class="val-saldo">R$ ${item.saldo.toLocaleString('pt-BR', {minimumFractionDigits:2})}</h2>
          </div>
        </div>

        <h3>Detalhamento das Contas Mensais</h3>
        <table>
          <thead>
            <tr>
              <th>Descrição do Lançamento</th>
              <th>Categoria</th>
              <th style="text-align:right">Valor (R$)</th>
            </tr>
          </thead>
          <tbody>
            ${(item.itensDespesa || [
              { desc: 'Folha de Pagamento Portaria/Limpeza', categoria: 'Pessoal', valor: 48500 },
              { desc: 'Energia Elétrica Enel', categoria: 'Utilidades', valor: 14200 },
              { desc: 'Água Sabesp', categoria: 'Utilidades', valor: 11800 },
              { desc: 'Manutenção Otis Elevadores', categoria: 'Manutenção', valor: 6400 },
              { desc: 'Segurança Armada Viva', categoria: 'Segurança', valor: 18500 }
            ]).map(i => `
              <tr>
                <td>${i.desc}</td>
                <td>${i.categoria || 'Geral'}</td>
                <td style="text-align:right">R$ ${i.valor.toLocaleString('pt-BR', {minimumFractionDigits:2})}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="signatures">
          <div class="sig-line">Síndico Profissional<br>Modern Life Residence</div>
          <div class="sig-line">Conselho Fiscal<br>Aprovação de Contas</div>
        </div>

        <div class="footer">
          Modern Life Residence - Documento gerado via Portal da Transparência Oficial
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  }
}

window.exportManager = new ExportManager();
