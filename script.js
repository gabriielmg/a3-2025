// Primeiro, a gente "pega" todos os pedacinhos do nosso HTML que vamos usar no JavaScript.
// Assim, fica mais fácil trabalhar com eles depois.
const startSection = document.getElementById('start-section'); // A tela inicial do jogo
const subjectSelection = document.getElementById('subject-selection'); // A tela de escolher o ano
const gameSection = document.getElementById('game-section'); // A tela onde a gente joga de verdade
const endSection = document.getElementById('end-section'); // A tela que aparece no fim do jogo
const playerNameInput = document.getElementById('player-name'); // O campo onde a gente digita o nome
const startBtn = document.getElementById('start-btn'); // O botão "Começar"
const nameError = document.getElementById('name-error'); // Onde a gente mostra os erros do nome
const levelDisplay = document.getElementById('level-display'); // Onde aparece o "Ano: X"
const livesDisplay = document.getElementById('lives-display'); // Onde aparecem as vidas (os corações)
const xpDisplay = document.getElementById('xp-display'); // Onde aparece o XP do jogador
const progressBar = document.getElementById('progress-bar'); // A barrinha de progresso verde
const missionText = document.getElementById('mission'); // Onde a pergunta ou a introdução aparece
const optionsContainer = document.getElementById('options-container'); // A caixinha onde ficam os botões de resposta
const answerFeedback = document.getElementById('answer-feedback'); // Onde a gente diz se a resposta está certa ou errada
const prevBtn = document.getElementById('prev-btn'); // O botão "Anterior"
const nextBtn = document.getElementById('next-btn'); // O botão "Próxima"
const endTitle = document.getElementById('end-title'); // O título da tela final
const summaryText = document.getElementById('summary-text'); // O resumo do jogo na tela final
const historyList = document.getElementById('history-list'); // A lista de perguntas que a gente acertou
const restartBtn = document.getElementById('restart-btn'); // O botão "Jogar Novamente"
const backgroundMusic = document.getElementById('background-music'); // E a nossa música de fundo, claro!

// Carregando os sons que vão tocar durante o jogo (acerto, erro, game over)
// Basta mudar os caminhos para os seus arquivos de áudio!
const correctSound = new Audio('./music'); // Mude para o caminho do seu som de acerto
const wrongSound = new Audio('./audio/som_erro.mp3');   // Mude para o caminho do seu som de erro
const gameoverSound = new Audio('./audio/som_gameover.mp3'); // Mude para o caminho do seu som de game over

// Algumas variáveis que vão guardar o "estado" atual do nosso jogo.
// É tipo o caderninho de anotações do jogo, para ele saber onde está.
let playerName = ''; // Nome do jogador
let currentSubject = null; // O ano que a gente está estudando (1º, 2º, etc.)
let currentMissionIndex = 0; // Qual pergunta ou introdução estamos no momento
let mistakes = 0; // Quantas vezes a gente errou
const maxMistakes = 3; // O máximo de erros antes do "Game Over"
let totalCorrect = 0; // Quantas perguntas a gente acertou no total
let currentXP = 0; // Nossos pontos de experiência!
let correctAnswersHistory = []; // Uma lista das perguntas que acertamos
let missionsCurrentSubject = []; // Todas as perguntas e introduções para o ano escolhido
let hasAnsweredCurrentQuestion = false; // Uma bandeirinha para saber se já respondemos a pergunta atual

// Aqui estão os textinhos de introdução para cada ano.
// Eles aparecem antes das perguntas de cada fase.
const introductions = {
    1: 'Bem-vindo ao 1º Ano! Aqui vamos aprender somas e subtrações simples.',
    2: 'No 2º Ano, temos somas e subtrações um pouco maiores para praticar.',
    3: '3º Ano foca em multiplicação com exemplos simples.',
    4: '4º Ano trabalha com divisões simples.',
    5: '5º Ano traz operações combinadas com parênteses.',
    6: '6º Ano introduz equações básicas.',
    7: '7º Ano explora equações quadráticas.',
    8: '8º Ano usa sistemas de equações.',
    9: '9º Ano trata de álgebra avançada e proporções.'
};

// As missões (perguntas) de verdade! Cada uma tem um nível, a pergunta, a resposta certa e as opções.
const missions = [
    // 1º Ano (Soma e Subtração simples)
    { level: 1, intro: true, text: introductions[1] },
    { level: 1, question: 'Quanto é 2 + 1?', answer: 3, options: [2, 3, 4, 5, 1] },
    { level: 1, question: 'Quanto é 5 - 3?', answer: 2, options: [3, 2, 4, 5, 0] },
    { level: 1, question: 'Quanto é 4 + 4?', answer: 8, options: [7, 6, 8, 9, 5] },
    { level: 1, question: 'Quanto é 7 - 2?', answer: 5, options: [4, 6, 5, 3, 7] },
    { level: 1, question: 'Quanto é 3 + 6?', answer: 9, options: [8, 10, 9, 7, 11] },
    // 2º Ano (Soma e Subtração um pouco maiores)
    { level: 2, intro: true, text: introductions[2] },
    { level: 2, question: 'Quanto é 10 + 7?', answer: 17, options: [15, 18, 17, 20, 10] },
    { level: 2, question: 'Quanto é 14 - 5?', answer: 9, options: [7, 8, 9, 10, 6] },
    { level: 2, question: 'Quanto é 8 + 6?', answer: 14, options: [13, 14, 15, 12, 11] },
    { level: 2, question: 'Quanto é 12 - 9?', answer: 3, options: [3, 4, 5, 2, 1] },
    { level: 2, question: 'Quanto é 9 + 8?', answer: 17, options: [16, 17, 14, 15, 20] },
    // 3º Ano (Multiplicação simples)
    { level: 3, intro: true, text: introductions[3] },
    { level: 3, question: 'Quanto é 3 x 4?', answer: 12, options: [7, 8, 12, 10, 14] },
    { level: 3, question: 'Quanto é 5 x 3?', answer: 15, options: [15, 10, 20, 18, 12] },
    { level: 3, question: 'Quanto é 6 x 2?', answer: 12, options: [10, 12, 14, 16, 11] },
    { level: 3, question: 'Quanto é 4 x 4?', answer: 16, options: [12, 14, 15, 16, 13] },
    // 4º Ano (Divisão simples)
    { level: 4, intro: true, text: introductions[4] },
    { level: 4, question: 'Quanto é 12 ÷ 4?', answer: 3, options: [2, 3, 4, 5, 6] },
    { level: 4, question: 'Quanto é 18 ÷ 3?', answer: 6, options: [3, 5, 6, 4, 7] },
    { level: 4, question: 'Quanto é 20 ÷ 5?', answer: 4, options: [3, 4, 5, 6, 7] },
    { level: 4, question: 'Quanto é 24 ÷ 6?', answer: 4, options: [4, 3, 5, 6, 7] },
    // 5º Ano (Operações combinadas com parênteses)
    { level: 5, intro: true, text: introductions[5] },
    { level: 5, question: 'Quanto é (4 + 3) x 2?', answer: 14, options: [12, 14, 16, 10, 8] },
    { level: 5, question: 'Quanto é 5 + (6 x 3)?', answer: 23, options: [20, 23, 18, 25, 21] },
    { level: 5, question: 'Quanto é (8 - 3) x 4?', answer: 20, options: [15, 20, 22, 18, 24] },
    { level: 5, question: 'Quanto é 7 x (2 + 3)?', answer: 35, options: [30, 35, 32, 28, 36] },
    // 6º Ano (Equações básicas)
    { level: 6, intro: true, text: introductions[6] },
    { level: 6, question: 'Resolva: x + 5 = 10. Quanto é x?', answer: 5, options: [3, 4, 5, 6, 7] },
    { level: 6, question: 'Resolva: 2x = 14. Quanto é x?', answer: 7, options: [6, 7, 8, 5, 9] },
    { level: 6, question: 'Resolva: x - 3 = 4. Quanto é x?', answer: 7, options: [5, 6, 7, 8, 9] },
    // 7º Ano (Equações quadráticas)
    { level: 7, intro: true, text: introductions[7] },
    { level: 7, question: 'Qual a solução de x² = 9?', answer: 3, options: [3, -3, 9, 0, 1] }, // A gente simplificou para pegar só a raiz positiva aqui
    { level: 7, question: 'Qual a solução de x² = 16?', answer: 4, options: [3, 4, 5, 6, 2] },
    { level: 7, question: 'Qual a solução de x² = 25?', answer: 5, options: [4, 5, 6, 7, 8] },
    // 8º Ano (Sistemas de equações simples)
    { level: 8, intro: true, text: introductions[8] },
    { level: 8, question: 'Resolva: 2x + 3y = 12, y = 3. Quanto é x?', answer: 1.5, options: [1, 1.5, 2, 3, 2.5] },
    { level: 8, question: 'Resolva: x - y = 5, y = 2, x = ?', answer: 7, options: [5, 6, 7, 8, 9] },
    { level: 8, question: 'Resolva: 3x + 4y = 24, y = 3. Quanto é x?', answer: 4, options: [3, 4, 5, 6, 7] },
    // 9º Ano (Álgebra avançada e proporções)
    { level: 9, intro: true, text: introductions[9] },
    { level: 9, question: 'Qual a razão entre 4 e 12?', answer: '1:3', options: ['1:2', '1:3', '2:3', '3:4', '4:12'] },
    { level: 9, question: 'Qual o valor de x na proporção 3:x = 6:12?', answer: 6, options: [4, 5, 6, 7, 8] },
    { level: 9, question: 'Resolva a proporção: 5:x = 15:45. Quanto é x?', answer: 15, options: [10, 15, 20, 25, 30] }
];

/**
 * Pega as missões (perguntas) de um ano específico e coloca as introduções no começo.
 * Isso ajuda a gente a sempre ver a introdução da fase primeiro.
 * @param {number} subjectNum - O número do ano que a gente quer (ex: 1 para 1º Ano).
 * @returns {Array} Uma lista organizada das missões para aquele ano.
 */
function getMissionsBySubject(subjectNum) {
    return missions.filter(m => m.level === subjectNum) // Filtra as missões que pertencem a esse ano
        .sort((a, b) => {
            // Se for uma introdução, ela vem antes de qualquer outra missão
            if (a.intro && !b.intro) return -1;
            if (!a.intro && b.intro) return 1;
            return 0; // Mantém a ordem original se não for uma introdução específica
        });
}

/**
 * Mistura os elementos de um array de forma aleatória.
 * Isso é super útil para embaralhar as opções de resposta e não ficar previsível!
 * @param {Array} array - O array que a gente quer misturar.
 * @returns {Array} Um novo array com os elementos misturados.
 */
function shuffleArray(array) {
    const arr = [...array]; // A gente faz uma cópia para não mexer no array original
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Gera um número aleatório para trocar
        [arr[i], arr[j]] = [arr[j], arr[i]]; // Troca os elementos de lugar
    }
    return arr;
}

/**
 * Checa se o nome que o jogador digitou é válido.
 * Se não for, a gente mostra uma mensagem de erro bem visível.
 * @returns {boolean} `true` se o nome estiver ok, `false` se tiver algo errado.
 */
function validateName() {
    const name = playerNameInput.value.trim(); // Pega o nome e tira os espaços extras
    if (!name) {
        nameError.textContent = "Ops, esquecemos o nome! Por favor, digite seu nome.";
        nameError.classList.add("visible");
        return false;
    }
    if (name.length > 20) {
        nameError.textContent = "Nome muito longo! Tente um nome com até 20 caracteres.";
        nameError.classList.add("visible");
        return false;
    }
    // Verifica se tem algum caractere estranho no nome (só aceita letras e espaços)
    if (/[^a-zA-ZÀ-ÿ\s]/.test(name)) {
        nameError.textContent = "O nome só pode ter letras e espaços, sem símbolos ou números.";
        nameError.classList.add("visible");
        return false;
    }
    nameError.textContent = ""; // Se tudo estiver certo, a gente limpa a mensagem de erro
    nameError.classList.remove("visible");
    return true;
}

/**
 * Atualiza o estado do botão "Começar".
 * Ele só fica clicável se o nome do jogador for válido.
 */
function updateButtonState() {
    startBtn.disabled = !validateName(); // Desabilita o botão se o nome não for válido
}

// Quando a página termina de carregar, a gente já coloca o cursor no campo do nome
// e atualiza o botão "Começar" pra ver se já dá pra clicar.
window.onload = () => {
    playerNameInput.focus(); // O cursor pisca no campo do nome
    updateButtonState(); // Vê se o botão de iniciar já pode ser clicado
};

// Fica de olho no que a gente digita no campo do nome para validar em tempo real
playerNameInput.addEventListener('input', updateButtonState);

/**
 * Atualiza as informações que aparecem lá em cima na tela do jogo:
 * o ano que estamos, quantas vidas restam (os coraçõezinhos) e nosso XP.
 */
function updateStatus() {
    levelDisplay.textContent = `Ano: ${currentSubject}`; // Mostra o ano atual
    const hearts = '❤️'.repeat(maxMistakes - mistakes); // Desenha os corações com base nas vidas
    livesDisplay.textContent = `Vidas: ${hearts}`; // Atualiza o display de vidas
    xpDisplay.textContent = `XP: ${currentXP}`; // Atualiza o XP
}

/**
 * Faz a barra de progresso avançar.
 * Ela mostra o quanto do ano atual a gente já "concluiu".
 */
function updateProgress() {
    // A gente só conta as missões de verdade (sem as introduções) para o progresso
    const missionsForProgress = missionsCurrentSubject.filter(m => !m.intro).length;
    // Quantas missões de verdade a gente já passou
    const completedMissions = missionsCurrentSubject.filter((m, i) => i < currentMissionIndex && !m.intro).length;
    
    let progressRatio = 0;
    if (missionsForProgress > 0) {
        progressRatio = completedMissions / missionsForProgress;
    }
    
    // Garante que a barra não passe de 100%
    if (progressRatio > 1) progressRatio = 1;

    progressBar.style.width = `${Math.round(progressRatio * 100)}%`; // Ajusta a largura da barra
}


/**
 * Mostra a pergunta ou a introdução atual na tela.
 * Também cuida de habilitar/desabilitar os botões de navegação e opções.
 */
function showMission() {
    answerFeedback.textContent = ''; // Limpa qualquer mensagem de acerto/erro antiga
    optionsContainer.innerHTML = ''; // Tira os botões de resposta antigos
    updateProgress(); // Atualiza a barra de progresso
    updateStatus(); // Atualiza as informações de vidas e XP

    const mission = missionsCurrentSubject[currentMissionIndex]; // Pega a missão atual
    if (!mission) {
        console.error("Ops, parece que não tem missão nesse índice. Acho que terminamos o jogo!");
        finishGame(true); // Se não achou missão, considera que o jogo foi completado
        return;
    }

    hasAnsweredCurrentQuestion = false; // Reseta a flag para a nova pergunta: ela ainda não foi respondida

    if (mission.intro) {
        // Se for uma introdução, a gente mostra o texto explicativo
        missionText.innerHTML = `<strong>Introdução ao ano ${mission.level}:</strong><br>${mission.text}`;
        optionsContainer.innerHTML = `<p style="font-style: italic; text-align:center; color: var(--color-text-secondary);">Pressione "Próxima" para continuar</p>`;
        
        // Na introdução, o botão "Anterior" só fica ativo se não for a primeira missão
        prevBtn.disabled = currentMissionIndex === 0;
        // O botão "Próxima" sempre fica ativo na introdução para a gente poder avançar
        nextBtn.disabled = false;
    } else {
        // Se for uma pergunta, a gente mostra a pergunta e as opções
        missionText.textContent = mission.question;
        // Embaralha as opções e cria um botão para cada uma
        shuffleArray(mission.options).forEach(option => {
            const btn = document.createElement('button');
            btn.className = 'option-btn'; // Adiciona a classe CSS para o estilo do botão
            btn.textContent = option; // O texto do botão será a opção
            btn.setAttribute('aria-label', `Opção ${option}`); // Ajuda na acessibilidade para leitores de tela
            btn.onclick = () => handleAnswer(option); // Define o que acontece quando o botão é clicado
            optionsContainer.appendChild(btn); // Adiciona o botão na tela
        });
        // A gente desabilita o botão "Próxima" até o jogador responder
        nextBtn.disabled = true;
        // O botão "Anterior" só fica ativo se não for a primeira missão do ano
        prevBtn.disabled = currentMissionIndex === 0;
    }
}

/**
 * Verifica se a resposta que o jogador escolheu está correta.
 * @param {any} selectedOption - A opção que o jogador selecionou.
 * @returns {boolean} `true` se acertou, `false` se errou.
 */
function isCorrectAnswer(selectedOption) {
    const mission = missionsCurrentSubject[currentMissionIndex];
    if (!mission) return false;

    // Se a resposta certa for um array (tipo, várias opções poderiam ser certas, embora não seja o caso aqui), a gente verifica se a opção está nesse array
    if (Array.isArray(mission.answer)) return mission.answer.includes(selectedOption);
    // Se a resposta for um número, a gente compara. E pra garantir, a gente lida com números decimais também.
    if (typeof mission.answer === "number" && !isNaN(mission.answer)) {
        return Math.abs(Number(selectedOption) - mission.answer) < 0.0001; // Uma margem de erro bem pequena para decimais
    }
    // Para outros tipos de resposta (como texto), a gente só compara direto
    return selectedOption === mission.answer;
}

/**
 * Dá um destaque visual à opção que o jogador selecionou,
 * mostrando se acertou ou errou, e desabilita os outros botões.
 * @param {any} optionValue - O valor da opção que foi clicada.
 * @param {boolean} correct - Se a opção estava correta (`true`) ou não (`false`).
 */
function highlightOption(optionValue, correct) {
    const buttons = optionsContainer.querySelectorAll('button.option-btn'); // Pega todos os botões de opção
    buttons.forEach(btn => {
        // Encontra o botão que corresponde à opção clicada
        if (btn.textContent == optionValue || (typeof optionValue === 'number' && Number(btn.textContent) === optionValue)) {
            // Muda a cor da borda, do fundo e do texto para indicar acerto ou erro
            btn.style.borderColor = correct ? 'var(--color-success)' : 'var(--color-error)';
            btn.style.backgroundColor = correct ? '#dcfce7' : '#fee2e2';
            btn.style.color = correct ? 'var(--color-success)' : 'var(--color-error)';
            btn.setAttribute('aria-pressed', 'true'); // Marca para acessibilidade
        } else {
            btn.setAttribute('aria-pressed', 'false');
        }
    });
}

/**
 * Desabilita todos os botões de opção de resposta depois que o jogador responde.
 * Assim, ele não consegue clicar em mais de uma opção.
 */
function disableOptions() {
    Array.from(optionsContainer.children).forEach(btn => btn.disabled = true);
}

/**
 * Lida com o que acontece quando o jogador clica em uma das opções de resposta.
 * Verifica se acertou, atualiza o jogo e mostra o feedback.
 * @param {any} selectedOption - A opção que o jogador escolheu.
 */
function handleAnswer(selectedOption) {
    const mission = missionsCurrentSubject[currentMissionIndex];
    // Se for uma introdução ou se já respondemos, a gente ignora o clique
    if (mission.intro || hasAnsweredCurrentQuestion) return; 

    hasAnsweredCurrentQuestion = true; // Marca que a pergunta atual foi respondida

    const correct = isCorrectAnswer(selectedOption); // Vê se a resposta está certa
    if (correct) {
        correctSound.play(); // Toca o som de acerto
        totalCorrect++; // Aumenta a contagem de acertos
        currentXP += 10; // Ganha 10 XP!
        correctAnswersHistory.push(missionsCurrentSubject[currentMissionIndex].question); // Adiciona a pergunta ao histórico de acertos
        answerFeedback.textContent = 'Resposta correta! Boa!';
        answerFeedback.className = 'feedback success'; // Coloca a cor verde no feedback
        highlightOption(selectedOption, true); // Destaca a opção como correta
    } else {
        wrongSound.play(); // Toca o som de erro
        mistakes++; // Aumenta a contagem de erros
        answerFeedback.textContent = `Resposta incorreta! Mas não desista! Vidas restantes: ${maxMistakes - mistakes}`;
        answerFeedback.className = 'feedback error'; // Coloca a cor vermelha no feedback
        highlightOption(selectedOption, false); // Destaca a opção como incorreta
        if (mistakes >= maxMistakes) {
            gameoverSound.play(); // Toca o som de game over
            // Um pequeno atraso para o som terminar antes de mostrar a tela final
            setTimeout(() => finishGame(false), 1800); 
            return; // Termina a função aqui para não ir para a próxima etapa
        }
    }
    disableOptions(); // Desabilita todos os botões de opção
    // Habilita o botão "Próxima" depois de um tempo para o jogador ver o feedback
    setTimeout(() => {
        nextBtn.disabled = false;
        // Se já estamos na última pergunta e ela foi respondida, o botão vira "Terminar"
        if (currentMissionIndex === missionsCurrentSubject.length - 1) {
            nextBtn.textContent = 'Terminar'; 
            nextBtn.focus(); // Coloca o foco no botão "Terminar"
        }
    }, 1200);
}

/**
 * Leva o jogador para a tela final do jogo, mostrando se ele ganhou ou perdeu.
 * @param {boolean} won - `true` se o jogador venceu, `false` se perdeu.
 */
function finishGame(won) {
    gameSection.classList.add('hidden'); // Esconde a tela de jogo
    endSection.classList.remove('hidden'); // Mostra a tela final
    
    // É importante pausar a música de fundo e resetá-la para o começo, caso o jogador jogue de novo
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0; 

    missionText.textContent = ''; // Limpa o texto da pergunta
    answerFeedback.textContent = ''; // Limpa o feedback de resposta
    
    nextBtn.disabled = true; // Desabilita os botões de navegação na tela final
    prevBtn.disabled = true;
    optionsContainer.innerHTML = ''; // Limpa os botões de opção

    if (won) {
        endTitle.textContent = `Parabéns, ${playerName}! Você completou o ano! 🎉`;
    } else {
        endTitle.textContent = `Que pena, ${playerName}! Game Over! 😞`;
    }
    summaryText.textContent = `Você acertou ${totalCorrect} questão(ões) e fez ${currentXP} XP.`;

    // Mostra a lista das perguntas que o jogador acertou
    historyList.innerHTML = correctAnswersHistory.length === 0
        ? '<li>Nenhum acerto desta vez, mas continue tentando!</li>'
        : correctAnswersHistory.map((q, i) => `<li>Questão ${i + 1}: ${q}</li>`).join('');
    
    // Volta o texto do botão "Próxima" para o padrão, para a próxima partida
    nextBtn.textContent = 'Próxima';
}

/**
 * Reinicia o jogo do zero, voltando para a tela de início
 * e zerando todas as variáveis de estado.
 */
function restartGame() {
    endSection.classList.add('hidden'); // Esconde a tela final
    startSection.classList.remove('hidden'); // Mostra a tela de início
    subjectSelection.classList.add('hidden'); // Garante que a seleção de ano esteja escondida
    gameSection.classList.add('hidden'); // Garante que a tela de jogo esteja escondida

    playerNameInput.value = ''; // Limpa o nome digitado
    answerFeedback.textContent = ''; // Limpa feedback
    nameError.textContent = ''; // Limpa erros do nome
    startBtn.disabled = true; // Desabilita o botão "Começar"
    playerNameInput.focus(); // Coloca o foco de volta no campo do nome

    // Zera todas as variáveis do jogo para uma nova partida
    playerName = '';
    currentSubject = null;
    missionsCurrentSubject = [];
    currentMissionIndex = 0;
    mistakes = 0;
    totalCorrect = 0;
    currentXP = 0;
    correctAnswersHistory = [];
    hasAnsweredCurrentQuestion = false;

    // Pausa e reseta a música de fundo
    backgroundMusic.pause(); 
    backgroundMusic.currentTime = 0;
}

// Quando o botão "Começar" é clicado:
startBtn.addEventListener('click', () => {
    if (!validateName()) { // Se o nome não estiver ok, a gente não avança
        playerNameInput.focus(); // Volta o foco para o campo do nome
        return;
    }
    playerName = playerNameInput.value.trim(); // Guarda o nome do jogador
    startSection.classList.add('hidden'); // Esconde a tela inicial
    subjectSelection.classList.remove('hidden'); // Mostra a tela de seleção de ano
    playerNameInput.blur(); // Tira o foco do campo do nome
});

// Permite que a gente pressione "Enter" no campo do nome para iniciar o jogo (se o botão estiver habilitado)
playerNameInput.addEventListener('keydown', e => {
    if (e.key === "Enter" && !startBtn.disabled) {
        startBtn.click(); // Simula um clique no botão "Começar"
    }
});

// Para cada botão de seleção de ano, a gente adiciona uma função para quando for clicado
document.querySelectorAll('.subject-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        currentSubject = Number(btn.dataset.subject); // Pega o número do ano do botão
        missionsCurrentSubject = getMissionsBySubject(currentSubject); // Carrega as perguntas daquele ano
        currentMissionIndex = 0; // Começa na primeira missão
        mistakes = 0; // Zera os erros
        totalCorrect = 0; // Zera os acertos
        currentXP = 0; // Zera o XP
        correctAnswersHistory = []; // Limpa o histórico de acertos
        hasAnsweredCurrentQuestion = false; // Reseta a flag de resposta para a nova fase

        subjectSelection.classList.add('hidden'); // Esconde a seleção de ano
        gameSection.classList.remove('hidden'); // Mostra a tela do jogo

        updateStatus(); // Atualiza as informações de status
        showMission(); // Mostra a primeira missão/introdução do ano

        // No começo do ano, o botão "Anterior" fica desabilitado
        prevBtn.disabled = true;
        // O botão "Próxima" só fica desabilitado se a primeira missão não for uma introdução
        nextBtn.disabled = !missionsCurrentSubject[currentMissionIndex].intro;

        // Tenta tocar a música de fundo quando o jogo de verdade começa
        backgroundMusic.volume = 0.3; // Define o volume da música (entre 0 e 1)
        backgroundMusic.play().catch(e => console.error("Erro ao reproduzir música:", e)); // Toca a música, e se der erro, avisa no console
    });
});

// Quando o botão "Anterior" é clicado:
prevBtn.addEventListener('click', () => {
    if (currentMissionIndex === 0) return; // Não faz nada se já estiver na primeira missão
    currentMissionIndex--; // Volta para a missão anterior
    showMission(); // Mostra a nova missão
});

// Quando o botão "Próxima" é clicado:
nextBtn.addEventListener('click', () => {
    const lastMissionIndex = missionsCurrentSubject.length - 1; // Pega o índice da última missão

    if (currentMissionIndex === lastMissionIndex) {
        // Se estamos na última missão e clicamos em "Próxima" (que agora é "Terminar"), finaliza o jogo!
        finishGame(true);
    } else {
        currentMissionIndex++; // Avança para a próxima missão
        showMission(); // Mostra a nova missão
    }
});

// Quando o botão "Jogar Novamente" é clicado na tela final
restartBtn.addEventListener('click', restartGame);