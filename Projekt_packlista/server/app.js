const express = require('express');
const app = express();
const fs = require('fs/promises');
const PORT = 5000;


app
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');
    next();
  });

/* This code is setting up an HTTP GET endpoint for the path '/tasks'.
When a client makes a GET request to this endpoint, the server will execute the code inside the callback function.
Inside the callback function, the server will try to read the contents of a file called 'tasks.json' using the fs.readFile() function, 
which is a method of the built-in fs module in Node.js that allows you to work with the file system on your computer.

If the file is successfully read, the server will send the contents of the file back to the client in the response body as a JSON object*/
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await fs.readFile('./tasks.json');
    res.send(JSON.parse(tasks));
  } catch (error) {
    res.status(500).send({ error });
  }
});


/* Uppgift 2C*/
/* Metod för att lyssna efter POST-anrop.*/
app.post('/tasks', async (req, res) => {
  try {
        /* Alla data från klienten finns i req-objektet. I req.body finns själva innehållet i förfrågan. */
    const task = req.body;
        /* Det befintliga innehållet i filen läses in och sparas till variabeln listBuffer. */
    const listBuffer = await fs.readFile('./tasks.json');
    /* Innehållet i filen är de uppgifter som hittills är sparade. För att kunna behandla listan av uppgifter i filen som JavaScript-objekt, behövs JSON.parse.
    Vi parsar json-filen så att vi kan köra innehållet i Javasript. */
    const currentTasks = JSON.parse(listBuffer);
        /* Skapar en variabel för att kunna sätta id på den senast uppladdade uppgiften */
    let maxTaskId = 1;
        /* Om det finns några uppgifter sedan tidigare som existerar och är en lista med en längd större än 0 ska ett nytt id räknas ut. */
    if (currentTasks && currentTasks.length > 0) {
            /* Det görs genom array.reduce() som går igenom alla element i listan och tar fram det högsta id:t. Det högsta id:t sparas sedan i variabeln maxTaskId */
      maxTaskId = currentTasks.reduce(
          /* För varje element i currentTasks anropas en callbackfunktion som får två parametrar, maxId och currentElement. maxId kommer att innehålla det id som för närvarande är 
        högst och currentElement representerar det aktuella element i currentTasks som man för närvarande kontrollerar. */
        (maxId, currentElement) =>
             /* ********ÄNDRA DENNA DEL************ Om id:t för den aktuella uppgiften är större än det i variabeln maxId, sätts maxId om till det id som nu är högst. maxId är från början satt till värdet av maxTaskId 
          (1, enligt rad 53.).  */
          currentElement.id > maxId ? currentElement.id : maxId,
        maxTaskId
      );
    }


    /* En ny uppgift skapas baserat på den uppgift som skickades in och som hämtades ur req.body, samt egenskapen id som sätts till det högsta id av de uppgifter som redan finns 
    (enligt uträkning med hjälp av reduce ovan) plus ett. Det befintliga objektet och det nya id:t slås ihop till ett nytt objekt med hjälp av spreadoperatorn ... */
    const newTask = { id: maxTaskId + 1, ...task };
    
    /* Om currentTasks finns - dvs det finns tidigare lagrade uppgifter,  skapas en ny array innehållande tidigare uppgifter (varje befintlig uppgift i currentTasks läggs till i den 
      nya arrayen med hjälp av spreadoperatorn) plus den nya uppgiften. Om det inte tidigare finns några uppgifter, skapas istället en ny array med endast den nya uppgiften.  */
    const newList = currentTasks ? [...currentTasks, newTask] : [newTask];
    /* Den nya listan görs om till en textsträng med hjälp av JSON.stringify och sparas ner till filen tasks.json med hjälp av fs-modulens writeFile-metod. Anropet är asynkront så 
    await används för att invänta svaret innan koden går vidare. */

    await fs.writeFile('./tasks.json', JSON.stringify(newList));



    // // // // Uppgift 2c; Kan det vara denna? En respons från backend på att ett task har mottagits?

    /* Här använder vi responsparametern där vi skickar new task, och om det skulle bli fel så skickas ett errormeddelande samt information om felet */
    res.send(newTask);
  } catch (error) {
    res.status(500).send({ error: error.stack });
  }
});


/* Mottsats till 2 A ? */
app.delete('/tasks/:id', async (req, res) => {
  console.log(req);
  try {
    const id = req.params.id;
    const listBuffer = await fs.readFile('./tasks.json');
    const currentTasks = JSON.parse(listBuffer);
    if (currentTasks.length > 0) {
      
      await fs.writeFile(
        './tasks.json',
        JSON.stringify(currentTasks.filter((task) => task.id != id))
      );
      res.send({ message: `Uppgift med id ${id} togs bort` });
    } else {
      res.status(404).send({ error: 'Ingen uppgift att ta bort' });
    }
  } catch (error) {
    res.status(500).send({ error: error.stack });
  }
});

app.listen(PORT, () => console.log('Server running on http://localhost:5000'));
