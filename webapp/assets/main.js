const addNewTodoButton = document.getElementById("add-new-todo"); // Button referenced representing the add new todo.
const createTodoButton = document.getElementById("create-todo"); // Button referenced representing create todo.
const updateTodoButton = document.getElementById("update-todo"); // Button referenced representing update todo. 
const idField = document.getElementById("id-field"); // Input referenced representing the todo id. It is readonly.
const timeField = document.getElementById("time-field"); // Input referenced representing the todo timestamp
const bodyField = document.getElementById("body-field"); // Textarea referenced representing the todo body.
const todoList = document.querySelector(".todo-content"); // Div referenced representing todo content.
const div = document.createElement("div");
let created = false;
let output = false;

updateTodoButton.style.display = "none"

let Todos = [];

// REST api

const displayAllTodos = () => {
	todoList.innerHTML = ""
	axios.get("http://localhost:8000/posts").then(res => {	
		Todos = [...res.data]
		if (Todos.length == 0) {
			// Displays this if todo is empty.
			todoList.innerHTML += `
			<div class = "empty-todo">
			<img src="./assets/images/undraw_empty_xct9.png" alt="empty image" style="width: 50%;">
			<br>
			<span style="font-family: 'Fira Sans', sans-serif; font-size: 20px; font-weight: bold;">There are no todos yet...</span>
			<br>
			</div>
			`;
		} else {		
			for(let key in Todos){
				// Adding todos to the div containing todo content gotten from the fetched url, depending on the number of todos.
				let todo = Todos[key]; 
				todoList.innerHTML += `
				<div data-id="${todo.id}" class="todo-content-item">
					<span class="todo-id">▪️ ${todo.id} ▪️</span>
					${todo.status === "Complete" ? `<span style="text-decoration: line-through;" class="todo-text">${todo.body}</span>` : `<span class="todo-text">${todo.body}</span>`}
					<span class="todo-date">Created at : ${todo.timestamp}</span>
					${todo.status === "Complete" ? `<span class="todo-status complete">▪️ ${todo.status} ▪️</span>` : `<span class="todo-status incomplete">▪️ ${todo.status} ▪️</span>`}
					<div style="display: flex; flex-direction: column; justify-content: space-around; align-items: center;" class="actions-window">
						<i class="far fa-edit"></i>
						<i class="far fa-trash-alt"></i>
						${todo.status === "Complete" ? "" : '<i class="fas fa-check"></i>'}
					</div>
				</div>
				`;
				output = true;
			};
			document.querySelector(".fa-edit").addEventListener("click", (e) => {
				editTodo(e.currentTarget.parentNode.parentNode.dataset.id);
			});
			document.querySelector(".fa-trash-alt").addEventListener("click", (e) => {
				deleteTodo(e.currentTarget.parentNode.parentNode.dataset.id);
			});
			document.querySelector(".fa-check").addEventListener("click", (e) => {
				markTodoAsComplete(e.currentTarget.parentNode.parentNode.dataset.id);
			})
		}
	}).catch(err => console.log(err));
	console.log(Todos); 
}

displayAllTodos();

// const myPromise = new Promise((res, rej) => {
// 	displayAllTodos(); // Gets data from the url, loops through the array data and formats it to be represented to the to do list div.
// 	res(output);
// 	rej(new Error("No Todos"));
// }).then((res) => {
// 	if (res) {
// 		console.log(todoList);
// 	}
// }).catch((err) => console.log(err));


// const addTodo = () => {
// 	const id = idField.value;
// 	const timestamp = timeField.value;
// 	const body = bodyField.value;
// 	const status = "Not complete";
// 	Todos.push({id,timestamp, body, status})
// 	idField.value = "";
// 	timeField.value = "";
// 	bodyField.value = "";
// 	displayAllTodos();
// }

const addTodo = () => {
	const id = idField.value; // Gets data from the input's value.
	const timestamp = timeField.value; // Gets data from the input's value.
	const body = bodyField.value; // Get's data from the textarea's value.
	const status = "Not complete";
	if (created == false) {
		addNewTodo();
	} else {
		axios
    .post('http://localhost:8000/posts', {id, timestamp, body, status})
    .then(res => console.log(res.data))
    .catch(err => console.error(err));
	idField.value = "";
	timeField.value = "";
	bodyField.value = "";
	displayAllTodos();
	}
}

const editTodo = (itemId) => {
	createTodoButton.style.display = "none" // Hides create todo button
	updateTodoButton.style.display = "block" // Displays update todo button
	const {id, timestamp, status, body} = Todos.filter(todo => todo.id == itemId)[0]; // Parameters from the const variable are new variables that will contain the data that will be filtered from the todos

	idField.value = id;
	timeField.value = getTimeStamp(); 
	bodyField.value = body;

}

const generateID = () => {
	let id = `${Math.random().toString(36).substr(2, 6)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 6)}`;
	return id;
}

const getTimeStamp = () => {
	let date = new Date();
	let time = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
	return time;
}

const addNewTodo = () => {
	idField.value = generateID();
	timeField.value = getTimeStamp();
	created = true;
}

const deleteTodo = (itemId) => {
	Todos = Todos.filter(todo => todo.id != itemId);

	axios.delete(`http://localhost:8000/posts/${itemId}`)
	.then(res => console.log(res))
	.catch(err => console.log(err));

	displayAllTodos();
}

const updateTodo = () => {
	const todos = Todos.map(todo=>{
		if(todo.id === idField.value){
			todo.status = "Not complete";
			todo.body = bodyField.value; // Assigns changed to do value to the current todo iteration.
			todo.timestamp = timeField.value;
			return todo;
		}else{
			return todo;
		}
	})

	let updateid;
	let updatebody;
	for (index in todos) {
		if (todos[index].id == idField.value) {
			updateid = todos[index].id;
			updatebody = todos[index].body;
			console.log(todos[index]);
		} 			
	}

	axios.patch(`http://localhost:8000/posts/${updateid}`, {
		'body': updatebody
	})
	.then((res) => console.log(res))
	.catch(err => console.log(err));

	Todos = todos;
	console.log(todos);
	idField.value = "";
	timeField.value = "";
	bodyField.value = "";
	displayAllTodos();
	updateTodoButton.style.display = "none"
	createTodoButton.style.display = "block"
}

const markTodoAsComplete = (itemId) => {
	const todos = Todos.map(todo=>{
		if(todo.id === itemId){
			todo.status = "Complete";
			return todo;
		}else{
			return todo;
		}
	})
	Todos = todos;
	displayAllTodos();
}

todoList.addEventListener('click', (e)=>{

	const id = e.target.parentElement.parentElement.dataset.id;

	if(e.target.classList.contains('fa-edit')){
	  editTodo(id);
	}
	
	if(e.target.classList.contains('fa-trash-alt')) {
	  deleteTodo(id);
 	}

	if(e.target.classList.contains('fa-check')){
	  markTodoAsComplete(id);
	}
})

addNewTodoButton.addEventListener('click', addNewTodo);
createTodoButton.addEventListener('click', addTodo);
updateTodoButton.addEventListener('click', updateTodo);