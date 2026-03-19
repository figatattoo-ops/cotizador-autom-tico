// Precios fijos de traforos
let traforosPrecios = { grif: 20, bacha: 40, anafe: 40 };

// Función para agregar secciones
function agregarSeccion(piezaId, tipo, esExtra = false) {
  const contenedor = document.getElementById(piezaId + '-secciones');
  const index = contenedor.children.length + 1;
  let extras = '';

  if (tipo==='isla' || esExtra) {
    extras += `
      Pata Ancho: <input type="number" class="pata_ancho" readonly>
      Pata Alto: <input type="number" class="pata_alto"><br>
      Rivuelta Ancho: <input type="number" class="rivuleta_ancho">
      Rivuelta Alto: <input type="number" class="rivuleta_alto" readonly><br>
    `;
  }
  if (tipo==='cocina' || tipo==='lavadero' || esExtra) {
    extras += `Alzada Largo: <input type="number" class="alzada_largo">
               Alzada Ancho: <input type="number" class="alzada_ancho"><br>`;
  }
  if (tipo==='bano' || esExtra) {
    extras += `Bacha integrada: <input type="number" class="bacha_int"><br>`;
  }

  const zocalosHTML = ['fondo','izq','der'].map(l=>`${l.charAt(0).toUpperCase()+l.slice(1)} <input type="checkbox" class="zocalo_${l}">`).join(' ');
  const regruesosHTML = ['frente','izq','der'].map(l=>`${l.charAt(0).toUpperCase()+l.slice(1)} <input type="checkbox" class="regrueso_${l}">`).join(' ');

  const html = `<div class="seccion" style="margin-bottom:5px;border:1px solid #ccc;padding:5px;">
      <h4>Sección ${index}</h4>
      Largo: <input type="number" class="largo">
      Ancho: <input type="number" class="ancho"><br>
      Zócalos: ${zocalosHTML}<br>
      Regruesos: ${regruesosHTML}<br>
      ${extras}
    </div>`;
  const div = document.createElement('div');
  div.innerHTML = html;
  contenedor.appendChild(div.firstElementChild);
}

function agregarEspacioExtra(){ agregarSeccion('espacio_extra','extra',true); }

// Cálculo principal
function calcular(){
  let total = 0;
  const precioM2 = parseFloat(document.getElementById('precioM2')?.value||0);
  const piezas = ['cocina','isla','lavadero','bano','espacio_extra'];

  piezas.forEach(pieza=>{
    const contenedor = document.getElementById(pieza+'-secciones');
    if(!contenedor) return;
    Array.from(contenedor.getElementsByClassName('seccion')).forEach(sec=>{
      const largo=parseFloat(sec.querySelector('.largo')?.value||0);
      const ancho=parseFloat(sec.querySelector('.ancho')?.value||0);
      let subtotal=largo*ancho*precioM2;

      const zocalos=Array.from(sec.querySelectorAll('[class^="zocalo_"]')).reduce((s,el)=>s+(el.checked?1:0),0);
      const regruesos=Array.from(sec.querySelectorAll('[class^="regrueso_"]')).reduce((s,el)=>s+(el.checked?1:0),0);
      subtotal+=zocalos*0.1*largo*ancho*precioM2 + regruesos*0.2*largo*ancho*precioM2;

      const esExtra=(pieza==='espacio_extra');

      if(pieza==='isla'||esExtra){
        const altoPata=parseFloat(sec.querySelector('.pata_alto')?.value||0);
        sec.querySelector('.pata_ancho').value=ancho;
        subtotal+=(ancho*altoPata/10000)*precioM2;
        const rivAncho=parseFloat(sec.querySelector('.rivuleta_ancho')?.value||0);
        sec.querySelector('.rivuleta_alto').value=altoPata;
        subtotal+=(rivAncho*altoPata/10000)*precioM2;
      }
      if(pieza==='bano'||esExtra){ subtotal+=parseFloat(sec.querySelector('.bacha_int')?.value||0)*precioM2; }
      if(pieza==='cocina'||pieza==='lavadero'||esExtra){
        subtotal+=parseFloat(sec.querySelector('.alzada_largo')?.value||0)*parseFloat(sec.querySelector('.alzada_ancho')?.value||0)*precioM2;
      }
      total+=subtotal;
    });
  });

  // Traforos
  const traforosTotal=(parseFloat(document.getElementById('grif')?.value||0)*traforosPrecios.grif)+
                      (parseFloat(document.getElementById('bacha')?.value||0)*traforosPrecios.bacha)+
                      (parseFloat(document.getElementById('anafe')?.value||0)*traforosPrecios.anafe);
  total+=traforosTotal;

  // Medición, envío y colocación
  const flete=Math.max(total*0.15,400);
  const totalFinal=total+flete;

  // Descuento
  const descuentoPorc=parseFloat(document.getElementById('descuentoPorc')?.value||0);
  const descuentoManual=parseFloat(document.getElementById('descuentoManual')?.value||0);
  let descuentoAplicado=0;
  if(descuentoManual>0) descuentoAplicado=descuentoManual;
  else if(descuentoPorc>0) descuentoAplicado=totalFinal*(descuentoPorc/100);

  const totalConDescuento=totalFinal-descuentoAplicado;

  // Mostrar resultados
  const resultado=document.getElementById('resultado');
  const filas=[
    {label:'Subtotal',value:total},
    {label:'Medición, envío y colocación',value:flete},
    {label:'Trafóros',value:traforosTotal},
    {label:'Total final',value:totalFinal,totales:true},
    {label:'Descuento aplicado',value:descuentoAplicado},
    {label:'Total con descuento',value:totalConDescuento,totales:true},
  ];

  resultado.innerHTML='';
  filas.forEach((f,i)=>{
    const div=document.createElement('div');
    div.className='fila';
    if(f.totales) div.classList.add('totales');
    div.innerHTML=`<span>${f.label}</span><span>u$d${f.value.toFixed(2)}</span>`;
    if(i%2==1 && !f.totales) div.style.backgroundColor='#f9f9f9';
    resultado.appendChild(div);
  });
}