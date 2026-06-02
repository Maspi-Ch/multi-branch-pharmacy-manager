-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 02, 2026 at 07:19 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pharmacy`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `Admin_Id` int(11) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Created_At` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`Admin_Id`, `Name`, `Email`, `Password`, `Created_At`) VALUES
(1, 'Super Admin', 'admin@medicare.com', 'hashed_password_1', '2026-04-27 17:14:15'),
(2, 'Dhaka Manager', 'dhaka.mgr@medicare.com', 'hashed_password_2', '2026-04-27 17:14:15'),
(3, 'Test Admin', 'admin@pharmacy.com', '$2b$10$g8EiViwYhAEIVS.QocVqJ.IbGKOnqgpEaDYXR77wEzaAu.7eTY6AO', '2026-04-28 07:04:52'),
(4, 'Test Admin', 'admin@test.com', '1234', '2026-05-05 07:27:21');

-- --------------------------------------------------------

--
-- Table structure for table `batches`
--

CREATE TABLE `batches` (
  `Batch_Id` int(11) NOT NULL,
  `Branch_Id` int(11) DEFAULT NULL,
  `Medicine_Id` int(11) DEFAULT NULL,
  `Supplier_Id` int(11) DEFAULT NULL,
  `Batch_No` varchar(50) DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL,
  `Unit_Price` decimal(10,2) DEFAULT NULL,
  `Expiry_Date` date DEFAULT NULL,
  `Received_Date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `batches`
--

INSERT INTO `batches` (`Batch_Id`, `Branch_Id`, `Medicine_Id`, `Supplier_Id`, `Batch_No`, `Quantity`, `Unit_Price`, `Expiry_Date`, `Received_Date`) VALUES
(1, 1, 1, 1, 'BATCH-A001', 200, 45.00, '2026-06-01', '2024-07-01'),
(2, 2, 1, 1, 'BATCH-A002', 150, 45.00, '2027-01-01', '2025-02-01'),
(3, 1, 2, 2, 'BATCH-B001', 500, 5.00, '2027-03-01', '2025-04-01'),
(4, 3, 3, 3, 'BATCH-C001', 100, 12.00, '2025-05-15', '2024-12-01'),
(5, 2, 4, 4, 'BATCH-D001', 300, 8.00, '2027-02-01', '2025-03-01'),
(6, 1, 5, 1, 'BATCH-E001', 80, 55.00, '2027-05-01', '2025-06-01'),
(7, 1, 8, 6, 'BATCH-F001', 250, 10.00, '2027-08-01', '2025-09-10'),
(8, 2, 9, 6, 'BATCH-F002', 180, 15.00, '2027-06-01', '2025-07-15'),
(9, 3, 10, 5, 'BATCH-G001', 120, 18.00, '2026-07-01', '2025-08-01'),
(10, 1, 11, 5, 'BATCH-G002', 90, 22.00, '2026-05-20', '2025-06-01'),
(11, 2, 12, 6, 'BATCH-H001', 200, 12.00, '2027-11-01', '2025-12-01'),
(12, 3, 13, 2, 'BATCH-H002', 160, 20.00, '2027-09-01', '2025-10-05'),
(13, 1, 14, 3, 'BATCH-I001', 300, 25.00, '2027-04-01', '2025-05-01'),
(14, 2, 15, 4, 'BATCH-I002', 400, 7.00, '2027-07-01', '2025-08-20'),
(15, 3, 2, 2, 'BATCH-J001', 350, 5.00, '2026-06-15', '2025-07-01'),
(16, 1, 6, 1, 'BATCH-J002', 130, 14.00, '2026-08-01', '2025-09-01');

-- --------------------------------------------------------

--
-- Table structure for table `branches`
--

CREATE TABLE `branches` (
  `Branch_Id` int(11) NOT NULL,
  `Branch_Name` varchar(150) NOT NULL,
  `Location` varchar(255) DEFAULT NULL,
  `Phone` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `branches`
--

INSERT INTO `branches` (`Branch_Id`, `Branch_Name`, `Location`, `Phone`) VALUES
(1, 'MediCare Main Branch', 'Dhaka, Mirpur', '02-111-0001'),
(2, 'MediCare Ctg Branch', 'Chattogram, GEC', '031-222-0002'),
(3, 'MediCare Sylhet Branch', 'Sylhet, Zindabazar', '0821-333-0003');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `Category_Id` int(11) NOT NULL,
  `Category_Name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`Category_Id`, `Category_Name`) VALUES
(1, 'Antibiotic'),
(2, 'Analgesic'),
(3, 'Antacid'),
(4, 'Vitamin'),
(5, 'Antifungal'),
(6, 'Antidiabetic'),
(7, 'Antihistamine'),
(8, 'Antihypertensive');

-- --------------------------------------------------------

--
-- Table structure for table `expiryalerts`
--

CREATE TABLE `expiryalerts` (
  `Alert_Id` int(11) NOT NULL,
  `Batch_Id` int(11) DEFAULT NULL,
  `Alert_Type` varchar(50) DEFAULT NULL,
  `Status` varchar(20) DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expiryalerts`
--

INSERT INTO `expiryalerts` (`Alert_Id`, `Batch_Id`, `Alert_Type`, `Status`) VALUES
(1, 4, 'Critical - Expiring within 30 days', 'Pending'),
(2, 1, 'Warning - Expiring within 90 days', 'Pending'),
(3, 3, 'Info - Expiring within 180 days', 'Resolved'),
(4, 10, 'Critical - Expiring within 30 days', 'Pending'),
(5, 15, 'Warning - Expiring within 90 days', 'Pending'),
(6, 9, 'Warning - Expiring within 90 days', 'Pending'),
(7, 16, 'Info - Expiring within 180 days', 'Pending'),
(8, 2, 'Info - Expiring within 180 days', 'Resolved');

-- --------------------------------------------------------

--
-- Table structure for table `medicines`
--

CREATE TABLE `medicines` (
  `Medicine_Id` int(11) NOT NULL,
  `Category_Id` int(11) DEFAULT NULL,
  `Medicine_Name` varchar(150) DEFAULT NULL,
  `Generic_Name` varchar(150) DEFAULT NULL,
  `Dosage_Form` varchar(50) DEFAULT NULL,
  `Dosage_Strength` varchar(50) DEFAULT NULL,
  `Min_Stock_Threshold` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `medicines`
--

INSERT INTO `medicines` (`Medicine_Id`, `Category_Id`, `Medicine_Name`, `Generic_Name`, `Dosage_Form`, `Dosage_Strength`, `Min_Stock_Threshold`) VALUES
(1, 1, 'Amoxil', 'Amoxicillin', 'Capsule', '500mg', 50),
(2, 2, 'Napa', 'Paracetamol', 'Tablet', '500mg', 100),
(3, 3, 'Seclo', 'Omeprazole', 'Capsule', '20mg', 60),
(4, 4, 'A-Vit', 'Vitamin A', 'Tablet', '5000IU', 80),
(5, 5, 'Flucan', 'Fluconazole', 'Capsule', '150mg', 40),
(6, 4, 'Civit', 'Vitamin C', 'Tablet', '500mg', 70),
(8, 6, 'Diaben', 'Metformin', 'Tablet', '500mg', 80),
(9, 6, 'Gluco-N', 'Glibenclamide', 'Tablet', '5mg', 60),
(10, 7, 'Fexo', 'Fexofenadine', 'Tablet', '120mg', 50),
(11, 7, 'Atarax', 'Hydroxyzine', 'Tablet', '25mg', 40),
(12, 8, 'Amdocal', 'Amlodipine', 'Tablet', '5mg', 70),
(13, 8, 'Losartan', 'Losartan Potassium', 'Tablet', '50mg', 65),
(14, 1, 'Cipro', 'Ciprofloxacin', 'Tablet', '500mg', 55),
(15, 2, 'Ibufen', 'Ibuprofen', 'Tablet', '400mg', 90),
(16, 2, 'Saline', 'Salt', 'Powder', '1000 ml', 1),
(17, 1, 'saline', 'salt', 'poweder', '500ml', 3),
(456, 2, 'unknown', 'janina', 'powder', 'onk shoktishali', 33);

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `Sale_Id` int(11) NOT NULL,
  `Batch_Id` int(11) DEFAULT NULL,
  `Quantity_Sold` int(11) NOT NULL,
  `Sale_Date` date DEFAULT curdate(),
  `Sale_Price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`Sale_Id`, `Batch_Id`, `Quantity_Sold`, `Sale_Date`, `Sale_Price`) VALUES
(1, 3, 10, '2026-04-27', 5.00),
(2, 1, 5, '2026-04-27', 45.00),
(3, 4, 2, '2026-04-27', 12.00),
(4, 6, 1, '2026-04-27', 55.00),
(5, 5, 6, '2026-04-27', 8.00),
(6, 7, 15, '2026-04-28', 10.00),
(7, 9, 8, '2026-04-28', 18.00),
(8, 13, 20, '2026-04-28', 25.00),
(9, 14, 30, '2026-04-28', 7.00),
(10, 8, 12, '2026-04-29', 15.00),
(11, 11, 10, '2026-04-29', 12.00),
(12, 15, 25, '2026-04-29', 5.00),
(13, 3, 18, '2026-04-29', 5.00),
(14, 12, 7, '2026-04-30', 20.00),
(15, 16, 5, '2026-04-30', 14.00),
(16, 10, 4, '2026-04-30', 22.00),
(17, 6, 3, '2026-04-30', 55.00),
(18, 5, 10, '2026-04-30', 8.00),
(19, 7, 20, '2026-05-01', 10.00),
(20, 8, 14, '2026-05-01', 15.00),
(21, 13, 10, '2026-05-01', 25.00),
(22, 14, 50, '2026-05-01', 7.00),
(23, 9, 6, '2026-05-02', 18.00),
(24, 11, 8, '2026-05-02', 12.00),
(25, 15, 40, '2026-05-02', 5.00),
(26, 12, 5, '2026-05-02', 20.00),
(27, 1, 10, '2026-05-03', 45.00),
(28, 3, 30, '2026-05-03', 5.00),
(29, 16, 8, '2026-05-03', 14.00),
(30, 7, 12, '2026-05-03', 10.00),
(31, 8, 9, '2026-05-04', 15.00),
(32, 13, 15, '2026-05-04', 25.00),
(33, 14, 20, '2026-05-04', 7.00),
(34, 12, 6, '2026-05-05', 20.00),
(35, 9, 10, '2026-05-05', 18.00),
(38, 15, 33, '2026-06-02', 999.00);

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `Staff_Id` int(11) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Branch_Id` int(11) NOT NULL,
  `Created_At` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`Staff_Id`, `Name`, `Email`, `Password`, `Branch_Id`, `Created_At`) VALUES
(1, 'Rahim Ahmed', 'rahim@medicare.com', 'hashed_password_3', 2, '2026-04-27 17:16:09'),
(2, 'Nasrin Akter', 'nasrin@medicare.com', 'hashed_password_4', 2, '2026-04-27 17:16:09'),
(3, 'Farhan Islam', 'farhan@medicare.com', 'hashed_password_5', 3, '2026-04-27 17:16:09'),
(4, 'Sumaiya Begum', 'sumaiya@medicare.com', 'hashed_password_6', 1, '2026-01-10 03:00:00'),
(5, 'Tanvir Hossain', 'tanvir@medicare.com', 'hashed_password_7', 3, '2026-02-15 04:30:00'),
(6, 'Meherun Nessa', 'meherun@medicare.com', 'hashed_password_8', 2, '2026-03-20 02:45:00');

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `Supplier_Id` int(11) NOT NULL,
  `Supplier_Name` varchar(150) DEFAULT NULL,
  `Contact_No` varchar(20) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Address` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `suppliers`
--

INSERT INTO `suppliers` (`Supplier_Id`, `Supplier_Name`, `Contact_No`, `Email`, `Address`) VALUES
(1, 'Square Pharma', '01700-111111', 'info@squarepharma.com', 'Dhaka, Bangladesh'),
(2, 'Beximco Pharma', '01700-222222', 'info@beximco.com', 'Dhaka, Bangladesh'),
(3, 'Renata Limited', '01700-333333', 'info@renata.com', 'Rajshahi, Bangladesh'),
(4, 'ACI Pharmaceuticals', '01700-444444', 'info@aci-bd.com', 'Narayanganj, Bangladesh'),
(5, 'Opsonin Pharma', '01700-555555', 'info@opsonin.com', 'Chittagong, Bangladesh'),
(6, 'Incepta Pharmaceuticals', '01700-666666', 'info@incepta-bd.com', 'Savar, Dhaka, Bangladesh');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`Admin_Id`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- Indexes for table `batches`
--
ALTER TABLE `batches`
  ADD PRIMARY KEY (`Batch_Id`),
  ADD KEY `Branch_Id` (`Branch_Id`),
  ADD KEY `Medicine_Id` (`Medicine_Id`),
  ADD KEY `Supplier_Id` (`Supplier_Id`);

--
-- Indexes for table `branches`
--
ALTER TABLE `branches`
  ADD PRIMARY KEY (`Branch_Id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`Category_Id`);

--
-- Indexes for table `expiryalerts`
--
ALTER TABLE `expiryalerts`
  ADD PRIMARY KEY (`Alert_Id`),
  ADD KEY `Batch_Id` (`Batch_Id`);

--
-- Indexes for table `medicines`
--
ALTER TABLE `medicines`
  ADD PRIMARY KEY (`Medicine_Id`),
  ADD KEY `Category_Id` (`Category_Id`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`Sale_Id`),
  ADD KEY `Batch_Id` (`Batch_Id`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`Staff_Id`),
  ADD UNIQUE KEY `Email` (`Email`),
  ADD KEY `Branch_Id` (`Branch_Id`);

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`Supplier_Id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `Admin_Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `batches`
--
ALTER TABLE `batches`
  MODIFY `Batch_Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `branches`
--
ALTER TABLE `branches`
  MODIFY `Branch_Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `Category_Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `expiryalerts`
--
ALTER TABLE `expiryalerts`
  MODIFY `Alert_Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `medicines`
--
ALTER TABLE `medicines`
  MODIFY `Medicine_Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=457;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `Sale_Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
  MODIFY `Staff_Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `Supplier_Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `batches`
--
ALTER TABLE `batches`
  ADD CONSTRAINT `batches_ibfk_1` FOREIGN KEY (`Branch_Id`) REFERENCES `branches` (`Branch_Id`),
  ADD CONSTRAINT `batches_ibfk_2` FOREIGN KEY (`Medicine_Id`) REFERENCES `medicines` (`Medicine_Id`),
  ADD CONSTRAINT `batches_ibfk_3` FOREIGN KEY (`Supplier_Id`) REFERENCES `suppliers` (`Supplier_Id`);

--
-- Constraints for table `expiryalerts`
--
ALTER TABLE `expiryalerts`
  ADD CONSTRAINT `expiryalerts_ibfk_1` FOREIGN KEY (`Batch_Id`) REFERENCES `batches` (`Batch_Id`);

--
-- Constraints for table `medicines`
--
ALTER TABLE `medicines`
  ADD CONSTRAINT `medicines_ibfk_1` FOREIGN KEY (`Category_Id`) REFERENCES `categories` (`Category_Id`);

--
-- Constraints for table `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`Batch_Id`) REFERENCES `batches` (`Batch_Id`);

--
-- Constraints for table `staff`
--
ALTER TABLE `staff`
  ADD CONSTRAINT `staff_ibfk_1` FOREIGN KEY (`Branch_Id`) REFERENCES `branches` (`Branch_Id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
