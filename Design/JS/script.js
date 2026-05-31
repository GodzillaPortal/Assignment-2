//  RECOMMEND
/*Gets elements for slider*/
const slider = document.getElementById("recommend_slider"); /*getElementById = finds element by ID only in HTML*/
const output = document.getElementById("slider_output");
const recommendBox = document.getElementById("recommendation");
const checkboxes = document.querySelectorAll('input[type="checkbox"]'); /*querySelectorAll = returns list of elements from HTML*/
const dropdown = document.getElementById("occasion_select");

//*Labels matching slider output*//
const labels = ["I have no roof over my head right now.", "I am so broke.", "Ehh, I can afford it.", "I wipe my ass with this kind of money.", "I own the restaraunt."];

/*Slider listener - updates text and changes results when slides*/
if (slider && output && recommendBox && dropdown) {
slider.addEventListener("input", () => {
    output.textContent = labels[slider.value - 1]; /*Update displayed budget description*/
    updateResults(); /*refresh results based on new budget set*/
});
}

/*Restaraunt dataset used to filter data from criteria*/
const restaraunts = [
    {
        name: "Los Pollos Hermanos",
        price: 2,
        diet: [],
        occasion: ["Just cos!!!!"]
    },
    {
        name: "Pizza Planet",
        price: 3,
        diet: ["Vegetarian", "Gluten Free"],
        occasion: ["Just cos!!!!", "Date", "Family Get Together"]
    },
    {
        name: "Freddy Fazbear's Pizzaria",
        price: 1,
        diet: ["Vegetarian"],
        occasion: ["Just cos!!!!", "Family Get Together"]
    },
    {
        name: "Flaming Dragon",
        price: 5,
        diet: ["Vegetarian", "Dairy Free"],
        occasion: ["Just cos!!!!", "Family Get Together", "Date", "Business"]
    },
    {
        name: "Nigels Kebabs",
        price: 1,
        diet: ["Vegan", "Vegetarian", "Gluten Free", "Dairy Free", "Halal"],
        occasion: ["Just cos!!!!", "Date"]
    },
    {
        name: "Papa Johns Place",
        price: 4,
        diet: ["Vegetarian", "Gluten Free"],
        occasion: ["Just cos!!!!", "Date", "Family Get Together", "Business"]
    },
];

/*Main filtering function - runs whenever budget changes options - filters based on critiera*/
function updateResults() {

    /*Safety check if page elements exist in the page. USED TO NOT GET MIXED UP WITH OTHER PAGES LINKED TO JS*/
    if (!slider || !dropdown || !recommendBox) return;

    const budget = Number(slider.value); /*Current budget level*/
    const selectedDiets = getSelectedDiets(); /*Selected dietary requirements*/
    const selectedOccasion = dropdown.value; /*Selected occasion*/

    /*Filters restaraunts based on criteria*/
    const filtered = restaraunts.filter(r => {
        if (r.price > budget) return false; /*Removes restaraunts that are too expensive*/

        /*Checks if restaraunt supports all selected diets*/
        for (let d of selectedDiets) {
            if (!r.diet.includes(d)) return false;
        }

        /*Checks if restaraunt supports selected occasion*/
        if (!r.occasion.includes(selectedOccasion)) return false;

        return true; /*Thats if restaraunt passed all filters*/
    });

    /*Outputs restaraunt recommendations as links to reservation page*/
    recommendBox.innerHTML = filtered
        .map(r => `
        <li>
            <a href="reservation.html?restaraunt=${encodeURIComponent(r.name)}">
                ${r.name}
            </a>
        </li>
        `)
        .join("");

    /*Fallback message if no results*/
    if (filtered.length === 0) {
        recommendBox.innerHTML = "<li>No restaurants found LOOOOOOOOL</li>";
    }
}

/*Updates results when checkboxes change*/
checkboxes.forEach(cb => {
    cb.addEventListener("change", updateResults);
});

/*Returns array of selected diet filters*/
function getSelectedDiets() {

    const selected = [];

    checkboxes.forEach(cb => {
        if (cb.checked) {
            selected.push(cb.value);
        }
    });

    return selected;
}

/*Run once on page load*/
updateResults();

/*Update results when occasion changes*/
if (dropdown) {
    dropdown.addEventListener("change", updateResults);
}


//  REGISTER
/*Main validation function for signing up*/
function validate(event) {

    /*Gets values/data from form*/
    const username = document.getElementById("Username").value;
    const email = document.getElementById("Email").value;
    const phone = document.getElementById("Phone").value;
    const password = document.getElementById("Password").value;
    const passwordConfirm = document.getElementById("Password_Confirm").value;
    const country = document.getElementById("Country").value;
    const region = document.getElementById("Region").value;
    const gender = document.querySelector('input[name="Gender"]:checked'); /*querySelector = Find first selected element in HTML*/
    const errors = []; /*Empty field to put error messages*/

    /*Validation rules or submitting*/
    if (username === "") errors.push("- Username can NOT be empty."); /* "" meants that its checking if username is empty. error.push loads error message*/
    if (!/^[a-zA-Z0-9_] {5,}$/.test(username)) errors.push("- Username MUST be at least 5 characters long, includes only letter, numbers, underscores.") /*^=start of string, a-z/9/etc is character set, 5, is how many characters it can be, .test tests to see if username matches*/
    if (email === "") errors.push("- Email can NOT be empty."); /*=== checks is BOTH data and valye type are the same*/
    if (!email.includes("@")) errors.push("- Email MUST include an @."); /*! means if it DOESNT include that*/
    if (!email.includes(".")) errors.push("- Email MUST be valid");
    if (phone === "") errors.push("- Phone number can NOT be empty.");
    if (!/^\d{8,15}$/.test(phone)) errors.push("- Phone MUST include 8-15 digits only.")
    if (password === "") errors.push("- Password can NOT be empty.");
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{10,}$/.test(password)) errors.push("- Password MUST be at least 10 characters, and have numbers, capitals, lower case, and special characters.")
    if (password !== passwordConfirm) errors.push("- Passwords do NOT match.");
    if (!gender) errors.push("- Please SELECT a gender.");
    if (country === "") errors.push("- Please ENTER your country.");
    if (region === "") errors.push("- Please ENTER your region.");

    /*Stop submit if there are errors*/
    if (errors.length > 0) { /*Checks if error array has any messages*/
        event.preventDefault(); /*Stops form from submitting*/
        alert(errors.join("\n")); /*Join all errors with line breaks for user*/
    }
}

/*Selects registration form element*/
const registerForm = document.getElementById("register_form");

if (registerForm) { /*Checks if form was found on HTML^^^ (<form>)*/
    registerForm.addEventListener("submit", validate); /*Attatches validate function when form is submitted WHEN VALID*/
}


// RESERVATION
/*Reads restaraunt from URL that lead user to reservation page*/
const params = new URLSearchParams(window.location.search); /*Creates params element that can read strings and URL*/
const restarauntParam = params.get("restaraunt"); /*Params extracts restaraunt data from URL*/

/*Form elements for autofill (coming from another page)*/
const restarauntSelect = document.getElementById("restaraunt_select");
const depositInput = document.getElementById("deposit_input");

/*Deposits per restaraunt*/
const deposits = {
    "Los Pollos Hermanos": "$5",
    "Pizza Planet": "$2",
    "Freddy Fazbear's Pizzaria": "FREE",
    "Flaming Dragon": "$6",
    "Nigels Kebabs": "$2",
    "Papa Johns Place": "$1",
};

/*Autoselects each restaraunt and enters deposit if coming from another page*/
if (restarauntSelect && depositInput && restarauntParam) { /*Safety check: only run if these 3 exist*/
    restarauntSelect.value = restarauntParam; /*Dropdown will automatically select restaraunt from url*/

    if (deposits[restarauntParam] !== undefined) { /*Checks if restaraunt name exists in deposit area*/
        depositInput.value = deposits[restarauntParam]; /*Puts matching deposit ammount into field*/
    }
}

/*Pulling email+reusecheckbox*/
const email = document.querySelector('input[name="Billing_Email"]');
const reuseEmail = document.querySelector('input[name="Reuse_Address"]');

/*If checked, copy email into field*/
if (reuseEmail && email) {
    reuseEmail.addEventListener("change", () => { /*Runs function whenever checkbox is ticked or unticked*/
        if (reuseEmail.checked) { /*If checkbox is now ticked (true)*/
            email.value = document.querySelector('input[name="Email"]').value; /*Copies what is in email field to billing email field*/
        } else {
            email.value = ""; /*If checkbox is unticked, clear email field*/
        }
    });
}

/*Reservation validation*/
function validateReservation(event) {

    /*Getting form inputs*/
    const emailValue = document.querySelector('input[name="Email"]').value;
    const phone = document.querySelector('input[name="Phone"]').value;
    const date = document.querySelector('input[name="Reservation_Date"]').value;
    const people = document.querySelector('input[name="Number_Of_People"]').value;
    const depositMethod = document.querySelector('input[name="Deposit_Method"]:checked');
    const cardNumber = document.querySelector('input[name="Card_Number"]').value;
    const voucher = document.querySelector('input[name="Voucher_Code"]').value;
    const errors = [];

    /*Validation rules*/
    if (emailValue === "" || !emailValue.includes("@")) errors.push("Enter a VALID email.");
    if (phone.replace(/\D/g, "").length < 10) errors.push("Phone MUST contain at least 10 digits."); /*.replace everything that isnt a digit (\D=not a digit, g=global in full string). THEN veryify its 10 or less digits*/
    if (date === "" || new Date(date) < new Date(new Date().setHours(0,0,0,0))) errors.push("Reservation date CANNOT be in the past."); /*If date is empty or before today, push error. Converts string into date, check if date is today, converts back into date, compares*/
    if (people === "" || Number(people) <= 0) errors.push("Number of people MUST be greater than 0."); /*Converts people to number and confirms its positive*/
    if (!depositMethod) errors.push("SELECT a payment method.");

    /*Online ONLY payment validation*/
    if (depositMethod && depositMethod.value === "Online") { /*Checks that online was selected*/

        const digits = cardNumber.replace(/\s/g, ""); /*removes al spaces from card number (\s = removes character)*/

        if (!/^\d+$/.test(digits)) { /*checks if card contains numbers ^=start, \d+=one or more digits, $=end of string*/
            errors.push("Card number MUST contain only digits.");
        }

        if (!(digits.length === 15 || digits.length === 16)) { /*Checks if card number is NOT 15 or 16 digits*/
            errors.push("Card MUST be 15 or 16 digits.");
        }
    }

    /*Voucher validation*/
    if (depositMethod && depositMethod.value === "Voucher") { /*Checks if voucher option was selected*/

    if (!/^\d{12}$/.test(voucher)) { /*Checks through string if voucher is 12 characters/digits*/
        errors.push("Voucher MUST be 12 digits.");
    }
    }

    /*Stop submission if errors exist*/
    if (errors.length > 0) { /*If error is found*/
        event.preventDefault(); /*Stop submission*/
        alert(errors.join("\n")); /*Show popup for user*/
    }
}

/*Attatch reservation validation to form submit*/
const reservationForm = document.querySelector("form"); /*Finds first form element in HTML*/
if (reservationForm) { /*Only run if program was found*/
    reservationForm.addEventListener("submit", validateReservation); /*Run validation first*/
}