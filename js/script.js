/* Menu hambúrguer */

const botaoMenu = document.querySelector(".menu-toggle");
const menuPrincipal = document.querySelector(".menu-principal");

botaoMenu.addEventListener("click", function () {
  menuPrincipal.classList.toggle("menu-aberto");
});

/* Filtro de eventos */

const filtroRegiao = document.querySelector("#filtro-regiao");
const filtroModalidade = document.querySelector("#filtro-modalidade");

function filtrarEventos() {
  const cards = document.querySelectorAll(".evento");
  const regiao = filtroRegiao.value;
  const modalidade = filtroModalidade.value;
  let total = 0;

  cards.forEach(function (card) {
    const regiaoOk = regiao === "todas" || regiao === card.getAttribute("data-regiao");
    const modalidadeOk = modalidade === "todas" || modalidade === card.getAttribute("data-modalidade");

    if (regiaoOk && modalidadeOk) {
      card.classList.remove("escondido");
      total++;
    } else {
      card.classList.add("escondido");
    }
  });

  document.querySelector("#contador").textContent = total + " evento(s) encontrado(s)";

  if (total === 0) {
    document.querySelector("#sem-resultado").classList.remove("escondido");
  } else {
    document.querySelector("#sem-resultado").classList.add("escondido");
  }
}

if (filtroRegiao) {
  filtroRegiao.addEventListener("change", filtrarEventos);
  filtroModalidade.addEventListener("change", filtrarEventos);
}

/* Inscrição em eventos */

const classificacao = {
  iniciante: 1,
  intermediario: 2,
  avancado: 3,
};

function inscrever(botao) {
  const card = botao.closest(".evento");
  const aviso = card.querySelector(".aviso");
  const vagas = card.querySelector(".vagas");
  const modalidadeUsuario = document.querySelector("#modalidade-usuario").value;
  const nivelUsuario = document.querySelector("#nivel-usuario").value;
  const nivelEvento = card.getAttribute("data-nivel");

  aviso.classList.remove("aviso-erro", "aviso-sucesso");

  if (modalidadeUsuario === "" || nivelUsuario === "") {
    aviso.textContent = "Escolha a sua modalidade e o seu nível no topo da página.";
    aviso.classList.add("aviso-erro");
    return;
  }

  if (modalidadeUsuario !== card.getAttribute("data-modalidade")) {
    aviso.textContent = "Você só pode se inscrever em eventos da sua modalidade.";
    aviso.classList.add("aviso-erro");
    return;
  }

  if (classificacao[nivelUsuario] < classificacao[nivelEvento]) {
    aviso.textContent = "Seu nível é insuficiente para participar desse evento.";
    aviso.classList.add("aviso-erro");
    return;
  }

  if (Number(vagas.textContent) <= 0) {
    aviso.textContent = "Não há vagas disponíveis.";
    aviso.classList.add("aviso-erro");
    return;
  }

  vagas.textContent = Number(vagas.textContent) - 1;
  botao.textContent = "Inscrito";
  botao.disabled = true;
  aviso.textContent = "Inscrição realizada com sucesso!";
  aviso.classList.add("aviso-sucesso");
}

document.querySelectorAll(".btn-inscrever").forEach(function (botao) {
  botao.addEventListener("click", function () {
    inscrever(botao);
  });
});

/* Abas de perfil */

const botoesAba = document.querySelectorAll(".aba-botao");

botoesAba.forEach(function (botao) {
  botao.addEventListener("click", function () {
    botoesAba.forEach(function (outroBotao) {
      outroBotao.classList.remove("ativa");
      outroBotao.setAttribute("aria-selected", "false");
    });

    document.querySelectorAll(".aba-painel").forEach(function (painel) {
      painel.classList.remove("ativa");
    });

    botao.classList.add("ativa");
    botao.setAttribute("aria-selected", "true");
    document.querySelector("#" + botao.getAttribute("data-aba")).classList.add("ativa");
  });
});

/* Validação do formulário de contato */

const formContato = document.querySelector("#form-contato");

function mostrarErro(campo, mensagem) {
  campo.classList.add("campo-erro");
  document.querySelector("#erro-" + campo.id).textContent = mensagem;
}

function limparErro(campo) {
  campo.classList.remove("campo-erro");
  document.querySelector("#erro-" + campo.id).textContent = "";
}

function emailValido(email) {
  const posicaoArroba = email.indexOf("@");
  const posicaoPonto = email.lastIndexOf(".");
  return posicaoArroba > 0 && posicaoPonto > posicaoArroba + 1 && posicaoPonto < email.length - 1;
}

function validarFormulario(evento) {
  evento.preventDefault();

  const nome = document.querySelector("#nome");
  const email = document.querySelector("#email");
  const assunto = document.querySelector("#assunto");
  const mensagem = document.querySelector("#mensagem");
  const mensagemSucesso = document.querySelector("#mensagem-sucesso");

  let formularioValido = true;

  if (nome.value.trim().length < 3) {
    mostrarErro(nome, "Digite o seu nome (mínimo de 3 letras).");
    formularioValido = false;
  } else {
    limparErro(nome);
  }

  if (email.value.trim() === "") {
    mostrarErro(email, "Digite o seu e-mail.");
    formularioValido = false;
  } else if (!emailValido(email.value.trim())) {
    mostrarErro(email, "Digite um e-mail válido, como voce@email.com.");
    formularioValido = false;
  } else {
    limparErro(email);
  }

  if (assunto.value === "") {
    mostrarErro(assunto, "Selecione um assunto.");
    formularioValido = false;
  } else {
    limparErro(assunto);
  }

  if (mensagem.value.trim().length < 10) {
    mostrarErro(mensagem, "Escreva uma mensagem com pelo menos 10 caracteres.");
    formularioValido = false;
  } else {
    limparErro(mensagem);
  }

  if (formularioValido) {
    mensagemSucesso.textContent = "Mensagem enviada com sucesso! Obrigado, " + nome.value.trim() + ".";
    formContato.reset();
  } else {
    mensagemSucesso.textContent = "";
  }
}

if (formContato) {
  formContato.addEventListener("submit", validarFormulario);

  formContato.querySelectorAll("input, select, textarea").forEach(function (campo) {
    campo.addEventListener("input", function () {
      limparErro(campo);
    });
  });
}
