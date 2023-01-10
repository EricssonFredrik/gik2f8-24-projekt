listForm.thing.addEventListener('keyup', (e) => validateField(e.target));
listForm.thing.addEventListener('blur', (e) => validateField(e.target));

listForm.number.addEventListener('input', (e) => validateField(e.target));
listForm.number.addEventListener('blur', (e) => validateField(e.target));

listForm.trip.addEventListener('input', (e) => validateField(e.target));
listForm.trip.addEventListener('blur', (e) => validateField(e.target));

listForm.addEventListener('submit', onSubmit);
const packingListElement = document.getElementById('packingList');

let thingValid = true;
let numberValid = true;
let tripValid = true;


const api = new Api('http://localhost:5000/tasks');

function validateField(field) {
  const { name, value } = field;
  let = validationMessage = '';
  switch (name) {
    case 'thing': {
      if (value.length < 2) {
        thingValid = false;
        validationMessage = "Fältet 'Sak' måste innehålla minst 2 tecken.";
      } else if (value.length > 100) {
        thingValid = false;
        validationMessage =
          "Fältet 'Sak' får inte innehålla mer än 100 tecken.";
      } else {
        thingValid = true;
      }
      break;
    }
    case 'number': {
      if (value.length < 1) {
        numberValid = false;
        validationMessage = "Fältet 'Antal' måste innehålla minst 1 tecken.";
      } else if (value.length > 1000) {
        numberValid = false;
        validationMessage =
          "Fältet 'Antal' får inte innehålla mer än 100 tecken.";
      } else {
        numberValid = true;
      }
      break;
    }
    case 'trip': {
      if (value.length < 2) {
        tripValid = false;
        validationMessage = "Fältet 'Resa' måste innehålla minst 2 tecken.";
      } else if (value.length > 100) {
        tripValid = false;
        validationMessage =
          "Fältet 'Resa' får inte innehålla mer än 100 tecken.";
      } else {
        tripValid = true;
      }
      break;
    }
  }
  
  field.previousElementSibling.innerText = validationMessage;
  field.previousElementSibling.classList.remove('hidden');
}


function onSubmit(e) {
  e.preventDefault();
  if (thingValid && numberValid && tripValid) {
    console.log('Submit');
    saveThing();
  }
}

 

function saveThing() {
  const thing = {
    thing: listForm.thing.value,
    number: listForm.number.value,
    trip: listForm.trip.value,
  };
   
api.create(thing).then((thing) => {
  
  if (thing) {
      renderList();
    }
  });
}


function renderList() {
  console.log('rendering');
  api.getAll().then((things) => {
    packingListElement.innerHTML = '';

    things.sort((p1, p2) =>
      p2.trip < p1.trip ? 1 : p2.trip > p1.trip ? -1 : 0
    );

    if (things && things.length > 0) {
      things.forEach((thing) => {
        packingListElement.insertAdjacentHTML('beforeend', renderThing(thing));
      });
    }
  });
}



function renderThing({ id, thing, number, trip}) {
let html = `
<li class="select-none mt-2 py-2 border-b border-teal-300">
  <div class="flex things-center">
    <h3 class="mb-3 flex-1 text-xl font-bold text-zinc-700 uppercase">${thing}</h3>
      <div>
      <button onclick="deleteThing(${id})" class="inline-block bg-zinc-300 text-xs text-teal-900 border border-white px-3 py-1 rounded-md ml-2 hover:bg-zinc-500">Ta bort</button>
    </div>
  </div>
  <div class="flex things-center">
    <p class="ml-8 mt-2 text-xs italic basis-1/3">${number}</p>
    <p class="ml-8 mt-2 text-xs italic basis-1/3">${trip}</p>
  </div>`;
return html;
}


function deleteThing(id) {
  api.remove(id).then(() => {
    renderList();
  });
}


renderList();
