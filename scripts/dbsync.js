var db = new Dexie("eticket");
db.version(1).stores({
    tickets: '++code, count_stub'
});


function db_synchro(data) {
    

    db.tickets.bulkPut(data.data).then(function(lastKey) {
        console.log('done: ' + lastKey); 
    }).catch(Dexie.BulkError, function (e) {
        console.error ('error while injecting into db');
    });
	localStorage.setItem('date_remote_update', date_update.toISOString());
	console.log('date_remote_update: ' + date_update.toISOString());
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
	db.tickets
	.update(code, {
		count_stub: new_count
		,date_stub: '2018-05-18 15:00:00'
	}).then(function (updated) {
		if (updated) {
		  console.log ("reccord updated");
		  after_update();
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
