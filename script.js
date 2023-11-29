const mapHtml = document.querySelector('.map')
const botao = document.querySelector('button')

let linhas = 0
let colunas = 0
let padrao = 0

botao.onclick = function() {
    const select = document.querySelector('#select').value
    
    if (select == 3) {
        linhas = 2
        colunas = 4
    } else {
        linhas = select
        colunas = select
    }
    
    padrao = linhas == colunas ? linhas : 3
    
    let verificar = 0
    while (!verificar) {
        let sequencia = variaveisHtml(select)
        let valores = gerarMapaFinal(linhas, colunas, padrao)
        verificar = verificarVariaveis(valores, sequencia)
    } 
}

function padraoDeValor(padrao) {
    let valor = '0000'
    let valorSplited = valor.split('')
    valorSplited.splice(padrao, valorSplited.length - padrao)
    valor = valorSplited.join('')
    return valor
}

function substituirCaracterePorIndice(str, indice, novoCaractere) {
    const caracteres = str.split('');
    caracteres[indice] = novoCaractere;
    const novaString = caracteres.join('');
    return novaString;
}

function gerarMapaVetorInicial(linhas, colunas) {
    let valores = []
    for (let i = 0; i < linhas; i++) {
        let line = []
        for (let j = 0; j < colunas; j++) {
            line.push('')
        }
        valores.push(line)
    }
    return valores
}

function gerarMapaHtml(valores) {
    let cells = ''
    for (let linha = 0; linha < valores.length; linha++) {
        for (let coluna = 0; coluna < valores[linha].length; coluna++) {
            cells += `<div id="${linha}${coluna}" class="cell">${valores[linha][coluna]}</div>`
        }
    
    }
    mapHtml.innerHTML = cells
    mapHtml.style.gridTemplateRows = `repeat(${linhas}, 1fr)`
    mapHtml.style.gridTemplateColumns = `repeat(${colunas}, 1fr)`
}

function gerarMapaFinal(linhas, colunas, padrao) {
    let valores = gerarMapaVetorInicial(linhas, colunas)
    let valor = padraoDeValor(padrao)
    let verificarValores = [valor]

    for (let linha = 0; linha < linhas; linha++) {
        for (let coluna = 0; coluna < colunas; coluna++) {
            valores[linha][coluna] = valor
            
            // Colunas
            const c1 = coluna
            const c2 = coluna - 1 >= 0 ? coluna - 1 : colunas - 1
            const c3 = coluna + 1 < colunas ? coluna + 1 : 0 
            
            // Linhas
            const l1 = linha
            const l2 = linha - 1 >= 0 ? linha - 1 : linhas - 1
            const l3 = linha + 1 < linhas ? linha + 1 : 0 

            let positions = Array.from({ length: padrao }, (_, index) => index)

            function calculoDeValor(l, c) {
                if (valores[l][c] == '') {
                    let indice = 0
                    let cellValue = ''
                    do {
                        do {
                            indice = Math.floor(Math.random() * padrao);
                        } while (positions[indice] == -1)
                        let p = positions[indice]
                        
                        let v = valor[p] == "1" ? "0" : "1"
                        cellValue = substituirCaracterePorIndice(valor, p, v)

                    } while (verificarValores.includes(cellValue))
        
                    positions[indice] = -1
                    verificarValores.push(cellValue)
                    valores[l][c] = cellValue
                }
            }

            calculoDeValor(l1, c3)
            calculoDeValor(l3, c1)
            calculoDeValor(l1, c2)
            calculoDeValor(l2, c1)

            let key_linha = linha
            let key_coluna = coluna + 1
            if (coluna == colunas - 1 && linha != linhas - 1) {
                key_linha = linha + 1
                key_coluna = 0
            }

            const cellProximo = valores[key_linha][key_coluna]
            valor = cellProximo
        }
    }

    gerarMapaHtml(valores)
    return valores
}

function variaveisHtml(variaveis) {
    document.querySelectorAll('.faixa').forEach(f => {
        f.style.display = 'none'
    })

    let vars = []
    const faixaC = document.querySelector('.selectC')
    switch(variaveis) {
        case "2":
            faixaC.value = "B"
            vars = {'A': 0, 'B': 1}
            break
        case "3":
            faixaC.value = "C"
            vars = {'A': 0, 'C': 2, 'B': 1}
            break
        case "4":
            faixaC.value = "C"
            vars = {'A': 0, 'C': 2, 'B': 1, 'D': 3}
            break
    }

    let seq = {}
    for (let v in vars) {
        if (Object.keys(vars).length == 2 && v == 'B'){
            v = 'C'
        }
        document.querySelectorAll(`.${v}`).forEach(f => {
            f.style.display = 'block'
        })
        document.querySelectorAll(`.select${v}`).forEach(f => {
            seq[f.value] = vars[f.value]
        })
    }

    return seq
}

function verificarVariaveis(valores, sequencia) {
    let qtdVariareis = Object.keys(sequencia).length
    let regra = []
    if (qtdVariareis == 2) {
        regra = ["1", "1"]
    }
    else if (qtdVariareis == 3) {
        regra = ["23", "1", "12"]
    }
    else if (qtdVariareis == 4) {
        regra = ["23", "23", "12", "12"]
    }
    return verificarCadaCelula(valores, sequencia, regra)
}

function verificarCadaCelula(valores, sequencia, regra) {
    for (let i = 0; i < valores.length; i++) {
        for (let j = 0; j < valores[i].length; j++) {
            let valor = valores[i][j]
            let c = 0
            for (let key in sequencia) {
                let indice1 = regra[c][0]
                let indice2 = regra[c][1]
                if (c % 2 == 0) {
                    // Coluna
                    if (j == parseInt(indice1) || j == parseInt(indice1)) {
                        if (parseInt(valor[sequencia[key]]) != 1) {
                            return 0
                        }
                    }
                } else {
                    // Linha
                    if (i == parseInt(indice1) || i == parseInt(indice2)) {
                        if (parseInt(valor[sequencia[key]]) != 1) {
                            return 0
                        }
                    }
                }
                c++
            }
        }
    }
    return 1
}
