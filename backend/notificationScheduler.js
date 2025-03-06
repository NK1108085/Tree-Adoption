// Ensure you've installed node-cron and twilio: npm install node-cron twilio
const cron = require("node-cron");
const twilio = require("twilio");
const mongoose = require("mongoose");
const User = require("./models/User"); // Adjust the path as needed
const Plantation = require("./models/Plantation"); // Your plantation model

const accountSid = process.env.TWILIO_ACCOUNT_SID; 
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER; 

const client = twilio(accountSid, authToken);

// Array of friendly, lightly funny messages for users who have planted at least one tree
const messages = [
  "Hey, water your plant. It's thirsty like you are after a long day!",
  "Your plant just texted me saying 'Hey buddy, water me!'",
  "Don't let your plant wilt, give it some water and love!",
  "Yo, it's plant watering time! Quench that green buddy's thirst!",
  "Hey superstar, your plant needs a sip of water. Cheers to growth!",
  "Water your plant and make it greener than your neighbor's envy!",
  "Your plant is counting on you! Give it some water before it throws a tantrum.",
  "Just a reminder: water your plant, because even plants need hydration.",
  "Hey, water your plant! It’s not a cactus – it actually needs some love.",
  "Your plant called – it's desperate for water. Don't let it down!",
  "Thirsty plant alert! Water it now and earn some green points.",
  "Hey, don't forget to water your plant. It wants to grow tall like you!",
  "Give your plant a drink – hydration is key for a happy green friend.",
  "Your plant is looking a bit parched. Time to water and watch it thrive!",
  "A little water goes a long way. Nourish your plant today!",
  "H2O to your plant now, so it can be the envy of every leaf around!",
  "It's watering time! Your plant deserves a refreshing treat.",
  "Remember: water your plant and enjoy the shade of a greener future.",
  "Hey friend, your plant misses you. Water it and share some love!",
  "Quick! Water your plant before it decides to go on a drought strike!"
];

// Array of messages for users who haven't planted any trees yet
const messagesNoPlantation = [
  "Hey, looks like you haven't planted any trees yet. Time to green up your life!",
  "Your garden's waiting – plant a tree and start your green journey today!",
  "Zero trees so far? Let's change that – plant one and watch the magic happen!",
  "Don't let your future be barren. Plant a tree and make a difference!",
  "Time to get your hands dirty! Plant a tree and leave a lasting legacy."
];

// Dummy function to fetch users from DB (replace with your actual DB call)
const getUsersFromDB = async () => {
  // This example uses Mongoose to fetch all users with role "user"
  return await User.find({ role: "user" });
};

// Function to fetch plantations for a specific user
const getPlantationsForUser = async (userId) => {
  return await Plantation.find({ user: userId });
};

/**
 * Start a notification scheduler that runs every `intervalSeconds`.
 * For each user:
 *   - If they have 0 plantations, use messagesNoPlantation.
 *   - Else, use the normal messages.
 */
const startNotificationScheduler = (intervalSeconds) => {
  setInterval(async () => {
    try {
      const users = await getUsersFromDB();
      // Use for...of so we can await inside the loop
      for (const user of users) {
        if (!user.phoneNumber) {
          console.log(`Skipping user ${user.email} because phoneNumber is missing.`);
          continue;
        }
        
        // Get plantations for the user
        const userPlantations = await getPlantationsForUser(user._id);
        let chosenMessage;
        if (userPlantations.length === 0) {
          // Use the no-plantation messages if the user hasn't planted any trees
          chosenMessage = messagesNoPlantation[Math.floor(Math.random() * messagesNoPlantation.length)];
        } else {
          // Use the normal messages if the user has at least one plantation
          chosenMessage = messages[Math.floor(Math.random() * messages.length)];
        }
        
        const personalizedMessage = `Hi ${user.name}, ${chosenMessage}`;
        
        try {
          const msg = await client.messages.create({
            body: personalizedMessage,
            from: twilioPhone,
            to: user.phoneNumber,
          });
          console.log(`Notification sent to ${user.email}: ${msg.sid}`);
        } catch (err) {
          console.error("Twilio error:", err);
        }
      }
    } catch (error) {
      console.error("Error sending notifications:", error);
    }
  }, intervalSeconds * 1000);
};

// Start the scheduler with an interval of 1800 seconds (i.e. every 30 minutes)
startNotificationScheduler(1800);