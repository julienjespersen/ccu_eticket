
let code;
var all_my_freaking_cameras = [];
var cameras = [];
let my_camera;
let my_camera_i = 1;

let mirror = false;
let opts;
let scanner;

let cam_status;


let vibrate_proceed = [100, 100, 100];
let vibrate_alert = [100, 200, 100, 200, 400];

var date_device = new Date();
var date_update = new Date();


Instascan.Camera.getCameras().then(function (cameras) {
  if (cameras.length == 2) {
    my_camera = cameras[1];
    scanner = new Instascan.Scanner({ video: document.getElementById('preview'), mirror: false }).addListener('scan', function (content) {
      code = content;
      console.log(content);
      // console.log(count_record(content));
      count_record(content);
      cam_start(false);
    
      
    });
    ;
    add_to_log('mirror false');
  } 
  else if (cameras.length == 1) {
    my_camera = cameras[0];
    mirror = true;
    scanner = new Instascan.Scanner({ video: document.getElementById('preview'), mirror: true  }).addListener('scan', function (content) {
      code = content;
      console.log(content);
      // console.log(count_record(content));
      count_record(content);
      cam_start(false);
    
      
    });
    
    // opts = { video: document.getElementById('preview'), mirror: true };
    add_to_log('mirror true');
  }
  else {
    console.error('No cameras found.');
  }
}).catch(function (e) {
  console.error(e);
});


// let scanner = new Instascan.Scanner(opts);


add_to_log('app started 06');

// let scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
//       scanner.addListener('scan', function (content) {
//         console.log(content);
//       });
//       Instascan.Camera.getCameras().then(function (cameras) {
//         if (cameras.length > 0) {
//           scanner.start(cameras[0]);
//         } else {
//           console.error('No cameras found.');
//         }
//       }).catch(function (e) {
//         console.error(e);
// });


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




// Instascan.Camera.getCameras().then(function (cameras) {
//   for (let i = 0; i < cameras.length; i++) {
//     all_my_freaking_cameras[i] = cameras[i];

//   }
// });


function compare_storage() {
  if(localStorage.getItem('date_remote_update')) {
    console.log('device time: ' + Date.now());
    console.log('update time: ' + date_update.getTime(localStorage.getItem('date_remote_update')));
    console.log(Date.now() - date_device.getTime(localStorage.getItem('date_remote_update')));
  }
  else {
    console.log('no remote date');
  }

}

AppOnOff();

// switch_camera();
// assign_camera_2();
// scanner.addListener('scan', function (content) {
//   code = content;
//   console.log(content);
//   // console.log(count_record(content));
//   count_record(content);
//   cam_start(false);

  
// });
// // document.querySelector('.switch-cam').addEventListener('click', switch_camera);
// document.querySelector('#btnSwitchCam').addEventListener('click', switch_camera);
document.querySelector('#btnSwitchCam').addEventListener('click', assign_camera_2);

function assign_camera_2() {
  Instascan.Camera.getCameras().then(function (cameras) {
    if (cameras.length > 0) {
      for (let i = 0; i < cameras.length; i++) {
        document.querySelector('#out_0' + i).innerHTML = i + ': ' + cameras[i].name;
        document.querySelector('#out_0' + i).setAttribute('data-i', i);
        document.querySelector('#out_0' + i).addEventListener('click', function() {
          my_camera = cameras[this.dataset.i];
          console.log(my_camera.id);
        });
      }
    } else {
      console.error('No cameras found.');
    }
  }).catch(function (e) {
    console.error(e);
  });
}



function switch_camera() {
  // console.log('radio has changed!');
  Instascan.Camera.getCameras().then(function (cameras) {
    console.log(cameras);

    if(cameras.length == 2) {
      my_camera = cameras[1];
    }
    else {
        for (var i = 0; i < cameras.length; i++) {
          document.querySelector('#out_0' + i).innerHTML = i + ': ' + cameras[i].name;
          let a = document.createElement('a');
          a.classList.add('mdl-navigation__link');
          document.querySelector('#out_0' + i).setAttribute('data-i', i);
          document.querySelector('#out_0' + i).addEventListener('click', function() {
            my_camera = cameras[this.dataset.i];
            console.log(my_camera.id);
          });
        }
        if (cameras.length == 1) {
          my_camera = cameras[0];
        } 
    }
    // add_to_log('camera id: ' + my_camera.id);
    
  });
  

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


function after_update() {
  document.querySelector('#demo-toast-example').MaterialSnackbar.showSnackbar({message: 'OK proceed! '});
  navigator.vibrate(vibrate_proceed);
  add_to_log('OK proceed');
  feedback_bg(true);

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

function add_to_log(msg) {
  let li = document.createElement('li');
  li.innerHTML = msg;
  document.querySelector('.log').appendChild(li);
}


function cam_start(StartStop) {
  if(StartStop) {
    cam_status = true;
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
    cam_status = false;
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
  console.log('offline');
  updateConnectionIcon(false);

});
window.addEventListener('online', function(e) { 
  console.log('online'); 
  updateConnectionIcon(true);
});

var nIntervId;
 
function AppTimer(r) {
  if (r == 'play') {
    nIntervId = setInterval(compare_storage, 5000);

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
  }
  else {
    AppTimer('play');
    // AppCam(true);
    // AppConnect(true);
    // AppButtons(true);
    localStorage.setItem('app_state', 1);
    document.querySelector('.ButtonPower i').classList.remove('mdl-color-text--grey-700');
    document.querySelector('.ButtonPower i').classList.add('mdl-color-text--green-500');
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