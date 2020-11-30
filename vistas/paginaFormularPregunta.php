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


    <div id="boxFormularioPregunta">

    
        <form id="formularPregunta" class="formularioPregunta">

            <div id="divTitulo">
                <label>Formular una pregunta</label>
            </div>
            

            <label id="tituloFormulario">Título</label>
            <label id = "textSubTitulo">Sé específico e imagina que estás haciendo la pregunta a otra persona</label>
            <input id="inputCorreo" name="correo" placeholder="¿Cuál es tu pregunta sobre programación de aplicaciones web?" type="text"> </input>
           
            <label id="tituloFormulario">Cuerpo</label>
            <label id="textSubCuerpo">Incluye toda la información que alguien necesitaría para responder tu pregunta</label>
            <textarea id="inputCuerpo" name="cuerpo" type="text" > </textarea>

            <label id="tituloFormulario">Etiquetas</label>
            <label id="textSubEtiquetas">Añade hasta 5 etiquetas para describir sobre qué trata tu pregunta</label>
            <input id="inputEtiquetas" name="etiquetas" placeholder="Por ejemplo: @node@express" type="text"> </input>

            <button id="buttonPublicarPregunta">Publica tu pregunta</button>
           
        </form>

    </div>
    
</body>
</html>