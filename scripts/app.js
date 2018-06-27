var domainUrl = 'https://unige.ch/dife/api/v1/';
var id_user = 0;
if(localStorage.getItem('id_user')) {
  id_user = localStorage.getItem('id_user');
}
var id_event = 9985;
if(localStorage.getItem('id_event')) {
  id_event = localStorage.getItem('id_event');
}
var token = '';
if(localStorage.getItem('token')) {
  token = localStorage.getItem('token');
}

var time_short = 5000;
var time_medium = 20000;
var time_long = 60000;

let code;
var all_my_freaking_cameras = [];
var cameras = [];
let my_camera;
let my_camera_i = 1;

let opts;
let scanner;

let cam_status;

var login_dialog = document.querySelector('#login-dialog');

let vibrate_proceed = [100, 100, 100];
let vibrate_alert = [300, 100, 300, 100, 300];

var date_device = new Date();
var date_update = new Date();


Instascan.Camera.getCameras().then(function (cameras) {
  let mirror = false;
  if (cameras.length == 2) {
    my_camera = cameras[1];
  } 
  else if (cameras.length == 1) {
    my_camera = cameras[0];
    mirror = true;
  }
  else {
    console.error('No cameras found.');
  }
  scanner = new Instascan.Scanner({ video: document.getElementById('preview'), mirror: mirror  }).addListener('scan', function (content) {
    code = content;
    console.log(content);
    count_record(content);
    cam_start(false);
  });
}).catch(function (e) {
  console.error(e);
});


add_to_log('app version 0.0.11', 'settings');


function compare_storage() {
  if(localStorage.getItem('date_remote_update')) {
    let ttlu = parseInt((Date.now() - date_device.getTime(localStorage.getItem('date_remote_update'))) / 1000);
    // console.log('device time: ' + Date.now());
    add_to_log('time to last update: ' + ttlu + ' s.', 'timer');
    // console.log('update time: ' + date_update.getTime(localStorage.getItem('date_remote_update')));
    // console.log(Date.now() - date_device.getTime(localStorage.getItem('date_remote_update')));
  }
  else {
    console.log('no remote date');
  }

}

AppOnOff();


function updateEventList(data) {

  console.log(data);
  // data.each

  // db.tickets.each(ticket => console.log(ticket.code));
  // db.tickets.each(function(ticket) {
  //   // console.log(ticket.id_ticket);
  //   createTicket(ticket);
  // })

}






function updateAttendeeList() {
  // db.tickets.each(ticket => console.log(ticket.code));
  db.tickets.each(function(ticket) {
    // console.log(ticket.id_ticket);
    createTicket(ticket);
  })
  // db.tickets.get().then (function (all) {
  //   console.log(all);
  // });
}

function createTicket(ticket) {
  if(document.querySelector('t' + ticket.id_ticket)) {
    document.querySelector('t' + ticket.id_ticket).remove();
  }
  if(!ticket.date_stub) {
    ticket.date_stub = '';
  }
  let li = document.createElement('li');
  let span1 = document.createElement('span');
  let span2 = document.createElement('span');
  let i = document.createElement('i');
  let mt = document.createTextNode(ticket.code);
  let it = document.createTextNode('person');
  
  let ul = document.querySelector('#fixed-tab-2 ul');

  li.classList.add('mdl-list__item', 'mdl-list__item--two-line', 'mdl-color--grey-100');
  li.id = 't' + ticket.id_ticket;
  span1.classList.add('mdl-list__item-primary-content');
  span2.classList.add('mdl-list__item-secondary-content');
  i.classList.add('material-icons', 'mdl-list__item-icon');


  span1.innerHTML = '<i class="material-icons mdl-list__item-icon">person</i><span>' + ticket.nom + '</span><span class="mdl-list__item-sub-title">' + ticket.date_stub + ' • ' + ticket.count_stub + '/' + ticket.count_total + ' • ' + ticket.code + '</span>';
  span2.innerHTML = '<span class="mdl-list__item-secondary-info">' + ticket.id_ticket + '</span><span class="mdl-list__item-secondary-info"><i class="material-icons">check</i></span>';


  // i.appendChild(it);
  // span1.appendChild(i);
  // span1.appendChild(mt);
  li.appendChild(span1);
  li.appendChild(span2);
  // ul.insertBefore(li, ul.firstChild);
  ul.insertBefore(li, ul.firstChild);

  // ul.appendChild(li);
}





function after_count(count) {
  console.log('after count: ' + count);
  if (count) {
    fetch_reccord();
  } else {
    document.querySelector('#demo-toast-example').MaterialSnackbar.showSnackbar({
      message: 'NOT (unknown)',
      actionHandler: function(event) {
        show_dialog('Unknown code number!', 'This code number (' + code + ') doesn\'t exists in the system. Please escort the offender toward the security officer ;)' )
      },
      actionText: 'Why?',
      timeout: 5000
    });
    navigator.vibrate(vibrate_alert);
    feedback_bg(false);

  }
}
function after_fetch(reccord_obj) {
  if(reccord_obj.count_total - reccord_obj.count_stub) {
    update_reccord(reccord_obj);

  }
  else {
    document.querySelector('#demo-toast-example').MaterialSnackbar.showSnackbar({
      message: 'NOT (expired)',
      actionHandler: function(event) {
        show_dialog('Expired ticket!', 'This ticket (' + code + ') is no longer valid for this event. Please escort the offender toward the security officer ;)' )
      },
      actionText: 'Why?',
      timeout: 5000
    });
    navigator.vibrate(vibrate_alert);
    feedback_bg(false);
  }
}

function feedback_bg(okfail) {
  let main = document.querySelector('main');
  let the_class;
  if (okfail) {
    the_class = 'mdl-color--green-700';
  }
  else {
   the_class = 'mdl-color--red-700';
  }
  main.classList.remove('mdl-color--grey-700');
  main.classList.add(the_class);
  setTimeout(function (){
    main.classList.remove(the_class);
    main.classList.add('mdl-color--grey-700');
  }, 2000);
}


function after_update(ticket) {
  document.querySelector('#demo-toast-example').MaterialSnackbar.showSnackbar({message: 'OK proceed! '});
  navigator.vibrate(vibrate_proceed);
  add_to_log('OK proceed');
  feedback_bg(true);
  createTicket(ticket);
  console.log('kes tu fou!');
}



function show_dialog(info_title, info_msg) {
  let dialog = document.querySelector('dialog');
  dialog.querySelector('h4').innerHTML = info_title;
  dialog.querySelector('p').innerHTML = info_msg;
  dialog.showModal();
  dialog.querySelector('.close').addEventListener('click', function() {
    dialog.close();
  });
}

function show_login_dialog(info_title, info_msg) {
  let dialog = document.querySelector('#login-dialog');
  dialog.querySelector('h4').innerHTML = info_title;
  dialog.querySelector('p').innerHTML = info_msg;
  dialog.showModal();
  dialog.querySelector('.close').addEventListener('click', function() {
    dialog.close();
  });
}

// user's stuff ala not pollute style
(function() {
  let form = document.querySelector('#login-form');
  let userButton = document.querySelector('.butUser');
  userButton.addEventListener('click', function() {
    login_dialog.showModal();
  });
  login_dialog.querySelector('button.close')
  .addEventListener('click', function() {
    login_dialog.close();
  });
  login_dialog.querySelector('button.ok')
  // .addEventListener('click', myRequestResponseFunction('POST', domainUrl + 'logMe/', new FormData(form), {TOKEN: ''}, registerUser));
  .addEventListener('click', function(){
    myRequestResponseFunction('POST', domainUrl + 'logMe', new FormData(form), {TOKEN: ''}, registerUser);
  });
}());

function registerUser(data) {
  if(data.login.token) {
    localStorage.setItem('token', data.login.token);
    localStorage.setItem('id_user', data.login.id_personne);
    id_user = data.login.id_personne;
    updateUserIcon(true);
    login_dialog.close();
  }
  else {
    localStorage.removeItem('token');
    updateUserIcon(false);
  }
}

function updateUserIcon(status) {
  if (status) {
    document.querySelector('.UserIcon').classList.remove('mdl-color-text--grey-700');
    document.querySelector('.UserIcon').classList.add('mdl-color-text--white-700');
  }
  else {
    document.querySelector('.UserIcon').classList.remove('mdl-color-text--white-700');
    document.querySelector('.UserIcon').classList.add('mdl-color-text--grey-700');
  }
}




function AppConnect(YesNo) {
  add_to_log('feed requested: ' + domainUrl + 'eticket/tickets/' + id_event, 'link');
	// get all events
  myRequestResponseFunction('GET', domainUrl + 'eticket/events/' + id_user, {hello: 'world'}, {TOKEN: token}, updateEventList);
	// get all tickets
  myRequestResponseFunction('GET', domainUrl + 'eticket/tickets/' + id_event, {hello: 'world'}, {TOKEN: token}, db_synchro);

}


function add_to_log(msg, type = 'info') {
  let li = document.createElement('li');
  let span = document.createElement('span');
  let i = document.createElement('i');
  let mt = document.createTextNode(msg);
  let it = document.createTextNode(type);
  let ul = document.querySelector('#fixed-tab-4 ul');

  li.classList.add('mdl-list__item');
  span.classList.add('mdl-list__item-primary-content');
  i.classList.add('material-icons', 'mdl-list__item-icon');

  i.appendChild(it);
  span.appendChild(i);
  span.appendChild(mt);
  li.appendChild(span);
  ul.insertBefore(li, ul.firstChild);
}


function cam_start(StartStop) {
  if(StartStop) {
    cam_status = true;
    scanner.start(my_camera);
  }
  else {
    cam_status = false;
    scanner.stop(my_camera);
  }
}



document.querySelector('.butOnOff').addEventListener('click', function() {
  if (cam_status) {
    cam_status = false;
  }
  else {
    cam_status = true;
  }
  cam_start(cam_status);
});

// document.querySelector('.butUser').addEventListener('click', show_login_dialog);

document.querySelector('#show-user').addEventListener('click', function() {
  document.querySelector('#user-profile').dislpay = 'bloc';
});

document.querySelector('.ButtonPower').addEventListener('click', AppOnOff);


function updateConnectionIcon(status) {
  if (status) {
    document.querySelector('.ConnectionIcon').innerHTML = 'signal_cellular_4_bar';
  }
  else {
    document.querySelector('.ConnectionIcon').innerHTML = 'signal_cellular_off';
  }
}

if (navigator.onLine) {
  updateConnectionIcon(true);
} else {
  updateConnectionIcon(false);
}

window.addEventListener('offline', function(e) { 
  updateConnectionIcon(false);
  add_to_log('app goes offline', 'signal_cellular_off');

});
window.addEventListener('online', function(e) { 
  updateConnectionIcon(true);
  add_to_log('app goes online', 'signal_cellular_4_bars');
  
});

var nIntervId;
 
function AppTimer(r) {
  if (r == 'play') {
    nIntervId = setInterval(AppCycle, time_short);


  }
  else {
    clearInterval(nIntervId);

  }
}


function AppOnOff() {
  if(!localStorage.getItem('app_state')) {
    localStorage.setItem('app_state', 0);
  }
  if(localStorage.getItem('app_state') == 1) { // stop the app
    
    AppTimer('stop');
    // AppCam(false);
    // AppConnect(false);
    // AppButtons(false);
    localStorage.setItem('app_state', 0);
    document.querySelector('.ButtonPower i').classList.remove('mdl-color-text--grey-100');
    document.querySelector('.ButtonPower i').classList.add('mdl-color-text--grey-700');
    add_to_log('app stopped', 'stop');
  }
  else {
    AppTimer('play');
    // AppCam(true);
    AppConnect(true);
    // AppButtons(true);
    localStorage.setItem('app_state', 1);
    document.querySelector('.ButtonPower i').classList.remove('mdl-color-text--grey-700');
    document.querySelector('.ButtonPower i').classList.add('mdl-color-text--green-500');
    add_to_log('app started', 'play_arrow');
  }
}

function AppButtons(param) {
  if(param) {
    document.querySelector('.sec-btn').dislpay = 'bloc';
  }
  else {
    document.querySelector('.sec-btn').dislpay = 'none';
  }
}

function AppCycle() {
  if (id_user) {
    compare_storage();
    AppConnect();
    updateUserIcon(true);
  }
  else {
    updateUserIcon(false);
  }

}



window.addEventListener('load', AppOnOff());