

let activeUser = JSON.parse(localStorage.getItem("user"));
const socket = io();

// client-side
socket.on("connect", () => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});

socket.on("disconnect", (reason) => {
    console.log(reason); // undefined
});

socket.on("message", addMessage)

function getMessages() {
  var url = 'http://localhost:3000/messages';
  // var data = { username: 'example' };

  fetch(url, {
    method: 'get',
  }).then(async res => {
    if (res.status == 200) {
      let messages = await res.json();
      for (message of messages) {
        addMessage(message)
      }
    }

  })
    .catch(error => console.error('Error:', error))
    .then(response => console.log('Success:', response));
}

function addMessage(message) {
  let el = document.getElementById("messages");
  if (message.user_id == activeUser.id) {
    el.innerHTML += `<span class="m-1  max-w-lg self-end mx-4 p-2.5 text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
    ${message.name} :\n ${message.message}</span>`
  } else {
    el.innerHTML += `<span class="m-1 max-w-lg self-start mx-4 p-2.5 text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
    ${message.name} :\n ${message.message}
   </span>`
  }
  const element = document.getElementById("messages");
  element.scrollTop = element.scrollHeight;
}



function sendMessage() {
  var url = '/messages';

  fetch(url, {
    method: 'POST', // or 'PUT'
    body: JSON.stringify({
      user_id: activeUser.id,
      name: activeUser.username,
      message: document.getElementById('chat').value
    }), // data can be `string` or {object}!
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(async res => {
    if (res.status == 200) {
      document.getElementById('chat').value = "";
      let user = await res.json();
      localStorage.setItem('user', JSON.stringify(user));
      activeUser = user;
      window.location = "/";
    }
  })
    .catch(error => console.error('Error:', error))
    .then(response => console.log('Success:', response));


}



function login() {

  var url = '/login';
  var data = { username: 'example' };

  fetch(url, {
    method: 'POST', // or 'PUT'
    body: JSON.stringify({
      username: document.getElementById('username').value,
      password: document.getElementById('password').value
    }), // data can be `string` or {object}!
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(async res => {
    if (res.status == 200) {
      let user = await res.json();
      localStorage.setItem('user', JSON.stringify(user));
      activeUser = user;
      window.location = "/";
    } else if (res.status == 404) {
      res = await res.json()
      showToast({ message: res.error, title: res.title })
    }
  })
    .catch(error => console.log);


}


