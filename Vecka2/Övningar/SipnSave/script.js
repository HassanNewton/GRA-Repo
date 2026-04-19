document.addEventListener("DOMContentLoaded", () => {
  // Hämta referenser till viktiga DOM-element
  const form = document.getElementById("drink-form");
  const drinkList = document.getElementById("drink-list");
  const drinkDescription = document.getElementById("drink-description");
  const apiUrl = "http://localhost:3000/drinks"; // API-url för att hämta och skicka drycker

  // Funktion för att hämta drycker från servern
  async function fetchDrinks() {
    try {
      // Gör ett GET-anrop till servern för att hämta alla drycker
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Fel vid hämtning av drycker");
      }
      // Om anropet lyckas, konvertera svaret till JSON
      const data = await response.json();
      // Rendera drycker på sidan
      renderDrinks(data);
    } catch (error) {
      // Logga eventuella fel
      console.error(error);
    }
  }

  // Funktion för att rendera drycker på sidan
  function renderDrinks(drinks) {
    // Töm tidigare listinnehåll
    drinkList.innerHTML = "";
    // Om inga drycker finns, visa ett meddelande
    if (drinks.length === 0) {
      drinkList.innerHTML = "<li>Inga drycker tillgängliga</li>";
      return;
    }

    // För varje dryck, skapa en listpunkt (li) och lägg till den i listan
    drinks.forEach((drink) => {
      const li = document.createElement("li");
      li.textContent = `${drink.name} (${drink.type})`;

      // Skapa en delete-knapp och koppla den till varje dryck
      const deleteBtn = createDeleteButton(drink.id);
      li.appendChild(deleteBtn);

      // Lägg till eventlyssnare för att visa och dölja beskrivningen av drycken
      li.addEventListener("mouseover", () => {
        drinkDescription.textContent = drink.description;
      });
      li.addEventListener("mouseout", () => {
        drinkDescription.textContent = "";
      });

      // Lägg till li-elementet i listan
      drinkList.appendChild(li);
    });
  }

  // Funktion för att skapa en delete-knapp för varje dryck
  function createDeleteButton(drinkId) {
    const button = document.createElement("button");
    button.classList.add("delete-btn"); ///lägg till class för att kunna modifiera i css
    button.textContent = "❌"; // Ange symbolen för knappen
    // När knappen klickas, ta bort drycken
    button.addEventListener("click", () => deleteDrink(drinkId));
    return button;
  }

  // Lägg till en ny dryck när formuläret skickas
  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Förhindra att sidan laddas om

    // Skapa ett objekt med värdena från formuläret
    const newDrink = {
      name: form.name.value,
      type: form.type.value,
      description: form.description.value,
    };

    try {
      // Skicka POST-anrop till servern för att lägga till drycken
      await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDrink),
      });
      // Återställ formuläret
      form.reset();
      // Hämta och visa alla drycker efter att den nya lagts till
      fetchDrinks();
    } catch (error) {
      // Logga eventuella fel vid tillägg av drycken
      console.error("Error adding drink:", error);
    }
  });

  // Funktion för att ta bort en dryck
  async function deleteDrink(id) {
    try {
      // Skicka DELETE-anrop till servern för att ta bort drycken
      await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
      // Uppdatera listan efter borttagning
      fetchDrinks();
    } catch (error) {
      // Logga eventuella fel vid borttagning
      console.error("Error deleting drink:", error);
    }
  }

  // Hämta och visa alla drycker när sidan laddas
  fetchDrinks();
});
