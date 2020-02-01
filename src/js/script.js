// variaveis
const fontes = document.getElementById('fontes')
const cores = document.getElementById('cores')
const racas = document.getElementById('racas')
const racasoption = document.getElementsByTagName('option')
const nomeDog = document.getElementById('nome-dog')
const code = document.getElementById('code')
const color = document.getElementById('cor')

const inputDog = document.getElementById('input-dog')
const imagemdog = document.getElementById('cachorro_selecionado')
const backDog = document.getElementById('nome-dog')

let htmlRacas;

const storageMyDog = JSON.parse(localStorage.getItem('meuDog'))

// Objeto com configurações que será salvo no localstorage
let meuDog = {}
console.log(storageMyDog)

// ver se ja tem item salvo no localstorage
if(storageMyDog) {
    nomeDog.style.fontFamily = storageMyDog.fonte

    nomeDog.style.color = storageMyDog.cor
    backDog.style.background = storageMyDog.background
    nomeDog.textContent = storageMyDog.nome
    inputDog.value = storageMyDog.nome

    code.innerHTML = localStorage.getItem('meuDog')
}

// funcao padrao para pegar o item selecionado nos campos de select
function seleciona(item) {
    item.onchange = function () {

        const indice_selecionado = item.options.selectedIndex;
        const valor = item.options[indice_selecionado].value

        if (item.name === 'fontes') {
            console.log(valor)
            nomeDog.style.fontFamily = valor
            meuDog.fonte = valor
        }

        if (item.name === 'cores') {
            console.log(valor)
            nomeDog.style.color = valor
            meuDog.cor = valor
        }

        if (item.name === 'racas') {
            console.log(valor)
            meuDog.raca = valor
            fetchImg(valor)
        }

        return
    }
}

// Pega o valor digitado no input
inputDog.onkeyup = function () {

    if(inputDog.value === '') {
        nomeDog.textContent = 'Escreva um nome pra seu dog!'
        return
    }

    nomeDog.textContent = inputDog.value
    meuDog.nome = inputDog.value
}

// muda background 
color.onchange = function() {
    backDog.style.background = color.value

    meuDog.background = color.value
}

// Pega a lista de dogs na api
function fetchDog() {
    fetch('https://dog.ceo/api/breeds/list/all')
        .then(r => r.json())
        .then(r => {
            Object.keys(r.message).forEach(element => {
                htmlRacas = `<option value='${element}'>${element}</option>`
                racas.innerHTML += htmlRacas
            })
        }).catch((error) => {
            console.error(error)
        })
}

// Função que será iniciada no começo
function reloadInit() {

    fetchDog()
    seleciona(fontes)
    seleciona(cores)
    seleciona(racas)
    
    selectDog()
}

// Seleciona o dog juntamente com sua imagem
function selectDog() {
    if (storageMyDog) {
        imagemdog.src = storageMyDog.imagem
    } else {
        seleciona(racas)
    }

}

function fetchImg(valor) {
    fetch(`https://dog.ceo/api/breed/${valor}/images/random`)
        .then(r => r.json())
        .then(r => {
            imagemdog.src = r.message
            meuDog.imagem = r.message
        })
}

// salvar as configurações no localstorage
function salvar() {
    if (!meuDog.nome)return new AWN().warning('Digite o nome', {durations: {warning: 3500}})
    if (!meuDog.raca) return new AWN().warning('Escolha uma raça', {durations: {warning: 3500}})
    if (!meuDog.fonte) return new AWN().warning('Escolha uma fonte', {durations: {warning: 3500}})
    if (!meuDog.cor) return new AWN().warning('Escolha uma cor', {durations: {warning: 3500}})

    meuDog.horario = new Date().getTime()
    
    let json = JSON.stringify(meuDog)
    localStorage.setItem('meuDog', json)

    code.innerText = json

    new AWN().success('Cachorrinho salvo!', {durations: {sucess: 3500}})
}

function resetar() {
    localStorage.removeItem('meuDog')

    new AWN().success('Removido com sucesso!', {durations: {warning: 4000}})
    setTimeout(() => {
        window.location.reload()
    }, 4000);
}

reloadInit()