#  PharmaTrack

A comprehensive, multi-branch pharmacy inventory and sales management system built with Node.js, Express, and MySQL. PharmaTrack streamlines pharmacy operations by providing real-time insights, automated alerts, and seamless point-of-sale transactions.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)

## ✨ Key Features

- **Role-Based Authentication:** Secure login portals tailored for both Admin and Staff users.
- **Real-Time Dashboard Stats:** Instant overview of total medicines, batches, branches, suppliers, and sales.
- **Automated Expiry Alerts:** Proactively flags batches expiring within the next 90 days to prevent financial losses.
- **Low Stock Monitoring:** Automatically compares current batch quantities against minimum stock thresholds and highlights items needing restock.
- **Comprehensive Record Management:** Full CRUD operations for Medicines, Batches, Branches, and Suppliers.
- **Point of Sale (POS):** Dedicated sales recording that links sold quantities directly to specific batch IDs for accurate, automated inventory deduction.

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MySQL (via `mysql2`)
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **API Testing/Communication:** RESTful API architecture

##  Prerequisites

Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v14.0.0 or higher)
- [MySQL Server](https://dev.mysql.com/downloads/) or a local stack like [XAMPP](https://www.apachefriends.org/) / [WAMP](https://www.wampserver.com/)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/pharma-track.git
cd pharma-track
