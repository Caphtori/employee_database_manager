INSERT INTO department (name)
VALUES  ("Accounting"),
        ("Legal"),
        ("Sales"),
        ("Executive");

INSERT INTO role(title, salary, dept_id)
VALUES  ("Accountant", 120000.00, 1),
        ("Payroll Manager", 100000.00, 1),
        ("Head Counsel", 450000.00, 2),
        ("General Counsel", 110000.00, 2),
        ("Sales Director", 300000.00, 3),
        ("Account Manager", 85000.00, 3),
        ("Chief Executive Officer", 5000000.00, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES  ("Joe", "Smith", 7, NULL),
        ("Gus", "Gussman", 2, 1),
        ("Bill", "Johnson", 1, 2),
        ("Sally", "Salsbury", 3, 1),
        ("Mike", "Michaelson", 4, 4),
        ("Pip", "Humbug", 5, 1),
        ("Derek", "Jeter", 6, 6);