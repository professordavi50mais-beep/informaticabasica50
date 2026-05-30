const plans = {
  completo: {
    label: "Tecnologia Sem Medo 50+: Curso Completo",
    access: "Completo",
    modules: ["computador", "celular"],
  },
  computador: {
    label: "Computador Sem Medo 50+",
    access: "Computador",
    modules: ["computador"],
  },
  celular: {
    label: "Celular Sem Medo 50+",
    access: "Celular",
    modules: ["celular"],
  },
};

const lessons = [
  { id: "pc-01", module: "computador", title: "Componentes básicos de um computador", detail: "Monitor, teclado, mouse, gabinete, notebook e cuidados." },
  { id: "pc-02", module: "computador", title: "Primeiros passos no Windows", detail: "Área de trabalho, menu Iniciar, barra de tarefas e janelas." },
  { id: "pc-03", module: "computador", title: "Uso do mouse e teclado", detail: "Cliques, arrastar, teclas principais e digitação básica." },
  { id: "pc-04", module: "computador", title: "Atalhos de teclado essenciais", detail: "Copiar, colar, salvar, imprimir, localizar e alternar janelas." },
  { id: "pc-05", module: "computador", title: "Arquivos e pastas", detail: "Criar, salvar, renomear, excluir e encontrar arquivos." },
  { id: "pc-06", module: "computador", title: "Internet no computador", detail: "Navegador, Google, sites seguros, anúncios e golpes." },
  { id: "pc-07", module: "computador", title: "Aplicativos e sites úteis", detail: "Invertexto, iLovePDF, Canva, Tradutor, Keep, VirusTotal e Gov.br." },
  { id: "pc-08", module: "computador", title: "E-mail", detail: "Ler, responder, enviar, anexar arquivos e evitar links suspeitos." },
  { id: "pc-09", module: "computador", title: "Segurança digital", detail: "Senhas fortes, antivírus, downloads e proteção de documentos." },
  { id: "cel-01", module: "celular", title: "Conhecendo o celular", detail: "Botões, tela inicial, toque, carregamento, Wi-Fi e Bluetooth." },
  { id: "cel-02", module: "celular", title: "Configurações básicas", detail: "Letra, volume, brilho, Wi-Fi, senha, PIN e biometria." },
  { id: "cel-03", module: "celular", title: "Ligações e contatos", detail: "Chamadas, contatos, bloqueio de números e viva-voz." },
  { id: "cel-04", module: "celular", title: "WhatsApp", detail: "Mensagens, áudio, fotos, vídeo, grupos e golpes." },
  { id: "cel-05", module: "celular", title: "Fotos e vídeos", detail: "Câmera, galeria, apagar e compartilhar com segurança." },
  { id: "cel-06", module: "celular", title: "Internet no celular", detail: "Google, sites, YouTube e instalação cuidadosa de aplicativos." },
  { id: "cel-07", module: "celular", title: "Aplicativos úteis", detail: "Mapas, transporte, bancos, Gov.br, saúde e compras." },
  { id: "cel-08", module: "celular", title: "ChatGPT e Gemini", detail: "Perguntas, textos, listas, explicações simples e limites da IA." },
  { id: "cel-09", module: "celular", title: "Segurança no celular", detail: "Bloqueio de tela, links falsos, permissões e backup." },
];

const storageKey = "tecnologiaSemMedoStudents";
const sessionKey = "tecnologiaSemMedoSession";

const registerForm = document.querySelector("#registerForm");
const loginForm = document.querySelector("#loginForm");
const authSection = document.querySelector("#authSection");
const dashboardSection = document.querySelector("#dashboardSection");
const publicSite = document.querySelector("#publicSite");
const logoutButton = document.querySelector("#logoutButton");
const registerStatus = document.querySelector("#registerStatus");
const loginStatus = document.querySelector("#loginStatus");
const fillDemoButton = document.querySelector("#fillDemoButton");
const planSelect = document.querySelector("#plan");

function getStudents() {
  return JSON.parse(localStorage.getItem(storageKey) || "[]");
}

function saveStudents(students) {
  localStorage.setItem(storageKey, JSON.stringify(students));
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function seedDemoStudent() {
  const students = getStudents();
  if (students.some((student) => student.email === "aluno@demo.com")) return;

  students.push({
    id: crypto.randomUUID(),
    name: "Aluno Demonstração",
    phone: "(00) 00000-0000",
    email: "aluno@demo.com",
    password: "123456",
    plan: "completo",
    completed: ["pc-01", "pc-02", "cel-01"],
  });
  saveStudents(students);
}

function setSession(studentId) {
  localStorage.setItem(sessionKey, studentId);
}

function getCurrentStudent() {
  const studentId = localStorage.getItem(sessionKey);
  return getStudents().find((student) => student.id === studentId) || null;
}

function updateStudent(updatedStudent) {
  const students = getStudents().map((student) => (student.id === updatedStudent.id ? updatedStudent : student));
  saveStudents(students);
}

function getAllowedLessons(planKey) {
  const plan = plans[planKey] || plans.completo;
  return lessons.filter((lesson) => plan.modules.includes(lesson.module));
}

function renderDashboard(student) {
  const plan = plans[student.plan] || plans.completo;
  const allowedLessons = getAllowedLessons(student.plan);
  const completed = new Set(student.completed || []);
  const completedCount = allowedLessons.filter((lesson) => completed.has(lesson.id)).length;
  const nextLesson = allowedLessons.find((lesson) => !completed.has(lesson.id));

  document.querySelector("#studentName").textContent = student.name;
  document.querySelector("#studentPlan").textContent = plan.label;
  document.querySelector("#progressCount").textContent = `${completedCount} de ${allowedLessons.length}`;
  document.querySelector("#nextLesson").textContent = nextLesson ? nextLesson.title : "Curso concluído";
  document.querySelector("#accessType").textContent = plan.access;

  const lessonList = document.querySelector("#lessonList");
  lessonList.innerHTML = "";

  allowedLessons.forEach((lesson) => {
    const row = document.createElement("label");
    row.className = "lesson";
    row.innerHTML = `
      <input type="checkbox" ${completed.has(lesson.id) ? "checked" : ""} data-lesson="${lesson.id}" />
      <span>
        <strong>${lesson.title}</strong>
        <span>${lesson.detail}</span>
      </span>
      <span class="badge">${lesson.module === "computador" ? "Computador" : "Celular"}</span>
    `;
    lessonList.appendChild(row);
  });

  authSection.classList.add("hidden");
  publicSite.classList.add("hidden");
  dashboardSection.classList.remove("hidden");
  logoutButton.classList.remove("hidden");
  document.querySelector("#area-aluno").scrollIntoView({ behavior: "smooth", block: "start" });
}

function showAuth() {
  publicSite.classList.remove("hidden");
  authSection.classList.remove("hidden");
  dashboardSection.classList.add("hidden");
  logoutButton.classList.add("hidden");
}

registerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(registerForm);
  const email = normalizeEmail(formData.get("email"));
  const students = getStudents();

  registerStatus.textContent = "";

  if (students.some((student) => student.email === email)) {
    registerStatus.textContent = "Este e-mail já está cadastrado.";
    registerStatus.classList.add("error");
    return;
  }

  const student = {
    id: crypto.randomUUID(),
    name: formData.get("name").trim(),
    phone: formData.get("phone").trim(),
    email,
    password: formData.get("password"),
    plan: formData.get("plan"),
    completed: [],
  };

  students.push(student);
  saveStudents(students);
  setSession(student.id);
  registerForm.reset();
  registerStatus.classList.remove("error");
  renderDashboard(student);
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  const email = normalizeEmail(formData.get("email"));
  const password = formData.get("password");
  const student = getStudents().find((item) => item.email === email && item.password === password);

  if (!student) {
    loginStatus.textContent = "E-mail ou senha incorretos.";
    return;
  }

  loginStatus.textContent = "";
  setSession(student.id);
  renderDashboard(student);
});

document.querySelector("#lessonList").addEventListener("change", (event) => {
  if (!event.target.matches("[data-lesson]")) return;

  const student = getCurrentStudent();
  if (!student) return;

  const lessonId = event.target.dataset.lesson;
  const completed = new Set(student.completed || []);

  if (event.target.checked) {
    completed.add(lessonId);
  } else {
    completed.delete(lessonId);
  }

  const updatedStudent = { ...student, completed: Array.from(completed) };
  updateStudent(updatedStudent);
  renderDashboard(updatedStudent);
});

logoutButton.addEventListener("click", () => {
  localStorage.removeItem(sessionKey);
  showAuth();
});

fillDemoButton.addEventListener("click", () => {
  document.querySelector("#loginEmail").value = "aluno@demo.com";
  document.querySelector("#loginPassword").value = "123456";
});

document.querySelectorAll("[data-buy-plan]").forEach((button) => {
  button.addEventListener("click", () => {
    planSelect.value = button.dataset.buyPlan;
    registerStatus.textContent = "Plano selecionado. Agora preencha o cadastro para liberar o acesso.";
    registerStatus.classList.remove("error");
    document.querySelector("#area-aluno").scrollIntoView({ behavior: "smooth", block: "start" });
    document.querySelector("#name").focus({ preventScroll: true });
  });
});

seedDemoStudent();
const currentStudent = getCurrentStudent();
if (currentStudent) {
  renderDashboard(currentStudent);
} else {
  showAuth();
}
