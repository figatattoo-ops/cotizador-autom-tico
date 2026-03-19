let traforosPrecios = { grif: 20, bacha: 40, anafe: 40 };

function agregarSeccion(piezaId, tipo, esExtra = false) {
  const contenedor = document.getElementById(piezaId + '-secciones');
  const index = contenedor.children.length + 1;

  let extras = '';

  // Pata/Rivuelta
  if (tipo === 'isla' || esExtra) {
    extras += `
      Pata Ancho: <input type="number" class="pata_ancho" placeholder="Ancho" readonly>
      Pata Alto: <input type="number" class="pata_alto" placeholder="Alto"><br>
      Rivuelta Ancho: <input type="number" class="rivuleta_ancho" placeholder="Ancho">
      Rivuelta Alto: <input type="number" class="rivuleta_alto" placeholder="Alto" readonly><br>
    `;
  }

  // Alzada
  if (tipo === 'cocina' || tipo === 'lavadero' || esExtra) {
    extras += `
      Alzada Largo: <input type="number" class="alzada_largo" placeholder="Largo">
      Alzada Ancho: <input type="number" class="alzada_ancho" placeholder="Ancho"><br>
    `;
  }

  // Bacha integrada
  if (tipo === 'bano' || esExtra) {
    extras += `Bacha integrada: <input type="number" class="bacha_int" placeholder="Cantidad"><br>`;
  }

  // Zócalos y Regruesos
  let zocalosOpciones = ['fondo', 'izq', 'der'];
  let regruesosOpciones = ['frente', 'izq', 'der'];

  if (tipo === 'isla') {
    zocalosOpciones = ['frente','fondo','izq','der'];
    regruesosOpciones = ['frente','fondo','izq','der'];
  }

  const zocalosHTML = zocalosOpciones
    .map(lado => `${lado.charAt(0).toUpperCase() + lado.slice(1)} <input type="checkbox" class="zocalo_${lado}">`)
    .join(' ');

  const regruesosHTML = regruesosOpciones
    .map(lado => `${lado.charAt(0).toUpperCase() + lado.slice(1)} <input type="checkbox" class="regrueso_${lado}">`)
    .join(' ');

  // Sección sin input de nombre
  const html = `
    <div class="seccion" style="margin-bottom:5px; border:1px solid #ccc; padding:5px;">
      <h4>Sección ${index}</h4>
      Largo: <input type="number" class="largo">
      Ancho: <input type="number" class="ancho"><br>

      Zócalos: ${zocalosHTML}<br>
      Regruesos: ${regruesosHTML}<br>

      ${extras}
    </div>
  `;

  const div = document.createElement('div');
  div.innerHTML = html;
  contenedor.appendChild(div.firstElementChild);
}

function agregarEspacioExtra() {
  agregarSeccion('espacio_extra', 'extra', true);
}

function calcular() {
  let total = 0;

  const piezas = [
    {id: 'cocina', tipo: 'cocina'},
    {id: 'isla', tipo: 'isla'},
    {id: 'lavadero', tipo: 'lavadero'},
    {id: 'bano', tipo: 'bano'},
    {id: 'espacio_extra', tipo: 'extra'}
  ];

  piezas.forEach(p => {
    const contenedor = document.getElementById(p.id + '-secciones');
    if(!contenedor) return;

    const secciones = contenedor.getElementsByClassName('seccion');
    for(let sec of secciones){
      const largo = parseFloat(sec.querySelector('.largo')?.value || 0);
      const ancho = parseFloat(sec.querySelector('.ancho')?.value || 0);
      const m2 = largo * ancho;
      let precioM2 = parseFloat(document.getElementById('precioM2').value || 0);

      let subtotalSeccion = m2 * precioM2;

      // Zócalos
      const zocalos = Array.from(sec.querySelectorAll('[class^="zocalo_"]')).reduce((sum, el) => sum + (el.checked ? 1 : 0), 0);
      subtotalSeccion += zocalos * 0.1 * m2 * precioM2;

      // Regruesos
      const regruesos = Array.from(sec.querySelectorAll('[class^="regrueso_"]')).reduce((sum, el) => sum + (el.checked ? 1 : 0), 0);
      subtotalSeccion += regruesos * 0.2 * m2 * precioM2;

      // Extras
      const esExtra = p.tipo === 'extra';

      // Pata/Rivuelta
      if(p.tipo === 'isla' || esExtra){
        const anchoIsla = ancho;
        const altoPata = parseFloat(sec.querySelector('.pata_alto')?.value || 0);
        sec.querySelector('.pata_ancho').value = anchoIsla;

        const pataM2 = (anchoIsla * altoPata)/10000;
        subtotalSeccion += pataM2 * precioM2;

        const rivueltaAncho = parseFloat(sec.querySelector('.rivuleta_ancho')?.value || 0);
        sec.querySelector('.rivuleta_alto').value = altoPata;
        const rivueltaM2 = (rivueltaAncho * altoPata)/10000;
        subtotalSeccion += rivueltaM2 * precioM2;
      }

      // Bacha integrada
      if(p.tipo === 'bano' || esExtra){
        const bachaInt = parseFloat(sec.querySelector('.bacha_int')?.value || 0);
        subtotalSeccion += bachaInt * precioM2;
      }

      // Alzada
      if(p.tipo === 'cocina' || p.tipo === 'lavadero' || esExtra){
        const alzadaLargo = parseFloat(sec.querySelector('.alzada_largo')?.value || 0);
        const alzadaAncho = parseFloat(sec.querySelector('.alzada_ancho')?.value || 0);
        const alzadaM2 = alzadaLargo * alzadaAncho;
        subtotalSeccion += alzadaM2 * precioM2;
      }

      total += subtotalSeccion;
    }
  });

  // Trafóros
  const traforosTotal = 
    (parseFloat(document.getElementById('grif')?.value || 0) * traforosPrecios.grif) +
    (parseFloat(document.getElementById('bacha')?.value || 0) * traforosPrecios.bacha) +
    (parseFloat(document.getElementById('anafe')?.value || 0) * traforosPrecios.anafe);

  total += traforosTotal;

  // Flete
  let flete = Math.max(total * 0.15, 400);
  let totalFinal = total + flete;

  // DESCUENTO
  const descuentoPorc = parseFloat(document.getElementById('descuentoPorc')?.value || 0);
  const descuentoManual = parseFloat(document.getElementById('descuentoManual')?.value || 0);

  let descuentoAplicado = 0;
  if(descuentoManual > 0){
    descuentoAplicado = descuentoManual;
  } else if(descuentoPorc > 0){
    descuentoAplicado = totalFinal * (descuentoPorc / 100);
  }

  const totalConDescuento = totalFinal - descuentoAplicado;

  // Planilla de presupuesto con dos columnas
  document.getElementById('resultado').innerHTML = `
    <span>Subtotal:</span><span>u$d${total.toFixed(2)}</span>
    <span>Flete:</span><span>u$d${flete.toFixed(2)}</span>
    <span>Trafóros:</span><span>u$d${traforosTotal.toFixed(2)}</span>
    <span>Total final:</span><span>u$d${totalFinal.toFixed(2)}</span>
    <span>Descuento aplicado:</span><span>u$d${descuentoAplicado.toFixed(2)}</span>
    <span>Total con descuento:</span><span>u$d${totalConDescuento.toFixed(2)}</span>
  `;
}