-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 12-11-2020 a las 18:14:07
-- Versión del servidor: 10.4.14-MariaDB
-- Versión de PHP: 7.2.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `404`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medallas`
--

DROP DATABASE IF EXISTS `404`;
CREATE DATABASE `404` ;
USE `404`;

CREATE TABLE `medallas` (
  `ID_Medalla` int(100) NOT NULL,
  `Metal` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `Nombre` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `id_usuario` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `id_pregunta` int(100) DEFAULT NULL,
  `id_respuesta` int(100) DEFAULT NULL,
  `Fecha` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preguntas`
--

CREATE TABLE `preguntas` (
  `ID_Pregunta` int(100) NOT NULL,
  `Titulo` varchar(500) COLLATE utf8mb4_spanish_ci NOT NULL,
  `Cuerpo` text COLLATE utf8mb4_spanish_ci NOT NULL,
  `ID_Usuario` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `Fecha` date NOT NULL,
  `Reputacion` int(30) NOT NULL,
  `Votos` int(30) NOT NULL,
  `Visitas` int(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `respuestas`
--

CREATE TABLE `respuestas` (
  `ID_Respuesta` int(100) NOT NULL,
  `Cuerpo` text COLLATE utf8mb4_spanish_ci NOT NULL,
  `ID_Usuario` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `ID_Pregunta` int(100) NOT NULL,
  `Fecha` date NOT NULL,
  `Reputacion` int(30) NOT NULL,
  `Votos` int(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `Correo` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `Contraseña` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `Nombre` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `Reputacion` int(30) NOT NULL,
  `FechaAlta` date NOT NULL,
  `FotoPerfil` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Estructura de la tabla `votosPreguntas`
--
CREATE TABLE `votosPreguntas` (
  `ID_Usuario` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `ID_Pregunta` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Estructura de la tabla `task`
--
CREATE TABLE `tag` (
  `ID_Pregunta` int(11) NOT NULL,
  `tag` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Estructura de la tabla `votosRespuesta`
--
CREATE TABLE `votosRespuesta` (
  `ID_Usuario` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `ID_Respuesta` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `tags`
--
ALTER TABLE `tag`
  ADD PRIMARY KEY (`ID_Pregunta`,`tag`);

--
-- Indices de la tabla `medallas`
--
ALTER TABLE `medallas`
  ADD PRIMARY KEY (`ID_Medalla`),
  ADD KEY `fk_usuario_medallas` (`id_usuario`),
  ADD KEY `fk_pregunta_medallas` (`id_pregunta`),
  ADD KEY `fk_respuesta_medallas` (`id_respuesta`);

--
-- Indices de la tabla `preguntas`
--
ALTER TABLE `preguntas`
  ADD PRIMARY KEY (`ID_Pregunta`),
  ADD KEY `fk_usuario_preguntas` (`ID_Usuario`);

--
-- Indices de la tabla `respuestas`
--
ALTER TABLE `respuestas`
  ADD PRIMARY KEY (`ID_Respuesta`),
  ADD KEY `fk_usuario_respuestas` (`ID_Usuario`),
  ADD KEY `fk_pregunta_respuestas` (`ID_Pregunta`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`Correo`);

--
-- Indices de la tabla `votosPreguntas`
--
ALTER TABLE `votosPreguntas`
  ADD PRIMARY KEY (`ID_Usuario`, `ID_Pregunta`),
  ADD KEY `fk_usuario_respuestas` (`ID_Usuario`),
  ADD KEY `fk_pregunta_respuestas` (`ID_Pregunta`);


--
-- Indices de la tabla `votosRespuesta`
--
ALTER TABLE `votosRespuesta`
  ADD PRIMARY KEY (`ID_Usuario`, `ID_Respuesta`),
  ADD KEY `fk_usuario_votorespuesta` (`ID_Usuario`),
  ADD KEY `fk_respuesta_votorespuesta` (`ID_Respuesta`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `medallas`
--
ALTER TABLE `medallas`
  MODIFY `ID_Medalla` int(100) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `preguntas`
--
ALTER TABLE `preguntas`
  MODIFY `ID_Pregunta` int(100) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `respuestas`
--
ALTER TABLE `respuestas`
  MODIFY `ID_Respuesta` int(100) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `medallas`
--
ALTER TABLE `medallas`
  ADD CONSTRAINT `fk_usuario_medallas` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`Correo`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_respuesta_medallas` FOREIGN KEY (`id_respuesta`) REFERENCES `respuestas` (`ID_Respuesta`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_pregunta_medallas` FOREIGN KEY (`id_pregunta`) REFERENCES `preguntas` (`ID_Pregunta`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `preguntas`
--
ALTER TABLE `preguntas`
  ADD CONSTRAINT `fk_usuario_preguntas` FOREIGN KEY (`ID_Usuario`) REFERENCES `usuarios` (`Correo`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `respuestas`
--
ALTER TABLE `respuestas`
  ADD CONSTRAINT `fk_pregunta_respuestas` FOREIGN KEY (`ID_Pregunta`) REFERENCES `preguntas` (`ID_Pregunta`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_usuario_respuestas` FOREIGN KEY (`ID_Usuario`) REFERENCES `usuarios` (`Correo`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `votosPreguntas`
--
ALTER TABLE `votosPreguntas`
  ADD CONSTRAINT `fk_pregunta_voto` FOREIGN KEY (`ID_Pregunta`) REFERENCES `preguntas` (`ID_Pregunta`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_usuario_voto` FOREIGN KEY (`ID_Usuario`) REFERENCES `usuarios` (`Correo`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `votosRespuesta`
  ADD CONSTRAINT `fk_pregunta_votoRespuesta` FOREIGN KEY (`ID_Respuesta`) REFERENCES `respuestas` (`ID_Respuesta`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_usuario_votoRespuesta` FOREIGN KEY (`ID_Usuario`) REFERENCES `usuarios` (`Correo`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `tag`
  ADD CONSTRAINT `tag_ibfk_1` FOREIGN KEY (`ID_Pregunta`) REFERENCES `preguntas` (`ID_Pregunta`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

INSERT INTO `usuarios` (`Correo`, `Contraseña`, `Nombre`, `Reputacion`, `FechaAlta`, `FotoPerfil`) VALUES ("nico@404.es", 12345678, "Nico", 1, "2021-01-13", "nico.png");
INSERT INTO `usuarios` (`Correo`, `Contraseña`, `Nombre`, `Reputacion`, `FechaAlta`, `FotoPerfil`) VALUES ("roberto@404.es", 12345678, "Roberto", 1, "2021-01-13", "roberto.png");
INSERT INTO `usuarios` (`Correo`, `Contraseña`, `Nombre`, `Reputacion`, `FechaAlta`, `FotoPerfil`) VALUES ("sfg@404.es", 12345678, "SFG", 1, "2021-01-13", "sfg.png");
INSERT INTO `usuarios` (`Correo`, `Contraseña`, `Nombre`, `Reputacion`, `FechaAlta`, `FotoPerfil`) VALUES ("marta@404.es", 12345678, "Marta", 1, "2021-01-13", "marta.png");
INSERT INTO `usuarios` (`Correo`, `Contraseña`, `Nombre`, `Reputacion`, `FechaAlta`, `FotoPerfil`) VALUES ("lucas@404.es", 12345678, "Lucas", 1, "2021-01-13", "kuroko.png");
INSERT INTO `usuarios` (`Correo`, `Contraseña`, `Nombre`, `Reputacion`, `FechaAlta`, `FotoPerfil`) VALUES ("emy@404.es", 12345678, "Emy", 1, "2021-01-13", "amy.png");


INSERT INTO preguntas (Titulo, Cuerpo, ID_Usuario, Fecha, Reputacion, Votos, Visitas) VALUES ("¿Cual es la diferencia entre position: relative, position: absolute y position: fixed?","Sé que estas propiedades de CSS sirven para posicionar un elemento dentro de la página. Sé que estas propiedades de CSS sirven para posicionar un elemento dentro de la página.", "nico@404.es", "2021-01-13", 0, 0,0);
INSERT INTO tag (ID_Pregunta, tag) VALUES (1,"css");
INSERT INTO tag (ID_Pregunta, tag) VALUES (1,"css3");
INSERT INTO respuestas (Cuerpo, ID_Usuario, ID_Pregunta, Fecha, Reputacion, Votos) VALUES ("La propiedad position sirve para posicionar un elemento dentro de la página. Sin embargo, dependiendo de cual sea la propiedad que usemos, el elemento tomará una referencia u otra para posicionarse respecto a ella.
Los posibles valores que puede adoptar la propiedad position son: static | relative | absolute | fixed | inherit | initial.", "lucas@404.es", 1, "2021-01-13", 0, 0);


INSERT INTO preguntas (Titulo, Cuerpo, ID_Usuario, Fecha, Reputacion, Votos, Visitas) VALUES ("¿Cómo funciona exactamente nth-child?","No acabo de comprender muy bien que hace exactamente y qué usos prácticos puede tener.", "roberto@404.es", "2021-01-13", 0, 0,0);
INSERT INTO tag (ID_Pregunta, tag) VALUES (2,"css");
INSERT INTO tag (ID_Pregunta, tag) VALUES (2,"html");
INSERT INTO respuestas (Cuerpo, ID_Usuario, ID_Pregunta, Fecha, Reputacion, Votos) VALUES ("La pseudoclase :nth-child() selecciona los hermanos que cumplan cierta condición definida en la fórmula an + b. a y b deben ser números enteros, n es un contador. El grupo an representa un ciclo, cada cuantos elementos se repite; b indica desde donde empezamos a contar.", "emy@404.es", 2, "2021-01-13", 0, 0);


INSERT INTO preguntas (Titulo, Cuerpo, ID_Usuario, Fecha, Reputacion, Votos, Visitas) VALUES ("Diferencias entre == y === (comparaciones en JavaScript)","
Siempre he visto que en JavaScript hay:

asignaciones =
comparaciones == y ===
Creo entender que == hace algo parecido a comparar el valor de la variable y el === también compara el tipo (como un equals de java).
", "sfg@404.es", "2021-01-13", 0, 0,0);
INSERT INTO tag (ID_Pregunta, tag) VALUES (3,"JavaScript");


INSERT INTO preguntas (Titulo, Cuerpo, ID_Usuario, Fecha, Reputacion, Votos, Visitas) VALUES ("Problema con asincronismo en Node","
Soy nueva en Node... Tengo una modulo que conecta a una BD de postgres por medio de pg-node. En eso no tengo problemas. Mi problema es que al llamar a ese modulo, desde otro modulo, y despues querer usar los datos que salieron de la BD me dice undefined... Estoy casi seguro que es porque la conexion a la BD devuelve una promesa, y los datos no estan disponibles al momento de usarlos.", "marta@404.es", "2021-01-13", 0, 0, 0);
INSERT INTO tag (ID_Pregunta, tag) VALUES (4,"nodejs");


INSERT INTO preguntas (Titulo, Cuerpo, ID_Usuario, Fecha, Reputacion, Votos, Visitas) VALUES ("¿Qué es la inyección SQL y cómo puedo evitarla?","
He encontrado bastantes preguntas en StackOverflow sobre programas o formularios web que guardan información en una base de datos (especialmente en PHP y MySQL) y que contienen graves problemas de seguridad relacionados principalmente con la inyección SQL.

Normalmente dejo un comentario y/o un enlace a una referencia externa, pero un comentario no da mucho espacio para mucho y sería positivo que hubiera una referencia interna en SOes sobre el tema así que decidí escribir esta pregunta.", "lucas@404.es", "2021-01-13", 0, 0, 0);
INSERT INTO tag (ID_Pregunta, tag) VALUES (5,"mysql");
INSERT INTO tag (ID_Pregunta, tag) VALUES (5,"sql");





