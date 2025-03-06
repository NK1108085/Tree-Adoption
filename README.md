# 🌳 Tree Adoption Project

## 📌 Overview
The **Tree Adoption Project** is a web-based platform that encourages users to plant and adopt trees. Users can upload images of their planted trees, track their locations, and earn points for verified tree plantations. These points can be redeemed for discounts on government taxes and water bills.

## 🚀 Features
- 📸 Upload tree images with location tracking
- 🏆 Earn points for verified tree plantations
- 📍 View planted tree locations
- 🔄 Redeem points for government incentives
- 🛠 Admin dashboard for managing users and plantations
- 🎫 QR code generation for point redemption
- 📷 QR scanner for government park ticket discounts

## 🏗 Tech Stack
### Frontend
- React (JSX)
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MongoDB (Database: `plantApp`)

### Authentication
- Custom authentication (different collection than `users` to avoid conflicts with another project)

## 📂 Project Structure
/tree-adoption-project
│── /client                # React frontend
│── /server                # Node.js & Express backend
│── /models                # MongoDB models
│── /routes                # API routes
│── /controllers           # Logic for API endpoints
│── package.json           # Dependencies & scripts
│── README.md              # Project documentation


## 🎯 How It Works
1. **User Registration & Login**
   - Users sign up and log in to upload tree images.
2. **Tree Upload & Verification**
   - Users submit images with tree details and locations.
   - Admin verifies and assigns points.
3. **Points & Redemption**
   - Users earn points for verified plantations.
   - Points can be redeemed for tax and park discounts via QR codes.
4. **Admin Dashboard**
   - Admins manage plantations and user data.
   - Government authorities log in to approve tax discounts.
   - Park authorities scan QR codes for discount validation.

## 🔧 Installation & Setup
1. **Clone the repository**
   ```sh
   git clone https://github.com/yourusername/tree-adoption-project.git
   cd tree-adoption-project
2.Install dependencies
    # Backend
     cd server
     npm install

  # Frontend
    cd ../client
    npm install

🎟 QR Code & Scanner Integration
QR Code Generation: Users receive a downloadable QR code containing their name, email, points, and location.
QR Scanner: Government park authorities scan the QR code using a react-webcam based scanner for point redemption.
🤝 Contributing
We welcome contributions! To contribute:

Fork the repository.
Create a new branch: git checkout -b feature-branch
Commit your changes: git commit -m "Add new feature"
Push to the branch: git push origin feature-branch
Open a pull request.
📜 License
This project is licensed under the MIT License.
