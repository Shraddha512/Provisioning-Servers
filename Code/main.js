var needle = require("needle");
var os   = require("os");

var config = {};
//Dummy Value
config.token = "123456789";

var headers =
{
	'Content-Type':'application/json',
	Authorization: 'Bearer ' + config.token
};

// Documentation for needle:
// https://github.com/tomas/needle
var dropletId;
var client =
{
	listRegions: function( onResponse )
	{
		needle.get("https://api.digitalocean.com/v2/regions", {headers:headers}, onResponse)
	},
    listImages: function( onResponse )
    {
        needle.get("https://api.digitalocean.com/v2/images", {headers:headers}, onResponse)
    },
    listDetails: function(dropletId,onResponse )
    {
        needle.get("https://api.digitalocean.com/v2/droplets/"+dropletId, {headers:headers}, onResponse)
    },
		listKeys: function( onResponse )
		{
				needle.get("https://api.digitalocean.com/v2/account/keys", {headers:headers}, onResponse)
		},

	createDroplet: function (dropletName, region, imageName, onResponse)
	{
		var data =
		{
			"name": dropletName,
			"region":region,
			"size":"512mb",
			"image":imageName,
			// Id to ssh_key already associated with account.
			"ssh_keys":[1267031],
			//"ssh_keys":null,
			"backups":false,
			"ipv6":false,
			"user_data":null,
			"private_networking":null
		};

		console.log("Attempting to create: "+ JSON.stringify(data) );

		needle.post("https://api.digitalocean.com/v2/droplets", data, {headers:headers,json:true}, onResponse );
	}
};
// Generating key
//var dropletId = "7332730 ";

/*
client.listKeys(function(error, response)
{
	var data = response.body;
	//console.log( JSON.stringify(response.body) );

	if( response.headers )
	{
		console.log( "Calls remaining", response.headers["ratelimit-remaining"] );
	}

	if( data.ssh_keys )
	{

          console.log("id", data.ssh_keys[0].id );

	}
});
*/
// #############################################
// #1 Print out a list of available regions
// Comment out when completed.
// https://developers.digitalocean.com/#list-all-regions
// use 'slug' property
/*
client.listRegions(function(error, response)
{
	var data = response.body;
	//console.log( JSON.stringify(response.body) );

	if( response.headers )
	{
		console.log( "Calls remaining", response.headers["ratelimit-remaining"] );
	}

	if( data.regions )
	{
		for(var i=0; i<data.regions.length; i++)
	{
                    console.log("Data regions:", data.regions[i])
		}
	}
});

*/
// #############################################
// #2 Extend the client object to have a listImages method
// Comment out when completed.
// https://developers.digitalocean.com/#images
// - Print out a list of available system images, that are AVAILABLE in a specified region.
// - use 'slug' property
/*
client.listImages(function(error, response)
{
        var data = response.body;
        //console.log( JSON.stringify(response.body) );

        if( response.headers )
        {
                console.log( "Calls remaining", response.headers["ratelimit-remaining"] );
        }

        if(data.images )
        {
                for(var i=0; i<data.images.length; i++)
                {
                	for(var j=0; j<data.images[i].regions.length; j++)
                	if(data.images[i].regions[j]=='ams1')
                       console.log("Data images:", data.images[i])
                }
        }
});

*/
// #############################################
// #3 Create an droplet with the specified name, region, and image
// Comment out when completed. ONLY RUN ONCE!!!!!
// Write down/copy droplet id.

 var name = "sanaik2"+os.hostname();
 var region = 'nyc1'; // Fill one in from #1
 var image = 'ubuntu-14-04-x64'; // Fill one in from #2
 client.createDroplet(name, region, image, function(err, resp, body)
 {
 	console.log(body);
 	// StatusCode 202 - Means server accepted request.
 	if(!err && resp.statusCode == 202)
 	{
 		console.log( JSON.stringify( body, null, 3 ) );
 	}
		dropletId= body.droplet.id;

		var interval= setInterval(function(){
			client.listDetails(dropletId,function(error, response)
			{
			        var data = response.body;
			        //console.log( JSON.stringify(response.body) );
							if(data.droplet.networks.v4.length>0)
							{
			        console.log("Data networks:", data.droplet.networks.v4[0].ip_address)
							var ipAddress = data.droplet.networks.v4[0].ip_address
							var fs = require('fs');
							fs.writeFile('ansible/inventory', "[droplet]\n node1 ansible_ssh_host="+ipAddress +" ansible_ssh_user=root ansible_ssh_private_key_file=ansible/node/key", function(err){
							    if(err){console.log(err);}
							});
							clearInterval(interval);
							}


			});
		}, 1000);

 });
