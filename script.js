let donnees = [];
let graphique;

const GOOGLE_SHEET_URL ="https://docs.google.com/spreadsheets/d/e/2PACX-1vQHhsse8N5a_QRo7exyuT8x6LMX1r7L_tm1B3vbmR-C-7tB9j2BZHydpuKGwdtrk8nr1XXsphOcCpqT/pub?output=csv"

// ==========================================
// CHARGEMENT DES DONNÉES GOOGLE SHEETS
// ==========================================

Papa.parse(GOOGLE_SHEET_URL, {

    download: true,

    header: true,

    skipEmptyLines: true,

    complete: function(result) {

        donnees = result.data;

        console.log("Données reçues :", donnees);

        afficherStatistiques();

        remplirFiltre();

        afficherTableau(donnees);

        creerGraphique(donnees);
    },

    error: function(error) {

        console.error(
            "Erreur lors du chargement :",
            error
        );

        alert(
            "Impossible de charger les données Google Sheets."
        );
    }

});


// -----------------------------
// STATISTIQUES
// -----------------------------

function afficherStatistiques() {

    const total = donnees.length;

    const ageMoyen =
        donnees.reduce(
            (somme, personne) =>
                somme + Number(personne.age),
            0
        ) / total;


    const films = new Set(
        donnees.map(personne => personne.film)
    );


    document.getElementById("totalUsers")
        .textContent = total;

    document.getElementById("averageAge")
        .textContent = ageMoyen.toFixed(1);

    document.getElementById("totalFilms")
        .textContent = films.size;
}


// -----------------------------
// FILTRE DES FILMS
// -----------------------------

function remplirFiltre() {

    const select =
        document.getElementById("filmFilter");


    const films = [...new Set(
        donnees.map(personne => personne.film)
    )];


    films.sort();


    films.forEach(film => {

        const option =
            document.createElement("option");

        option.value = film;

        option.textContent = film;

        select.appendChild(option);

    });
}


// Détection du changement de filtre

document
    .getElementById("filmFilter")
    .addEventListener("change", function() {

        const film = this.value;


        if (film === "all") {

            afficherTableau(donnees);

        } else {

            const resultat =
                donnees.filter(
                    personne => personne.film === film
                );

            afficherTableau(resultat);

        }

    });


// -----------------------------
// TABLEAU
// -----------------------------

function afficherTableau(data) {

    const tableau =
        document.getElementById("dataTable");


    tableau.innerHTML = "";


    data.forEach((personne, index) => {

        const ligne =
            document.createElement("tr");


        // Animation progressive
        ligne.style.animationDelay =
            `${index * 0.03}s`;


        ligne.innerHTML = `

            <td>${personne.pseudo}</td>

            <td>${personne.age} ans</td>

            <td>${personne.film}</td>

        `;


        tableau.appendChild(ligne);

    });

}


// -----------------------------
// GRAPHIQUE
// -----------------------------

function creerGraphique(data) {

    const ages = {};


    data.forEach(personne => {

        const age =
            Number(personne.age);


        if (!ages[age]) {

            ages[age] = 0;

        }


        ages[age]++;

    });


    const agesTries =
        Object.keys(ages)
        .sort((a, b) => a - b);


    const nombres =
        agesTries.map(
            age => ages[age]
        );


    const contexte =
        document
        .getElementById("ageChart")
        .getContext("2d");


    graphique = new Chart(contexte, {

        type: "bar",

        data: {

            labels: agesTries,

            datasets: [{

                label: "Nombre de personnes",

                data: nombres

            }]

        },

        options: {

            responsive: true,

            animation: {

                duration: 1500,

                easing: "easeOutQuart"

            },

            scales: {

                x: {

                    title: {

                        display: true,

                        text: "Âge"

                    }

                },

                y: {

                    beginAtZero: true,

                    title: {

                        display: true,

                        text: "Nombre de personnes"

                    }

                }

            }

        }

    });

}
