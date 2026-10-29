# Manual de Operação Local — TTP Proto1s

!!! warning "Aviso de Referência e Complementaridade"
    Este é um guia prático interno do laboratório e destina-se a padronizar o fluxo de trabalho e registrar as regras de projeto da nossa bancada. **Este material complementa e NÃO substitui o manual/tutorial oficial** fornecido pela TTP Indústria Mecânica Ltda. Ele pode ser acessado em [Tutorial TTP](https://www.ttp.ind.br/portal/tutorial/index.html).

---

## Tabela de Ferramentas do Laboratório

Todas as ferramentas utilizadas no Spindle da TTP Proto1s **devem ter haste de exatamente 1/8” (3,175 mm)**. Ferramentas fora dessa especificação danificam a pinça de aperto.

### Identificação por Anel Colorido

| Tipo | Cor do Anel de Nylon | Diâmetro Configurado | Aplicação Principal |
| :--- | :--- | :--- | :--- |
| **Fresa** | **V 60° (VCut)** | **`0,199 mm`** | Isolação de trilhas e pads SMD/PTH (profundidade Z = 0,037 mm) |
| **Fresa** | **Vinho** | `1,50 mm` | Remoção de grandes áreas de cobre / Desbaste / Recorte final do contorno |
| **Fresa** | **Laranja Escuro** | `1,50 mm` | Remoção de grandes áreas de cobre |
| **Broca** | **Verde Água** | `0,30 mm` | Vias e furos extra finos |
| **Broca** | **Azul** | `0,30 mm` | Vias e furos extra finos |
| **Broca** | **Amarelo** | `0,40 mm` | Vias SMD / Furos pequenos |
| **Broca** | **Marrom** | `0,60 mm` | Furos padronizados / Vias de pino |
| **Broca** | **Branco** | `0,60 mm` | Furos padronizados / Vias de pino |
| **Broca** | **Laranja Claro** | `0,80 mm` | Terminais Through-Hole |
| **Broca** | **Verde Escuro** | `1,00 mm` | Pinos de alinhamento duplo-lado e conectores |
| **Broca** | **Verde Claro** | `1,00 mm` | Pinos de alinhamento duplo-lado e conectores |
| **Broca** | **Roxo** | `1,30 mm` | Terminais largos e conectores de potência |

!!! info "Detalhamento da Geometria da Fresa VCut 60°"
    A fresa cônica V 60° altera sua largura efetiva de usinagem conforme afunda na placa. Para remover a camada padrão de 0,035 mm de cobre com tolerância, a profundidade do eixo Z é travada em 0,037 mm. Nessa profundidade específica, o diâmetro de corte resultante no CAM deve ser configurado como 0,199 mm.


## Regras Práticas do Laboratório e Segurança

### Margem do Substrato e Fixação
* **Tamanho Utilizável:** O tamanho detectado pelos sensores da máquina durante o mapeamento automático é menor que o tamanho físico real da placa de FR4 virgem.
* **Corte do Substrato:** Deixe sempre uma sobra de **5 mm a 10 mm em cada lado** em relação ao contorno do `Edge.Cuts`.
* **Fixação:** Aplique fita dupla face cobrindo uniformemente o verso do substrato para impedir vibrações, evitando cobrir as áreas onde a broca atravessará totalmente a placa.

### Segurança e Rearme Obrigatório
!!! danger "Parada de Segurança e Trava de Operação"
    Ao abrir a tampa de proteção acrílica da TTP Proto1s, o spindle é desligado e o movimento de todos os eixos é interrompido imediatamente.

    **Procedimento de Rearme:** Sempre que abrir e fechar a tampa (para trocar ferramentas, aspirar resíduos ou virar a placa), é **obrigatório pressionar o botão azul de REARME** localizado no painel frontal da máquina. Caso contrário, os comandos do software serão ignorados.


## Preparação no CAM (FlatCAM / PCB-Proto Studio)

Abaixo uma versão simplificada para a geração dos arquivos de fabricação. Para uma visão detalhada veja o [guia completo](./prep_gcode.md).

### Configurações Iniciais
1. Importe os arquivos Gerber e Excellon.
2. Certifique-se de que a unidade global do software está em **milímetros (mm)**.

### Espelhamento da Camada Inferior (Flip Y)
* Selecione o objeto Gerber correspondente à camada inferior (`B.Cu`).
* Aplique a função **Mirror** utilizando o **Eixo Y** como referência de espelhamento.


### Furos de Alinhamento (Procedimento de Correção / Workaround)

!!! bug "Defeito Identificado na Geração Automática"
    A função de geração automática de furos de alinhamento da versão atual do software apresenta falhas, criando furos incorretos ou em posições indesejadas fora da placa. Siga o procedimento manual abaixo.

```mermaid
flowchart TD
    A[Gera Furos de Alinhamento no Tool] --> B[Copia o Objeto Excellon Gerado]
    B --> C[Espelha a Cópia no Eixo Y]
    C --> D[Abre o Editor de Geometria/Excellon]
    D --> E[Remove Furos Desnecessários/Fora da Placa]
    E --> F[Mantém Apenas Par Estratégico para Pinos de 1.0mm]
```

#### Parâmetros de Furação para Alinhamento:
* **Ferramenta:** Broca de `1,0 mm` (anel Verde Escuro ou Verde Claro).
* **Cut Z (Profundidade):** **`-3,9 mm`**  
  *(⚠️ **NUNCA utilize `-4,0 mm`**, pois essa profundidade causa quebra da broca ao colidir com o fundo de metal da mesa).*
* **Travel Z (Altura de deslocamento):** `2,0 mm`.
* **Feedrate (Avanço):** `400 mm/min`.


### Estratégia de Isolação e Remoção de Grandes Áreas

#### Múltiplas Passagens de Isolação (Acesso a Espaços Apertados)
* **Configuração:** Defina entre **2 e 4 passagens (Passes)** na ferramenta de isolação com a VCut 60°.
* **Sobreposição (Overlap):** Configure entre **55% e 70%** (ex: `60%`).
* **Opção:** Marque a caixa **Combine Passes**.

!!! tip "Por que fazer múltiplas passagens com a VCut?"
    A fresa de remoção de grandes áreas (1,5 mm) possui diâmetro grande e não consegue entrar em cantos vivos ou vãos estreitos entre trilhas. Ao fazer 2 a 4 passagens de isolação prévias com a cônica VCut (0,199 mm), você abre um canal mais largo ao redor do circuito, permitindo que a fresa de 1,5 mm navegue livremente sem colidir ou deixar ilhas isoladas de cobre.

#### Remoção de Grandes Áreas (Desbaste)
1. Selecione as geometrias de isolação e execute o **Join** para criar o objeto **Combo**.
2. Selecione a **Fresa 1,5 mm** (Vinho ou Laranja Escuro).
3. **Inspeção Visual Obrigatória:**
   * Após gerar o CNC Job da remoção de áreas, **examine o caminho da ferramenta na tela do CAM**.
   * Se identificar ilhas de cobre remanescentes onde a fresa de 1,5 mm não coube, retorne à etapa de isolação, **aumente o número de passagens da VCut** e refaça o Combo.


## Sequência Operacional de Usinagem

```mermaid
sequenceDiagram
    autonumber
    participant Op as Operador
    participant CNC as TTP Proto1s
    participant SW as PCB-Proto Interface

    Note over Op,CNC: Preparação Top
    Op->>CNC: Fixa FR4 com Fita Dupla Face
    Op->>CNC: Monta Fresa/Broca e Fecha Tampa
    Op->>CNC: Pressiona Botão Azul (REARME)
    Op->>SW: Executa Sondagem Z (Probe Z)

    Note over Op,CNC: Usinagem Top
    SW->>CNC: Executa Remoção (1.5mm) e Isolação Top (VCut 60°)
    SW->>CNC: Executa Furos de Alinhamento (1.0mm - Cut Z = -3.9mm)

    Note over Op,CNC: Procedimento de Virada (Flip)
    Op->>SW: Ejeta Placa para a Frente
    Op->>CNC: Remove a Ferramenta do Spindle
    Op->>Op: Raspa rebarbas com Bit Quadrado de Aço Rápido
    Op->>CNC: Insere Pinos de Aço e Encaixa a Placa Virada (Flip Y)

    Note over Op,CNC: Usinagem Bottom & Recorte
    Op->>CNC: Fecha Tampa e Pressiona Botão Azul (REARME)
    Op->>SW: Executa Nova Sondagem Z
    SW->>CNC: Executa Isolação Bottom e Furações Internas
    SW->>CNC: Executa Recorte Final Edge.Cuts (1.5mm - Cut Z = -1.7mm)
```

### Parâmetros de Usinagem Final e Recorte

* **Recorte de Contorno (`Edge.Cuts`):**
  * **Ferramenta:** Fresa Laranja Escuro (`1,5 mm`).
  * **Cut Z:** `-1,7 mm` *(atravessa os 1,6 mm do substrato).*
  * **Travel Z:** `1,0 mm`.
  * **Feedrate:** `750 mm/min`.

### Check-list Pós-Usinagem
1. [ ] Ejetar a placa e remover a ferramenta do spindle.
2. [ ] Limpar a placa com palha de aço / álcool isopropílico para remover óxidos.
3. [ ] Testar a continuidade elétrica das trilhas e ausência de curtos com o multímetro.
4. [ ] Aplicar solda/ilhós nas vias de passagem entre as camadas Top e Bottom.