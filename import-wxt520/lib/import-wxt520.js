/*
* import-wxt520
* https://github.com/52North/ConnectinGEO
*
* Copyright (c) 2016 matthesrieke
* Licensed under the MIT license.
*/

'use strict';

var asyncd = require('async');
var request = require('request-promise');
var moment = require('moment');

var insertTemplate = require('./insert-template.json');
var batchTemplate = require('./batch-template.json');

var doImport = function(config) {
  var requestList = [];

  asyncd.eachLimit(config.series, 1, function(ser, done) {
    var target = ser.dataUrl+'&timespan='+encodeURIComponent(config.timePeriod);
    console.info(ser.observedProperty+': '+target);

    request(target).then(function (response) {
      var data = JSON.parse(response);

      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          for (var i = 0; i < data[key].values.length; i++) {
            var dateTime = moment(data[key].values[i][0]);
            var val = data[key].values[i][1];

            var template = JSON.parse(JSON.stringify(insertTemplate));
            template.offering = config.procedure;
            // template.observation[0].identifier.value = config.procedure+'/'+ser.observedProperty+'/1';
            template.observation[0].procedure = config.procedure;
            template.observation[0].observedProperty = ser.observedProperty;
            template.observation[0].featureOfInterest.identifier.value = config.procedure;
            template.observation[0].featureOfInterest.name[0].value = config.procedure;
            template.observation[0].featureOfInterest.sampledFeature = ['http://www.opengis.net/def/nil/OGC/0/unknown'];
            template.observation[0].featureOfInterest.geometry.coordinate = config.coordinates;
            template.observation[0].phenomenonTime = dateTime.toISOString();
            template.observation[0].resultTime = dateTime.toISOString();
            template.observation[0].result = {
              'uom': ser.uom,
              'value': val
            };

            requestList.push(template);

          }
        }
      }

      console.info('total count: '+requestList.length);
      done();
    }).catch(function (err) {
      console.warn(err);
      done();
    });

  }, function(err) {
    console.info('Pushing to SOS!');
    if (err) {
      console.warn(err);
      return;
    }

    //now we have all requests set up, do the post
    batchTemplate.requests = requestList;
    var options = {
      method: 'POST',
      uri: 'http://localhost:8080/52n-sos-webapp/service',
      body: batchTemplate,
      json: true
    };

    request(options)
    .then(function (sosResp) {
      console.info("worked!");
    })
    .catch(function (err) {
      console.error(JSON.stringify(err, null, 4));
    });

    // console.info(JSON.stringify(batchTemplate, null, 4));

  });


};


exports.doImport = doImport;
