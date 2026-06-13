const express = require("express");
const router = express.Router();
const Salary = require("../model/Salary");//import salary model
const EmployeeManager = require("../model/users");//import users model

// Create Salary
router.post("/", async (req, res) => {
  try {
    const { employee, baseSalary, bonus, month } = req.body;

    if (!employee || !baseSalary || !month) {
      return res.status(400).json({ message: "Employee, baseSalary, and month are required" });
    }

    const emp = await EmployeeManager.findById(employee);
    if (!emp) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const totalSalary = baseSalary + (bonus || 0);

    const salary = new Salary({
      employee,
      baseSalary,
      bonus,
      month,
      totalSalary,
    });

    await salary.save();
    res.status(201).json({ message: "Salary added successfully", salary });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//get all salary
router.get("/", async (req, res) => {
  try {
    const salaries = await Salary.find()
      .populate("employee", "adminName email role");
    res.json(salaries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one Salary
router.get("/:id", async (req, res) => {
  try {
    const salary = await Salary.findById(req.params.id)
      .populate("employee", "adminName email role");
    if (!salary) return res.status(404).json({ message: "Salary not found" });
    res.json(salary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




// Update Salary
router.put("/:id", async (req, res) => {
  try {
    const { baseSalary, bonus, month } = req.body;
    const salary = await Salary.findById(req.params.id);
    if (!salary) return res.status(404).json({ message: "Salary not found" });

    salary.baseSalary = baseSalary ?? salary.baseSalary;
    salary.bonus = bonus ?? salary.bonus;
    salary.month = month ?? salary.month;
    salary.totalSalary = salary.baseSalary + (salary.bonus || 0);

    await salary.save();
    res.json({ message: "Salary updated successfully", salary });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete Salary
router.delete("/:id", async (req, res) => {
  try {
    const salary = await Salary.findByIdAndDelete(req.params.id);
    if (!salary) return res.status(404).json({ message: "Salary not found" });
    res.json({ message: "Salary deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
