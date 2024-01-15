document.addEventListener('DOMContentLoaded', function () {
  const formTarefa = document.getElementById('form-tarefa');
  const formEdicao = document.getElementById('form-edicao');
  const entradaTarefa = document.getElementById('entrada-tarefa');
  const entradaEdicao = document.getElementById('entrada-edicao');
  const listaTarefas = document.getElementById('lista-de-tarefas');
  const botaoLimpar = document.getElementById('botao-limpar');
  const entradaBusca = document.getElementById('entrada-busca');
  const selecaoFiltro = document.getElementById('selecao-filtro');
  const mensagemResultado = document.getElementById('mensagem-resultado');

  formTarefa.addEventListener('submit', adicionarTarefa);
  formEdicao.addEventListener('submit', salvarEdicao);
  botaoLimpar.addEventListener('click', limparTarefas);
  entradaBusca.addEventListener('input', filtrarTarefas);
  entradaBusca.addEventListener('focus', () => filtrarTarefas());
  selecaoFiltro.addEventListener('change', filtrarTarefas);

  function adicionarTarefa(event) {
    event.preventDefault();
    const descricaoTarefa = entradaTarefa.value.trim();
    if (descricaoTarefa !== '') {
      const novaTarefa = criarTarefaElemento(descricaoTarefa);
      listaTarefas.appendChild(novaTarefa);
      mostrarMensagemResultado('Tarefa adicionada com sucesso!', 'sucesso');
      entradaTarefa.value = '';
    } else {
      mostrarMensagemResultado('Por favor, insira uma descrição para a tarefa.', 'erro');
    }
  }

  function criarTarefaElemento(descricao) {
    const novaTarefa = document.createElement('div');
    const tarefaId = Date.now().toString(); 
    novaTarefa.setAttribute('data-tarefa-id', tarefaId);
    novaTarefa.innerHTML = `<p>${descricao}</p><button class="concluir-btn">Concluir</button><button class="editar-btn">Editar</button><button class="remover-btn">Remover</button>`;
    novaTarefa.querySelector('.concluir-btn').addEventListener('click', () => concluirTarefa(novaTarefa));
    novaTarefa.querySelector('.editar-btn').addEventListener('click', () => editarTarefa(novaTarefa));
    novaTarefa.querySelector('.remover-btn').addEventListener('click', () => removerTarefa(novaTarefa));
    return novaTarefa;
  }

  function concluirTarefa(tarefa) {
    tarefa.classList.toggle('concluida');
    mostrarMensagemResultado('Tarefa concluída com sucesso!', 'sucesso');
  }

  function editarTarefa(tarefa) {
    const descricao = tarefa.querySelector('p').textContent;
    entradaEdicao.value = descricao;
    formTarefa.classList.add('esconder');
    formEdicao.classList.remove('esconder');
    formEdicao.dataset.editandoId = tarefa.dataset.tarefaId;
  }

  function salvarEdicao(event) {
    event.preventDefault();
    const novaDescricao = entradaEdicao.value.trim();
    if (novaDescricao !== '') {
      const tarefaEditada = criarTarefaElemento(novaDescricao);
      const tarefaOriginal = listaTarefas.querySelector(`[data-tarefa-id="${formEdicao.dataset.editandoId}"]`);
      listaTarefas.replaceChild(tarefaEditada, tarefaOriginal);
      resetarFormularioEdicao();
      mostrarMensagemResultado('Tarefa editada com sucesso!', 'sucesso');
    } else {
      mostrarMensagemResultado('Por favor, insira uma descrição para a tarefa.', 'erro');
    }
  }

  function removerTarefa(tarefa) {
    listaTarefas.removeChild(tarefa);
    mostrarMensagemResultado('Tarefa removida com sucesso!', 'sucesso');
  }

  function limparTarefas() {
    listaTarefas.innerHTML = '';
    mostrarMensagemResultado('Todas as tarefas foram removidas.', 'sucesso');
  }

  function filtrarTarefas() {
    const termoBusca = entradaBusca.value.toLowerCase();
    const filtroSelecionado = selecaoFiltro.value;

    listaTarefas.childNodes.forEach(function (tarefa) {
      const descricao = tarefa.querySelector('p').textContent.toLowerCase();
      const tarefaConcluida = tarefa.classList.contains('concluida');

      const correspondeBusca = descricao.includes(termoBusca);
      const correspondeFiltro = (
        filtroSelecionado === 'todos' ||
        (filtroSelecionado === 'concluidos' && tarefaConcluida) ||
        (filtroSelecionado === 'a-fazer' && !tarefaConcluida)
      );

      if (correspondeBusca && correspondeFiltro) {
        tarefa.style.display = 'block';
      } else {
        tarefa.style.display = 'none';
      }
    });
  }

  function resetarFormularioEdicao() {
    formTarefa.classList.remove('esconder');
    formEdicao.classList.add('esconder');
    entradaEdicao.value = '';
    delete formEdicao.dataset.editandoId;
  }

  function mostrarMensagemResultado(mensagem, tipo) {
    mensagemResultado.textContent = mensagem;
    mensagemResultado.classList.remove('sucesso', 'erro');
    mensagemResultado.classList.add(tipo);
    setTimeout(() => {
      mensagemResultado.textContent = '';
    }, 3000);
  }
});
