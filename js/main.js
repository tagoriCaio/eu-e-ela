let highestZ = 1; // Variável global para controlar a ordem de empilhamento (z-index) dos papéis.

class Paper {
    holdingPaper = false; // Indica se o papel está sendo "segurado" (arrastado).
    mouseTouchX = 0;      // Coordenada X inicial do toque/clique para cálculo de deslocamento.
    mouseTouchY = 0;      // Coordenada Y inicial do toque/clique para cálculo de deslocamento.
    
    // As variáveis mouseX, mouseY, prevMouseX, prevMouseY, velX, velY
    // serão adaptadas para lidar com touch events.
    currentX = 0;         // Posição X atual do cursor/toque.
    currentY = 0;         // Posição Y atual do cursor/toque.
    prevX = 0;            // Posição X anterior do cursor/toque.
    prevY = 0;            // Posição Y anterior do cursor/toque.
    velX = 0;             // Velocidade de deslocamento no eixo X.
    velY = 0;             // Velocidade de deslocamento no eixo Y.

    rotation = Math.random() * 30 - 15; // Rotação inicial aleatória para o papel.
    currentPaperX = 0;    // Posição X atual do papel na tela.
    currentPaperY = 0;    // Posição Y atual do papel na tela.
    rotating = false;     // Indica se o papel está sendo girado.

    init(paper) {
        // --- Eventos de Toque (Touch Events) ---

        // Evento 'touchmove': Similar ao 'mousemove' para dispositivos de toque.
        // É disparado quando um ou mais pontos de toque são alterados.
        document.addEventListener('touchmove', (e) => {
            // Previne o comportamento padrão de rolagem da página ao tocar.
            e.preventDefault(); 
            
            // Pega as coordenadas do primeiro toque na tela.
            // e.touches é uma TouchList, um array de objetos Touch.
            const touch = e.touches[0]; 

            if (!this.rotating) {
                this.currentX = touch.clientX; // Posição X do toque atual.
                this.currentY = touch.clientY; // Posição Y do toque atual.
                // Calcula a velocidade de deslocamento.
                this.velX = this.currentX - this.prevX; 
                this.velY = this.currentY - this.prevY;
            }

            // Cálculo da direção e ângulo para rotação.
            // Aqui, usamos as coordenadas do toque para calcular o vetor de direção.
            const dirX = touch.clientX - this.mouseTouchX;
            const dirY = touch.clientY - this.mouseTouchY;
            const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
            const dirNormalizedX = dirX / dirLength;
            const dirNormalizedY = dirY / dirLength;
            const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
            let degrees = 180 * angle / Math.PI;
            degrees = (360 + Math.round(degrees)) % 360;

            if (this.rotating) {
                this.rotation = degrees; // Atualiza a rotação se estiver no modo de rotação.
            }

            if (this.holdingPaper) {
                if (!this.rotating) {
                    this.currentPaperX += this.velX; // Move o papel na horizontal.
                    this.currentPaperY += this.velY; // Move o papel na vertical.
                }
                this.prevX = this.currentX; // Atualiza a posição X anterior.
                this.prevY = this.currentY; // Atualiza a posição Y anterior.

                // Aplica as transformações CSS para mover e girar o papel.
                paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
            }
        });

        // Evento 'touchstart': Similar ao 'mousedown' para dispositivos de toque.
        // Disparado quando um ou mais pontos de toque são colocados na superfície.
        paper.addEventListener('touchstart', (e) => {
            if (this.holdingPaper) return; // Se já estiver segurando, não faz nada.
            this.holdingPaper = true;      // Começa a segurar o papel.

            paper.style.zIndex = highestZ; // Coloca o papel no topo da pilha.
            highestZ += 1;                 // Incrementa o z-index para o próximo papel.

            // Pega as coordenadas do primeiro toque.
            const touch = e.touches[0];
            this.mouseTouchX = touch.clientX; // Coordenada X do toque inicial.
            this.mouseTouchY = touch.clientY; // Coordenada Y do toque inicial.
            this.prevX = touch.clientX;       // Define a posição X anterior como a atual.
            this.prevY = touch.clientY;       // Define a posição Y anterior como a atual.

            // Simula a rotação com múltiplos toques (neste caso, 2 toques).
            // e.touches.length > 1 significa que há mais de um dedo na tela.
            if (e.touches.length > 1) { 
                this.rotating = true; // Ativa o modo de rotação.
            } else {
                this.rotating = false; // Desativa o modo de rotação se for apenas um toque.
            }
        });

        // Evento 'touchend': Similar ao 'mouseup' para dispositivos de toque.
        // Disparado quando um ou mais pontos de toque são removidos da superfície.
        window.addEventListener('touchend', () => {
            this.holdingPaper = false; // Para de segurar o papel.
            this.rotating = false;     // Desativa o modo de rotação.
        });

        // --- Mantendo compatibilidade com eventos de mouse (opcional, mas recomendado) ---
        // Se você quiser que o site funcione tanto com mouse quanto com toque,
        // mantenha os listeners de mouse e adicione os de toque.
        // Para simplificar, o código abaixo usa os mesmos princípios dos eventos de toque.

        document.addEventListener('mousemove', (e) => {
            if(!this.rotating) {
                this.currentX = e.clientX; 
                this.currentY = e.clientY; 
                this.velX = this.currentX - this.prevX;
                this.velY = this.currentY - this.prevY;
            }
            const dirX = e.clientX - this.mouseTouchX;
            const dirY = e.clientY - this.mouseTouchY;
            const dirLength = Math.sqrt(dirX*dirX+dirY*dirY);
            const dirNormalizedX = dirX / dirLength;
            const dirNormalizedY = dirY / dirLength;
            const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
            let degrees = 180 * angle / Math.PI;
            degrees = (360 + Math.round(degrees)) % 360;
            if(this.rotating) {
                this.rotation = degrees;
            }
            if(this.holdingPaper) {
                if(!this.rotating) {
                    this.currentPaperX += this.velX;
                    this.currentPaperY += this.velY;
                }
                this.prevX = this.currentX;
                this.prevY = this.currentY;
                paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
            }
        });

        paper.addEventListener('mousedown', (e) => {
            if(this.holdingPaper) return;
            this.holdingPaper = true;
            paper.style.zIndex = highestZ;
            highestZ += 1;
            if(e.button === 0) { // Botão esquerdo do mouse
                this.mouseTouchX = this.currentX;
                this.mouseTouchY = this.currentY;
                this.prevX = this.currentX;
                this.prevY = this.currentY;
            }
            if(e.button === 2) { // Botão direito do mouse
                this.rotating = true;
            }
        });

        window.addEventListener('mouseup', () => {
            this.holdingPaper = false;
            this.rotating = false;
        });
    }
}

// Seleciona todos os elementos com a classe 'paper' e inicializa a classe Paper para cada um.
const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach(paper => {
    const p = new Paper();
    p.init(paper);
});