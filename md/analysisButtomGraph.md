Olhando para o código, a secção abaixo do gráfico principal é o **"UPDRS Progression Forecast"** — a linha de progressão temporal. Deixa-me detalhar cada elemento:

---

## 📉 UPDRS Progression Forecast — Secção Inferior ao Gráfico

Esta secção apresenta a **trajectória completa da doença ao longo do tempo**, desde o momento actual até ao fim do período de previsão do modelo. É essencialmente um gráfico de linha (sparkline) acompanhado de marcadores e uma legenda.

---

### Os Três Marcadores Superiores (Start / Peak / End)

```javascript
{ label: "Start", value: a.baseline }
{ label: "Peak",  value: a.peak     }
{ label: "End",   value: a.final    }
```

**Start — Valor Inicial (Baseline)**
É a pontuação UPDRS no momento em que os dados foram recolhidos — o ponto de partida da análise. Representa o estado actual do doente em termos de severidade motora. É a fotografia do momento presente.

**Peak — Valor Máximo Atingido**
É o ponto mais alto que a pontuação UPDRS atinge em qualquer momento ao longo de toda a janela de previsão. É importante porque nem sempre a progressão é linear — pode haver períodos de aceleração antes de estabilizar. O Peak indica o pior cenário projectado dentro do período analisado.

**End — Valor Final**
É a pontuação UPDRS estimada no último mês da janela de previsão. Representa o estado esperado do doente no final do horizonte temporal do modelo — seja 12, 24 ou mais meses. Comparar o Start com o End dá uma ideia imediata da magnitude total da progressão esperada.

---

### A Linha do Gráfico (Sparkline)

```javascript
<Sparkline data={a.predictions} color={COLORS.cyan} height={64} />
```

A linha azul que atravessa o gráfico representa a **trajectória mês a mês da pontuação UPDRS**, calculada pelo modelo LSSM. Cada ponto da linha corresponde a um mês de previsão. A forma da linha é extremamente informativa:

- **Linha ascendente suave** — progressão lenta e gradual, favorável
- **Linha ascendente abrupta** — progressão rápida, requer atenção clínica imediata
- **Linha com inflexão** — possível aceleração num determinado período, identificando uma janela crítica de intervenção
- **Linha que estabiliza** — sugestão de que a progressão pode abrandar ao longo do tempo

A área sombreada por baixo da linha não tem significado clínico directo — é apenas um elemento visual para facilitar a leitura da trajectória.

---

### A Legenda Inferior — As Quatro Linhas de Referência

```javascript
{ color: COLORS.yellow, label: "Moderate ≥ 20"         }
{ color: COLORS.red,    label: "Severe ≥ 40"            }
{ color: COLORS.yellow, label: `Moderate at m${a.criticalMonth}` }
{ color: COLORS.red,    label: `Severe at m${a.severeMonth}`     }
```

Estes quatro elementos da legenda são os mais clinicamente relevantes de toda a secção, pois identificam **limiares clínicos de gravidade** e **quando se espera que sejam atingidos**.

---

**Moderate ≥ 20 (linha amarela/dourada)**
O limiar de **20 pontos UPDRS** corresponde ao ponto a partir do qual a doença começa a ter **impacto funcional moderado** na vida diária do doente — dificuldades visíveis na marcha, na escrita, em tarefas de motricidade fina. Abaixo deste valor, os sintomas são geralmente ligeiros e bem tolerados.

**Severe ≥ 40 (linha vermelha)**
O limiar de **40 pontos UPDRS** corresponde a uma **incapacidade funcional significativa** — o doente começa a necessitar de apoio em actividades básicas do quotidiano, como vestir-se, alimentar-se ou deslocar-se de forma independente. É o limiar a partir do qual se considera que a doença entrou numa fase severa.

**Moderate at m[X] (mês crítico)**
Indica **em que mês concreto** se espera que a pontuação UPDRS atinja ou ultrapasse os 20 pontos. Este é provavelmente o dado mais accionável de toda a secção — diz ao clínico exactamente quando deve intensificar o acompanhamento ou considerar ajustes terapêuticos.

**Severe at m[X] (mês severo)**
Da mesma forma, indica **em que mês** se espera atingir os 40 pontos. Permite antecipar com precisão a janela em que o doente poderá necessitar de cuidados mais intensivos, reabilitação especializada ou eventual avaliação para intervenções como a estimulação cerebral profunda (DBS).

---

### Resumo Visual da Secção

| Elemento | O Que Mede | Relevância Clínica |
|---|---|---|
| **Start** | Estado actual do doente | Ponto de referência base |
| **Peak** | Pior momento projectado | Cenário mais adverso esperado |
| **End** | Estado no fim da janela | Progressão total acumulada |
| **Linha azul** | Trajectória mês a mês | Velocidade e forma da progressão |
| **Limiar ≥ 20** | Impacto funcional moderado | Quando agir preventivamente |
| **Limiar ≥ 40** | Incapacidade significativa | Quando planear cuidados intensivos |

---

> Em síntese, esta secção responde à pergunta mais importante que qualquer doente ou familiar coloca: **"Como vai evoluir a doença, e quando?"** — traduzindo a complexidade matemática do modelo preditivo numa narrativa temporal clara e clinicamente accionável.