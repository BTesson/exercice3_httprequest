let tableEmpBody = document.getElementById('table-emp-body');
let buttonOrderMonthlySalary = document.getElementById('button-order-monthly-salary');

let data = {};
let order = null;

let request = new XMLHttpRequest();
let requestURL = "http://dummy.restapiexample.com/api/v1/employees";

/**
 * Affichage en format monaitaire
 */
const euro = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  });
  
/**
 * Récupération des données json
 */
request.open('GET', requestURL, true);
request.send();
request.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
        let reponse = JSON.parse(request.responseText);
       
        if(reponse.status == "success"){
            data = reponse.data;  
            addData();      
        } else if(reponse.status == "error"){
            errorLoading("Erreur");
        }
    }
}

/**
 * Fonction pour remplir le tbody
 */
function addData(){
    if(data != null){
        Object.keys(data).forEach(function(k){   
            let newTr = document.createElement('tr');
            tableEmpBody.appendChild(newTr);
            addValue(newTr, data[k]);
        });
        addFooterTable();
    }
}

/**
 * Fonction de remplissage de ligne du tableau
 * @param {element au quel acrocher les élément} elemt 
 * @param {données qui sert a remplir le tableau} value 
 */
function addValue(elemt, value){
    addTd(elemt, "employee-id", document.createTextNode(value.id));

    addTd(elemt, "employee-name", document.createTextNode(value.employee_name));

    let firstChar = value.employee_name.charAt(0).toLowerCase();
    let lastname = (value.employee_name.split(' '))[1].toLowerCase();
    let email = firstChar +'.'+ lastname + "@email.com";
    addTd(elemt, "employee-email", document.createTextNode(email));

    let monthlySalary = euro.format(value.employee_salary / 12);
    addTd(elemt, "employee-monthly-salary", document.createTextNode(monthlySalary));

    let dateOfDay = new Date(); 
    let year = dateOfDay.getFullYear(); 
    let yearOfBirth = year - value.employee_age;
    addTd(elemt, "employee-year-of-birth", document.createTextNode(yearOfBirth));

    let buttonDuplicate = document.createElement('button');
    buttonDuplicate.className = "button-duplicate";
    buttonDuplicate.addEventListener('click', function(){
        data.push(value);
        tableEmpBody.deleteRow(-1);
        let newTr = document.createElement('tr');
        tableEmpBody.appendChild(newTr);
        addValue(newTr, value);
        addFooterTable();
    });
    buttonDuplicate.textContent = "Duplicate";
    addTd(elemt, "td-button-duplicate", buttonDuplicate);

    let buttonDelete = document.createElement('button');
    buttonDelete.className = 'button-delete';
    buttonDelete.addEventListener('click', function(){  
        data.splice(data.indexOf(value), 1);
        row = this.parentNode.parentNode;
        tableEmpBody.removeChild(row);
        tableEmpBody.deleteRow(-1);
        addFooterTable();
    });
    buttonDelete.textContent = "Delete";
    addTd(elemt, "td-button-delete", buttonDelete);
}

/**
 * Fonction création du pied de tableau
 */
function addFooterTable(){
    let newTr = document.createElement('tr');
    tableEmpBody.appendChild(newTr);
    
    addTd(newTr, "total-employee-id", document.createTextNode(data.length));

    addTd(newTr, "total-employee-name", document.createTextNode(""));

    addTd(newTr, "total-employee-email", document.createTextNode(""));

    let total = 0; 
    Object.keys(data).forEach(function(k){ 
        total = total + (data[k].employee_salary / 12);
    });
    addTd(newTr, "total-employee-monthly-salary", document.createTextNode(euro.format(total)));
    
    addTd(newTr, "total-employee-year-of-birth", document.createTextNode(""));

    addTd(newTr, "total-button-duplicate", document.createTextNode(""));

    addTd(newTr, "total-button-delete", document.createTextNode(""));
}

/**
 * Fonction de tri est réaffichage des données 
 */
buttonOrderMonthlySalary.addEventListener('click', function(){
    if(order == null || !order){
        data.sort(function(a, b){
            return (a.employee_salary / 12) - (b.employee_salary / 12);
        });
        clearTable();
        addData();
        this.textContent = '^';
        order = true;
    } else {
        data.sort(function(a, b){
            return (b.employee_salary / 12) - (a.employee_salary / 12);
        });
        clearTable();
        addData();
        this.textContent = 'v';
        order = false;
    }
});

/**
 * Function d'éffacage du tableau
 */
function clearTable(){
    while(tableEmpBody.hasChildNodes()){
        tableEmpBody.removeChild(tableEmpBody.firstChild);
    }
}

/**
 * Fonction de création de td
 * @param {element parent auquel acrocher le td} parentElem 
 * @param {le nom de la classe du td} classname 
 * @param {element a ajouter a l'intérieur du td} elemtToAdd 
 */
function addTd(parentElem, classname, elemtToAdd){
    let td = document.createElement('td');
    td.className = classname;
    parentElem.appendChild(td);
    td.appendChild(elemtToAdd);
 }

 function errorLoading(mess){
    let newTr = document.createElement('tr');           
    tableEmpBody.appendChild(newTr);
    let newTd = document.createElement('td');
    newTr.appendChild(newTd);
    newTd.appendChild(document.createTextNode(mess));
    newTd.colSpan = 7;
 }
 