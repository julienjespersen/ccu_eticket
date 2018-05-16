function db_synchro(data) {
    
    var db = new Dexie("eticket");
    db.version(1).stores({
        tickets: 'id_ticket'
    });

    db.tickets.bulkPut(data.data).then(function(lastKey) {
        console.log('done: ' + lastKey); 
    }).catch(Dexie.BulkError, function (e) {
        console.error ('error while injecting into db');
    });




    // db.tickets.bulkPut(data).then(function(lastKey) {
    //     console.log("Done putting 100,000 raindrops all over the place");
    //     console.log("Last raindrop's id was: " + lastKey); // Will be 100000.
    // }).catch(Dexie.BulkError, function (e) {
    //     // Explicitely catching the bulkAdd() operation makes those successful
    //     // additions commit despite that there were errors.
    //     console.error ("Some raindrops did not succeed. However, " +
    //        100-e.failures.length + " raindrops was added successfully");
    // });
          
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
