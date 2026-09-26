# L.A PNEUS — Sistema de Devis & Demandes d'Intervention

> **Destino dos Devis**: `info.lapneus@gmail.com`  
> **Formulário de Origem**: Formulário da Landing Page (`index.html#reservation`)  
> **Isolamento**: 100% separado do Club Privilège (Abonnements / `tarifs.html`)

---

## ⚡ Como Funciona

1. O cliente preenche o formulário de devis na página inicial:
   - Nome e Sobrenome
   - Telefone suíço (ex: 078 123 45 67)
   - Comuna de intervenção (Genève / Vaud)
   - Prestation (Pneus, Freios ou Combinado)
   - Veículo e Dimensões
   - Créneau horaire (Manhã / Tarde)

2. O formulário envia os dados diretamente para o e-mail oficial da empresa: **`info.lapneus@gmail.com`**.

3. O e-mail chega formatado em uma **tabela limpa e organizada**, contendo:
   - Identificador do Dossiê (`DEV-2026-XXXX`)
   - Data e hora exatas da solicitação
   - Nome e Comuna do cliente
   - Prestation solicitada e veículo
   - Botão direto para **ligar para o cliente** com 1 toque
   - Botão direto para **responder no WhatsApp** já com o texto pronto

---

## 🚀 Ativação Opcional no Google Drive (Planilha Própria para Devis)

Se você também quiser que os orçamentos sejam salvos numa planilha Google separada chamada **"L.A PNEUS — Demandes de Devis"**:

1. Abra o [Google Sheets](https://sheets.new)
2. Dê o nome de: **"L.A PNEUS — Demandes de Devis"**
3. Renomeie a aba inferior para: **"Devis"**
4. Clique em **Extensões** > **Apps Script**
5. Apague o código padrão e cole o conteúdo de `Code-Devis.gs`
6. No menu superior selecione `initialiserFeuilleDevis` e clique em **Executar (▶)**
7. Clique em **Implantar** > **Nova implantação**:
   - Tipo: **App da Web**
   - Executar como: **Eu**
   - Quem tem acesso: **Qualquer pessoa**
8. Copie a URL gerada e insira em `DEVIS_WEBHOOK_URL` no `index.html`.
