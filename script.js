document.addEventListener("DOMContentLoaded", () => {
    
    // --- 0. VINHETA DE ENTRADA (SPLASH SCREEN) ---
    const introScreen = document.getElementById("intro-screen");
    document.body.style.overflow = "hidden"; // Trava scroll durante vinheta

    setTimeout(() => {
        introScreen.style.opacity = "0";
        introScreen.style.visibility = "hidden";
        document.body.style.overflow = ""; 
        document.body.style.overflowX = "hidden"; 
        startTypewriter();
        initParticleBackground(); // Inicia o Canvas após a vinheta
    }, 2600); 


    // --- 1. EFEITO MÁQUINA DE ESCREVER PREMIUM ---
    function startTypewriter() {
        const text = "Você não perde vendas por falta de clientes. Você perde por falta de resposta.";
        const speed = 45; 
        let index = 0;
        const titleElement = document.getElementById("typewriter-text");

        if (titleElement) {
            titleElement.innerHTML = ""; 
            function typeWriter() {
                if (index < text.length) {
                    titleElement.innerHTML += text.charAt(index);
                    index++;
                    setTimeout(typeWriter, speed);
                }
            }
            setTimeout(typeWriter, 300);
        }
    }


    // --- 2. FUNDO DE REDE NEURAL INTERATIVA (CANVAS SURREAL) ---
    function initParticleBackground() {
        const canvas = document.getElementById('particle-canvas');
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null, radius: 150 }; // Raio de interação do mouse

        // Ajusta tamanho do canvas
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles(); // Reinicia partículas ao redimensionar
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Captura posição do mouse
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Classe da Partícula (Nó da Rede)
        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 2 + 0.5; // Tamanho sutil
                this.baseX = this.x; // Posição original
                this.baseY = this.y;
                this.density = (Math.random() * 30) + 1; // Peso para movimento

                // Velocidade de flutuação independente
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
            }

            // Desenha o ponto
            draw() {
                ctx.fillStyle = 'rgba(74, 144, 226, 0.3)'; // Azul neon sutil
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }

            // Atualiza movimento e interação
            update() {
                // Flutuação natural
                this.x += this.vx;
                this.y += this.vy;

                // Bounce nas bordas da tela
                if (this.x > canvas.width || this.x < 0) this.vx *= -1;
                if (this.y > canvas.height || this.y < 0) this.vy *= -1;

                // Interação com o Mouse (Atração sutil)
                if (mouse.x != null && mouse.y != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < mouse.radius) {
                        // Força de atração baseada na densidade da partícula e distância
                        let forceDirectionX = dx / distance;
                        let forceDirectionY = dy / distance;
                        let force = (mouse.radius - distance) / mouse.radius;
                        let moveX = forceDirectionX * force * this.density * 0.1;
                        let moveY = forceDirectionY * force * this.density * 0.1;
                        
                        this.x += moveX;
                        this.y += moveY;
                    } else {
                        // Tenta voltar lentamente para a posição original se longe do mouse
                        // dx = this.x - this.baseX;
                        // dy = this.y - this.baseY;
                        // if (this.x !== this.baseX) this.x -= dx/20;
                        // if (this.y !== this.baseY) this.y -= dy/20;
                    }
                }
            }
        }

        // Inicializa array de partículas baseada no tamanho da tela
        function initParticles() {
            particles = [];
            // Quantidade equilibrada para performance (aprox 1 partícula a cada 1500 pixels quadrados)
            let numberOfParticles = (canvas.width * canvas.height) / 1500; 
            if (canvas.width < 768) numberOfParticles = (canvas.width * canvas.height) / 3000; // Menos no mobile

            for (let i = 0; i < numberOfParticles; i++) {
                let x = Math.random() * canvas.width;
                let y = Math.random() * canvas.height;
                particles.push(new Particle(x, y));
            }
        }

        // Desenha as linhas de conexão (Rede Neural)
        function connectParticles() {
            let maxDistance = 150; // Distância máxima para conectar
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let dx = particles[a].x - particles[b].x;
                    let dy = particles[a].y - particles[b].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        // Opacidade da linha baseada na distância (mais perto = mais forte)
                        let opacity = 1 - (distance / maxDistance);
                        ctx.strokeStyle = `rgba(74, 144, 226, ${opacity * 0.15})`; // Sutil
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[ b].x, particles[b].y);
                        ctx.stroke();
                        ctx.closePath();
                    }
                }
                
                // Conecta também com o Mouse
                if (mouse.x != null && mouse.y != null) {
                    let dxMouse = particles[a].x - mouse.x;
                    let dyMouse = particles[a].y - mouse.y;
                    let distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
                    
                    if (distMouse < mouse.radius) {
                        let opacityMouse = 1 - (distMouse / mouse.radius);
                        ctx.strokeStyle = `rgba(123, 44, 191, ${opacityMouse * 0.4})`; // Roxo neon mais forte pro mouse
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                        ctx.closePath();
                    }
                }
            }
        }

        // Loop de Animação
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa tela a cada frame
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            connectParticles(); // Desenha a rede
            requestAnimationFrame(animate); // Chama próximo frame
        }
        animate();
    }


    // --- 3. Lógica do Spotlight e Micro-interações do Mouse ---
    const cursorGlow = document.querySelector('.cursor-glow');
    if (cursorGlow) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        });
    }

    // Física 3D nos Cartões (Efeito Apple)
    const cards3D = document.querySelectorAll('.card, .tech-item, .step');
    cards3D.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;  
            const rotateX = ((y / rect.height) - 0.5) * -15; 
            const rotateY = ((x / rect.width) - 0.5) * 15;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.boxShadow = `0 20px 40px rgba(0,0,0,0.6), 0 0 20px rgba(74, 144, 226, 0.15)`;
            card.style.transition = 'none'; 
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.boxShadow = `none`;
            card.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease'; 
        });
    });

    // Botões Magnéticos
    const magneticButtons = document.querySelectorAll('.btn-primary, .btn-whatsapp');
    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = (e.clientX - rect.left) - (rect.width / 2);
            const y = (e.clientY - rect.top) - (rect.height / 2);
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.05)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px) scale(1)`;
        });
    });


    // --- 4. Lógica do Slider do Portfólio (Swipe Mobile) ---
    const sliders = document.querySelectorAll('.slider-container');
    sliders.forEach(slider => {
        const slides = slider.querySelectorAll('.slide');
        const prevBtn = slider.querySelector('.prev');
        const nextBtn = slider.querySelector('.next');
        let currentIndex = 0;
        let startX = 0;
        let endX = 0;

        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            if (index >= slides.length) currentIndex = 0;
            else if (index < 0) currentIndex = slides.length - 1;
            else currentIndex = index;
            slides[currentIndex].classList.add('active');
        }

        nextBtn.addEventListener('click', () => showSlide(currentIndex + 1));
        prevBtn.addEventListener('click', () => showSlide(currentIndex - 1));

        slider.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, {passive: true});
        slider.addEventListener('touchend', (e) => { endX = e.changedTouches[0].clientX; handleSwipe(); }, {passive: true});

        function handleSwipe() {
            const swipeThreshold = 50; 
            if (startX - endX > swipeThreshold) showSlide(currentIndex + 1); 
            else if (endX - startX > swipeThreshold) showSlide(currentIndex - 1); 
        }
    });

    // --- 5. Lógica do Modal de Vídeo ---
    const modal = document.getElementById("video-modal");
    const videoElement = document.getElementById("portfolio-video");
    const btnsVideo = document.querySelectorAll(".btn-video");
    const closeModal = document.querySelector(".close-modal");

    btnsVideo.forEach(btn => {
        btn.addEventListener("click", () => {
            const videoSrc = btn.getAttribute("data-video"); 
            videoElement.src = videoSrc; 
            modal.style.display = "flex"; 
            setTimeout(() => { modal.style.opacity = "1"; }, 10);
            videoElement.play(); 
        });
    });

    function closeAndResetVideo() {
        modal.style.opacity = "0";
        setTimeout(() => { modal.style.display = "none"; videoElement.pause(); videoElement.src = ""; }, 300); 
    }
    if(closeModal) closeModal.addEventListener("click", closeAndResetVideo);
    window.addEventListener("click", (e) => { if (e.target === modal) closeAndResetVideo(); });

    // --- 6. Animações de Scroll Profissionais ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) { entry.target.classList.add('active'); observer.unobserve(entry.target); }
        });
    }, { root: null, threshold: 0.1, rootMargin: "0px" });
    revealElements.forEach(el => revealObserver.observe(el));
});

// --- 7. Cabeçalho Responsivo no Scroll ---
window.addEventListener("scroll", () => {
    const header = document.querySelector("header");
    if (window.scrollY > 50) {
        header.style.padding = "12px 50px"; 
        header.style.background = "rgba(5, 5, 8, 0.95)";
        header.style.boxShadow = "0 10px 30px rgba(0,0,0,0.8)";
    } else {
        if(window.innerWidth > 768) header.style.padding = "20px 50px";
        header.style.background = "rgba(5, 5, 8, 0.75)";
        header.style.boxShadow = "none";
    }
});