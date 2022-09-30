const fs = require("fs");

var students = [];
var programs = [];

module.exports.initialize = () => {
    return new Promise((resolve, reject) => {
        try {
            fs.readFile("./data/students.json", "utf8", (err, data) => {
                if (err) {
                    throw err;
                }
                students = JSON.parse(data);
            });
            fs.readFile("./data/programs.json", "utf8", (err, data) => {
                if (err) {
                    throw err;
                }
                programs = JSON.parse(data);
            });
        } catch (err) {
            reject("Unable to read file");
        }

        resolve();
    });
};

module.exports.getAllstudents = () => {
    return new Promise((resolve, reject) => {
        if (students.length == 0) {
            reject("no results returned");
            return;
        }
        resolve(students);
    });
};

module.exports.getInternationalStudents = () => {
    return new Promise((resolve, reject) => {
        const allIntStudents = students.filter(
            (stu) => stu.isInternationalStudent === true
        );
        if (allIntStudents.length == 0) {
            reject("no results returned");
            return;
        }
        resolve(allIntStudents);
    });
};

module.exports.getPrograms = () => {
    return new Promise((resolve, reject) => {
        if (programs.length == 0) {
            reject("no results returned");
            return;
        }
        resolve(programs);
    });
};
