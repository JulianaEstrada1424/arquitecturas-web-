/* Interacciones de navegación, animaciones y cuestionario. */
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = [...document.querySelectorAll(".navbar-nav .nav-link[href^='#']")];
  const sections = [...document.querySelectorAll("main section[id]")];
  const backToTop = document.querySelector(".back-to-top");
  const navigation = document.querySelector("#mainNavigation");
  const year = document.querySelector("#current-year");

  if (year) year.textContent = new Date().getFullYear();

  const updateNavigation = () => {
    const marker = window.scrollY + 150;
    let currentSection = sections[0]?.id;
    sections.forEach((section) => {
      if (section.offsetTop <= marker) currentSection = section.id;
    });
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${currentSection}`;
      link.classList.toggle("active", isActive);
      if (isActive) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    backToTop?.classList.toggle("visible", window.scrollY > 500);
  };

  window.addEventListener("scroll", updateNavigation, { passive: true });
  window.addEventListener("resize", updateNavigation);
  updateNavigation();

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navigation?.classList.contains("show") && window.bootstrap) {
        window.bootstrap.Collapse.getOrCreateInstance(navigation).hide();
      }
    });
  });

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const questions = [
    {
      question: "¿Qué describe mejor una arquitectura de microservicios?",
      options: ["Una aplicación compuesta por servicios pequeños y autónomos", "Una base de datos compartida por varias páginas", "Un único archivo que contiene toda la lógica", "Un tipo de lenguaje de programación"],
      answer: "Una aplicación compuesta por servicios pequeños y autónomos",
      explanation: "Cada microservicio implementa una capacidad concreta y colabora con otros mediante interfaces."
    },
    {
      question: "En la analogía del restaurante, ¿qué representa una cocina especializada?",
      options: ["Un servicio responsable de una tarea concreta", "El navegador web", "La red que conecta a los clientes", "Un repositorio de imágenes"],
      answer: "Un servicio responsable de una tarea concreta",
      explanation: "Cada área del restaurante, como cada servicio, se especializa en una responsabilidad."
    },
    {
      question: "¿Cómo se despliega habitualmente una aplicación monolítica?",
      options: ["Como una única unidad", "Cada función se despliega siempre por separado", "Solo mediante mensajes Kafka", "No requiere despliegue"],
      answer: "Como una única unidad",
      explanation: "El monolito empaqueta y publica sus funcionalidades como una sola aplicación."
    },
    {
      question: "¿Qué ventaja ofrece la escalabilidad selectiva?",
      options: ["Permite escalar solo el servicio que tiene más demanda", "Elimina la necesidad de monitorear", "Evita que los servicios se comuniquen", "Hace que todos los servicios usen la misma tecnología"],
      answer: "Permite escalar solo el servicio que tiene más demanda",
      explanation: "Los recursos pueden asignarse al servicio con mayor carga, en lugar de escalar el sistema completo."
    },
    {
      question: "¿Cuál es una función típica de un API Gateway?",
      options: ["Recibir solicitudes y dirigirlas al servicio adecuado", "Guardar todas las contraseñas en texto plano", "Reemplazar las bases de datos de cada servicio", "Compilar el código fuente"],
      answer: "Recibir solicitudes y dirigirlas al servicio adecuado",
      explanation: "El gateway ofrece una entrada común y puede encargarse de enrutamiento y políticas de acceso."
    },
    {
      question: "¿Qué significa que un servicio sea dueño de sus datos?",
      options: ["Que otros servicios acceden a ellos a través de interfaces acordadas", "Que todos los servicios leen directamente su base de datos", "Que no puede hacer copias de seguridad", "Que solo funciona sin conexión"],
      answer: "Que otros servicios acceden a ellos a través de interfaces acordadas",
      explanation: "La propiedad de datos reduce el acoplamiento: los otros servicios usan APIs o eventos para consultarlos."
    },
    {
      question: "¿Para qué se utiliza Docker comúnmente en este contexto?",
      options: ["Para empaquetar servicios y sus dependencias en contenedores", "Para diseñar diagramas de base de datos", "Para sustituir las APIs", "Para escribir consultas SQL automáticamente"],
      answer: "Para empaquetar servicios y sus dependencias en contenedores",
      explanation: "Los contenedores ayudan a ejecutar una unidad de software de manera consistente en distintos entornos."
    },
    {
      question: "¿Qué herramienta está orientada a orquestar contenedores?",
      options: ["Kubernetes", "Bootstrap", "HTML", "RabbitMQ"],
      answer: "Kubernetes",
      explanation: "Kubernetes automatiza tareas como el despliegue, el escalado y la gestión de contenedores."
    },
    {
      question: "¿Qué es un desafío habitual de los sistemas distribuidos?",
      options: ["Gestionar latencia y fallos de red entre servicios", "Mantener todo el código en un solo proceso", "Usar siempre una sola base de datos", "Evitar que un equipo escriba pruebas"],
      answer: "Gestionar latencia y fallos de red entre servicios",
      explanation: "Las llamadas entre servicios dependen de la red, que puede fallar o responder con retraso."
    },
    {
      question: "¿Cuándo conviene evaluar si una arquitectura de microservicios tiene sentido?",
      options: ["Cuando las necesidades del producto y del equipo justifican la complejidad distribuida", "Siempre, incluso para una aplicación de una sola pantalla", "Solo cuando se quiere usar muchos lenguajes", "Antes de entender qué problema resolverá la aplicación"],
      answer: "Cuando las necesidades del producto y del equipo justifican la complejidad distribuida",
      explanation: "Los microservicios aportan beneficios, pero también complejidad operativa; no son la mejor opción para todos los casos."
    }
  ];

  const questionContainer = document.querySelector("#question-container");
  const feedback = document.querySelector("#quiz-feedback");
  const quizContent = document.querySelector("#quiz-content");
  const quizResults = document.querySelector("#quiz-results");
  const previousButton = document.querySelector("#previous-button");
  const nextButton = document.querySelector("#next-button");
  const retryButton = document.querySelector("#retry-button");
  const counter = document.querySelector("#question-counter");
  const progress = document.querySelector("#quiz-progress");
  const progressContainer = document.querySelector(".quiz-progress");
  const answers = new Array(questions.length).fill(null);
  let currentQuestion = 0;
  let quizOptions = questions.map((question) => [...question.options]);

  const shuffle = (items) => {
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }
    return shuffled;
  };

  const renderQuestion = () => {
    const question = questions[currentQuestion];
    const selectedAnswer = answers[currentQuestion];
    counter.textContent = `Pregunta ${currentQuestion + 1} de ${questions.length}`;
    progress.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
    progressContainer.setAttribute("aria-valuemax", String(questions.length));
    progressContainer.setAttribute("aria-valuenow", String(currentQuestion + 1));
    previousButton.disabled = currentQuestion === 0;
    nextButton.disabled = selectedAnswer === null;
    nextButton.innerHTML = currentQuestion === questions.length - 1
      ? "Ver resultado<i class=\"bi bi-check2 ms-2\" aria-hidden=\"true\"></i>"
      : "Siguiente<i class=\"bi bi-arrow-right ms-2\" aria-hidden=\"true\"></i>";

    const heading = document.createElement("h3");
    heading.className = "question-title";
    heading.id = "current-question";
    heading.textContent = question.question;
    const fieldset = document.createElement("fieldset");
    fieldset.className = "answer-list";
    fieldset.setAttribute("aria-labelledby", heading.id);

    quizOptions[currentQuestion].forEach((option) => {
      const label = document.createElement("label");
      label.className = "answer-option";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = `question-${currentQuestion}`;
      input.value = option;
      input.checked = selectedAnswer === option;
      input.disabled = selectedAnswer !== null;
      input.addEventListener("change", () => selectAnswer(option));
      const text = document.createElement("span");
      text.textContent = option;
      label.append(input, text);
      if (selectedAnswer !== null) {
        if (option === question.answer) label.classList.add("is-correct");
        if (option === selectedAnswer && selectedAnswer !== question.answer) label.classList.add("is-incorrect");
      }
      fieldset.append(label);
    });

    questionContainer.replaceChildren(heading, fieldset);
    feedback.hidden = selectedAnswer === null;
    feedback.classList.toggle("feedback-correct", selectedAnswer === question.answer);
    feedback.classList.toggle("feedback-incorrect", selectedAnswer !== null && selectedAnswer !== question.answer);
    if (selectedAnswer === null) {
      feedback.textContent = "";
    } else {
      const result = selectedAnswer === question.answer ? "¡Correcto! " : "No es correcto. ";
      feedback.textContent = `${result}${question.explanation}`;
    }
  };

  const selectAnswer = (answer) => {
    if (answers[currentQuestion] !== null) return;
    answers[currentQuestion] = answer;
    renderQuestion();
    nextButton.focus();
  };

  const showResults = () => {
    const score = answers.reduce((total, answer, index) => total + (answer === questions[index].answer ? 1 : 0), 0);
    const percentage = Math.round((score / questions.length) * 100);
    document.querySelector("#result-score").textContent = `${score} de ${questions.length} correctas · ${percentage}%`;
    document.querySelector("#result-message").textContent = percentage >= 80 ? "¡Excelente!" : percentage >= 50 ? "¡Buen trabajo!" : "Buen intento, repasa el contenido";
    document.querySelector("#result-detail").textContent = percentage >= 80
      ? "Tienes una buena base sobre arquitectura de microservicios."
      : "Vuelve a revisar las secciones y el video; después puedes intentarlo de nuevo.";
    document.querySelector("#result-icon").innerHTML = percentage >= 80
      ? '<i class="bi bi-trophy-fill" aria-hidden="true"></i>'
      : '<i class="bi bi-arrow-repeat" aria-hidden="true"></i>';
    quizContent.hidden = true;
    quizResults.hidden = false;
    retryButton.focus();
  };

  previousButton.addEventListener("click", () => {
    if (currentQuestion > 0) {
      currentQuestion -= 1;
      renderQuestion();
      questionContainer.querySelector("input:not(:disabled)")?.focus();
    }
  });

  nextButton.addEventListener("click", () => {
    if (answers[currentQuestion] === null) return;
    if (currentQuestion === questions.length - 1) {
      showResults();
      return;
    }
    currentQuestion += 1;
    renderQuestion();
    questionContainer.querySelector("input:not(:disabled)")?.focus();
  });

  retryButton.addEventListener("click", () => {
    answers.fill(null);
    quizOptions = questions.map((question) => shuffle(question.options));
    currentQuestion = 0;
    quizResults.hidden = true;
    quizContent.hidden = false;
    renderQuestion();
    questionContainer.querySelector("input")?.focus();
  });

  renderQuestion();
});
