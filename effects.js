document.addEventListener('DOMContentLoaded', () => {
    // Espera a que todo el contenido de la página esté completamente cargado antes de ejecutar el código

    // Obtiene el canvas y su contexto 2D para dibujar sobre él
    const canvas = document.getElementById('backgroundCanvas');
    const ctx = canvas.getContext('2d');

    // Variables globales
    let width, height, particles;
    let animationFrameId; // Para almacenar el ID de la animación
    let mousePosition = { x: 0, y: 0 }; // Posición inicial del mouse

    // Información de las secciones (Perfil, Habilidades, Experiencia)
    const sections = [
        { 
            id: 'profile', 
            title: 'Perfil', 
            description: '¡Hola! Soy Ángel Gallego, un apasionado de la tecnología y la ciencia. Mi objetivo es revolucionar la manera en que se toman decisiones con datos, como: liderando equipos de datos para impulsar la innovación, diseñando soluciones de datos escalables y robustas. Me gusta apoyar y motivar a mi equipo, aprendiendo en un entorno de competencia sana. Si tienes metas grandes y ganas de lograrlas, ¡Sígueme! Estoy desarrollando proyectos innovadores y busco personas con visión y determinación. Juntos, podemos lograr algo increíble.'
        },
        { 
            id: 'skills', 
            title: 'Habilidades', 
            description: 'Analisis de datos, Python, Mysql, MongoDB, Google Cloud, Scrum, Inteligencia Artificial'
        },
        { 
            id: 'experience', 
            title: 'Experiencia', 
            description: '¡Hola! Soy Ángel Gallego, un apasionado de la tecnología y la innovación. Con más de 10 años de experiencia en soporte técnico y análisis de sistemas, he desarrollado una sólida base en resolución de problemas y pensamiento crítico. Mi trayectoria profesional comenzó en helpdesk, donde adquirí habilidades en macOS, Windows y Linux. Luego, como técnico en sistemas y tecnólogo analista de sistemas, amplié mi conocimiento en infraestructura y desarrollo de software. En los últimos 3 años, he aplicado mis habilidades en apoyo a la gestión y ejecución de proyectos, analizando datos con Python, Excel y herramientas como Pandas y Pip. He automatizado flujos de trabajo administrativos, documentado procesos y aplicado Inteligencia Artificial de forma ética y asertiva en proyectos de desarrollo. Actualmente, estoy a punto de graduarme como Ingeniero de Sistemas, lo que me ha permitido consolidar mis conocimientos y habilidades en diseño, desarrollo y implementación de soluciones tecnológicas. Mi objetivo es seguir innovando y aplicar mis habilidades en proyectos que impacten positivamente en la sociedad. No dudes en conectar con migo a traves de mis redes sociales, si tienes proyectos concretos o si necesitas estructurarlo.'
        },
    ];

    // Función que inicializa el canvas y crea las partículas
    function initCanvas() {
        // Establece las dimensiones del canvas al tamaño de la ventana
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        // Crea un array de partículas con propiedades aleatorias (posición, radio, velocidad)
        particles = Array.from({ length: 100 }, () => ({
            x: Math.random(),
            y: Math.random(),
            radius: Math.random() * 2 + 1,
            vx: (Math.random() - 0.5) * 0.002,
            vy: (Math.random() - 0.5) * 0.002
        }));
    }

    // Función que dibuja el fondo del océano en el canvas
    function drawOcean(time) {
        // Crea un degradado para el fondo, simulando el color del océano
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#001f3f'); // Azul oscuro en la parte superior
        gradient.addColorStop(1, '#003366'); // Azul más claro en la parte inferior
        ctx.fillStyle = gradient; // Aplica el degradado como fondo
        ctx.fillRect(0, 0, width, height); // Dibuja el rectángulo que cubre todo el canvas

        // Dibuja ondas simulando el movimiento del agua
        ctx.beginPath();
        for (let x = 0; x < width; x += 20) {
            const y = Math.sin(x * 0.01 + time * 0.0002) * 20 + height / 2;
            ctx.lineTo(x, y); // Dibuja las ondas con función senoidal
        }
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'; // Color de las ondas
        ctx.stroke(); // Dibuja las líneas
    }

    // Función que dibuja las partículas en movimiento
    function drawParticles() {
        particles.forEach((particle, i) => {
            // Actualiza la posición de las partículas
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Si la partícula se sale de los límites, invierte su dirección
            if (particle.x < 0 || particle.x > 1) particle.vx *= -1;
            if (particle.y < 0 || particle.y > 1) particle.vy *= -1;

            // Calcula la posición real de la partícula en el canvas
            const x = particle.x * width;
            const y = particle.y * height;

            // Dibuja la partícula como un círculo
            ctx.beginPath();
            ctx.arc(x, y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.sin(Date.now() * 0.003 + i) * 0.2})`;
            ctx.fill();

            // Dibuja líneas entre partículas si están lo suficientemente cerca
            for (let j = i + 1; j < particles.length; j++) {
                const otherX = particles[j].x * width;
                const otherY = particles[j].y * height;
                const dx = otherX - x;
                const dy = otherY - y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(otherX, otherY);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 - distance * 0.001})`;
                    ctx.stroke(); // Dibuja una línea entre las partículas si la distancia es menor a 100
                }
            }

            // Dibuja líneas entre las partículas y el mouse si están lo suficientemente cerca
            const mouseDistance = Math.sqrt(
                Math.pow(mousePosition.x - x, 2) + 
                Math.pow(mousePosition.y - y, 2)
            );
            if (mouseDistance < 150) {
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(mousePosition.x, mousePosition.y);
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.5 - mouseDistance * 0.003})`;
                ctx.stroke(); // Dibuja una línea entre la partícula y el mouse
            }
        });
    }

    // Función que anima el canvas, llamándose a sí misma en cada frame
    function animate(currentTime) {
        ctx.clearRect(0, 0, width, height); // Limpia el canvas antes de dibujar el siguiente frame
        drawOcean(currentTime); // Dibuja el fondo del océano
        drawParticles(); // Dibuja las partículas
        animationFrameId = requestAnimationFrame(animate); // Llama a sí misma para el próximo frame
    }

    // Función que se ejecuta cuando la ventana se redimensiona
    function handleResize() {
        cancelAnimationFrame(animationFrameId); // Cancela la animación actual
        initCanvas(); // Recalcula las dimensiones del canvas
        animate(0); // Inicia la animación desde el principio
    }

    // Función que maneja el movimiento del mouse
    function handleMouseMove(event) {
        mousePosition.x = event.clientX; // Actualiza la posición X del mouse
        mousePosition.y = event.clientY; // Actualiza la posición Y del mouse
    }

    // Añade event listeners para el redimensionado de la ventana y el movimiento del mouse
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Inicializa el canvas y comienza la animación
    initCanvas();
    animate(0);

    // **Funcionalidad para las secciones de contenido con efecto de fade-in y fade-out**

    const sectionButtons = document.querySelectorAll('.section-button'); // Selecciona todos los botones de sección
    const sectionContent = document.getElementById('sectionContent'); // Selecciona el contenedor del contenido
    let activeSection = null; // Variable para almacenar la sección actualmente activa

    // Itera sobre los botones de las secciones y añade un event listener para el clic
    sectionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sectionId = button.id.replace('Btn', ''); // Obtiene el ID de la sección
            const section = sections.find(s => s.id === sectionId); // Encuentra los datos de la sección correspondiente

            if (activeSection === sectionId) {
                // Si la sección clicada ya está activa, hacemos el fade-out para cerrarla
                sectionContent.classList.remove('fade-in'); // Elimina la clase fade-in (para fade-out)
                sectionContent.classList.add('fade-out'); // Añade la clase fade-out

                setTimeout(() => {
                    sectionContent.innerHTML = ''; // Vacía el contenido después de 0.1s (duración del fade-out)
                    sectionContent.classList.remove('active'); // Remueve la clase active
                }, 100); // Espera 0.1 segundos para completar el fade-out

                button.classList.remove('active'); // Remueve el estilo activo del botón
                activeSection = null; // Resetea la sección activa

            } else {
                // Si es una nueva sección, primero realiza el fade-out de la anterior (si existe)
                if (activeSection !== null) {
                    sectionContent.classList.remove('fade-in');
                    sectionContent.classList.add('fade-out');

                    setTimeout(() => {
                        sectionContent.innerHTML = ''; // Vacía el contenido de la sección anterior
                        openNewSection(); // Llama a la función que abre la nueva sección
                    }, 100); // Espera 0.1 segundos antes de abrir la nueva sección
                } else {
                    openNewSection(); // Si no hay sección activa, simplemente abre la nueva sección
                }

                function openNewSection() {
                    sectionContent.innerHTML = section.description; // Inserta el contenido de la nueva sección
                    sectionContent.classList.add('fade-in'); // Añade la clase fade-in para la animación
                    sectionContent.classList.add('active'); // Activa la sección
                    sectionButtons.forEach(btn => btn.classList.remove('active')); // Remueve el estado activo de otros botones
                    button.classList.add('active'); // Activa el botón actual
                    activeSection = sectionId; // Actualiza la sección activa
                }
            }
        });
    });
});
