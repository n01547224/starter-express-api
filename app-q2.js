var express = require('express');
var mongoose = require('mongoose');
var app = express();
var database = require('./config/database');
var bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

app.engine('.hbs', exphbs.engine({
    extname: '.hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}));

app.set('view engine', 'hbs');

var port = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({ 'extended': 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

function createInvoiceData(requestBody) {
    return {
        "Invoice ID": requestBody.invoiceID,
        "Branch": requestBody.branch,
        "City": requestBody.city,
        "Customer type": requestBody.customerType,
        "Product line": requestBody.productLine,
        "name": requestBody.name,
        "image": requestBody.image,
        "Unit price": requestBody.unitPrice,
        "Quantity": requestBody.quantity,
        "Tax 5%": requestBody.tax,
        "Total": requestBody.total,
        "Date": requestBody.date,
        "Time": requestBody.time,
        "Payment": requestBody.payment,
        "cogs": requestBody.cogs,
        "gross income": requestBody.grossIncome,
        "Rating": requestBody.rating
    };
}
mongoose.connect(database.url);

var Invoice = require('./models/invoice');

//get all employee data from db
app.get('/api/invoice', function (req, res) {
    // use mongoose to get all todos in the database
    Invoice.find(function (err, invoices) {
        if (err)
            res.send(err)
        //res.json(invoices);
        res.render('index', {invoices});
    });
});

app.get('/api/invoice/:invoiceId', function (req, res) {
    let id = req.params.invoiceId;
    Invoice.findById(id, function (err, invoice) {
        if (err) {
            console.error('Error:', err);
            res.status(500).send('Internal Server Error');
        } else {
            if (invoice) {
                res.json(invoice);
            } else {
                res.status(404).send('Invoice not found');
            }
        }
    });
});

// create invoice and send back all employees after creation
app.post('/api/invoice', function (req, res) {
    // create mongoose method to create a new record into the collection
    console.log(req.body);
    const data = createInvoiceData(req.body);
    Invoice.create(data, function (err, invoice) {
        if (err)
            res.send(err);
        // get and return all the invoices after a newly created record
        Invoice.find(function (err, invoices) {
            if (err)
                res.send(err)
            res.json(invoices);
        });
    });
});

//New Route for handelbars insert for questiion2
app.get('/api/insert/invoice', function (req, res) {
    // create mongoose method to create a new record into the collection
    console.log(req.body);
    const data = createInvoiceData(req.body);
    Invoice.create(data, function (err, invoice) {
        if (err)
            res.send(err);
        // get and return all the invoices after a newly created record
        Invoice.find(function (err, invoices) {
            if (err)
                res.send(err)
            //res.json(invoices);
            res.render('insert', {invoices})
        });
    });
});
// create employee and send back all employees after creation
app.put('/api/invoice/:invoiceID', function (req, res) {
    // create mongose method to update an existing record into collection
    console.log(req.body);

    let id = req.params.invoiceID;

    // save the user
    Invoice.findByIdAndUpdate(id, data, function (err, invoice) {
        if (err) throw err;
        res.send('Successfully! invoice updated - ' + invoice.name);
    });
});

app.delete('/api/invoice/:invoiceID', function (req, res) {
    console.log(req.params.invoiceID);
    let id = req.params.invoiceID;
    Invoice.remove({
        _id: id
    }, function (err) {
        if (err)
            res.send(err);
        else
            res.send('Successfully! Invoice has been Deleted.');
    });
});

app.get('*', function (req, res) {
    res.status(404).render('error'); // Render the error page for 404 (Not Found)
});

app.listen(port);
console.log("App listening on port : " + port);