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
