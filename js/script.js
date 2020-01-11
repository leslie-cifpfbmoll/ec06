const CARTAS_FACIL = ['img/img1.png', 'img/img2.png', 'img/img3.png'];
const CARTAS_MEDIO = ['img/img1.png', 'img/img2.png', 'img/img3.png', 'img/img4.png', 'img/img9.png', 'img/img10.png'];
const CARTAS_DIFICIL = ['img/img1.png', 'img/img2.png', 'img/img3.png', 'img/img4.png', 'img/img9.png', 'img/img10.png', 'img/img7.png', 'img/img6.png'];
var limite_nivel = '[{"nivel": "facil", "tiempo": 60},{"nivel": "medio","tiempo": 120},{"nivel": "dificil","tiempo": 120}]';
var img_correcta = 0;
var img_select = [];
var img_id = [];
var partidas = [];
var tiempo;
var tlimite = '';
//compreba si el nickname esta vacio y envia las cartas de cada nivel
function nivel(opcion) {
    nickname = document.getElementById('name').value;
    //Jquery - AddClass RemoveClass
    $("#partida").removeClass("index").addClass("partida");
    if (nickname == "") {
        alert("Nickname vacio");
    } else {
        t_limite(opcion); //cronometro
        if (opcion == "facil") {
            document.getElementById('partida').style.width = "50%";
            mostrar(CARTAS_FACIL);
        } else if (opcion == "medio") {
            document.getElementById('partida').style.width = "70%";
            mostrar(CARTAS_MEDIO);
        } else if (opcion == "dificil") {
            document.getElementById('partida').style.width = "80%";
            mostrar(CARTAS_DIFICIL);
        }
    }
}
//el tiempo limite según el JSON en segundos
function t_limite(nivel) {
    limites = JSON.parse(limite_nivel);
    for (var i = 0; i < limites.length; i++) {
        if (limites[i].nivel == nivel) { tlimite = limites[i].tiempo }
    }
    document.getElementById('limite').innerHTML = parseInt(tlimite / 60) + " min " + (tlimite % 60) + " seg";

}
/* creamos un cronometro con la funcion setinterval
que cada 1000ms=1s aumente los segundos,hasta que llegue
al tiempo limite
  */
function cronometro() {
    segundos = 0;
    minutos = 0;
    s = document.getElementById("seg");
    m = document.getElementById("min");
    tiempo = setInterval(function() {
            segundos++;
            s.innerHTML = segundos;
            m.innerHTML = minutos;
            if (segundos == 60) {
                minutos++;
                segundos = 0;
            }
            if (segundos < 10) {
                s.innerHTML = "0" + segundos;
            }
            if (minutos < 10) {
                m.innerHTML = "0" + minutos;
            }
            if ((minutos * 60) + segundos == tlimite) {
                alert("tiempo agotado");
                clearInterval(tiempo);
                document.getElementById('partida').innerHTML = "Tiempo agotado";
                img_correcta = 0;
            }
        }, 1000) //1 segundo=1000ms;
}
//crea las cartas
function mostrar(cartasnivel) {
    cronometro();
    var carta = '';

    cartas = cartasnivel.concat(cartasnivel).concat(cartasnivel);
    cartas.sort(() => 0.5 - Math.random());
    //Jquery - chaining
    $("#partida").hide().empty();

    for (var i = 0; i < cartas.length; i++) {
        carta = '<div class="carta" id="carta_' + i + '" onclick="juego(this,\'' + cartas[i] + '\')"></div>';
        //Jquery - selector
        $("#partida").append(carta);
    }
    //Jquery - fadeIn
    $("#partida").fadeIn(700);


    document.getElementById('partida').name = cartas.length;

}
/* 
solo puedo seleccionar 3 cartas, cada vez que da click 
en una se almacena en un array img_select si estos
son los mismos, se suman 3 a img_correctas
si no son iguales la carta vuelve a esconderse
la partida acaba cuando img_correctas es igual 
que el tamaño del array de cartas 
  */
function juego(carta, img) {

    if (img_select.length < 3) {
        //Jquery - css()
        $(carta).css({ backgroundImage: `url(${img})` });
        if (img_select.length == 0) {
            img_select.push(img);
            img_id.push(carta.id);
            $(carta).css({ pointerEvents: "none" });
        } else if (img_select.length == 1) {
            img_select.push(img);
            img_id.push(carta.id);
            $(carta).css({ pointerEvents: "none" });
        } else if (img_select.length == 2) {
            img_select.push(img);
            img_id.push(carta.id);
            $(carta).css({ pointerEvents: "none" });
            if ((img_select[0] == img_select[1]) && (img_select[0] == img_select[2]) && (img_select[2] == img_select[1])) {
                img_correcta += 3;
                img_select = [];
                img_id = [];
                //   if (img_correcta == document.getElementById('partida').name) {
                if (img_correcta == 3) {
                    clearInterval(tiempo);
                    //   if (img_correcta == 9) {
                    if (img_correcta == 3) {
                        nickname = document.getElementById('name').value;
                        tinvertido = (document.getElementById("min").innerHTML * 60) + document.getElementById("seg").innerHTML;
                        puntuacion = (tlimite - tinvertido) * 100;
                        partidas[puntuacion] = nickname;
                        // //JQuery - hide
                        $("#partida").hide();
                        //JQuery - removeClass AddClass chaining
                        $("#partida").removeClass("partida").addClass("index");
                        //JQuery - show - animate -chaining
                        $("#partida").show().animate({ opacity: 'auto', width: 'auto', left: '250px' });
                        document.getElementById('partida').innerHTML = ordenar(partidas);
                        img_correcta = 0;
                    } else {
                        img_correcta = 0;
                        //JQuery - fadeOut
                        $("#partida").fadeOut(700);
                        document.getElementById('partida').innerHTML = "Has ganado " + nickname;
                    }
                }
            } //
            else {
                function Back() {
                    carta1 = document.getElementById(img_id[0]);
                    carta2 = document.getElementById(img_id[1]);
                    carta3 = document.getElementById(img_id[2]);
                    //JQuery - .css()
                    $(carta1).css({ pointerEvents: 'auto', background: 'rgb(255, 255, 255)' });
                    $(carta2).css({ pointerEvents: 'auto', background: 'rgb(255, 255, 255)' });
                    $(carta3).css({ pointerEvents: 'auto', background: 'rgb(255, 255, 255)' });

                    img_select = [];
                    img_id = [];
                }
                setTimeout(Back, 600);
            }
        }


    }
}

function ordenar(arr) {
    var ordenar_puntuacion = new Array();
    // Separamos la puntuación en un solo array
    for (var i in arr) {
        ordenar_puntuacion.push(i);
    }
    ordenar_puntuacion = ordenar_puntuacion.reverse();
    // Ordenamos alrevez

    ranking = "<ol>";
    for (var i in ordenar_puntuacion) {
        ranking += "<li>Puntuación:" + [ordenar_puntuacion[i]] + " Nickname:" + arr[ordenar_puntuacion[i]] + "</li>";
    }
    ranking += "</ol>";
    return ranking;


}