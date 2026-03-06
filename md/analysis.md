# Glossário de Variáveis — Análise Dopaminérgica (DatScan)

---

## 🧠 Regiões Cerebrais Avaliadas

**Caudado Direito / Esquerdo (`caudateR` / `caudateL`)**
Estruturas em forma de vírgula localizadas no centro do cérebro, responsáveis pelo planeamento e iniciação do movimento. Pense nelas como os *controladores de arranque* de um motor: regulam o impulso inicial de qualquer acção motora. Os valores são medidos em SBR (Striatal Binding Ratio).

**Putâmen Direito / Esquerdo (`putamenR` / `putamenL`)**
Estruturas ovais adjacentes ao caudado, mais envolvidas na *execução contínua* do movimento — o refinamento e a fluidez. Se o caudado é o arranque do motor, o putâmen é a caixa de velocidades: garante que o movimento decorra de forma suave e controlada.

---

## 📊 Métricas Derivadas

**Absorção Média (`avgUptake`)**
Média dos quatro valores SBR. Representa a "saúde geral" do sistema dopaminérgico — quanto maior, mais transportadores de dopamina activos. É como medir o nível de combustível num reservatório: quanto mais alto, melhor o funcionamento do sistema.

**Índice de Assimetria (`asymmetry`)**
Diferença entre os hemisférios direito e esquerdo. A Doença de Parkinson frequentemente inicia de forma assimétrica — um lado degrada antes do outro. Imagine uma balança com pesos diferentes em cada prato: quanto maior o desequilíbrio, mais significativa a assimetria clínica.

**Índice de Risco (`riskScore`)**
Valor percentual (0–100%) que estima a probabilidade de progressão significativa da doença. Funciona como um *barómetro de tempestade*: valores baixos indicam céu limpo; valores elevados apontam para perturbação iminente que merece atenção clínica.

---

## 📈 Projecções Longitudinais

**Projecção a +1 Ano / +2 Anos (`projection1yr` / `projection2yr`)**
Estimativas da pontuação UPDRS (escala de avaliação motora do Parkinson) em 12 e 24 meses, calculadas por um modelo de progressão. É comparável à previsão meteorológica a longo prazo: não é uma certeza, mas fornece uma trajectória provável com base nos dados actuais.

**Taxa Mensal de Progressão (`monthlyRate`)**
Velocidade a que a pontuação UPDRS aumenta por mês. Uma taxa elevada indica progressão rápida — como a velocidade de um veículo: saber a que ritmo nos aproximamos do destino permite planear a viagem (e os cuidados) com maior antecedência.

---

> ⚠️ **Nota Importante:** Todos estes valores são gerados para fins de investigação e educação clínica. Não substituem o diagnóstico médico formal realizado por um especialista em neurologia.

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
# Glossário Descritivo — Análise Dopaminérgica (DatScan)

---

## 🧠 O Sistema Dopaminérgico — Contexto Geral

Antes de explorar cada variável, é essencial compreender o que está a ser medido. O cérebro humano comunica através de mensageiros químicos chamados **neurotransmissores**. A **dopamina** é um desses mensageiros, e desempenha um papel central no controlo do movimento, na motivação e na coordenação motora. Na Doença de Parkinson, as células que produzem dopamina vão morrendo progressivamente, o que se reflecte numa redução dos chamados **transportadores de dopamina** — proteínas que fazem a dopamina circular de forma eficiente entre neurónios.

O exame **DatScan** é uma técnica de imagiologia nuclear que permite visualizar e quantificar esses transportadores em vida, sem necessidade de cirurgia. Os valores que se seguem são o resultado directo desta avaliação.

---

## 🔵 Regiões Cerebrais — O Núcleo Estriado

O **núcleo estriado** é uma estrutura profunda do cérebro, composta por dois territórios principais: o **caudado** e o **putâmen**. É aqui que a dopamina actua para coordenar o movimento. Quando estas regiões perdem transportadores, o movimento torna-se lento, rígido e descoordenado — os sinais clássicos do Parkinson.

---

### `caudateR` e `caudateL` — Núcleo Caudado (Direito e Esquerdo)

O **núcleo caudado** é uma estrutura em forma de vírgula alongada, uma de cada lado do cérebro. A sua principal função é participar no **planeamento e iniciação do movimento** — ou seja, é responsável pelo momento em que o cérebro decide agir e emite o primeiro comando motor.

**Analogia:** Imagine o caudado como o *botão de ignição* de um automóvel. Quando está em bom estado, o motor arranca de imediato, sem hesitação. Quando os seus transportadores de dopamina diminuem, o arranque torna-se demorado, incerto — a pessoa demora mais a iniciar um movimento, como se o botão precisasse de ser pressionado várias vezes antes de responder.

Os valores são expressos em **SBR (Striatal Binding Ratio)**, que representa a densidade de transportadores activos nessa região. Valores mais altos indicam maior integridade neuronal. O intervalo considerado normal situa-se entre **2.5 e 5.0 SBR**.

---

### `putamenR` e `putamenL` — Putâmen (Direito e Esquerdo)

O **putâmen** é uma estrutura oval, também uma de cada lado, localizada junto ao caudado. Enquanto o caudado inicia o movimento, o putâmen é responsável pela sua **execução contínua, fluidez e automatização** — é ele que garante que movimentos repetidos (como caminhar, escrever ou apertar um botão) se tornem automáticos e coordenados.

**Analogia:** Se o caudado é o botão de ignição, o putâmen é a *caixa de velocidades e o sistema de direcção*. Permite que o veículo avance de forma suave, sem solavancos, e que o condutor não precise de pensar conscientemente em cada pequeno ajuste do volante. Quando o putâmen perde função, os movimentos tornam-se descoordenados, trémulos e deixam de ser automáticos — a pessoa tem de pensar activamente em cada passo que dá.

Na Doença de Parkinson, o **putâmen é tipicamente afectado mais cedo e de forma mais severa** do que o caudado, o que explica porque os sintomas motores são tão proeminentes desde o início da doença.

---

## 📊 Métricas Derivadas — O Que os Números Revelam em Conjunto

### `avgUptake` — Absorção Média

Este valor é calculado como a **média aritmética dos quatro valores SBR** (caudado direito, caudado esquerdo, putâmen direito e putâmen esquerdo). Representa uma visão global da saúde do sistema dopaminérgico como um todo, independentemente de assimetrias entre hemisférios.

**Analogia:** Imagine que o cérebro dopaminérgico é uma cidade com quatro centrais eléctricas — duas no lado direito, duas no esquerdo. A absorção média é como medir a *produção combinada de energia* dessas quatro centrais. Se a média for alta, a cidade está bem iluminada. Se for baixa, há apagões frequentes — os movimentos tornam-se lentos, rígidos e imprevisíveis.

Um valor superior a **3.5 SBR** indica excelente integridade dopaminérgica. Entre **2.5 e 3.5** sugere redução ligeira a moderada. Abaixo de **2.5** aponta para declínio significativo que merece seguimento clínico atento.

---

### `asymmetry` — Índice de Assimetria

Este índice mede a **diferença de actividade dopaminérgica entre o hemisfério direito e o esquerdo**, calculando a soma das diferenças absolutas entre caudado direito/esquerdo e putâmen direito/esquerdo. É um dos marcadores mais informativos na Doença de Parkinson, porque esta doença tem uma característica muito particular: **começa quase sempre de forma assimétrica**, afectando um lado do corpo antes do outro.

**Analogia:** Pense numa balança de dois pratos perfeitamente equilibrada. Em condições normais, os dois hemisférios cerebrais produzem quantidades semelhantes de dopamina — a balança está nivelada. Na Doença de Parkinson, um dos lados começa a perder transportadores mais rapidamente, inclinando a balança. Quanto maior a inclinação, mais evidente é a assimetria clínica — e é precisamente por isso que muitos doentes com Parkinson referem que o tremor ou a rigidez começa apenas num braço ou numa perna, e só mais tarde se generaliza.

Um índice de assimetria elevado é, portanto, um sinal de alerta importante, mesmo quando os valores absolutos de SBR ainda se encontram dentro de limites aceitáveis.

---

### `riskScore` — Índice de Risco

O índice de risco é um valor percentual entre **0% e 100%** que combina as informações da absorção média com a trajectória de progressão prevista pelo modelo, para estimar a probabilidade de impacto clínico significativo no horizonte de 12 meses.

**Analogia:** Funciona como o *índice UV* de uma previsão meteorológica — não descreve apenas o tempo que está agora, mas avalia o risco de exposição a condições adversas num futuro próximo. Um índice UV de 1 significa que pode sair à rua sem protecção. Um índice de 10 significa que deve tomar precauções sérias. Da mesma forma, um risco de 10% indica uma trajectória benigna que requer apenas vigilância; um risco de 70% sugere que a progressão está a acelerar e que intervenções clínicas proactivas devem ser consideradas.

---

## 📈 Projecções Longitudinais — Olhar Para o Futuro

O modelo matemático utilizado (LSSM — *Latent State Space Model*) analisa a trajectória actual da doença e projecta a sua evolução ao longo do tempo. Os valores seguintes são expressos em **UPDRS (Unified Parkinson's Disease Rating Scale)**, a escala clínica padrão para medir a gravidade dos sintomas motores do Parkinson. Esta escala vai de 0 (sem sintomas) a 60+ (sintomas graves).

---

### `projection1yr` e `projection2yr` — Projecção a +1 e +2 Anos

Estas variáveis representam a **pontuação UPDRS estimada** para daqui a 12 e 24 meses, respectivamente, com base na trajectória actual de progressão da doença.

**Analogia:** Imagine que está a conduzir numa auto-estrada e o GPS não apenas lhe diz onde está agora, mas calcula onde estará se mantiver a mesma velocidade e direcção daqui a uma hora e a duas horas. Estas projecções funcionam exactamente assim — não são uma certeza absoluta, mas são uma estimativa fundamentada, calculada com base em padrões de progressão observados em milhares de doentes com perfis semelhantes. Permitem ao clínico antecipar o grau de incapacidade esperado e planear intervenções terapêuticas com antecedência, em vez de reagir apenas quando os sintomas se agravam.

---

### `monthlyRate` — Taxa Mensal de Progressão

Este valor representa a **velocidade média de aumento da pontuação UPDRS por mês** — ou seja, quão rapidamente a doença está a progredir ao longo do tempo.

**Analogia:** Se a pontuação UPDRS é a distância a percorrer até um destino indesejado, a taxa mensal de progressão é a **velocidade do veículo**. Uma taxa de 0.2 por mês significa que o veículo avança devagar — há tempo para planear e agir. Uma taxa de 1.5 por mês significa que o veículo está a alta velocidade — a intervenção terapêutica urgente é fundamental para travar ou reduzir essa progressão. Valores superiores a 0.6 por mês são considerados indicativos de progressão rápida e justificam reavaliação terapêutica imediata.

---

> ⚠️ **Nota Importante:** Todas as variáveis e projecções apresentadas neste relatório foram geradas por um modelo de inteligência artificial para fins de investigação científica e educação clínica avançada. Não constituem, em nenhuma circunstância, um diagnóstico médico formal. A interpretação clínica definitiva deve ser sempre realizada por um médico especialista em neurologia, com base no conjunto completo da história clínica do doente.