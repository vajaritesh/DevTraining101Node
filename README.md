DocuSign Dev Training 101 - Node.js
================================

This is a sample Node.js project to be used with developer training through the DocuSign University.  
To get started go to <a href="http://www.docusign.com/devcenter">http://www.docusign.com/devcenter</a> and get
a free development account.  After you get an account and generate an Integrator Key (App Key) 
you will be able to make test web service calls.  To generate your Integrator Key login to your developer 
account at demo.docusign.net and go to Preferences -> API page.

This project contains a simple web app that we will use during the API training workshop.  Its purpose is to help
you get going with the DocuSign API, understand and implement the first API calls you should be making (i.e. the Login
API call), and sign an envelope using the Embedded Signing functionality. 


Library Configuration
-------------------------

TODO


System Requirements
-------------------------

This sample project has been tested using `Node v0.10.21`


Important Terms
-------------------------

`Integrator Key`: Identifies a single integration. Every API 
request includes the Integrator Key and a 
username/password combination

`Envelope`: Just like a normal Postal Envelope.It contains 
things like Documents, Recipients, and Tabs

`Document`: The PDF, Doc, Image, or other item you want 
signed. If it is not a PDF, you must include the File 
Extension in the API call

`Tab`: Tied to a position on a Document and defines what 
happens there. For example, you have a SignHere Tab 
wherever you want a Recipient to sign

`Recipient`: The person you want to send the Envelope 
to. Requires a UserName and Email

`Captive Recipient`: Recipient signs in an iframe on your 
website instead of receving an email.  Captive recipients have the
clientUserId property set.

`PowerForm`: A pre-created Envelope that you can launch
instead of writing server-side code

Rate Limits
-------------------------

Please note: Applications are not allowed to poll for envelope status more
than once every 15 minutes and we discourage integrators from continuously
retrieving status on envelopes that are in a terminal state (Completed, 
Declined, and Voided).  Excessive polling will result in your API access 
being revoked.  
If you need immediate notification of envelope events we encourage you to 
review envelope events or use our Connect Publisher technology, DocuSign 
Connect as an alternative.

More Information
-------------------------

Professional Services is also available to help define and implement your
project fast. 

You can also find a lot of answered questions on StackOverflow, search for tag `DocuSignApi`:
http://stackoverflow.com/questions/tagged/docusignapi
