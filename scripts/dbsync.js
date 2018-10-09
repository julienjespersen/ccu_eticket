var db = new Dexie("eticket");
db.version(1).stores({
	tickets: 'code, id_ticket',
	events: 'id_prestation'
});
db.open().catch(function (e) {
    console.error("Open failed: " + e.stack);
})


function db_synchro_events(data) {
    db.events.clear();
	// updateAttendeeList();

    db.events.bulkPut(data.data).then(function(lastKey) {
        console.log('done: ' + lastKey); 
    }).catch(Dexie.BulkError, function (e) {
        console.error ('error while injecting into db');
	})
	.then(function(){
		console.log('date_remote_update: ' + date_update.toISOString());
		localStorage.setItem('date_remote_update', date_update.toISOString());
		add_to_log('feed response @ ' + date_update.toISOString(), 'cloud_download');
		// updateAttendeeList();
	});
	
}



function db_synchro(data) {
	let new_date = new Date();
    // db.tickets.clear();
	// updateAttendeeList();
	// data.data.forEach(function(ticket) {
	// 	console.log('id t from db' + ticket.id_ticket);
	// 	db.tickets
	// 	.where('id_ticket')
	// 	.notEquals(ticket.id_ticket)
	// 	.first()
	// 	.then(
	// 		console.log('elle y est')
	// 		if() {

	// 		}
	// 	)
	//   });




    db.tickets.bulkPut(data.data).then(function(lastKey) {
        console.log('done: ' + lastKey); 
    }).catch(Dexie.BulkError, function (e) {
        console.error ('error while injecting into db');
	})
	.then(function(){
		// console.log('date_remote_update: ' + date_update.toISOString());
		localStorage.setItem('date_remote_update', date_update.toISOString());
		add_to_log('last update @ ' + new_date.toISOString(), 'cloud_download');
		add_to_log('remote date is ' + date_update.toISOString(), 'cloud_download');
		// updateAttendeeList();
	});
}

function count_record(code) {
	db.tickets.where('code').equals(code).count(after_count);
}
function show_info(code) {
	db.tickets
	.where('code')
	.equals(code)
	.first()
	.then(after_show);
}

function fetch_reccord() {
	db.tickets
	.where('code')
	.equals(code)
	.first()
	.then(after_fetch);
}
function clear_tickets() {
	db.tickets
	  .clear()
	  .then(
		updateAttendeeList(),
		add_to_log('All ticket deleted from local storage @ ' + date_update.toISOString(), 'delete')
	  );
}



function db_sort_count(callBackFunction) {

	let page = db.tickets
	.orderBy('id_ticket')
	.toArray();

	add_to_log('array: ' + page);

	// db.tickets.sortBy('id_ticket', friend => add_to_log('count: ' + friend));
	// db.tickets.orderBy('id_ticket');
	db.tickets.count(friend => add_to_log('count: ' + friend));
}





function post_all_reccords() {
	if (id_event > 0) {
		add_to_log('post and get request: ' + domainUrl + 'eticket/tickets/', 'link');
		db.tickets
		.toArray(function (array) {
			// var js_arr = [1,2,3,4];
			// myRequestResponseFunction('POST', domainUrl + 'eticket/tickets/' + id_event, {abc: 'test2'}, {TOKEN: token}, AfterFetchAllReccords);
			postData(domainUrl + 'eticket/tickets/', {tickets_from_client: array})
			.catch(error => console.error(error))
			.then(data => db_synchro(data)) // JSON-string from `response.json()` call
		
		});
	}
	else {
		add_to_log('no event ID', 'error');
	}
}

function update_reccord(reccord_obj) {
	let new_count = reccord_obj.count_stub + 1;
	// let new_date = '2018-05-18 15:00:00';
	let today = new Date();
	let new_date = today.toISOString().slice(0,10) + ' ' + today.toISOString().slice(11,19);
	
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
function myRequestResponseFunction(method_str, url_str, body_obj = {hello: 'world'}, headers_obj = {'TOKEN': 'hello from header'}, callBackFunction) {
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
		// if (response.ok) {
		// 	return response.json(); 
		// }
		// else {
		// 	return response.headers;
		// }
		// return response; 
	})
	// .then(function(data) {
	// 	callBackFunction(data);
	.then(function(response) {
		callBackFunction(response);
	});
}

function postData(url = ``, data = {}) {
		token = localStorage.getItem('token');
	// Default options are marked with *
	  return fetch(url, {
		  method: "POST", // *GET, POST, PUT, DELETE, etc.
		  mode: "cors", // no-cors, cors, *same-origin
		  cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
		//   credentials: "same-origin", // include, same-origin, *omit
		  headers: {
			  TOKEN: token,
			  "Content-Type": "application/json; charset=utf-8",
			  // "Content-Type": "application/x-www-form-urlencoded",
		  },
		  redirect: "follow", // manual, *follow, error
		  referrer: "no-referrer", // no-referrer, *client
		  body: JSON.stringify(data), // body data type must match "Content-Type" header
	  })
	  .then(response => response.json()); // parses response to JSON
  }
  