// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = [];


/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
    const res = await axios.get("https://jservice.io/api/categories?count=100")
    let allCats = res.data.map(function(item) {
        return item.id
    });

    catId = _.sampleSize(allCats, 6)
    return catId;
}


/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */ 

async function getCategory(catId) {
    
    for (let id of catId) {
        let category = {}
        const res = await axios.get(`https://jservice.io/api/category?id=${id}`)
        category.title = res.data.title
        category.clues = res.data.clues.map(function(val) {
            return {question: val.question, answer: (val.answer = (val.answer.includes("<i>") ? val.answer.slice(3,-4):val.answer)), showing: null}
        })
       categories.push(category)
    } 
    return categories;
}
    
   
   

    


/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

 function fillTable() {
    
    function createTopRow(){
        $("thead").append("<tr>")
        let topRow = $("tr").eq(0)
        
        for (let i = 0; i < 6; i++ ) {
           let th = document.createElement("th")
            topRow.append(th)
            th.innerText = categories[i].title;
        }
    }
    function createTable() {
        for (let r = 0; r < 5; r++ ) {
            $("tbody").append("<tr>")
        for (let c=0; c<6; c++) {
            let question = categories[c].clues[r]
            let tableRows = $("tbody > tr").eq(r)
            let td = $("<td>").text("?").on("click", (evt) => handleClick(evt, question))
            tableRows.append(td) 
            }
        }
    }
    function tableLoader() {
        $("tbody").ready(function() {
            const loader = document.querySelector(".loader");
            loader.classList.add("hidden")
        })
    }
    createTopRow();
    createTable();
    tableLoader();
}

    
    


/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt, question) {        
        if (question.showing === null) {
            question.showing = "question"
            evt.target.innerText = question.question
        }
        else if (question.showing === "question") {
            question.showing = "answer"
            evt.target.innerText = question.answer
        }
        else if (question.showing === "answer") {
            return
        }
        
    }



/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
    await getCategoryIds();
    await getCategory(catId);
    fillTable();
}

/** On click of restart button, restart game. */
function restartGame() {
    $("button").on("click", async function() {
    categories = []
    catId = []
    await getCategoryIds();
    await getCategory(catId);
    $("thead th").remove()
    $("tbody td").remove()
    fillTable();
})}




/** On page load, setup and start & add event handler for clicking clues */
$(function() {
    setupAndStart();
    restartGame();
    
})

