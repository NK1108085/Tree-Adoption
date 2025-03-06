const User = require("../models/User");
const Tree = require("../models/Tree");

// Get overall stats
exports.getStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const plantations = await Tree.countDocuments(); // This counts plantations instead of trees
    res.json({ users, plantation: plantations });  // Make sure to return `plantation` instead of `trees`
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Error fetching stats" });
  }
};

// Get all users and populate their plantations (formerly trees)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("trees"); // 'trees' still refers to the Tree model
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
};

// Get all plantations and their associated users
exports.getTrees = async (req, res) => {
  try {
    const plantations = await Tree.find().populate("user", "name email"); // Fetch plantations instead of trees
    res.json(plantations);  // Send plantations instead of trees
  } catch (error) {
    console.error("Error fetching plantations:", error);
    res.status(500).json({ error: "Error fetching plantations" });
  }
};

// Generate a report with user and plantation data
exports.generateReport = async (req, res) => {
  try {
    const users = await User.find().populate("trees"); // Fetch users with plantations (trees)

    const report = users.map(user => ({
      name: user.name,
      email: user.email,
      plantationsPlanted: user.trees.length, // Count the plantations
      points: user.points,
      plantations: user.trees.map(tree => ({
        treeName: tree.name,  // Update to reflect the correct field
        location: tree.location,
        plantedAt: tree.createdAt,
        stage: tree.growthStage, // Update the field name
        completed: tree.completed  // Ensure the 'completed' field exists in your schema
      }))
    }));

    res.json(report);
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Error generating report" });
  }
};


exports.redeemPoints = async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ email });

    if (!user || user.points <= 0) {
      return res.status(400).json({ success: false, message: "Invalid user or no points to redeem." });
    }

    user.points = 0; // Reset points after redeeming
    await user.save();

    res.json({ success: true, message: "Points redeemed successfully!" });
  } catch (error) {
    console.error("Redeem error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};
