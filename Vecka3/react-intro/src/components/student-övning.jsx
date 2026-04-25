// ELEVUPPGIFT: Student och StudentList
// =====================================
// Denna uppgift tränar komponenter, props och map()

// INSTRUKTIONER:
// ==============
// Din uppgift är att skapa två React-komponenter:
// 1. En Student-komponent
// 2. En StudentList-komponent som använder Student flera gånger

// STEG 1: Skapa Student-komponenten
// ==================================
// Skapa en ny fil som heter Student.jsx
// Komponenten ska ta emot följande props:
//   - name (elevens namn)
//   - grade (elevens betyg, t.ex. "A", "B", "C")
//   - subject (vilket ämne det är, t.ex. "Matematik")
//
// Visa upp dessa egenskaper på ett snyggt sätt i JSX
// Använd inline-styling för att göra det snyggare
//
// Exempel på output:
// +-------------------------------------------+
// | Alice Johnson - Matematik (A)             |
// +-------------------------------------------+

// STEG 2: Uppdatera App.jsx
// ==========================
// I din App.jsx (eller en ny StudentList.jsx) ska du:
//
// 1. Importera Student-komponenten
// 2. Skapa en array med minst 5 studenter
//    Varje student ska ha: name, grade och subject
//
// 3. Använd map() för att loopa över arrayn
// 4. För varje student, rendera en <Student>-komponent
// 5. Skicka name, grade och subject som props
//
// 6. Visa en rubrik "Studentlista" längst upp
// 7. Visa hur många studenter det finns totalt

// TIPS:
// =====
// ✓ Kom ihåg key={} när du använder map()
// ✓ Använd destrukturering: ({ name, grade, subject }) => {...}
// ✓ Testa att ändra något värde och se att det uppdateras
// ✓ Lägg till en border eller backgroundColor för snyggt utseende

// FÖRDJUPNING (om du är klar tidigt):
// ====================================
// 1. Lägg till ett email-fält till varje student
// 2. Visa emailen i Student-komponenten
// 3. Lägg till ett phone-fält (telefonnummer)
// 4. Skapa en ny komponent för att visa bara A-betyg
// 5. Lägg till en "active"-status (true/false) och visa grön/röd färg


