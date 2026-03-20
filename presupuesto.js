let contadorSecciones = { Cocina:0, Isla:0, Lavadero:0, Baño:0, Otro:0 };
const traforos = [
  {name:'Bacha', precio:40},
  {name:'Anafe', precio:40},
  {name:'Griferia', precio:20}
];

function agregarSeccion(grupo){
  contadorSecciones[grupo]++;
  const index = contadorSecciones[grupo];
  const contenedor = document.getElementById(`${grupo}-sections`);
  const div = document.createElement('div');
  div.className='section-box';
  div.id=`${grupo}-section-${index}`;

  let zocalosHTML = grupo==='Isla' ? '' : `
    <div class="mb-2">
      <strong>Zócalos:</strong>
      Fondo <input type="checkbox" id="${grupo}-z-fondo-${index}" onchange="calcularPresupuesto()">
      Izq <input type="checkbox" id="${grupo}-z-izq-${index}" onchange="calcularPresupuesto()">
      Der <input type="checkbox" id="${grupo}-z-der-${index}" onchange="calcularPresupuesto()">
    </div>
  `;

  let regruesosHTML = '';
  if(grupo==='Isla'){
    regruesosHTML = `
      <div class="mb-2">
        <strong>Regrueso:</strong>
        Frente <input type="checkbox" id="${grupo}-r-frente-${index}" onchange="calcularPresupuesto()">
        Fondo <input type="checkbox" id="${grupo}-r-fondo-${index}" onchange="calcularPresupuesto()">
        Izq <input type="checkbox" id="${grupo}-r-izq-${index}" onchange="calcularPresupuesto()">
        Der <input type="checkbox" id="${grupo}-r-der-${index}" onchange="calcularPresupuesto()">
      </div>
    `;
  } else {
    regruesosHTML = `
      <div class="mb-2">
        <strong>Regrueso:</strong>
        Frente <input type="checkbox" id="${grupo}-r-frente-${index}" onchange="calcularPresupuesto()">
        Izq <input type="checkbox" id="${grupo}-r-izq-${index}" onchange="calcularPresupuesto()">
        Der <input type="checkbox" id="${grupo}-r-der-${index}" onchange="calcularPresupuesto()">
      </div>
    `;
  }

  let bachaHTML = (grupo==='Lavadero'||grupo==='Baño') ? `
    <div class="mb-2">
      <label>Bacha integrada (m²):</label>
      <input type="number" id="${grupo}-bacha-${index}" value="0" step="0.01" onchange="calcularPresupuesto()">
    </div>` : '';

  div.innerHTML=`
    <div class="section-title">Sección ${index}</div>
    <div class="mb-2">
      <label>Largo:</label><input type="number" id="${grupo}-largo-${index}" value="0" step="0.01" onchange="calcularPresupuesto()">
      <label>Ancho:</label><input type="number" id="${grupo}-ancho-${index}" value="0" step="0.01" onchange="calcularPresupuesto()">
    </div>
    ${zocalosHTML}
    ${regruesosHTML}
    <div class="mb-2">
      <strong>Alzada:</strong>
      Alto <input type="number" id="${grupo}-alzada-alto-${index}" value="0" step="0.01" onchange="calcularPresupuesto()">
      Ancho <input type="number" id="${grupo}-alzada-ancho-${index}" value="0" step="0.01" onchange="calcularPresupuesto()">
    </div>
    ${bachaHTML}
  `;
  contenedor.appendChild(div);
  calcularPresupuesto();
}

// Crear inputs de traforos
traforos.forEach(t=>{
  const cont=document.getElementById('trafo-container-'+t.name);
  cont.innerHTML=`${t.name}: <input type="number" id="traforo-${t.name}" value="0" min="0" onchange="calcularPresupuesto()">`;
});

function calcularPresupuesto(){
  const grupos=['Cocina','Isla','Lavadero','Baño','Otro'];
  let subtotalMaterial=0, subtotalZocalos=0, subtotalRegruesos=0, subtotalAlzada=0, subtotalBacha=0, subtotalTraforos=0;
  const mapSubitems={'subtotal-material':[],'subtotal-zocalos':[],'subtotal-regruesos':[],'subtotal-alzada':[],'subtotal-bacha':[]};

  grupos.forEach(grupo=>{
    const precioM2=parseFloat(document.getElementById(`precio_m2_${grupo}`)?.value)||0;
    for(let i=1;i<=contadorSecciones[grupo];i++){
      const largo=parseFloat(document.getElementById(`${grupo}-largo-${i}`).value)||0;
      const ancho=parseFloat(document.getElementById(`${grupo}-ancho-${i}`).value)||0;
      const m2=largo*ancho;
      if(m2>0){subtotalMaterial+=m2*precioM2; mapSubitems['subtotal-material'].push(`${grupo} Sección ${i} – ${largo}x${ancho} = ${(m2*precioM2).toFixed(2)} USD`);}
      
      if(grupo!=='Isla'){
        const zF=document.getElementById(`${grupo}-z-fondo-${i}`)?.checked?ancho:0;
        const zI=document.getElementById(`${grupo}-z-izq-${i}`)?.checked?largo:0;
        const zD=document.getElementById(`${grupo}-z-der-${i}`)?.checked?largo:0;
        const zTotal=(zF+zI+zD)*precioM2*0.1;
        if(zTotal>0){subtotalZocalos+=zTotal; mapSubitems['subtotal-zocalos'].push(`${grupo} Sección ${i} – Zócalos = ${zTotal.toFixed(2)} USD`);}
      }

      let rFrente=document.getElementById(`${grupo}-r-frente-${i}`)?.checked?ancho:0;
      let rIzq=document.getElementById(`${grupo}-r-izq-${i}`)?.checked?largo:0;
      let rDer=document.getElementById(`${grupo}-r-der-${i}`)?.checked?largo:0;
      let rFondo=0;
      if(grupo==='Isla'){ rFondo=document.getElementById(`${grupo}-r-fondo-${i}`)?.checked?ancho:0; }
      const rTotal=(rFrente+rIzq+rDer+rFondo)*precioM2*0.2;
      subtotalRegruesos+=rTotal;
      mapSubitems['subtotal-regruesos'].push(`${grupo} Sección ${i} – Regrueso = ${rTotal.toFixed(2)} USD`);

      const alto=parseFloat(document.getElementById(`${grupo}-alzada-alto-${i}`).value)||0;
      const anchoAlz=parseFloat(document.getElementById(`${grupo}-alzada-ancho-${i}`).value)||0;
      const alzadaM2=alto*anchoAlz;
      if(alzadaM2>0){const subtotal=alzadaM2*precioM2; subtotalAlzada+=subtotal; mapSubitems['subtotal-alzada'].push(`${grupo} Sección ${i} – Alzada ${alto}x${anchoAlz} = ${subtotal.toFixed(2)} USD`);}

      if((grupo==='Lavadero'||grupo==='Baño') && document.getElementById(`${grupo}-bacha-${i}`)){
        const bachaM2=parseFloat(document.getElementById(`${grupo}-bacha-${i}`).value)||0;
        if(bachaM2>0){const subtotal=bachaM2*precioM2; subtotalBacha+=subtotal; mapSubitems['subtotal-bacha'].push(`${grupo} Sección ${i} – Bacha integrada ${bachaM2} m² = ${subtotal.toFixed(2)} USD`);}
      }
    }
  });

  traforos.forEach(t=>{
    const cant=parseInt(document.getElementById(`traforo-${t.name}`)?.value)||0;
    if(cant>0) subtotalTraforos+=cant*t.precio;
  });

  const subtotal=subtotalMaterial+subtotalZocalos+subtotalRegruesos+subtotalAlzada+subtotalBacha+subtotalTraforos;
  const costoColocacion=Math.max(400, subtotal*0.15);
  const totalBeforeDiscount=subtotal+costoColocacion;
  const descPorc=parseFloat(document.getElementById('descuento-porcentaje').value)||0;
  const descUsd=parseFloat(document.getElementById('descuento-usd').value)||0;
  const descuento=totalBeforeDiscount*(descPorc/100)+descUsd;
  const totalFinal=totalBeforeDiscount-descuento;

  for(const id in mapSubitems){
    const td=document.getElementById(id);
    td.innerHTML='';
    if(mapSubitems[id].length>0){
      const ul=document.createElement('ul');
      mapSubitems[id].forEach(txt=>{const li=document.createElement('li'); li.className='subitem'; li.textContent=txt; ul.appendChild(li);});
      td.appendChild(ul);
    }
  }

  document.getElementById('subtotal-traforos').innerText=subtotalTraforos.toFixed(2);
  document.getElementById('costo-colocacion').innerText=costoColocacion.toFixed(2);
  document.getElementById('total-before-discount').innerText=totalBeforeDiscount.toFixed(2);
  document.getElementById('total-final').innerText=totalFinal.toFixed(2);
}

['Cocina','Isla','Lavadero','Baño','Otro'].forEach(g=>agregarSeccion(g));