
let code;
let id_camera;
let my_camera;


let scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
switch_camera();
scanner.addListener('scan', function (content) {
  cam_start(false);
  code = content;
  console.log(content);
  // console.log(count_record(content));
    count_record(content);

  
});
document.querySelector('.switch-cam').addEventListener('click', switch_camera);

function switch_camera() {
  Instascan.Camera.getCameras().then(function (cameras) {
    console.log(cameras);
    if (cameras.length == 1) {
      my_camera = cameras[0];
      id_camera = cameras[0].id;
    } 
    else if (cameras.length == 2) {
      if (my_camera.id == cameras[1].id) {
        my_camera = cameras[0];
      }
      else {
        my_camera = cameras[1];

      }
  
    }
    else {
      console.error('No cameras found.');
      
    }
    document.querySelector('#out_00').innerHTML = cameras[0].name;
    if(cameras.length > 1) {
      document.querySelector('#out_01').innerHTML = cameras[1].name;
    }
    document.querySelector('#out_02').innerHTML = my_camera.name;
  });
    console.log(my_camera);

}


  function after_count(count) {
    console.log('after count: ' + count);
    if (count) {
      fetch_reccord();
    } else {
      document.querySelector('#demo-toast-example').MaterialSnackbar.showSnackbar({
        message: 'NOT (unknown)',
        actionHandler: function(event) {
          show_dialog('Unknown code number!', 'This code number doesn\'t exists in the system. Please escort the offender toward the security officer ;)' )
        },
        actionText: 'Why?',
        timeout: 10000
      });
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
          show_dialog('Expired ticket!', 'This ticket is no longer valid for this event. Please escort the offender toward the security officer ;)' )
          
        },
        actionText: 'Why?',
        timeout: 10000
      });
    }


  }

  function after_update() {
    document.querySelector('#demo-toast-example').MaterialSnackbar.showSnackbar({message: 'OK proceed! '});
    
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

  let cam_status;

  function cam_start(StartStop) {
    if(StartStop) {
      scanner.start(my_camera);

      // Instascan.Camera.getCameras().then(function (cameras) {
      //   if (cameras.length > 0) {
      //     scanner.start(cameras[0]);
      //     var test = scanner.scan();
      //     console.log(test);
      //   } else {
      //     console.error('No cameras found.');
      //   }
      // }).catch(function (e) {
      //   console.error('ajsdfg');
      //   console.error(e);
      //   document.querySelector('pre').innerHTML = e;
      // });        
    }
    else {
      scanner.stop(my_camera);
      
      // Instascan.Camera.getCameras().then(function (cameras) {
      //   if (cameras.length > 0) {
      //     scanner.stop(cameras[0]);
      //   } else {
      //     console.error('No cameras found.');
      //   }
      // });        
    }
  }


  /*****************************************************************************
   *
   * Event listeners for UI elements
   *
   ****************************************************************************/

  document.querySelector('.butOnOff').addEventListener('click', function() {
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

var domainUrl = 'https://unige.ch/dife/api/v1/tickets/';
var id_question = 9985;
	// get all tickets
myRequestResponseFunction('GET', domainUrl + id_question, {hello: 'world'}, {TOKEN: 123}, db_synchro);






window.addEventListener("load", AppOnOff());