/**
 * @copyright Copyright (C) DocuSign, Inc.  All rights reserved.
 *
 * This source code is intended only as a supplement to DocuSign SDK
 * and/or on-line documentation.
 *
 * This sample is designed to demonstrate DocuSign features and is not intended
 * for production use. Code and policy for a production application must be
 * developed to meet the specific data and security requirements of the
 * application.
 *
 * THIS CODE AND INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY
 * KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
 * PARTICULAR PURPOSE.
 */

var config = require('../config');

exports.index = function(httpRequest, httpResponse){

    var email = httpRequest.body.email;
    var name = httpRequest.body.name;

    console.log('got email:' + email);
    console.log('got name:' + name);

    var   	async = require("async"),		// async module
        request = require("request"),		// request module
        password = config.password,			// your account password
        integratorKey = config.integrator_key,			// your account Integrator Key (found on Preferences -> API page)
        recipientName = name,			// recipient (signer) name
        templateId = "F35087B4-CE90-4C79-8255-2738DF312926",			// provide valid templateId from a template in your account
        templateRoleName = "Signer1",		// template role that exists on template referenced above
        baseUrl = "",				// we will retrieve this
        envelopeId = "";			// created from step 2

    async.waterfall(
        [
            //////////////////////////////////////////////////////////////////////
            // Step 1 - Login (used to retrieve accountId and baseUrl)
            //////////////////////////////////////////////////////////////////////
            function(next) {
                var url = "https://demo.docusign.net/restapi/v2/login_information";
                var body = "";	// no request body for login api call

                // set request url, method, body, and headers
                var options = initializeRequest(url, "GET", body, config.email, password);

                // send the request...
                request(options, function(err, res, body) {
                    if(!parseResponseBody(err, res, body)) {
                        httpResponse.status(res.status);
                        return;
                    }
                    baseUrl = JSON.parse(body).loginAccounts[0].baseUrl;
                    next(null); // call next function
                });
            },

            //////////////////////////////////////////////////////////////////////
            // Step 2 - Send envelope with one Embedded recipient (using clientUserId property)
            //////////////////////////////////////////////////////////////////////
            function(next) {
                var url = baseUrl + "/envelopes";
                var body = JSON.stringify({
                    "emailSubject": "DocuSign API call - Embedded Sending Example",
                    "templateId": templateId,
                    "templateRoles": [{
                        "email": email,
                        "name": recipientName,
                        "roleName": templateRoleName,
                        "clientUserId": "1001"	// user-configurable
                    }],
                    "status": "sent"
                });

                // set request url, method, body, and headers
                var options = initializeRequest(url, "POST", body, config.email, password);

                // send the request...
                request(options, function(err, res, body) {
                    if(!parseResponseBody(err, res, body)) {
                        httpResponse.status(res.status);
                        return;
                    }
                    // parse the envelopeId value from the response
                    envelopeId = JSON.parse(body).envelopeId;
                    next(null); // call next function
                });
            },

            //////////////////////////////////////////////////////////////////////
            // Step 3 - Get the Embedded Signing View (aka the recipient view)
            //////////////////////////////////////////////////////////////////////
            function(next) {

                var returnUrl = httpRequest.protocol + '://' + httpRequest.get('host') + "/final";

                var url = baseUrl + "/envelopes/" + envelopeId + "/views/recipient";
                var method = "POST";
                var body = JSON.stringify({
                    "returnUrl": returnUrl,
                    "authenticationMethod": "email",
                    "email": email,
                    "userName": recipientName,
                    "clientUserId": "1001",	// must match clientUserId in step 2!
                });

                // set request url, method, body, and headers
                var options = initializeRequest(url, "POST", body, config.email, password);

                // send the request...
                request(options, function(err, res, body) {

                    if(!parseResponseBody(err, res, body)) {
                        httpResponse.status(res.status);
                        return;
                    } else {
                        httpResponse.redirect(JSON.parse(body).url);
                        console.log("\nNavigate to the above URL to start the Embedded Signing workflow...");
                    }
                });
            }
        ]);

//***********************************************************************************************
// --- HELPER FUNCTIONS ---
//***********************************************************************************************
    function initializeRequest(url, method, body, email, password) {
        var options = {
            "method": method,
            "uri": url,
            "body": body,
            "headers": {}
        };
        addRequestHeaders(options, email, password);
        return options;
    }

///////////////////////////////////////////////////////////////////////////////////////////////
    function addRequestHeaders(options, email, password) {
        // JSON formatted authentication header (XML format allowed as well)
        dsAuthHeader = JSON.stringify({
            "Username": email,
            "Password": password,
            "IntegratorKey": integratorKey	// global
        });
        // DocuSign authorization header
        options.headers["X-DocuSign-Authentication"] = dsAuthHeader;
    }

///////////////////////////////////////////////////////////////////////////////////////////////
    function parseResponseBody(err, res, body) {
        console.log("\r\nAPI Call Result: \r\n", JSON.parse(body));
        if( res.statusCode != 200 && res.statusCode != 201)	{ // success statuses
            console.log("Error calling webservice, status is: ", res.statusCode);
            console.log("\r\n", err);
            return false;
        }
        return true;
    }


};