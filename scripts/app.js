
  let scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
  scanner.addListener('scan', function (content) {
    console.log(content);
    document.querySelector('pre').innerHTML = content;
    cam_start(false);
    
  });

  let cam_status;

  function cam_start(StartStop) {
    if(StartStop) {
      Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 0) {
          scanner.start(cameras[0]);
          var test = scanner.scan();
          console.log(test);
        } else {
          console.error('No cameras found.');
        }
      }).catch(function (e) {
        console.error('ajsdfg');
        console.error(e);
        document.querySelector('pre').innerHTML = e;
      });        
    }
    else {
      Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 0) {
          scanner.stop(cameras[0]);
        } else {
          console.error('No cameras found.');
        }
      });        
    }
  }


  /*****************************************************************************
   *
   * Event listeners for UI elements
   *
   ****************************************************************************/

  document.querySelector('.butOnOff').addEventListener('click', function() {
    console.log('lsdhjf');
    if (cam_status) {
      cam_status = false;
    }
    else {
      cam_status = true;
    }
    cam_start(cam_status);
  });

  document.querySelector('.butUser').addEventListener('click', function() {
  });

  document.querySelector('.ButtonPower').addEventListener('click', AppOnOff());


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
  console.log('offline');
  updateConnectionIcon(false);

});
window.addEventListener('online', function(e) { 
  console.log('online'); 
  updateConnectionIcon(true);
});

var nIntervId;
 
function changeColor() {
  nIntervId = setInterval(flashText, 1000);
}

function flashText() {
  var oElem = document.getElementById('my_box');
  oElem.style.color = oElem.style.color == 'red' ? 'blue' : 'red';
  // oElem.style.color == 'red' ? 'blue' : 'red' is a ternary operator.
}

function stopTextColor() {
  clearInterval(nIntervId);
}

function AppOnOff() {
  if(!localStorage.getItem('app_state')) {
    localStorage.setItem('app_state', 0);
  }
  if(localStorage.getItem('app_state')) {
    // AppTimer(false);
    // AppCam(false);
    // AppConnect(false);
    // AppButtons(false);
    localStorage.setItem('app_state', 0);
  }
  else {
    // AppTimer(true);
    // AppCam(true);
    // AppConnect(true);
    // AppButtons(true);
    localStorage.setItem('app_state', 1);
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


function populateList(data) {
  console.log(data);
}
var domainUrl = 'http://unige.ch/dife/api/v1/tickets/';
var id_question = 9985;
	// get all tickets
myRequestResponseFunction('GET', domainUrl + id_question, {hello: 'world'}, {TOKEN: 123}, db_synchro);






window.addEventListener("load", AppOnOff());