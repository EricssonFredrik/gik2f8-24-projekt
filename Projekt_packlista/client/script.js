/****** EventListeners som "lyssnar" på när en användare markerar ett fält, skriver i ett fält, och lämnar ett fält ******/
/****** keyup - när en tangent trycks ned OCH upp igen. blur - när fältet lämnas. ******/
/****** Eventlyssnarna bakas in i en arrow-function, då parenteser inte går att använda. ******/
listForm.thing.addEventListener('keyup', (e) => validateField(e.target));
listForm.thing.addEventListener('blur', (e) => validateField(e.target));

listForm.number.addEventListener('input', (e) => validateField(e.target));
listForm.number.addEventListener('blur', (e) => validateField(e.target));

listForm.trip.addEventListener('input', (e) => validateField(e.target));
listForm.trip.addEventListener('blur', (e) => validateField(e.target));


/****** Här lyssnar den efter ett click-event via submit-knappen. ******/
listForm.addEventListener('submit', onSubmit);
const packingListElement = document.getElementById('packingList');


/****** Validering av formulär ******/
/****** Följande talar om för applikationen om de olika fälten i formulären har fått godkänd input.  ******/
/****** Alla är satta till true pga problem med liveServer, men skall väl egentligen vara false ******/
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


/* Uppgift 2A

// 1.2 
Här definieras en funktion kallad onSubmit, vilken initiellt används som Event Handler för ett formulärelement. 
Den kollar om flera variabler som representerar validiteten av olika formulärfält är True eller False.
Om alla dessa variabler är True, kommer funktionen logga ett meddelande till konsollen och kalla en annan funktion; saveThing.
*/
function onSubmit(e) {
  e.preventDefault();
  if (thingValid && numberValid && tripValid) {
    console.log('Submit');
    saveThing();
  }
}

 /*
 Savething funktionen används för att spara en ny "thing" till servern. Den gör det genom att skapa ett objekt med tre properties: thing, number, and trip.
 Till dessa egenskaper så tilldelar vi värdet av tre av våra formulär fält.
 "thing"-objektet skickas sen vidare till en api.create function, som sänder en HTTP POST request för att skapa en ny "thing" i servern.
 Om förfrågan är lyckad, så kallas funktionen renderList för att uppdatera listan med "thing"
 */

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


/* Uppgift 2A*/
// 1.1 
// I denna funktion så printar vi ut listan i frontend genom att anropa metoden getAll som är vår get-metod, se filen Api.js. 
// Vi sorterar även listan i bokstavsordning från A - Ö.
// If satsen sker när parametern things och längden på things är större än 0, Då har vi en for each loop som ittererar genom listan
// och då anropar vi på renderThings och skapar dessa div-ar när man klickar på Lägg till knappen och på så sätt sker detta dynamiskt.
// Och bara för att visa att spara-knappen är länkad med renderList-funktionen så kan vi visa det här ovan.

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


/* Uppgift 2A*/
// 1.0
//I denna funktion har vi fyra parametrar, varav 3 är våra labels med samma variabelnamn.
//Det som sker här är att vi skapar flera olika div-ar med styling och dessa div-ar anropas i funktionen ovan ( renderList() ).

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
