var db = new Dexie("test");
db.version(1).stores({
    raindrops: 'id,position'
});
var drops = [];
for (var i=0;i<100;++i) {
    drops.push({id: i, position: [Math.random(),Math.random(),Math.random()]});
}
db.raindrops.bulkPut(drops).then(function(lastKey) {
    console.log("Done putting 100,000 raindrops all over the place");
    console.log("Last raindrop's id was: " + lastKey); // Will be 100000.
}).catch(Dexie.BulkError, function (e) {
    // Explicitely catching the bulkAdd() operation makes those successful
    // additions commit despite that there were errors.
    console.error ("Some raindrops did not succeed. However, " +
       100-e.failures.length + " raindrops was added successfully");
});

//
          // Define your database
          //
          var db = new Dexie("ccu_db");
          db.version(1).stores({
              tickets: '++id,code'
          });

          //
          // Put some fake data into it
          //
          db.tickets.put(
              {code: 'abcdef', date_stub: '2018-10-10T00:00:00Z'}
            )
            .then(function (ticket) {
                console.log(ticket);
            })
            .catch(function(error) {
                alert('Ooops!' + error);
            });

