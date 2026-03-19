<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Cotizador Marmolería</title>
</head>
<body>

<h1>Cotizador</h1>

<h3>Precio por m²</h3>
<input type="number" id="precioM2" placeholder="Precio por m²">

<br><br>

<!-- COCINA -->
<div class="pieza" id="cocina">
  <h3>Cocina</h3>
  <div class="secciones" id="cocina-secciones"></div>
  <button onclick="agregarSeccion('cocina','cocina')">Agregar sección</button>
</div>

<!-- ISLA -->
<div class="pieza" id="isla">
  <h3>Isla</h3>
  <div class="secciones" id="isla-secciones"></div>
  <button onclick="agregarSeccion('isla','isla')">Agregar sección</button>
</div>

<!-- LAVADERO -->
<div class="pieza" id="lavadero">
  <h3>Lavadero</h3>
  <div class="secciones" id="lavadero-secciones"></div>
  <button onclick="agregarSeccion('lavadero','lavadero')">Agregar sección</button>
</div>

<!-- BAÑO -->
<div class="pieza" id="bano">
  <h3>Baño</h3>
  <div class="secciones" id="bano-secciones"></div>
  <button onclick="agregarSeccion('bano','baño')">Agregar sección</button>
</div>

<!-- ESPACIO EXTRA -->
<div class="pieza" id="espacio_extra">
  <h3>Espacio Extra</h3>
  <div class="secciones" id="espacio_extra-secciones"></div>
  <button onclick="agregarEspacioExtra()">Agregar espacio</button>
</div>

<!-- TRAFOROS -->
<h3>Trafóros</h3>
Grifería: <input type="number" id="grif"><br>
Bacha: <input type="number" id="bacha"><br>
Anafe: <input type="number" id="anafe"><br>

<br><br>
<button onclick="calcular()">Calcular</button>

<br><br>
<pre id="resultado"></pre>

<script src="app.js"></script>

</body>
</html>