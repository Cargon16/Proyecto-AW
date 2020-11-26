<!DOCTYPE html>
<html lang="en">
<head>
    <?php
        require("headers.html");
    ?>
</head>
<body>
    <header>
        <?php  
        require("headerNoLogged.html");
        ?>
    </header>

    <div id="boxFormulario">

        <form id="inicioSesion" class="formularios">

            
            <label id = "textCorreo">Correo *</label>
            <input id="inputCorreo"> </input>
           
            
            
            <label id = "textPassword">Contraseña *</label>
            <input id="inputPassword"> </input>
           
            <button id="buttonIniciarSesion">Iniciar Sesion</button>
            
            <button id="buttonCrearCuenta">Crear Cuenta</button>
           
        </form>

    </div>
   

    
</body>
</html>