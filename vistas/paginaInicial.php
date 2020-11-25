<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../Css/estilo.css">
    <link rel="stylesheet" href="../Css/cabecera.css">
    <link rel="icon" type="image/svg" href="iconos/404.svg" sizes="64x64">
    <title>404</title>
</head>
<body>
    <header>
        <?php  
        require("headerNoLogged.html");
        ?>
    </header>

    <div id="boxFormulario">

        <form id="inicioSesion">

            
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