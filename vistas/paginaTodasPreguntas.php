<!DOCTYPE html>
<html lang="es">
<head>
<?php
    require("headers.html");
    ?>
</head>
<body>
    <header>
    <?php
        require("headerLogged.html");
    ?> 
    </header>
    <?php
        require("busqueda.html");
    ?> 
        
    <div class="boxFormulario">

<div id="boxPregunta">
    <div id="boxTituloPreguntas">
        <label>Todas las preguntas</label>
    </div>
    
    <div id="boxSubGrupo">
        <label>preguntas</label>
        <button id="buttonFormularPregunta"> Formular una pregunta </button>
    </div>
</div>

</div>
</body>
</html>