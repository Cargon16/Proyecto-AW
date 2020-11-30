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

        <form id="registro" class="formularios" method="post" action="./usuarios/signup">

            
            <label id = "textCorreo">Correo *</label>
            <input id="inputCorreo" name="correo"> </input>
           
            <label id = "textPassword">Contraseña *</label>
            <input id="inputPassword" name="password"> </input>

            <label id = "textPassword">Confirmar contraseña *</label>
            <input id="inputPassword" name="confirmPassword"> </input>

            <label id = "textNombre">Nombre para mostrar*</label>
            <input id="inputNombre" name="nombre"> </input>
           
            <label id = "textPerfil">Nombre para mostrar*</label>
            <input id = "inputPerfil" name="perfil" type="file" name="adjunto" accept=".pdf,.jpg,.png" multiple />

            <button id="buttonCrearCuenta">Crear Cuenta</button>
            <button id="buttonIniciarSesion">Iniciar Sesion</button>
            
            
           
        </form>

    </div>
   

    
</body>
</html>