medex
=====

An attempt to digitize the paper Medex workflow.

The problem
-----------
When a patient is sick, he has to fill in a paper form with some data. When he's at the doctor for the diagnosis, the doctor has to fill in some other data and sign the form. The patient then has to send the paper form by postal mail to a medical center.

Installation
------------
This is a node.js project using MongoDB for storage.

1. Do a `git clone https://github.com/stevenbeeckman/medex.git` in the folder where you want this project to appear. A new directory called `medex` will be created, wherein the above repository will be cloned.

2. Then, do `cd medex' and `npm install` to install the required packages.

3. Open another terminal and start your local MongoDB server.

4. Run `node app.js` and visit `http://localhost:3000/`.