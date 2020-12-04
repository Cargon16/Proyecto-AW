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
    

    <div id="boxPerfil">
        <div id ="boxSuperior">
            <div id="boxUsuario">

            </div>
            
            <div id="boxEstadistica">
                <div id="boxTextEstadisticas">
                <p id="text_estadisticas">ESTADISTICAS</p>
                </div>
                <div id="boxReputacion" style="display:flex">
                    <div id="boxPreguntas">
                        <p>Preguntas</p>
                    </div>
                    <div id="boxRepu">
                        <p>Reputacion</p>
                    </div>
                    <div id="boxRespuestas">
                        <p>Respuestas</p>
                    </div>
                </div>

            </div>
          
        </div>
        <div id= "boxInferior">
            <div id="boxTextMedallas">
            <p id="text_medallas">MEDALLAS</p>
            </div>

            <div id = "boxMedallas" style="display:flex">
            <div id="boxBronce">
                <p>BRONCE</p>
            </div>
            <div id="boxPlata">
                <p>PLATA</p> 
            </div>
            <div id="boxOro">
                <p>ORO</p>
            </div>

            </div>
            
        </div>
    </div>
</body>
</html>