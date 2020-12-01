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
            require("headerLogged.html");
        ?> 
    </header>

    <?php
    require("busqueda.html");
    ?> 
    

    <div id="boxPerfil">
        <div id ="boxSuperior">
            <div id="boxUsuario">

            </div>
            
            <div id="boxEstadistica">
                <p id="text_estadisticas">ESTADISTICAS</p>
                <div id="boxReputacion">

                </div>

            </div>
          
        </div>
        <div id= "boxInferior">
            <p id="text_medallas">MEDALLAS</p>
            <div id="boxBronce">
                BRONCE
            </div>
            <div id="boxPlata">
                PLATA
            </div>
            <div id="boxOro">
                ORO
            </div>
        </div>
    </div>
</body>
</html>