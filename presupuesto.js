let contadorSecciones = {Cocina:0,Isla:0,Lavadero:0,Baño:0,Otro:0};

const traforos = [
  {name:'Bacha',precio:40},
  {name:'Anafe',precio:40},
  {name:'Griferia',precio:20}
];

// =============================
function getFocusables(){
  return Array.from(document.querySelectorAll('input, button'))
    .filter(el => !el.disabled && el.offsetParent !== null);
}

function enfocarSiguiente(el){
  const f = getFocusables();
  const i = f.indexOf(el);
  if(i >= 0 && i < f.length - 1) f[i+1].focus();
}

function enfocarAnterior(el){
  const f = getFocusables();
  const i = f.indexOf(el);
  if(i > 0) f[i-1].focus();
}

// =============================
function mejorarInputsNumericos(container){
  container.querySelectorAll('input[type="number"]').forEach(inp=>{
    inp.addEventListener('focus', ()=>{
      if(inp.value === "0") inp.value = "";
    });

    inp.addEventListener('blur', ()=>{
      if(inp.value === ""){
        inp.value = "0";
        calcularPresupuesto();
      }
    });

    inp.addEventListener('keydown', e=>{
      if(e.key === 'Enter'){
        e.preventDefault();
        calcularPresupuesto();
        enfocarSiguiente(inp);
      }
      if(e.key === 'ArrowRight'){
        e.preventDefault();
        enfocarSiguiente(inp);
      }
      if(e.key === 'ArrowLeft'){
        e.preventDefault();
        enfocarAnterior(inp);
      }
    });

    inp.addEventListener('change', calcularPresupuesto);
  });
}

function mejorarCheckboxes(container){
  container.querySelectorAll('input[type="checkbox"]').forEach(cb=>{
    cb.addEventListener('keydown', e=>{
      if(e.key === 'Enter'){
        e.preventDefault();
        cb.checked = !cb.checked;
        calcularPresupuesto();
        enfocarSiguiente(cb);
      }
    });
    cb.addEventListener('change', calcularPresupuesto);
  });
}

// =============================
function agregarSeccion(grupo){
  contadorSecciones[grupo]++;
  const i = contadorSecciones[grupo];
  const cont = document.getElementById(`${grupo}-sections`);
  const div = document.createElement('div');
  div.className='section-box';

  let zocalos = '';
  if(grupo !== 'Isla'){
    zocalos = `
    <div><strong>Zócalos:</strong>
      Fondo <input type="checkbox" id="${grupo}-z-fondo-${i}">
      Izq <input type="checkbox" id="${grupo}-z-izq-${i}">
      Der <input type="checkbox" id="${grupo}-z-der-${i}">
    </div>`;
  }

  let regruesos = (grupo==='Isla') ? `
    <div><strong>Regrueso:</strong>
      Frente <input type="checkbox" id="${grupo}-r-frente-${i}">
      Fondo <input type="checkbox" id="${grupo}-r-fondo-${i}">
      Izq <input type="checkbox" id="${grupo}-r-izq-${i}">
      Der <input type="checkbox" id="${grupo}-r-der-${i}">
    </div>`
    :
    `<div><strong>Regrueso:</strong>
      Frente <input type="checkbox" id="${grupo}-r-frente-${i}">
      Izq <input type="checkbox" id="${grupo}-r-izq-${i}">
      Der <input type="checkbox" id="${grupo}-r-der-${i}">
    </div>`;

  let bacha = (grupo==='Lavadero'||grupo==='Baño') ? `
    <div>Bacha integrada:
      <input type="number" id="${grupo}-bacha-${i}" value="0">
    </div>` : '';

  div.innerHTML = `
    <div><strong>Sección ${i}</strong></div>

    Largo <input type="number" id="${grupo}-largo-${i}" value="0">
    Ancho <input type="number" id="${grupo}-ancho-${i}" value="0">

    ${zocalos}
    ${regruesos}

    <div>
      Alzada:
      Alto <input type="number" id="${grupo}-alzada-alto-${i}" value="0">
      Ancho <input type="number" id="${grupo}-alzada-ancho-${i}" value="0">
    </div>

    ${bacha}
  `;

  cont.appendChild(div);

  mejorarInputsNumericos(div);
  mejorarCheckboxes(div);

  calcularPresupuesto();
}

// =============================
traforos.forEach(t=>{
  const c = document.getElementById(`trafo-container-${t.name}`);
  if(c){
    c.innerHTML = `${t.name}: <input type="number" id="traforo-${t.name}" value="0">`;
    mejorarInputsNumericos(c);
  }
});

// =============================
function calcularPresupuesto(){

  const grupos=['Cocina','Isla','Lavadero','Baño','Otro'];

  let mat=0,zoc=0,reg=0,alz=0,bac=0,traf=0;

  const map={
    'subtotal-material':[],
    'subtotal-zocalos':[],
    'subtotal-regruesos':[],
    'subtotal-alzada':[],
    'subtotal-bacha':[]
  };

  grupos.forEach(g=>{
    const p = parseFloat(document.getElementById(`precio_m2_${g}`)?.value)||0;

    for(let i=1;i<=contadorSecciones[g];i++){

      const l=parseFloat(document.getElementById(`${g}-largo-${i}`)?.value)||0;
      const a=parseFloat(document.getElementById(`${g}-ancho-${i}`)?.value)||0;

      if(l*a>0){
        const v=l*a*p;
        mat+=v;
        map['subtotal-material'].push(`${g} ${i} – ${l}x${a} = ${v.toFixed(2)} USD`);
      }

      if(g!=='Isla'){
        const v=(
          (document.getElementById(`${g}-z-fondo-${i}`)?.checked?a:0)+
          (document.getElementById(`${g}-z-izq-${i}`)?.checked?l:0)+
          (document.getElementById(`${g}-z-der-${i}`)?.checked?l:0)
        )*p*0.1;

        if(v>0){
          zoc+=v;
          map['subtotal-zocalos'].push(`${g} ${i} – Zócalos = ${v.toFixed(2)} USD`);
        }
      }

      let v=(
        (document.getElementById(`${g}-r-frente-${i}`)?.checked?a:0)+
        (document.getElementById(`${g}-r-izq-${i}`)?.checked?l:0)+
        (document.getElementById(`${g}-r-der-${i}`)?.checked?l:0)
      );

      if(g==='Isla'){
        v+=(document.getElementById(`${g}-r-fondo-${i}`)?.checked?a:0);
      }

      v*=p*0.2;

      if(v>0){
        reg+=v;
        map['subtotal-regruesos'].push(`${g} ${i} – Regrueso = ${v.toFixed(2)} USD`);
      }

      const al=parseFloat(document.getElementById(`${g}-alzada-alto-${i}`)?.value)||0;
      const an=parseFloat(document.getElementById(`${g}-alzada-ancho-${i}`)?.value)||0;

      if(al*an>0){
        const val=al*an*p;
        alz+=val;
        map['subtotal-alzada'].push(`${g} ${i} – Alzada = ${val.toFixed(2)} USD`);
      }

      if(g==='Lavadero'||g==='Baño'){
        const b=parseFloat(document.getElementById(`${g}-bacha-${i}`)?.value)||0;
        if(b>0){
          const val=b*p;
          bac+=val;
          map['subtotal-bacha'].push(`${g} ${i} – Bacha = ${val.toFixed(2)} USD`);
        }
      }
    }
  });

  traforos.forEach(t=>{
    const c=parseInt(document.getElementById(`traforo-${t.name}`)?.value)||0;
    traf+=c*t.precio;
  });

  const sub = mat+zoc+reg+alz+bac+traf;
  const col = Math.max(400, sub*0.15);
  const total = sub + col;

  const descP = parseFloat(document.getElementById('descuento-porcentaje')?.value)||0;
  const descU = parseFloat(document.getElementById('descuento-usd')?.value)||0;

  const descuento = total*(descP/100) + descU;
  const totalFinal = total - descuento;

  for(const id in map){
    const td = document.getElementById(id);
    td.innerHTML = '';

    if(map[id].length){
      const ul = document.createElement('ul');
      map[id].forEach(txt=>{
        const li=document.createElement('li');
        li.className='subitem';
        li.textContent=txt;
        ul.appendChild(li);
      });
      td.appendChild(ul);
    }
  }

  document.getElementById('subtotal-traforos').innerText=traf.toFixed(2);
  document.getElementById('costo-colocacion').innerText=col.toFixed(2);
  document.getElementById('total-before-discount').innerText=total.toFixed(2);
  document.getElementById('total-final').innerText=totalFinal.toFixed(2);
}

// =============================
document.getElementById("fecha-hoy").innerText =
  new Date().toLocaleDateString();

['Cocina','Isla','Lavadero','Baño','Otro'].forEach(g=>agregarSeccion(g));
mejorarInputsNumericos(document);