const API = 'http://localhost:3000/api/turnos'; // Cambiar por URL de Render
const horariosContainer = document.getElementById('horarios');
const fechaInput = document.getElementById('fecha');
const canchaInput = document.getElementById('cancha');

const generarHorarios = () => {
  horariosContainer.innerHTML = '';
  for (let h = 9; h <= 23; h++) {
    const hora = `${h.toString().padStart(2,'0')}:00`;
    const btn = document.createElement('button');
    btn.textContent = hora;
    btn.className = 'border rounded p-2 hover:bg-green-500 hover:text-white';
    btn.onclick = () => agendarTurno(hora);
    horariosContainer.appendChild(btn);
  }
};

generarHorarios();

async function cargarTurnos() {
  const fecha = fechaInput.value;
  const cancha = canchaInput.value;
  if (!fecha) return;

  const res = await fetch(`${API}?fecha=${fecha}&cancha=${cancha}`);
  const turnos = await res.json();

  document.querySelectorAll('#horarios button').forEach(btn => {
    const reservado = turnos.find(t => t.horario === btn.textContent);
    if (reservado) {
      btn.classList.add('agendado');
      btn.disabled = true;
    } else {
      btn.classList.remove('agendado');
      btn.disabled = false;
    }
  });
}

fechaInput.addEventListener('change', cargarTurnos);
canchaInput.addEventListener('change', cargarTurnos);

async function agendarTurno(hora) {
  const fecha = fechaInput.value;
  const cancha = canchaInput.value;
  if (!fecha) {
    alert('Seleccioná una fecha primero');
    return;
  }
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fecha, horario: hora, cancha })
  });
  if (res.ok) {
    cargarTurnos();
  } else {
    alert('El turno ya fue agendado.');
  }
}
