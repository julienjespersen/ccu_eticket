var db = new Dexie("eticket");
db.version(1).stores({
    tickets: '++code'
});


function db_synchro(data) {
    

    db.tickets.bulkPut(data.data).then(function(lastKey) {
        console.log('done: ' + lastKey); 
    }).catch(Dexie.BulkError, function (e) {
        console.error ('error while injecting into db');
    });

}

function fetch_record(code) {
    let tmp = db.tickets.get(code);


    db.tickets
    .where('code')
    .equals(code)
    .first()
    .then(function (ticket) {
        console.log(ticket);
    });


    // console.log(tmp);
    if (tmp) {
        return true;
    }
    else {
        return false;
    }
    // return db.tickets.get(code);
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
