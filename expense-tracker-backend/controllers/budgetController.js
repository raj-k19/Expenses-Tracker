const Budget = require("../models/Budget.js");
const Transaction = require("../models/Transaction.js");

// ➤ Set or Update Budget
exports.setBudget = async (req, res) => {
    try {
        const { monthlyLimit } = req.body;

        let budget = await Budget.findOne({ user: req.user._id });

        if (budget) {
            budget.monthlyLimit = monthlyLimit;
            await budget.save();
        } else {
            budget = await Budget.create({
                user: req.user._id,
                monthlyLimit
            });
        }

        res.json(budget);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ➤ Get Dashboard Summary
exports.getSummary = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user._id });

        const income = transactions
            .filter(t => t.type === "income")
            .reduce((acc, curr) => acc + curr.amount, 0);

        const expense = transactions
            .filter(t => t.type === "expense")
            .reduce((acc, curr) => acc + curr.amount, 0);

        const budget = await Budget.findOne({ user: req.user._id });

        const remainingBudget = budget ? budget.monthlyLimit - expense : null;

        res.json({
            totalIncome: income,
            totalExpense: expense,
            balance: income - expense,
            monthlyBudget: budget ? budget.monthlyLimit : null,
            remainingBudget
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};