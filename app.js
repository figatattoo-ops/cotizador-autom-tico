let traforosPrecios = { grif: 20, bacha: 40, anafe: 40 };

function agregarSeccion(piezaId, tipo, esExtra=false){
  const contenedor = document.getElementById(piezaId+'-secciones');
  const index = contenedor.children.length+1;
  let extras = '';

  if(tipo==='isla'||esExtra){
    extras+=`
      Pata Ancho: <input type="number" class="pata_ancho" placeholder="Ancho" readonly>
      Pata Alto: <input type="number" class="pata_alto" placeholder="Alto"><br>
      Rivuelta Ancho: <input type="number" class="rivuleta_ancho" placeholder="Ancho">
      Rivuelta Alto: <input type="number" class="rivuleta_alto" placeholder="Alto" readonly><br>
    `;
  }

  if(tipo==='cocina'||tipo==='lavadero'||esExtra){
    extras+=`
      Alzada Largo: <input type="number" class="alzada_largo" placeholder="Largo">
      Alzada Ancho: <input type="number" class="alzada_ancho" placeholder="Ancho"><br>
    `;
  }

  if(tipo==='bano'||esExtra){
    extras+=`Bacha integrada: <input type="number" class="bacha_int" placeholder="Cantidad"><br>`;
  }

  let zocalosOpciones = ['fondo','izq','der'];
  let regruesosOpciones = ['frente','izq','der'];
  if(tipo==='isla'){ zocalosOpciones=['frente','fondo','izq','der']; regruesosOpciones=['frente','fondo','izq','der']; }

  const zocalosHTML = zocalosOpciones.map(l=>`${l.charAt(0).toUpperCase()+l.slice(1)} <input type="checkbox" class="zocalo_${l}">`).join(' ');
  const regruesosHTML = regruesosOpciones.map(l=>`${l.charAt(0).toUpperCase()+l.slice(1)} <input type="checkbox" class="regrueso_${l}">`).join(' ');

  const html = `
    <div class="seccion">
      <h4>Sección ${index}</h4>
      Largo: <input type="number" class="largo">
      Ancho: <input type="number" class="ancho"><br>
      Zócalos: ${zocalosHTML}<br>
      Regruesos: ${regruesosHTML}<br>
      ${extras}
    </div>
  `;
  const div = document.createElement('div');
  div.innerHTML=html;
  contenedor.appendChild(div.firstElementChild);
}

function agregarEspacioExtra(){ agregarSeccion('espacio_extra','extra',true); }

function calcular(){
  let total=0;
  const precioM2=parseFloat(document.getElementById('precioM2')?.value||0);

  const piezas=[
    {id:'cocina',tipo:'cocina'},
    {id:'isla',tipo:'isla'},
    {id:'lavadero',tipo:'lavadero'},
    {id:'bano',tipo:'bano'},
    {id:'espacio_extra',tipo:'extra'}
  ];

  piezas.forEach(p=>{
    const contenedor=document.getElementById(p.id+'-secciones');
    if(!contenedor) return;

    const secciones=contenedor.getElementsByClassName('seccion');
    for(let sec of secciones){
      const largo=parseFloat(sec.querySelector('.largo')?.value||0);
      const ancho=parseFloat(sec.querySelector('.ancho')?.value||0);
      let subtotalSeccion=largo*ancho*precioM2;

      const zocalos = Array.from(sec.querySelectorAll('[class^="zocalo_"]')).reduce((sum,el)=>sum+(el.checked?1:0),0);
      subtotalSeccion+= zocalos*0.1*largo*ancho*precioM2;

      const regruesos = Array.from(sec.querySelectorAll('[class^="regrueso_"]')).reduce((sum,el)=>sum+(el.checked?1:0),0);
      subtotalSeccion+= regruesos*0.2*largo*ancho*precioM2;

      const esExtra=p.tipo==='extra';

      if(p.tipo==='isla'||esExtra){
        const altoPata=parseFloat(sec.querySelector('.pata_alto')?.value||0);
        sec.querySelector('.pata_ancho').value=ancho;
        subtotalSeccion+=(ancho*altoPata/10000)*precioM2;

        const rivueltaAncho=parseFloat(sec.querySelector('.rivuleta_ancho')?.value||0);
        sec.querySelector('.rivuleta_alto').value=altoPata;
        subtotalSeccion+=(rivueltaAncho*altoPata/10000)*precioM2;
      }

      if(p.tipo==='bano'||esExtra){
        const bachaInt=parseFloat(sec.querySelector('.bacha_int')?.value||0);
        subtotalSeccion+= bachaInt*precioM2;
      }

      if(p.tipo==='cocina'||p.tipo==='lavadero'||esExtra){
        const alzadaLargo=parseFloat(sec.querySelector('.alzada_largo')?.value||0);
        const alzadaAncho=parseFloat(sec.querySelector('.alzada_ancho')?.value||0);
        subtotalSeccion+= alzadaLargo*alzadaAncho*precioM2;
      }

      total+=subtotalSeccion;
    }
  });

  const traforosTotal = 
    (parseFloat(document.getElementById('grif')?.value||0)*traforosPrecios.grif)+
    (parseFloat(document.getElementById('bacha')?.value||0)*traforosPrecios.bacha)+
    (parseFloat(document.getElementById('anafe')?.value||0)*traforosPrecios.anafe);

  total+= traforosTotal;

  let flete=Math.max(total*0.15,400);
  let totalFinal=total+flete;

  const descuentoPorc=parseFloat(document.getElementById('descuentoPorc')?.value||0);
  const descuentoManual=parseFloat(document.getElementById('descuentoManual')?.value||0);
  let descuentoAplicado=0;
  if(descuentoManual>0) descuentoAplicado=descuentoManual;
  else if(descuentoPorc>0) descuentoAplicado=totalFinal*(descuentoPorc/100);

  const totalConDescuento=totalFinal-descuentoAplicado;

  const resultadoDiv=document.getElementById('resultado');
  const filas=[
    {label:'Subtotal', value: total},
    {label:'Medición, envío y colocación', value: flete},
    {label:'Trafóros', value: traforosTotal},
    {label:'Total final', value: totalFinal, totales:true},
    {label:'Descuento aplicado', value: descuentoAplicado},
    {label:'Total con descuento', value: totalConDescuento, totales:true},
  ];

  resultadoDiv.innerHTML='';
  filas.forEach((f,i)=>{
    const div=document.createElement('div');
    div.className='fila';
    if(f.totales) div.classList.add('totales');
    div.innerHTML=`<span>${f.label}</span><span>u$d${f.value.toFixed(2)}</span>`;
    resultadoDiv.appendChild(div);
  });
}