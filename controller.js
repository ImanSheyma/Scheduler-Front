var employees =  [];
var employeeId='';
var tasks = [];
var dateStart;
var dateEnd;

const apiURL = 'https://scheduler-2ply.onrender.com/api';

//form inputs and button
const submitBtn = document.getElementById("submit");
const dateStartInput = document.getElementById("startDate");
const dateEndInput = document.getElementById("endDate");
const employeeSelector = document.getElementById("employee");

//Tables
const taskTableBody = document.getElementById("task-table-body");
const planTableBody = document.getElementById("plan-table-body");
const planTableHead = document.getElementById("plan-table-head");

//Employee fetch function
async function getEmployees(){
    let res;
    res = await fetch(`${apiURL}/employee`, {mode: 'cors'});
    employees = await res.json();
    console.log(employees)
    generateEmployeeOptions();
}

//task fetch function
async function getTasks(){
    let res;
    let url = `${apiURL}/task?employeeId=${employeeId}&start=${dateStart}&end=${dateEnd}`;
    res = await fetch(url, {mode: 'cors'});
    tasks = await res.json();
	console.log(tasks)
    update();
}

//filling out the task-table
function generateTaskTable(){
    let data = '';
    tasks.forEach(task => {
        data += `<tr>`+
            `<td>${task.name}</td>`+
            `<td>${task.start}</td>`+
            `<td>${task.end}</td>`+
            `<td>${task.dateCompleted ? task.dateCompleted : '-'}</td>`+
            `<td><input type="checkbox" ${task.isCompleted ? 'checked' :''}></td>`+
        `</tr>`
    });
    taskTableBody.innerHTML = data;
}

//filling out the plan-table
function generatePlanTable(){
    let data = '';
    tasks.forEach(task => {
        plan = () => {
            cols=``;
            date = new Date(dateStart);
            end = new Date(dateEnd);
            taskStart = new Date(task.start);
            taskEnd = new Date(task.end);
            if(date > end) return;
            while(date <= end){
                if(date >= taskStart && date <= taskEnd)
                    cols += `<td class="bg-primary" style="--bs-bg-opacity: .3;"></td>`
                else
                    cols += `<td></td>`;
                date.setDate(date.getDate()+1);
            }
            return cols;
        }
        data += `<tr>`+
            `<td>${task.name}</td>`+plan()+
        `</tr>`
    });
    planTableBody.innerHTML = data;
}

//generating plan-table headers
function generateTaskTableHead(){
    cols = ``;
    date = new Date(dateStart);
    end = new Date(dateEnd);
    if(date > end) return;
    while(date <= end){
        cols += `<th>${date.getDate()}</th>`;
        date.setDate(date.getDate()+1);
    }
    planTableHead.innerHTML = `<tr><th>Задача</th>${cols}</tr>`
}

function generateEmployeeOptions(){
    let options = '<option value="">Все</option>';
    employees.forEach(emp => {
        options += `<option value=${emp.id}>`+
            `${emp.name + ' ' + emp.surename}`+
        `</option>`
    });
    employeeSelector.innerHTML = options;
}

//rerender tables
function update(){
    generateTaskTable();
    generateTaskTableHead();
    generatePlanTable();
}

//selector handler
employeeSelector.addEventListener("change", (event) => {
	employeeId = event.target.value;
})

//submit btn handler
submitBtn.addEventListener("click", (event) => {
	event.preventDefault();
    getTasks();
    update();
})

//date start input handler
dateStartInput.addEventListener('change', (event) => {
    dateStart = event.target.value;
})

//date end input handler
dateEndInput.addEventListener('change', (event) => {
    dateEnd = event.target.value;
})

getEmployees();