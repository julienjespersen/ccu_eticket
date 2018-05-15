
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