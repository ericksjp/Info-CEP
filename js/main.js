const cepInput = document.querySelector("#cep");
const cidadeInput = document.querySelector("#cidade");
const logradouroInput = document.querySelector("#street");
const bairroInput = document.querySelector("#bairro");
const ufInput = document.querySelector("#UF");
const dddInput = document.querySelector("#DDD");
const numeroInput = document.querySelector("#numero");
const cepInvalidoMSG = document.querySelector("#invalidCEP-Error");

const sessaoCeps = document.querySelector("#list-section");
const modalContainer = document.querySelector("#modal-container")

const limparBtn = document.querySelector("#clean-btn");
const submitBtn = document.querySelector("#submit-btn");
const modalBtn = document.querySelector("#modal-button")
const closeModalBtn =  document.querySelector("#close-modal");

cepInput.addEventListener("input", handleCepInputKeyUp);
cepInput.addEventListener("blur", handleCepInputOnBlur);
submitBtn.addEventListener("click", handleSubmitBtnClick);
limparBtn.addEventListener("click", handleLimparBtnClick);
modalBtn.addEventListener("click", handleModalBtnClick);
closeModalBtn.addEventListener("click", handleCloseModalBtnClick);


function handleCepInputKeyUp(e) {
  let newValue = e.target.value.replace(/[^0-9]/g, "");
  if (newValue.length > 8) newValue = newValue.substring(0, 8);

  if (newValue.length > 5)
    newValue = newValue.substring(0, 5) + "-" + newValue.substring(5);

  e.target.value = newValue;
}

async function handleCepInputOnBlur() {
  if (cepInput.value.length < 9 || cepInput.value.includes(" ")) {
    cepInvalidoMSG.style.display = "block";
    submitBtn.disabled = true;
  } else {
    const cep = cepInput.value.replace("-", "");
    const Obj = await pegarCep(cep);
    if (Obj.cep === undefined) {
      cepInvalidoMSG.style.display = "block";
      submitBtn.disabled = true;
    } else {
      cepInvalidoMSG.style.display = "none";
      submitBtn.disabled = false;

      cidadeInput.value = Obj.localidade;
      logradouroInput.value = Obj.logradouro;
      bairroInput.value = Obj.bairro;
      ufInput.value = Obj.uf;
      dddInput.value = Obj.ddd;
      numeroInput.value = Obj.siafi;
    }
  }
}

function handleSubmitBtnClick(e) {
  e.preventDefault();
  const newDiv = document.createElement("div");
  newDiv.innerHTML = `
    <h3>${cidadeInput.value}</h3>
    <ul>
        <li>CEP: <strong>${cepInput.value}</strong></li>
        <li>Logradouro: <strong>${logradouroInput.value}</strong></li>
        <li>Bairro: <strong>${bairroInput.value}</strong></li>
        <li>UF: <strong>${ufInput.value}</strong></li>
        <li>DDD: <strong>${dddInput.value}</strong></li>
        <li>Número: <strong>${numeroInput.value}</strong></li>
    </ul>`;

  sessaoCeps.appendChild(newDiv);
}

function handleLimparBtnClick(e) {
  e.preventDefault();

  cepInput.value = "";
  cidadeInput.value = "";
  logradouroInput.value = "";
  bairroInput.value = "";
  ufInput.value = "";
  dddInput.value = "";
  numeroInput.value = "";

  submitBtn.disabled = true;
  cepInvalidoMSG.style.display = "none";
  sessaoCeps.textContent = "";
}

function handleModalBtnClick(e){
    e.preventDefault();
    modalContainer.classList.add("active");
}

function handleCloseModalBtnClick(e){
    e.preventDefault();
    modalContainer.classList.remove("active");

}

async function pegarCep(cep) {
  try {
    const pedido = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const dados = await pedido.json();
    const cepObj = parseJsonToCepInfo(dados);
    return cepObj; // Retorna o objeto concreto, não uma promessa
  } catch (error) {
    throw error;
  }
}

function parseJsonToCepInfo(jsonData) {
  const cepInfo = {
    cep: jsonData.cep === "" ? "Informação não disponivel" : jsonData.cep,
    logradouro:
      jsonData.logradouro === ""
        ? "Informação não disponivel"
        : jsonData.logradouro,
    bairro:
      jsonData.bairro === "" ? "Informação não disponivel" : jsonData.bairro,
    localidade:
      jsonData.localidade === ""
        ? "Informação não disponivel"
        : jsonData.localidade,
    uf: jsonData.uf === "" ? "Informação não disponivel" : jsonData.uf,
    ibge: jsonData.ibge === "" ? "Informação não disponivel" : jsonData.ibge,
    gia: jsonData.gia === "" ? "Informação não disponivel" : jsonData.gia,
    ddd: jsonData.ddd === "" ? "Informação não disponivel" : jsonData.ddd,
    siafi: jsonData.siafi === "" ? "Informação não disponivel" : jsonData.siafi,
  };

  return cepInfo;
}
