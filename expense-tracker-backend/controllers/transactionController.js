const Transaction = require("../models/Transaction");

// ➤ Add Transaction
exports.addTransaction = async (req, res) => {
    try {
      const { type, amount, category } = req.body;
  
      const transaction = new Transaction({
        user: req.user._id,  // 🔥 VERY IMPORTANT
        type,
        amount,
        category,
        date: new Date()
      });
  
      const savedTransaction = await transaction.save();
      res.status(201).json(savedTransaction);
  
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

// ➤ Get All Transactions of Logged User
exports.getTransactions = async (req, res) => {
    try {
      const transactions = await Transaction.find({
        user: req.user._id
      }).sort({ date: -1 });
  
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

// ➤ Delete Transaction
exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        if (transaction.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized" });
        }

        await transaction.deleteOne();

        res.json({ message: "Transaction deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};