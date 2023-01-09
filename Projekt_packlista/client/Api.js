class Api {
  url = '';
  constructor(url) {
    this.url = url;
  }
/* Metod för att hatera att skapa resurser (Create i CRUD). Motsvarar ett anrop med metoden POST.   
  
  Create = POST
  */

  /* Uppgift 2B*/
  create(data) {
    /* Konverterar inskickat JavaScriptobjekt, i detta fall är det en uppgift, till en sträng så att den kan skickas över HTTP. */
    const JSONData = JSON.stringify(data);
    /* Utskrift till logg för att se vad som ska skickas och vart det ska skickas */
    console.log(`Sending ${JSONData} to ${this.url}`);
    
    /* Nedan skapas ett requestobjekt. Requestobjekt finns inbyggda i JavaScript tack vare JavaScripts fetch API. 

    Till request-objektets konstruktor skickas
    1. URL:en dit man vill göra förfrågan. I vårt fall det som man skickade in när klassen skapades och som lagrades i medlemsvariabeln this.url. 
    2. Ett objekt med konfiguration rörande förfrågan. 

    Objektet har följande egenskaper:
    
    method, som har satts till "POST". Eftersom vi här ska skapa något så är POST den metod man vill ha. 

    body, som har satts till den sträng som skapades utifrån det objekt som skickades in så att innehållet - body - i förfrågan kommer att innehålla en strängrepresentation av det som vi vill skapa. I fallet med vår todo-applikaiton kommer det att vara den uppgift som vi vill spara till servern. 

    headers, som är metadata som beskriver olika saker om själva förfrågan. Headers skickas in i form av ett JavaScript-objekt det också och här sätts egenskapen content-type för att beskriva på vilket sätt data är formaterat så att servern vet hur det ska avkodas när det packas upp på serversidan. 
      
    */
    const request = new Request(this.url, {
      method: 'POST',
      body: JSONData,
      headers: {
        'content-type': 'application/json'
      }
    });
/* JavaScripts inbyggda funktion fetch är det som används för att göra HTTP-anrop. Fetch tar ett requestobjekt som parameter. Här skickar vi in det requestobjekt som vi skapade direkt ovanför.  */

  /* Fetch är inbyggt i JavaScript och används för HTTP-kommunikation till andra servrar, för att t.ex. hämta data. Här använder vi */
    
    return (
      /* Fetch är asynkron och vi bearbetar förfrågan och svar i flera olika steg med hjälp av then. Slutligen, när hela "then"-kedjan är färdig, kommer resultatet av det hela att returneras ur denna create-metod. Det är därför hela fetch och alla dess then är omslutna av parenteser och står efter return. Man returnerar alltså hela det uttrycket ut ur metoden.  */
      fetch(request)
      /* När förfrågan skickats kommer först ett svar i ett oläsbart format. Det tas här emot i en parameter som kallas result, så det avkodas med hjälp av metoden json som finns på result-objektet. result.json() är också asynkrion */
        .then((result) => result.json())
      /* Output från result.json() bearbetas genom att det bara tas emot och skickas vidare (data) => data är en förkortning av function(data) {return data}, där data då alltså är resultatet av den asynkrona metoden result.json(). */

        .then((data) => data)
    /* Om något i förfrågan eller svaret går fel, fångas det upp här i catch, där information om felet skrivs ut till loggen.  */
        .catch((err) => console.log(err))
    );
  }

  /* Ingen Uppgift!*/
  //Vår fetch-metod. Man kan se vad i filen tasks.json
  //Denna kodsnutt definerar en metod som vi kallar getAll som gör ett HTTP GET anrop till den URL som är lagrad i this.url variabeln ******
  getAll() {
    //Fetch funktionen används för att initiera vår förfrågan och returnerar ett promise som svarar på ett response objekt när vårt förfrågan är klar. ****
    return fetch(this.url)
    //Then metoden används till det promise vi har för att ta hand om vårt Response objekt. Result.json parse:ar vårt response objekts body som json och returenrar ett promise som inväntar svaret på denna datan. ***
      .then((result) => result.json())
      //Vi har sen en till then metod kedjad till den tidigare metoden för att ta hand om vårt tidigare svar/promise. Den returnerar alltså helt enkelt datan.****
      .then((data) => data)
      //catch metoden används ifall det sker något error. Ifall ett error sker så printas det ut i konsollen.***
      .catch((err) => console.log(err));
  } 
  //Generellt så skickar denna kod ett HTTP GET request till en specifik URL, omvandlar till JSON och returnerar den omvandlade datan. Och om ett error sker så meddelar den det. ***

  remove(id) {
    console.log(`Removing task with id ${id}`);
    return fetch(`${this.url}/${id}`, {
      method: 'DELETE'
    })
      .then((result) => result)
      .catch((err) => console.log(err));
  }
}
