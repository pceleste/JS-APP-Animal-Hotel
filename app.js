class Animal{
	constructor(tipo,tamanho,nome_animal,idade_animal,servico,nome_dono,obs){
		this.tipo = tipo,
		this.tamanho = tamanho,
		this.nome_animal = nome_animal,
		this.idade_animal = idade_animal,
		this.servico = servico,
		this.nome_dono = nome_dono,
		this.obs = obs
	}

	validarDados(){
		for(let i in this){
			if(this[i] == undefined || this[i] == null || this[i] == ''){
				return false
			}			
		}
		return true
	}
}

class Bd{
	constructor(){
		let id = localStorage.getItem('id')

		if(id === null){
			localStorage.setItem('id', 0) // se for null coloca a 0
		}
	}

	getProximoId(){
		let proximoId = localStorage.getItem('id')
		return parseInt(proximoId) + 1
	}

	gravar(a){
	//GUARDAR ITEM EM LOCAL STORAGE DO BROWSER

	let id = this.getProximoId() // VAI BUSCAR O VALOR DO ID PARA GRAVAR

	localStorage.setItem(id, JSON.stringify(a))

	localStorage.setItem('id', id)// SEMPRE Q O GRAVAR FOR CHAMADO VAI ATUALIZAR A CHAVE ID
	}

	recuperarTodosRegistos(){
		
		//array de animais
		let animais = Array()

		let id = localStorage.getItem('id')

		//recuperar todas os animais registas no localstorage até ao ultimo id
		for(let i = 1; i <= id; i++){

			//recuperar o animal
			let animal = JSON.parse(localStorage.getItem(i)) //converte string JSON para objeto
			
			//existe possibilidade de haver indices que foram removidos
			//nesse caso vamos saltar esses indices
			if(animal === null){
				continue // avança para o ciclo seguinte
			}

			animal.id = i //ATRIBUIR UM ATRIBUTO ID DENTRO DO OBJETO

			animais.push(animal)
		}

		return animais
	}

	remover(id) {
		localStorage.removeItem(id)
	}

	pesquisar(animal){

		let animaisFiltrados = Array()

		animaisFiltrados = this.recuperarTodosRegistos()

		if(animal.tipo != ''){
			animaisFiltrados = animaisFiltrados.filter(a => a.tipo == animal.tipo)
		}
		if(animal.tamanho != ''){
			animaisFiltrados = animaisFiltrados.filter(a => a.tamanho == animal.tamanho)
		}
		if(animal.nome_animal != ''){
			animaisFiltrados = animaisFiltrados.filter(a => a.nome_animal == animal.nome_animal)
		}
		if(animal.idade_animal != ''){
			animaisFiltrados = animaisFiltrados.filter(a => a.idade_animal == animal.idade_animal)
		}
		if(animal.servico != ''){
			animaisFiltrados = animaisFiltrados.filter(a => a.servico == animal.servico)
		}
		if(animal.nome_dono != ''){
			animaisFiltrados = animaisFiltrados.filter(a => a.nome_dono == animal.nome_dono)
		}
		if(animal.obs != ''){
			animaisFiltrados = animaisFiltrados.filter(a => a.obs == animal.obs)
		}
		return animaisFiltrados
	}
}

let bd = new Bd()

function registarAnimal(){

	let tipo = document.getElementById('tipo')
	let tamanho = document.getElementById('tamanho')
	let nome_animal = document.getElementById('nome_animal')
	let idade_animal = document.getElementById('idade_animal')
	let servico = document.getElementById('servico')
	let nome_dono = document.getElementById('nome_dono')
	let obs = document.getElementById('obs')

	let animal = new Animal(
		tipo.value,
		tamanho.value,
		nome_animal.value,
		idade_animal.value,
		servico.value,
		nome_dono.value,
		obs.value)
	
	if (animal.validarDados()) {

		if(animal.tamanho == 'Extra grande' || animal.tamanho == 'Grande'){
			animal.casa = 'Grande'
		}
		if(animal.tamanho == 'Medio'){
			animal.casa = 'Medio'
		}
		if(animal.tamanho == 'Pequeno' || animal.tamanho == 'Extra pequeno'){
			animal.casa = 'Pequeno'
		}		

		bd.gravar(animal)

		tipo.value = ''
		tamanho.value = ''
		nome_animal.value = ''
		idade_animal.value = ''
		servico.value = ''
		nome_dono.value = ''
		obs.value = ''

	}
	else{
		alert('Erro')
	}

}

function carregaListaAnimais(animais = Array(), filtro = false){

	if(animais.length == 0 && filtro == false){
		animais = bd.recuperarTodosRegistos()
	}

	let listaAnimais = document.getElementById('listaAnimais')
	listaAnimais.innerHTML = ''

	animais.forEach(function(a){

		let linha = listaAnimais.insertRow()

		linha.insertCell(0).innerHTML = a.tipo
		linha.insertCell(1).innerHTML = a.tamanho
		linha.insertCell(2).innerHTML = a.nome_animal
		linha.insertCell(3).innerHTML = a.idade_animal

		switch(a.servico){
			case '1': a.servico = 'Premium'
				break
			case '2': a.servico = 'Normal Plus'
				break
			case '3': a.servico = 'Normal'
				break

		}

		linha.insertCell(4).innerHTML = a.servico

		linha.insertCell(5).innerHTML = a.nome_dono

		linha.insertCell(6).innerHTML = a.obs

		//CRIAR O BOTAO DE EXCLUSÃO
		let btn = document.createElement("button")
		btn.className = "btn btn-danger"
		btn.innerHTML = '<i class="fas fa-times"></i>'
		btn.id = 'id_animal' + a.id
		btn.onclick = function(){ // remover despesa

			let id = this.id.replace('id_animal', '')
			
			bd.remover(id)

			window.location.reload() // RECARREGAR PAGINA PARA ATUALIZAR TABELA
		}
		linha.insertCell(7).append(btn)

	})

}

function pesquisarAnimal(){

	let tipo = document.getElementById('tipo').value
	let tamanho = document.getElementById('tamanho').value
	let nome_animal = document.getElementById('nome_animal').value
	let idade = document.getElementById('idade_animal').value
	let servico = document.getElementById('servico').value
	let dono = document.getElementById('nome_dono').value
	let obs = document.getElementById('obs').value

	let animal = new Animal(tipo,tamanho,nome_animal,idade,servico,dono,obs)

	let animais = bd.pesquisar(animal)

	carregaListaAnimais(animais,true)
}

function verificarCasas(animais = Array()){

	let countCasasGrandes = 0
	let countCasasMedias = 0
	let countCasasPequenas = 0

	let xgrande = document.getElementById('xgrande')
	let grande = document.getElementById('grande')
	let medio = document.getElementById('medio')
	let pequeno = document.getElementById('pequeno')
	let xpequeno = document.getElementById('xpequeno')

	animais = bd.recuperarTodosRegistos()
	

	animais.forEach(function(a){

		if(a.casa == 'Grande'){
			countCasasGrandes += 1
		}

		if(a.casa == 'Medio'){
			countCasasMedias += 1
		}

		if(a.casa == 'Pequeno'){
			countCasasPequenas += 1
		}

		if(countCasasGrandes >= 5){
			document.getElementById('nrcasasg').className = 'text-danger'
			xgrande.disabled = true
			grande.disabled = true
		}
		if(countCasasMedias >= 10){
			document.getElementById('nrcasasm').className = 'text-danger'
			medio.disabled = true
		}
		if(countCasasPequenas >= 15){
			document.getElementById('nrcasasp').className = 'text-danger'
			pequeno.disabled = true
			xpequeno.disabled = true
		}

	})

	document.getElementById('nrcasasg').innerHTML = countCasasGrandes
	document.getElementById('nrcasasm').innerHTML = countCasasMedias
	document.getElementById('nrcasasp').innerHTML = countCasasPequenas

}