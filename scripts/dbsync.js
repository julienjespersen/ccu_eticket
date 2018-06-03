var db = new Dexie("eticket");
db.version(1).stores({
    tickets: '++code'
});


function db_synchro(data) {
    

    db.tickets.bulkPut(data.data).then(function(lastKey) {
        console.log('done: ' + lastKey); 
    }).catch(Dexie.BulkError, function (e) {
        console.error ('error while injecting into db');
	})
	.then(function(){
		console.log('date_remote_update: ' + date_update.toISOString());
		localStorage.setItem('date_remote_update', date_update.toISOString());
		add_to_log('feed response @ ' + date_update.toISOString(), 'cloud_download');
		updateAttendeeList();
	});
	
}

function count_record(code) {
	db.tickets.where('code').equals(code).count(after_count);
}

function fetch_reccord() {
	db.tickets
	.where('code')
	.equals(code)
	.first()
	.then(after_fetch);
}


function update_reccord(reccord_obj) {
	let new_count = reccord_obj.count_stub + 1;
	let new_date = '2018-05-18 15:00:00';
	
	reccord_obj.count_stub = new_count;
	reccord_obj.date_stub = new_date;

	add_to_log('in update_record');
	
	db.tickets
		.update(code, {
			count_stub: new_count
			,date_stub: new_date
		})
		.then(function (updated) {
			if (updated) {
				console.log ("reccord updated");
				after_update(reccord_obj);
			}
			else {
				console.log ("not updated");

			}
		});
}

// function to fetch and feed content from and to the rest api 
function myRequestResponseFunction(method_str, url_str, body_obj = {hello: 'world'}, headers_obj = {'TOKEN': ''}, callBackFunction) {
	// for GET or DELETE method no need of a body
	if (method_str == 'GET' || method_str == 'DELETE') {
		var fetchParams = {
			method: method_str
			,headers: headers_obj
		}
	}
	else if (method_str == 'POST') {
		var fetchParams = {
			method: method_str
			,body: body_obj
			,headers: headers_obj
		}
	}
	fetch(url_str, fetchParams
	)
	.catch(error => console.error('Error:', error))
	.then(function(response) {
		return response.json(); 
	})
	.then(function(data) {
		callBackFunction(data);
	});
}
