//Para trabajar el DOM//
// console.log("Hola")
window.onload = initialize;
let formMessage;
let refmessage;
let messageBackground;
//inicializa la conección entre base de datos y javascript
function initialize(){
    formMessage = document.getElementById("formMessage");
    formMessage.addEventListener("submit", sendDataToFirebase, false);
    messageBackground = document.getElementById("messageBackground");
    initializeFirebase();
    showMessageFromFirebase();
}
//mostrando mensaje de base de datos, ref=referencia
function showMessageFromFirebase(){
    refmessage = firebase.database().ref().child("mensaje");
    refmessage.on("value",function(snap){
        let todosLosMensajes = "";
        document.getElementById("messageBackground").innerHTML ="";
        let datos = snap.val();
        //aqui se dibujan los padres, mensaje que escribe usuario es el padre y el comentario el hijo(child)
        for(var key in datos){
            if(datos[key].Eliminado === 0){
             todosLosMensajes += "<div class='divWallMessage'><div class='divHeaderMuro'>" + datos[key].Nombre + "</div><div class='divBodyWall'><br></br>" + datos[key].Mensaje+"<br></br></div>";
             //ahora que dibujamos los padres, dibujaremos a los hijos
             let refMessageChild=firebase.database().ref().child("mensaje").child(key);
             refMessageChild.on("value",function(snap){
                 let datoChild=snap.val();
                 for(var keyChild in datoChild){
                    if(datoChild[keyChild].Eliminado === 0){
                        todosLosMensajes += "<div class='divBodyResWall'><a class='aMuro'>" + datoChild[keyChild].Nombre + " : " + datoChild[keyChild].Mensaje+"</a> <img src='imagenes/borrar.png' class='imgMuroBorrar' onclick=updateDeleteChild('"+key+"','"+keyChild+","+datoChild[keyChild].Email+"')><br></br></div>";
                    }
               }
             });
             todosLosMensajes+="<div class='divFooterWall'><div class='divSelect'><img src='imagenes/palta.png' class='imgMuro' onclick=sumLike('"+key+"')>" + datos[key].Like +"</div><div class='divSelect'><img src='imagenes/comm.png' class='imgMuro' onclick=answerMessage('"+key+"')></div><div class='divSelect'><img src='imagenes/borrar.png' class='imgMuro' onclick=updateDelete('"+key+"','"+datos[key].Email+"')></div></div>"
             todosLosMensajes+="</div></br>";
            }
        }
      //  messageBackground.innerHTML = todosLosMensajes;
      
     document.getElementById("messageBackground").innerHTML += todosLosMensajes;
    })
}
//cambia estado del mensaje(actualiza si la persona borra)
function updateDelete(valor,email){
    if(email === document.getElementById("email2").value){
        if(confirm("Desea eliminar mensaje")){
            refmessage = firebase.database().ref().child("mensaje").child(valor);
            refmessage.update({
            Eliminado:1
    
            });
        }
    }
    else
    {
        alert("Solo el usuario propietario puede eiminar el mensaje");

    }
}
//cambia estado del mensaje del mensaje hijo(actualiza si la persona borra)
function updateDeleteChild(valor,valorChild,email){
    if(email === document.getElementById("email2").value){
        if(confirm("Desea eliminar mensaje")){
            refmessage = firebase.database().ref().child("mensaje").child(valor).child(valorChild);
            refmessage.update({
            Eliminado:1
            });
        }
    }
    else
    {
        alert("Solo el usuario propietario puede eiminar el mensaje");
    }
  
 }
function sumLike(keySum){
    console.log("dfdfdf");
    let addLike = 0;
    refmessageLike = firebase.database().ref().child("mensaje").child(keySum);
    refmessageLike.on("value",function(snap){
        addLike = snap.val().Like;
    });
    refmessageLike.update({
    Like:addLike+1
    });
}
//para que el modal se cierre
window.onclick = function(event) {
    let modal = document.getElementById('myModal');
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }  
  document.getElementById("cerrarModal").addEventListener("click", closeModal)
  function closeModal()
  {
    let modal = document.getElementById('myModal');
    modal.style.display = "none";
  }
  document.getElementById("btnModal").addEventListener("click", cerrarModal)
  function cerrarModal(){
    let modal = document.getElementById("myModal");
    let usuario=document.getElementById("nameResponse").value;
    let mensaje=document.getElementById("mesageResponse").value;
    if(usuario != "" && usuario != null && mensaje != "" && mensaje != null)
    { 
        let email=document.getElementById("email2").value;
        console.log(email);  
        refmessageAnswer= firebase.database().ref().child("mensaje").child(keyAnswerMessage);
        refmessageAnswer.push({Mensaje:mensaje, Nombre:usuario, Eliminado:0,Principal:0,Like:0,Email:email});
        keyAnswerMessage="";
        document.getElementById("nameResponse").value="";
        document.getElementById("mesageResponse").value="";
    }
    else
    {
        modal.style.display = "none";
        alert("El mensaje o el usuario no puede estar en blanco");
    }
    modal.style.display = "none";
  }
//usuario será el nombre y correo de usuaro registrado
let keyAnswerMessage;
function answerMessage(keyAnswer){
    //let messageAnswer = prompt("Respuesta");

    keyAnswerMessage=keyAnswer;
    let modal = document.getElementById("myModal");
    modal.style.display = "block";
}
//Envía datos a Firebase
function sendDataToFirebase(event){
    event.preventDefault();
    let email=document.getElementById("email2").value;
    console.log(email);  
    if(event.target.mensaje.value != null && event.target.mensaje.value != "" && event.target.nombre.value != "" && event.target.nombre.value!= null){
        refmessage.push({Mensaje: event.target.mensaje.value, Nombre:event.target.nombre.value, Eliminado:0,Principal:0,Like:0,Email:email});
        document.getElementById("nombre").value="";
        document.getElementById("mensaje").value="";
    }
    else
    {
        alert("Mensaje y/o Usuario no puede estar en balnco");
    }
}
 //Parámetros para conexión de base de datos
function initializeFirebase(){
  // Initialize Firebase
	let config = {
		apiKey: 'AIzaSyB-jbfNQ2raBjBe0Y8iDER0k1VVQIYx01M',
		authDomain: 'social-network-a15f8.firebaseapp.com',
		databaseURL: 'https://social-network-a15f8.firebaseio.com',
        projectId: 'social-network-a15f8',
        storageBucket: 'social-network-a15f8.appspot.com',
        messagingSenderId: '994003009333'
	};
	// eslint-disable-next-line no-undef
	firebase.initializeApp(config);}