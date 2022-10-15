/*********************************************************************************
 *  WEB322 – Assignment 03
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part
 *  of this assignment has been copied manually or electronically from any other source
 *  (including 3rd party web sites) or distributed to other students.
 *
 *  Name: Yujin Kim / Student ID: ykim296 / Date: 2022 Sep 29
 *
 *  Online (Cyclic) Link:
 *
 ********************************************************************************/

var HTTP_PORT = process.env.PORT || 8080;

var express = require("express");
var multer = require("multer");
var app = express();
const path = require("path");
const fs = require("fs");
const dataService = require("./data-service.js");

function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage: storage });

// Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/home.html"));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get("/students", (req, res) => {
    if (req.query.status) {
        const status = req.query.status;
        dataService
            .getStudentsByStatus(status)
            .then((data) => {
                res.json(data);
            })
            .catch((err) => {
                res.json(err);
            });
    } else if (req.query.program) {
        const program = req.query.program;
        dataService
            .getStudentsByProgramCode(program)
            .then((data) => {
                res.json(data);
            })
            .catch((err) => {
                res.json(err);
            });
    } else if (req.query.credential) {
        const credential = req.query.credential;
        dataService
            .getStudentsByExpectedCredential(credential)
            .then((data) => {
                res.json(data);
            })
            .catch((err) => {
                res.json(err);
            });
    } else {
        dataService
            .getAllstudents()
            .then((data) => {
                res.json(data);
            })
            .catch((err) => {
                res.json(err);
            });
    }
});
app.get("/student/:value", function (req, res) {
    var sid = req.params.value;
    dataService
        .getStudentById(sid)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.json(err);
        });
});

app.post("/students/add", (req, res) => {
    console.log("here!");
    dataService
        .addStudent(req.body)
        .then(() => {
            res.redirect("/students");
        })
        .catch((err) => {
            console.log("Error: ", err);
        });
});

app.get("/students/add", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/addStudent.html"));
});

app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
});

app.get("/images/add", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/addImage.html"));
});

app.get("/images", (req, res) => {
    const images = [];
    fs.readdir("./public/images/uploaded", function (err, items) {
        images.push(items);
        res.json({ images });
    });
});

app.get("/intlstudents", (req, res) => {
    dataService
        .getInternationalStudents()
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.send(err);
        });
});

app.get("/programs", (req, res) => {
    dataService
        .getPrograms()
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.send(err);
        });
});

app.use((req, res) => {
    res.status(404).send("<h2>404</h2><p>Page Not Found</p>");
});

dataService
    .initialize()
    .then(() => {
        app.listen(HTTP_PORT, onHttpStart);
    })
    .catch((err) => {
        console.log("Error: ", err);
    });
