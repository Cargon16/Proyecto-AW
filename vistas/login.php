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

        <form id="inicioSesion" class="formularios" method="post" action="./usuarios/signin">

            
            <label id = "textCorreo">Correo *</label>
            <input id="inputCorreo" name="correo"> </input>
           
            
            
            <label id = "textPassword">Contraseña *</label>
            <input id="inputPassword" name="password"> </input>
           
            <a href="paginaPrincipal.php" id="buttonIniciarSesion" role="button">Iniciar Sesion</a>
            <a href="registro.php" id="buttonCrearCuenta" role="button">Crear Cuenta</a>
           
        </form>

    </div>
   

    
</body>
</html>