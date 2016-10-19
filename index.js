var express = require('express');
var app = express();
var unirest = require('unirest');
var Docker = require('dockerode');

app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({ extended: true }));

var templateUrl = 'http://%%:3000';
var docker = new Docker({
  host:'172.16.217.132', //TODO <-- replace this
  port:'12375' //TODO <-- weave ip address
});


app.post('/',function(req,res) {
  var targetUrl = templateUrl.replace('%%',req.query.functionName);
  unirest.post(targetUrl)
  .timeout(500)
  .send(req.body)
  .end(function(response) {
    console.log(response.error == undefined);
    if (response.error != undefined) {
      docker.listContainers({'all':true},function(err,containers) {
        containers.forEach(function(containerInfo) {
          var containerName = containerInfo.Names[0].substring(1);
          if (containerName == req.query.functionName) {
            //this is the one --> start it
            docker.getContainer(containerInfo.Id).start(function(err,data) {
              //wait 5 seconds and hit it again --> arbitrary five minues
              setTimeout(function() {
                unirest.post(targetUrl).send().end(function(resp) {
                  // return res.send(resp.body);
                  res.send(resp.body);
                  //shutdown the container
                  docker.getContainer(containerInfo.Id).stop(function(err,data) {
                    return;
                  });
                });
              },3000);
            });
          }//end if
        });
      });
    } else {
      return res.send(response.body);
    }//end if
  });
});


app.listen(80);
