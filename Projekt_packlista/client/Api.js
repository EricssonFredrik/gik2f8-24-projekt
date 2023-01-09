class Api {
  url = '';
  constructor(url) {
    this.url = url;
  }

  
/* Uppgift 2 B 
  Detta är då vår POST funktion:
  Funktionen skickar ett request till ett specifikt URL med en JSON-fil innehållande datan som passerat som argument.
  Funktionen returnerar ett Promise som löses med svaret från json-filen från servern.
  Om ett error förekommer vid request eller när ett svar parsas, kommer Promiset att nekas.

  Request-objektet används för att skapa ett request - efterfrågan - till servern.
  Den tar två argument: URL:n för servern och ett objekt.
  Objektet kan innehålla olika properties, så som: request method, body, headers, osvosv.

  Fetch-funktionen används för att skapa ett request till servern och returnerar ett Promise som löses med ett Response-objekt.
  Respons-objektet har en json-metod som returnerar ett Promise som löses med json-datan från svaret.
  Vår fetch-metod. Man kan se vad i filen tasks.json*/

  /* Fetch funktionen gör exakt samma som vår getAll funktion fast tar emot ett annat argument */

  create(data) {
    const JSONData = JSON.stringify(data);
    console.log(`Sending ${JSONData} to ${this.url}`);
    const request = new Request(this.url, {
      method: 'POST',
      body: JSONData,
      headers: {
        'content-type': 'application/json'
      }
    });
    
    return (
      fetch(request)
      .then((result) => result.json())
        .then((data) => data)
        .catch((err) => console.log(err))
    );
  }

/*
Uppgift 2A
1.1.1
Denna kodsnutt definerar en metod som vi kallar getAll som gör ett HTTP GET anrop till den URL som är lagrad i this.url variabeln 
Fetch funktionen används för att initiera vår förfrågan och returnerar ett promise som svarar på ett response objekt när vårt förfrågan är klar.

Then metoden används till det promise vi har för att ta hand om vårt Response objekt. Result.json parse:ar vårt response objekts body som json och returenrar ett promise som 
inväntar svaret på denna datan.

Vi har sen en till then metod kedjad till den tidigare metoden för att ta hand om vårt tidigare svar/promise. Den returnerar alltså helt enkelt datan.
catch metoden används ifall det sker något error. Ifall ett error sker så printas det ut i konsollen.
Generellt så skickar denna kod ett HTTP GET request till en specifik URL, omvandlar till JSON och returnerar den omvandlade datan. Och om ett error sker så meddelar den det. 
BYT TILLBAKS TILL SCRIPT 1.1.2
*/
  getAll() {
    return fetch(this.url)
      .then((result) => result.json())
      .then((data) => data)
      .catch((err) => console.log(err));
  } 
  

  remove(id) {
    console.log(`Removing task with id ${id}`);
    return fetch(`${this.url}/${id}`, {
      method: 'DELETE'
    })
      .then((result) => result)
      .catch((err) => console.log(err));
  }
}
