-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 17, 2024 at 08:50 PM
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
-- Database: `aespaalbumstoredb`
--
CREATE DATABASE IF NOT EXISTS `aespaalbumstoredb` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `aespaalbumstoredb`;

-- --------------------------------------------------------

--
-- Table structure for table `albums`
--

CREATE TABLE `albums` (
  `AlbumID` int(11) NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Artist` varchar(255) NOT NULL,
  `Genre` varchar(100) DEFAULT NULL,
  `ReleaseDate` date DEFAULT NULL,
  `RarityStatus` varchar(50) DEFAULT NULL,
  `Value` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `albums`
--

INSERT INTO `albums` (`AlbumID`, `Title`, `Artist`, `Genre`, `ReleaseDate`, `RarityStatus`, `Value`) VALUES
(1, 'Fearless', 'Taylor Swift', 'Country', '2008-11-11', 'Common', 15.00),
(2, '1989', 'Taylor Swift', 'Pop', '2014-10-27', 'Common', 20.00),
(3, 'Red', 'Taylor Swift', 'Country/Pop', '2012-10-22', 'Common', 18.00),
(4, 'Lover', 'Taylor Swift', 'Pop', '2019-08-23', 'Common', 22.00),
(5, 'Folklore', 'Taylor Swift', 'Indie Folk', '2020-07-24', 'Rare', 35.00),
(6, 'Evermore', 'Taylor Swift', 'Indie Folk', '2020-12-11', 'Rare', 35.00),
(7, 'Reputation', 'Taylor Swift', 'Pop', '2017-11-10', 'Common', 25.00),
(8, 'Midnights', 'Taylor Swift', 'Synth-pop', '2022-10-21', 'Common', 30.00);

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `CustomerID` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `ContactInfo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`CustomerID`, `Name`, `ContactInfo`) VALUES
(1, 'Claymar Pereyra', 'claymarpereyra@gmail.com'),
(2, 'Yuma Wakayama', 'yumawakayama@gmail.com'),
(3, 'Jeanrey Paculan', 'jeanreypaculan@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `InventoryID` int(11) NOT NULL,
  `AlbumID` int(11) NOT NULL,
  `QuantityAvailable` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`InventoryID`, `AlbumID`, `QuantityAvailable`) VALUES
(1, 1, 1),
(2, 2, 10);

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `TransactionID` int(11) NOT NULL,
  `CustomerID` int(11) NOT NULL,
  `AlbumID` int(11) NOT NULL,
  `TransactionDate` date NOT NULL,
  `Price` decimal(10,2) NOT NULL,
  `TransactionType` enum('Purchase from Customer','Sale to Customer') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`TransactionID`, `CustomerID`, `AlbumID`, `TransactionDate`, `Price`, `TransactionType`) VALUES
(1, 1, 1, '2024-09-01', 300.00, 'Purchase from Customer'),
(2, 2, 2, '2024-09-05', 200.00, 'Purchase from Customer'),
(3, 1, 1, '2024-09-12', 1200.00, 'Sale to Customer'),
(4, 2, 2, '2024-09-13', 50.00, 'Sale to Customer');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `albums`
--
ALTER TABLE `albums`
  ADD PRIMARY KEY (`AlbumID`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`CustomerID`);

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`InventoryID`),
  ADD KEY `AlbumID` (`AlbumID`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`TransactionID`),
  ADD KEY `CustomerID` (`CustomerID`),
  ADD KEY `AlbumID` (`AlbumID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `albums`
--
ALTER TABLE `albums`
  MODIFY `AlbumID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `CustomerID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `InventoryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `TransactionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `inventory`
--
ALTER TABLE `inventory`
  ADD CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`AlbumID`) REFERENCES `albums` (`AlbumID`);

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`CustomerID`) REFERENCES `customers` (`CustomerID`),
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`AlbumID`) REFERENCES `albums` (`AlbumID`);
--
-- Database: `aespaccis_sms`
--
CREATE DATABASE IF NOT EXISTS `aespaccis_sms` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `aespaccis_sms`;

-- --------------------------------------------------------

--
-- Table structure for table `machines`
--

CREATE TABLE `machines` (
  `MachineID` int(11) NOT NULL,
  `MachineName` varchar(255) NOT NULL,
  `IPAddress` varchar(15) NOT NULL,
  `UserAssigned` varchar(255) NOT NULL,
  `UserID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `machines`
--

INSERT INTO `machines` (`MachineID`, `MachineName`, `IPAddress`, `UserAssigned`, `UserID`) VALUES
(1, 'HPSB 1007', '192.168.1.10', 'Yuma Wakayama', 1),
(2, 'HPSB 1008', '192.168.1.11', 'Claymar Pereyra', 2),
(3, 'HPSB 1009', '192.168.2.5', 'Jeanrey Paculan', 3);

-- --------------------------------------------------------

--
-- Table structure for table `machinesoftware`
--

CREATE TABLE `machinesoftware` (
  `MachineID` int(11) DEFAULT NULL,
  `SoftwareID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `machinesoftware`
--

INSERT INTO `machinesoftware` (`MachineID`, `SoftwareID`) VALUES
(1, 1),
(2, 2),
(3, 3),
(1, 4);

-- --------------------------------------------------------

--
-- Table structure for table `software`
--

CREATE TABLE `software` (
  `SoftwareID` int(11) NOT NULL,
  `SoftwareName` varchar(255) NOT NULL,
  `LicenseKey` varchar(255) DEFAULT NULL,
  `LicenseExpiry` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `software`
--

INSERT INTO `software` (`SoftwareID`, `SoftwareName`, `LicenseKey`, `LicenseExpiry`) VALUES
(1, 'Microsoft Office', 'XXXX-YYYY-ZZZZ', '2025-09-30 00:00:00'),
(2, 'Adobe Photoshop', 'AAAA-BBBB-CCCC', '2024-12-31 00:00:00'),
(3, 'AutoCAD', '1111-2222-3333', '2026-01-01 00:00:00'),
(4, 'Visual Studio Code', '1234-4321-1243', '2027-01-01 00:00:00'),
(5, 'Eclipse', '9876-9898-0989', '2025-05-01 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `UserID` int(11) NOT NULL,
  `UserName` varchar(255) NOT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `ContactNumber` varchar(20) DEFAULT NULL,
  `Role` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`UserID`, `UserName`, `Email`, `ContactNumber`, `Role`) VALUES
(1, 'Yuma Wakayama', 'yuma.wakayama@example.com', '0917-123-4567', 'Admin'),
(2, 'Claymar Pereyra', 'claymar.pereyra@example.com', '0917-765-4321', 'Student'),
(3, 'Jeanrey Paculan', 'jeanrey.paculan@example.com', '0918-987-6543', 'Faculty');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `machines`
--
ALTER TABLE `machines`
  ADD PRIMARY KEY (`MachineID`),
  ADD KEY `FK_User_Machine` (`UserID`);

--
-- Indexes for table `machinesoftware`
--
ALTER TABLE `machinesoftware`
  ADD KEY `MachineID` (`MachineID`),
  ADD KEY `SoftwareID` (`SoftwareID`);

--
-- Indexes for table `software`
--
ALTER TABLE `software`
  ADD PRIMARY KEY (`SoftwareID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserID`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `machines`
--
ALTER TABLE `machines`
  ADD CONSTRAINT `FK_User_Machine` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`);

--
-- Constraints for table `machinesoftware`
--
ALTER TABLE `machinesoftware`
  ADD CONSTRAINT `machinesoftware_ibfk_1` FOREIGN KEY (`MachineID`) REFERENCES `machines` (`MachineID`),
  ADD CONSTRAINT `machinesoftware_ibfk_2` FOREIGN KEY (`SoftwareID`) REFERENCES `software` (`SoftwareID`);
--
-- Database: `aespa_dms`
--
CREATE DATABASE IF NOT EXISTS `aespa_dms` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `aespa_dms`;

-- --------------------------------------------------------

--
-- Table structure for table `drugassignments`
--

CREATE TABLE `drugassignments` (
  `AssignmentID` int(11) NOT NULL,
  `ParticipantID` int(11) NOT NULL,
  `DrugID` int(11) NOT NULL,
  `GroupID` int(11) NOT NULL,
  `StartDate` date NOT NULL,
  `EndDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `drugassignments`
--

INSERT INTO `drugassignments` (`AssignmentID`, `ParticipantID`, `DrugID`, `GroupID`, `StartDate`, `EndDate`) VALUES
(1, 1, 1, 2, '2024-05-01', '2024-06-30'),
(2, 2, 3, 1, '2024-05-02', '2024-06-30'),
(3, 3, 1, 2, '2024-05-03', '2024-06-30'),
(4, 4, 2, 2, '2024-05-04', '2024-06-30'),
(5, 5, 3, 1, '2024-05-05', '2024-06-30');

-- --------------------------------------------------------

--
-- Table structure for table `druggroups`
--

CREATE TABLE `druggroups` (
  `GroupID` int(11) NOT NULL,
  `GroupName` varchar(50) NOT NULL,
  `Description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `druggroups`
--

INSERT INTO `druggroups` (`GroupID`, `GroupName`, `Description`) VALUES
(1, 'Placebo', 'Control group receiving a placebo'),
(2, 'Active Drug', 'Group receiving the active antidepressant');

-- --------------------------------------------------------

--
-- Table structure for table `drugs`
--

CREATE TABLE `drugs` (
  `DrugID` int(11) NOT NULL,
  `DrugName` varchar(255) NOT NULL,
  `Dosage` varchar(50) NOT NULL,
  `Frequency` varchar(50) NOT NULL,
  `AdministrationRoute` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `drugs`
--

INSERT INTO `drugs` (`DrugID`, `DrugName`, `Dosage`, `Frequency`, `AdministrationRoute`) VALUES
(1, 'Sertraline', '50mg', 'Once daily', 'Oral'),
(2, 'Fluoxetine', '20mg', 'Once daily', 'Oral'),
(3, 'Placebo Pill', 'N/A', 'Once daily', 'Oral');

-- --------------------------------------------------------

--
-- Table structure for table `observations`
--

CREATE TABLE `observations` (
  `ObservationID` int(11) NOT NULL,
  `ParticipantID` int(11) NOT NULL,
  `ObservationDate` date NOT NULL,
  `Mood` varchar(50) DEFAULT NULL CHECK (`Mood` in ('Improved','No change','Worsened','Neutral')),
  `SleepQuality` varchar(50) DEFAULT NULL,
  `SideEffects` varchar(255) DEFAULT NULL,
  `Notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `observations`
--

INSERT INTO `observations` (`ObservationID`, `ParticipantID`, `ObservationDate`, `Mood`, `SleepQuality`, `SideEffects`, `Notes`) VALUES
(1, 1, '2024-05-08', 'Neutral', 'Slightly improved', 'None', 'Some initial anxiety reported'),
(2, 2, '2024-05-08', 'Improved', 'No change', 'None', 'Reported feeling more hopeful'),
(3, 3, '2024-05-08', 'No change', 'Slightly worse', 'Headache', 'Headache reported after taking the medication'),
(4, 4, '2024-05-08', 'Improved', 'Improved', 'None', 'Significant improvement in mood and sleep'),
(5, 5, '2024-05-08', 'No change', 'No change', 'None', 'No significant changes observed');

-- --------------------------------------------------------

--
-- Table structure for table `participants`
--

CREATE TABLE `participants` (
  `ParticipantID` int(11) NOT NULL,
  `FirstName` varchar(255) NOT NULL,
  `LastName` varchar(255) NOT NULL,
  `DateOfBirth` date NOT NULL,
  `Gender` varchar(10) NOT NULL CHECK (`Gender` in ('Male','Female','Other')),
  `ContactNumber` varchar(20) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `EnrollmentDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `participants`
--

INSERT INTO `participants` (`ParticipantID`, `FirstName`, `LastName`, `DateOfBirth`, `Gender`, `ContactNumber`, `Address`, `EnrollmentDate`) VALUES
(1, 'Yuma', 'Wakayama', '1990-07-15', 'Male', '123-456-7890', '123 Highland, Pasig City', '2024-05-01'),
(2, 'Claymar', 'Pereyra', '1988-04-22', 'Male', '987-654-3210', '456 Elm Street, Quezon City', '2024-05-02'),
(3, 'Jeanrey', 'Paculan', '1992-01-10', 'Female', '555-123-4567', '789 Oak Avenue, Manila', '2024-05-03'),
(4, 'Airich', 'Diawan', '1991-09-03', 'Male', '111-222-3333', '101 Pine Lane, Makati City', '2024-05-04'),
(5, 'Miguel', 'Erna', '1987-11-18', 'Male', '444-555-6666', '202 Willow Drive, Taguig City', '2024-05-05');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `drugassignments`
--
ALTER TABLE `drugassignments`
  ADD PRIMARY KEY (`AssignmentID`),
  ADD KEY `ParticipantID` (`ParticipantID`),
  ADD KEY `DrugID` (`DrugID`),
  ADD KEY `GroupID` (`GroupID`);

--
-- Indexes for table `druggroups`
--
ALTER TABLE `druggroups`
  ADD PRIMARY KEY (`GroupID`);

--
-- Indexes for table `drugs`
--
ALTER TABLE `drugs`
  ADD PRIMARY KEY (`DrugID`);

--
-- Indexes for table `observations`
--
ALTER TABLE `observations`
  ADD PRIMARY KEY (`ObservationID`),
  ADD KEY `ParticipantID` (`ParticipantID`);

--
-- Indexes for table `participants`
--
ALTER TABLE `participants`
  ADD PRIMARY KEY (`ParticipantID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `drugassignments`
--
ALTER TABLE `drugassignments`
  MODIFY `AssignmentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `druggroups`
--
ALTER TABLE `druggroups`
  MODIFY `GroupID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `drugs`
--
ALTER TABLE `drugs`
  MODIFY `DrugID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `observations`
--
ALTER TABLE `observations`
  MODIFY `ObservationID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `participants`
--
ALTER TABLE `participants`
  MODIFY `ParticipantID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `drugassignments`
--
ALTER TABLE `drugassignments`
  ADD CONSTRAINT `drugassignments_ibfk_1` FOREIGN KEY (`ParticipantID`) REFERENCES `participants` (`ParticipantID`),
  ADD CONSTRAINT `drugassignments_ibfk_2` FOREIGN KEY (`DrugID`) REFERENCES `drugs` (`DrugID`),
  ADD CONSTRAINT `drugassignments_ibfk_3` FOREIGN KEY (`GroupID`) REFERENCES `druggroups` (`GroupID`);

--
-- Constraints for table `observations`
--
ALTER TABLE `observations`
  ADD CONSTRAINT `observations_ibfk_1` FOREIGN KEY (`ParticipantID`) REFERENCES `participants` (`ParticipantID`);
--
-- Database: `apartmentdb`
--
CREATE DATABASE IF NOT EXISTS `apartmentdb` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `apartmentdb`;

-- --------------------------------------------------------

--
-- Table structure for table `apartment`
--

CREATE TABLE `apartment` (
  `ApartmentID` int(11) NOT NULL,
  `UnitNumber` varchar(10) NOT NULL,
  `Building` varchar(50) NOT NULL,
  `NumberOfRooms` int(11) NOT NULL,
  `RentAmount` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `apartment`
--

INSERT INTO `apartment` (`ApartmentID`, `UnitNumber`, `Building`, `NumberOfRooms`, `RentAmount`) VALUES
(1, '101', 'Building A', 3, 1200.00),
(2, '102', 'Building A', 2, 1000.00);

-- --------------------------------------------------------

--
-- Table structure for table `lease`
--

CREATE TABLE `lease` (
  `LeaseID` int(11) NOT NULL,
  `TenantID` int(11) NOT NULL,
  `ApartmentID` int(11) NOT NULL,
  `StartDate` date NOT NULL,
  `EndDate` date DEFAULT NULL,
  `MonthlyRent` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lease`
--

INSERT INTO `lease` (`LeaseID`, `TenantID`, `ApartmentID`, `StartDate`, `EndDate`, `MonthlyRent`) VALUES
(1, 1, 1, '2024-01-01', '2024-12-31', 1200.00),
(2, 2, 2, '2024-02-01', '2025-01-31', 1000.00);

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `PaymentID` int(11) NOT NULL,
  `LeaseID` int(11) NOT NULL,
  `PaymentDate` date NOT NULL,
  `AmountPaid` decimal(10,2) NOT NULL,
  `PaymentMethod` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`PaymentID`, `LeaseID`, `PaymentDate`, `AmountPaid`, `PaymentMethod`) VALUES
(1, 1, '2024-01-05', 1200.00, 'Credit Card'),
(2, 2, '2024-02-05', 1000.00, 'Bank Transfer');

-- --------------------------------------------------------

--
-- Table structure for table `tenant`
--

CREATE TABLE `tenant` (
  `TenantID` int(11) NOT NULL,
  `FirstName` varchar(50) NOT NULL,
  `LastName` varchar(50) NOT NULL,
  `DateOfBirth` date DEFAULT NULL,
  `PhoneNumber` varchar(15) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tenant`
--

INSERT INTO `tenant` (`TenantID`, `FirstName`, `LastName`, `DateOfBirth`, `PhoneNumber`, `Email`) VALUES
(1, 'Yuma', 'Wakayama', '2002-01-29', '09394759280', 'yumawakayama20@gmail.com'),
(2, 'Claymar', 'Pereyra', '1990-08-22', '555-5678', 'claymarpereyra@gmail.com'),
(3, 'Jeanrey', 'Paculan', '1990-08-22', '555-5678', 'jeanreypaculan@gmail.com');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `apartment`
--
ALTER TABLE `apartment`
  ADD PRIMARY KEY (`ApartmentID`);

--
-- Indexes for table `lease`
--
ALTER TABLE `lease`
  ADD PRIMARY KEY (`LeaseID`),
  ADD KEY `TenantID` (`TenantID`),
  ADD KEY `ApartmentID` (`ApartmentID`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`PaymentID`),
  ADD KEY `LeaseID` (`LeaseID`);

--
-- Indexes for table `tenant`
--
ALTER TABLE `tenant`
  ADD PRIMARY KEY (`TenantID`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `apartment`
--
ALTER TABLE `apartment`
  MODIFY `ApartmentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `lease`
--
ALTER TABLE `lease`
  MODIFY `LeaseID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `PaymentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tenant`
--
ALTER TABLE `tenant`
  MODIFY `TenantID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `lease`
--
ALTER TABLE `lease`
  ADD CONSTRAINT `lease_ibfk_1` FOREIGN KEY (`TenantID`) REFERENCES `tenant` (`TenantID`),
  ADD CONSTRAINT `lease_ibfk_2` FOREIGN KEY (`ApartmentID`) REFERENCES `apartment` (`ApartmentID`);

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`LeaseID`) REFERENCES `lease` (`LeaseID`);
--
-- Database: `clarrels`
--
CREATE DATABASE IF NOT EXISTS `clarrels` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `clarrels`;

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `username`, `password`, `created_at`, `updated_at`) VALUES
(1, 'clarrels', 'clarreladmin123', '2024-05-28 07:43:02', '2024-05-28 07:43:02');

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` varchar(12) NOT NULL,
  `patient` varchar(6) DEFAULT NULL,
  `doctor` varchar(6) DEFAULT NULL,
  `appointment_date` date NOT NULL,
  `appointment_time` time NOT NULL,
  `service_type` varchar(6) DEFAULT NULL,
  `service` varchar(6) DEFAULT NULL,
  `patient_name` varchar(255) NOT NULL,
  `patient_phone` varchar(255) NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `is_follow_up` tinyint(1) NOT NULL DEFAULT 0,
  `status` varchar(255) NOT NULL,
  `amount_paid` double NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `patient`, `doctor`, `appointment_date`, `appointment_time`, `service_type`, `service`, `patient_name`, `patient_phone`, `note`, `reason`, `is_follow_up`, `status`, `amount_paid`, `created_at`, `updated_at`) VALUES
('372959081353', '358962', '267402', '2024-06-15', '11:00:00', '100000', '100001', 'Yuma Wakayama', '939 475 9280', NULL, NULL, 0, 'Completed', 0, '2024-06-09 13:07:52', '2024-06-09 13:10:50'),
('586398229300', '358962', '267402', '2024-06-29', '11:00:00', '100000', '100001', 'Yuma Wakayama', '939 475 9280', NULL, NULL, 0, 'Pending', 0, '2024-06-10 16:05:59', '2024-06-10 16:05:59'),
('63000289563', '559949', '267402', '2024-06-08', '14:00:00', '100000', '100001', 'Airich Jay Diawan', '967 764 4695', NULL, NULL, 1, 'Canceled', 0, '2024-06-07 07:55:04', '2024-06-07 10:53:23'),
('786987320667', '559949', '267402', '2024-06-07', '10:00:00', '100000', '100001', 'Airich Jay Diawan', '967 764 4695', NULL, NULL, 0, 'Completed', 0, '2024-06-06 01:20:30', '2024-06-06 17:23:27'),
('863434401183', '559949', '267402', '2024-06-08', '10:00:00', '100000', '100001', 'Airich Jay Diawan', '967 764 4695', NULL, NULL, 0, 'Completed', 0, '2024-06-06 17:15:51', '2024-06-06 17:25:35'),
('903063533919', '559949', '267402', '2024-06-07', '09:00:00', '100000', '100002', 'Airich Jay Diawan', '967 764 4695', NULL, NULL, 0, 'Completed', 0, '2024-06-06 01:05:07', '2024-06-06 15:46:47'),
('906258526319', '559949', '267402', '2024-06-10', '14:00:00', '100000', '100002', 'Airich Jay Diawan', '967 764 4695', NULL, NULL, 0, 'Approved', 0, '2024-06-07 07:59:26', '2024-06-07 08:05:47'),
('925306374783', '358962', '878334', '2024-06-14', '11:00:00', '200000', '200001', 'Yuma Wakayama', '939 475 9280', NULL, NULL, 0, 'Completed', 0, '2024-06-09 12:57:16', '2024-06-09 13:00:41');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `content_manages`
--

CREATE TABLE `content_manages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `content_manages`
--

INSERT INTO `content_manages` (`id`, `title`, `content`, `created_at`, `updated_at`) VALUES
(1, 'Get ready for your best ever Dental Experience!', 'We use only the best quality materials on the market in order to provide the best products to our patients, So don\'t worry about anything and book yourself.', '2024-05-29 10:25:52', '2024-05-30 04:03:57'),
(2, 'Root Canal Treatment edited', 'Root canal treatment (endodontics) is a dental procedure used to treat infection at the centre of a tooth. edited', '2024-05-29 10:48:11', '2024-05-29 11:32:47'),
(3, 'Cosmetic Dentist edited', 'Cosmetic dentistry is the branch of dentistry that focuses on improving the appearance of your smile. edited', '2024-05-29 10:48:11', '2024-05-29 11:32:55'),
(4, 'Dental Implants edited', 'A dental implant is an artificial tooth root that\'s placed into your jaw to hold a prosthetic tooth or bridge. edited', '2024-05-29 10:48:52', '2024-05-29 11:33:01');

-- --------------------------------------------------------

--
-- Table structure for table `doctors`
--

CREATE TABLE `doctors` (
  `id` varchar(6) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `prc_number` varchar(255) NOT NULL,
  `doctor_type` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `birthdate` date NOT NULL,
  `gender` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `pfp` varchar(255) NOT NULL,
  `signature` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `doctors`
--

INSERT INTO `doctors` (`id`, `firstname`, `lastname`, `prc_number`, `doctor_type`, `username`, `password`, `email`, `phone`, `birthdate`, `gender`, `address`, `pfp`, `signature`, `created_at`, `updated_at`) VALUES
('267402', 'Elmer', 'Cabantog', '123345123', 'Orthodontist', 'elmer123', 'elmercabantog123', 'elmercabantog@gmail.com', '923 128 3183', '1959-06-28', 'Male', 'Address', '108dcqgbOJJHhOT7TAXvQPZl.jpg', 'elmer-sign.png', '2024-05-03 20:32:44', '2024-06-06 07:47:35'),
('878334', 'Regie Russel', 'Cabantog', '123123123', 'Skin care', 'regie123', 'regiecabantog123', 'regiecabantog@gmail.com', '967 625 2345', '1960-05-08', 'Female', 'Address', 'reggiePFP.jpeg', 'reggie-sign.png', '2024-05-03 20:29:19', '2024-05-05 06:15:32');

-- --------------------------------------------------------

--
-- Table structure for table `email_verifications`
--

CREATE TABLE `email_verifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `email` varchar(255) NOT NULL,
  `otp` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `email_verifications`
--

INSERT INTO `email_verifications` (`id`, `email`, `otp`, `created_at`, `updated_at`) VALUES
(10, 'airichjaydiawan@gmail.com', '385390', '2024-05-30 06:54:21', '2024-05-30 06:54:21'),
(11, 'airichjaydiawan@gmail.com', '574954', '2024-05-30 07:05:43', '2024-05-30 07:05:43'),
(12, 'airichjaydiawan@gmail.com', '254104', '2024-05-30 08:41:29', '2024-05-30 08:41:29');

-- --------------------------------------------------------

--
-- Table structure for table `faqs_contents`
--

CREATE TABLE `faqs_contents` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `question` varchar(255) NOT NULL,
  `answer` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `faqs_contents`
--

INSERT INTO `faqs_contents` (`id`, `question`, `answer`, `created_at`, `updated_at`) VALUES
(1, 'Can I see who reads my email campaigns? EDITED', 'Lorem ipsum dolor sit amet consectetur. Convallis cras placerat dignissim aliquam massa. Aliquet volutpat rhoncus in convallis consectetur. Cras adipiscing volutpat non hac enim odio enim.EDITED', '2024-05-29 12:17:45', '2024-05-29 12:56:22'),
(2, 'Do you offer non-profit discounts?', 'Lorem ipsum dolor sit amet consectetur. Convallis cras placerat dignissim aliquam massa. Aliquet volutpat rhoncus in convallis consectetur. Cras adipiscing volutpat non hac enim odio enim.', '2024-05-29 12:17:45', '2024-05-29 12:17:45'),
(3, 'Can I see who reads my email campaigns? EDITED', 'Lorem ipsum dolor sit amet consectetur. Convallis cras placerat dignissim aliquam massa. Aliquet volutpat rhoncus in convallis consectetur. Cras adipiscing volutpat non hac enim odio enim. EDITED', '2024-05-29 12:17:45', '2024-05-29 12:56:32'),
(4, 'Can I see who reads my email campaigns?', 'Lorem ipsum dolor sit amet consectetur. Convallis cras placerat dignissim aliquam massa. Aliquet volutpat rhoncus in convallis consectetur. Cras adipiscing volutpat non hac enim odio enim.', '2024-05-29 12:17:45', '2024-05-29 12:17:45');

-- --------------------------------------------------------

--
-- Table structure for table `medical_informations`
--

CREATE TABLE `medical_informations` (
  `id` varchar(12) NOT NULL,
  `patient` varchar(6) DEFAULT NULL,
  `allergies` varchar(255) NOT NULL,
  `heart_disease` varchar(255) NOT NULL,
  `high_blood_pressure` varchar(255) NOT NULL,
  `diabetic` varchar(255) NOT NULL,
  `surgeries` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `medical_informations`
--

INSERT INTO `medical_informations` (`id`, `patient`, `allergies`, `heart_disease`, `high_blood_pressure`, `diabetic`, `surgeries`, `created_at`, `updated_at`) VALUES
('593369', '559949', 'No', 'No', 'No', 'No', 'No', '2024-05-20 06:51:08', '2024-05-25 15:35:53'),
('650735', '595379', 'No', 'No', 'No', 'No', 'No', '2024-05-27 16:49:22', '2024-05-28 13:04:00'),
('802413', '358962', 'NO', 'NO', 'NO', 'NO', 'NO', '2024-06-09 12:56:31', '2024-06-09 12:56:31'),
('961626', NULL, 'asdasd', 'No', 'No', 'No', 'asd', '2024-05-29 03:57:05', '2024-05-29 03:57:05');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000001_create_cache_table', 1),
(16, '2024_05_05_150526_create_service_types_table', 7),
(22, '2024_05_01_052424_create_patients_table', 9),
(24, '2024_05_20_143032_create_medical_informations_table', 10),
(26, '2024_05_28_152743_create_admins_table', 12),
(28, '2024_05_29_174342_create_content_manages_table', 13),
(30, '2024_05_29_194308_create_why_clarrel_contents_table', 14),
(31, '2024_05_29_201409_create_faqs_contents_table', 15),
(34, '2024_05_30_113835_create_email_verifications_table', 17),
(36, '2024_06_04_165537_create_prescriptions_table', 19),
(37, '2024_05_01_110024_create_doctors_table', 20),
(38, '2024_05_05_150540_create_services_table', 21),
(39, '2024_05_05_155931_create_appointments_table', 22),
(40, '2024_06_06_222001_create_receipts_table', 23);

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

CREATE TABLE `patients` (
  `id` varchar(6) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `middlename` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `birthdate` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `pfp` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`id`, `firstname`, `middlename`, `lastname`, `username`, `password`, `email`, `phone`, `birthdate`, `gender`, `address`, `pfp`, `created_at`, `updated_at`) VALUES
('358962', 'Yuma', 'Gasga', 'Wakayama', 'Yowma123', 'yowma123', 'yowma20@gmail.com', '939 475 9280', '2002-01-29', 'Male', 'Blk 8 Lot 40 Villa Consolacion Subd. Antipolo City', 'default.png', '2024-06-09 12:56:31', '2024-06-09 12:56:31'),
('559949', 'Airich Jay', 'Sevilla', 'Diawan', 'adiawan', 'asd', 'airichjaydiawan@gmail.com', '967 764 4695', '2003-04-23', 'Male', 'Wellington Residences Brgy. Sahud Ulan Tanza Cavite', 'K4IjtA2YhDa1Vw1xL11HgKxE.jpg', '2024-05-20 06:51:08', '2024-05-30 08:31:22'),
('595379', 'Yuma', NULL, 'Wakayama', 'yowma', 'yowma123', 'adiawan.a12137244@umak.edu.ph', '927 712 3617', '2002-01-29', 'Male', 'Makati City', 'default.png', '2024-05-27 08:49:22', '2024-05-27 08:49:22');

-- --------------------------------------------------------

--
-- Table structure for table `prescriptions`
--

CREATE TABLE `prescriptions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `appointment` varchar(12) DEFAULT NULL,
  `prescription` longtext NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `prescriptions`
--

INSERT INTO `prescriptions` (`id`, `appointment`, `prescription`, `created_at`, `updated_at`) VALUES
(1, NULL, '3x a day Antibiotic for 10 days', '2024-06-04 09:28:27', '2024-06-04 09:28:27'),
(2, '903063533919', '3x a day Med 1 for 7 days<div>1 vitamins</div><div>1 vitamins 2</div>', '2024-06-06 09:24:08', '2024-06-06 09:24:08'),
(3, '786987320667', 'asdasd<div>asdasd</div><div>asdasd</div><div>asdasd</div><div>asdasd</div>', '2024-06-06 17:21:33', '2024-06-06 17:21:33'),
(4, '863434401183', 'asda<div>1x asda&nbsp;</div><div>3x asd</div>', '2024-06-06 17:22:52', '2024-06-06 17:22:52'),
(5, '925306374783', 'Do not wash your face<div><br></div><div>2x Paracetamol</div>', '2024-06-09 12:59:37', '2024-06-09 12:59:37'),
(6, '372959081353', '1x Antibiotic<div>1x Mefenamic&nbsp;</div>', '2024-06-09 13:09:54', '2024-06-09 13:09:54');

-- --------------------------------------------------------

--
-- Table structure for table `receipts`
--

CREATE TABLE `receipts` (
  `id` varchar(8) NOT NULL,
  `appointment` varchar(12) DEFAULT NULL,
  `service_price` double NOT NULL,
  `amount_paid` double NOT NULL,
  `change` double NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `receipts`
--

INSERT INTO `receipts` (`id`, `appointment`, `service_price`, `amount_paid`, `change`, `created_at`, `updated_at`) VALUES
('27949537', '925306374783', 2000, 2000, 0, '2024-06-09 13:00:41', '2024-06-09 13:00:41'),
('67403701', '903063533919', 1000, 1000, 0, '2024-06-06 15:46:47', '2024-06-06 15:46:47'),
('70188566', '786987320667', 750, 1000, 250, '2024-06-06 17:23:27', '2024-06-06 17:23:27'),
('8168540', '863434401183', 750, 1000, 250, '2024-06-06 17:25:35', '2024-06-06 17:25:35'),
('88472092', '372959081353', 750, 1000, 250, '2024-06-09 13:10:50', '2024-06-09 13:10:50');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` varchar(6) NOT NULL,
  `service_type` varchar(6) DEFAULT NULL,
  `service` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `price` double NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `service_type`, `service`, `description`, `price`, `created_at`, `updated_at`) VALUES
('100001', '100000', 'Teeth Cleaning', 'Description Sample', 750, '2024-05-04 23:21:31', '2024-05-04 23:21:31'),
('100002', '100000', 'Tooth extraction', 'Description Sample', 1000, '2024-05-04 23:21:31', '2024-05-04 23:21:31'),
('200001', '200000', 'Millia Removal', 'Description Sample', 2000, '2024-05-04 23:19:32', '2024-05-04 23:19:32'),
('200002', '200000', 'Keloid Injection', 'Description Sample', 3000, '2024-05-04 23:19:32', '2024-05-29 06:58:51'),
('200003', '200000', 'Skintag', 'Description Sample', 2500, '2024-05-04 23:19:55', '2024-05-29 06:58:42');

-- --------------------------------------------------------

--
-- Table structure for table `service_types`
--

CREATE TABLE `service_types` (
  `id` varchar(6) NOT NULL,
  `service_type` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `service_types`
--

INSERT INTO `service_types` (`id`, `service_type`, `created_at`, `updated_at`) VALUES
('100000', 'Dental', '2024-05-05 15:16:14', '2024-05-05 15:16:14'),
('200000', 'Skin care', '2024-05-05 15:16:14', '2024-05-05 15:16:14');

-- --------------------------------------------------------

--
-- Table structure for table `why_clarrel_contents`
--

CREATE TABLE `why_clarrel_contents` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `content` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `why_clarrel_contents`
--

INSERT INTO `why_clarrel_contents` (`id`, `content`, `created_at`, `updated_at`) VALUES
(1, 'Expert Care: Our skilled professionals are dedicated to providing top-notch dental and skincare services tailored to your needs.', '2024-05-29 11:44:12', '2024-05-29 13:17:55'),
(2, 'Personalized Approach: Each treatment plan is customized to address your unique dental and skincare concerns and goals.', '2024-05-29 11:44:12', '2024-05-29 13:18:03'),
(3, 'State-of-the-Art Facility: Our clinic is equipped with the latest technology to deliver the highest standard of care in both dental and skincare treatments.', '2024-05-29 11:44:12', '2024-05-29 13:18:07');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `appointments_patient_foreign` (`patient`),
  ADD KEY `appointments_doctor_foreign` (`doctor`),
  ADD KEY `appointments_service_type_foreign` (`service_type`),
  ADD KEY `appointments_service_foreign` (`service`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `content_manages`
--
ALTER TABLE `content_manages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `doctors`
--
ALTER TABLE `doctors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `email_verifications`
--
ALTER TABLE `email_verifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `faqs_contents`
--
ALTER TABLE `faqs_contents`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `medical_informations`
--
ALTER TABLE `medical_informations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `medical_informations_patient_foreign` (`patient`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `prescriptions`
--
ALTER TABLE `prescriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `prescriptions_appointment_foreign` (`appointment`);

--
-- Indexes for table `receipts`
--
ALTER TABLE `receipts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `receipts_appointment_foreign` (`appointment`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `services_service_type_foreign` (`service_type`);

--
-- Indexes for table `service_types`
--
ALTER TABLE `service_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `why_clarrel_contents`
--
ALTER TABLE `why_clarrel_contents`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `content_manages`
--
ALTER TABLE `content_manages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `email_verifications`
--
ALTER TABLE `email_verifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `faqs_contents`
--
ALTER TABLE `faqs_contents`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `prescriptions`
--
ALTER TABLE `prescriptions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `why_clarrel_contents`
--
ALTER TABLE `why_clarrel_contents`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_doctor_foreign` FOREIGN KEY (`doctor`) REFERENCES `doctors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `appointments_patient_foreign` FOREIGN KEY (`patient`) REFERENCES `patients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `appointments_service_foreign` FOREIGN KEY (`service`) REFERENCES `services` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `appointments_service_type_foreign` FOREIGN KEY (`service_type`) REFERENCES `service_types` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `medical_informations`
--
ALTER TABLE `medical_informations`
  ADD CONSTRAINT `medical_informations_patient_foreign` FOREIGN KEY (`patient`) REFERENCES `patients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `prescriptions`
--
ALTER TABLE `prescriptions`
  ADD CONSTRAINT `prescriptions_appointment_foreign` FOREIGN KEY (`appointment`) REFERENCES `appointments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `receipts`
--
ALTER TABLE `receipts`
  ADD CONSTRAINT `receipts_appointment_foreign` FOREIGN KEY (`appointment`) REFERENCES `appointments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `services`
--
ALTER TABLE `services`
  ADD CONSTRAINT `services_service_type_foreign` FOREIGN KEY (`service_type`) REFERENCES `service_types` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
--
-- Database: `ortegas_drugstore`
--
CREATE DATABASE IF NOT EXISTS `ortegas_drugstore` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `ortegas_drugstore`;

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `medicines`
--

CREATE TABLE `medicines` (
  `id` varchar(12) NOT NULL,
  `name` varchar(255) NOT NULL,
  `medicine_id` varchar(14) NOT NULL,
  `group` varchar(6) DEFAULT NULL,
  `qty` int(11) NOT NULL,
  `directions` longtext NOT NULL,
  `side_effects` longtext NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `medicines`
--

INSERT INTO `medicines` (`id`, `name`, `medicine_id`, `group`, `qty`, `directions`, `side_effects`, `created_at`, `updated_at`) VALUES
('130366168023', 'Ibupronazole', '111112', '472276', 100, 'sample', 'sample', '2024-10-17 10:21:30', '2024-10-17 10:21:30'),
('152373449375', 'Dolomet', '333338', '376620', 100, 'sample', 'sample', '2024-10-17 10:48:16', '2024-10-17 10:48:16'),
('163422278251', 'Ibuproprofen', '111117', '472276', 100, 'sample', 'sample', '2024-10-17 10:34:33', '2024-10-17 10:34:33'),
('238749468814', 'Amoxicillin', '111119', '472276', 100, 'sample', 'sample', '2024-10-17 10:34:57', '2024-10-17 10:34:57'),
('257652285596', 'Clariprofen', '333339', '376620', 100, 'sample', 'sample', '2024-10-17 10:48:35', '2024-10-17 10:48:35'),
('284321305440', 'Clarinazole', '222229', '841581', 100, 'sample', 'sample', '2024-10-17 10:41:18', '2024-10-17 10:41:18'),
('295480974123', 'Ibupromycin', '222228', '841581', 100, 'sample', 'sample', '2024-10-17 10:40:59', '2024-10-17 10:40:59'),
('301394734559', 'Ibupromycin', '111116', '472276', 100, 'sample', 'sample', '2024-10-17 10:23:55', '2024-10-17 10:23:55'),
('301746414499', 'Clarimycin', '222220', '841581', 100, 'sample', 'sample', '2024-10-17 10:41:46', '2024-10-17 10:41:46'),
('305951244409', 'Metocillin', '222227', '841581', 100, 'sample', 'sample', '2024-10-17 10:40:08', '2024-10-17 10:40:08'),
('315834941313', 'Dextrophen', '222221', '841581', 100, 'sample', 'sample', '2024-10-17 10:36:46', '2024-10-17 10:36:46'),
('386087662776', 'Clariprofen', '333337', '376620', 100, 'sample', 'sample', '2024-10-17 10:47:39', '2024-10-17 10:47:39'),
('433695704595', 'Acetophen', '111122', '472276', 100, 'sample', 'sample', '2024-10-17 10:35:59', '2024-10-17 10:35:59'),
('436449462784', 'Cefmet', '333332', '376620', 100, 'sample', 'sample', '2024-10-17 10:45:57', '2024-10-17 10:45:57'),
('505943218726', 'Doloprofen', '222226', '841581', 100, 'sample', 'sample', '2024-10-17 10:39:49', '2024-10-17 10:39:49'),
('561243594361', 'Metocillin', '111115', '472276', 100, 'sample', 'sample', '2024-10-17 10:23:31', '2024-10-17 10:23:31'),
('561346911867', 'Acetovir', '333335', '376620', 100, 'sample', 'sample', '2024-10-17 10:46:59', '2024-10-17 10:46:59'),
('564222836430', 'Clarivir', '111117', '472276', 100, 'sample', 'sample', '2024-10-17 10:25:57', '2024-10-17 10:25:57'),
('593491281892', 'Acetoprofen', '222225', '841581', 100, 'sample', 'sample', '2024-10-17 10:39:23', '2024-10-17 10:39:23'),
('621851740388', 'Clarimet', '333337', '376620', 100, 'sample', 'sample', '2024-10-17 10:47:59', '2024-10-17 10:47:59'),
('686585196332', 'Dextromycin', '222227', '841581', 100, 'sample', 'sample', '2024-10-17 10:40:31', '2024-10-17 10:40:31'),
('750010498942', 'Acetonazole', '333333', '376620', 100, 'sample', 'sample', '2024-10-17 10:46:19', '2024-10-17 10:46:19'),
('775966336301', 'Ibuprocillin', '333330', '376620', 100, 'sample', 'sample', '2024-10-17 10:48:57', '2024-10-17 10:48:57'),
('780714811783', 'Acetomycin', '111111', '472276', 100, 'sample', 'sample', '2024-10-17 10:19:52', '2024-10-17 10:19:52'),
('793195921607', 'Ibuprocillin', '222224', '841581', 100, 'sample', 'sample', '2024-10-17 10:38:58', '2024-10-17 10:38:58'),
('797149396331', 'Ibupromycin', '222222', '841581', 100, 'sample', 'sample', '2024-10-17 10:38:04', '2024-10-17 10:38:04'),
('829681937340', 'Cefmet', '111113', '472276', 100, 'sample', 'sample', '2024-10-17 10:22:14', '2024-10-17 10:22:14'),
('908273277352', 'Ibuproprofen', '333336', '376620', 100, 'sample', 'sample', '2024-10-17 10:47:20', '2024-10-17 10:47:20'),
('922099093979', 'Dolophen', '222223', '841581', 100, 'sample', 'sample', '2024-10-17 10:38:33', '2024-10-17 10:38:33'),
('963891611946', 'Amoximet', '111114', '472276', 100, 'sample', 'sample', '2024-10-17 10:23:10', '2024-10-17 10:23:10'),
('981317291698', 'Ibuprovir', '333331', '376620', 100, 'sample', 'sample<div><br></div>', '2024-10-17 10:45:38', '2024-10-17 10:45:38'),
('989030696138', 'Acetovir', '333334', '376620', 100, 'sample', 'sample', '2024-10-17 10:46:37', '2024-10-17 10:46:37');

-- --------------------------------------------------------

--
-- Table structure for table `medicine_groups`
--

CREATE TABLE `medicine_groups` (
  `id` varchar(6) NOT NULL,
  `number_meds` int(11) NOT NULL DEFAULT 0,
  `group_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `medicine_groups`
--

INSERT INTO `medicine_groups` (`id`, `number_meds`, `group_name`, `created_at`, `updated_at`) VALUES
('376620', 0, 'Antidepressant', '2024-10-17 10:45:17', '2024-10-17 10:45:17'),
('472276', 0, 'Analgesic', '2024-10-17 10:18:33', '2024-10-17 10:18:33'),
('841581', 0, 'Antibiotic', '2024-10-17 10:36:12', '2024-10-17 10:36:12');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2024_09_20_134723_create_user_admins_table', 1),
(5, '2024_09_23_064816_create_personal_access_tokens_table', 2),
(8, '2024_09_23_093751_create_medicines_table', 4),
(10, '2024_09_23_093350_create_medicine_groups_table', 5);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(7, 'App\\Models\\user_admins', 123321, 'main', '810c704a53008401963d60248a79fe1886718c3bd846f52a5425f630e7e97f7b', '[\"*\"]', '2024-10-17 10:09:09', NULL, '2024-10-05 06:17:40', '2024-10-17 10:09:09'),
(8, 'App\\Models\\user_admins', 123321, 'main', '15bd025b4dac3b621d93fa33da856b3a8e9ef686d8afb804baa8e5fb67d373df', '[\"*\"]', '2024-10-17 10:16:41', NULL, '2024-10-17 10:16:40', '2024-10-17 10:16:41');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_admins`
--

CREATE TABLE `user_admins` (
  `id` varchar(6) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `middlename` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_admins`
--

INSERT INTO `user_admins` (`id`, `firstname`, `middlename`, `lastname`, `email`, `username`, `password`, `created_at`, `updated_at`) VALUES
('123321', 'Yuma', NULL, 'Wakayama', 'yumawakayama@gmail.com', 'yuma123', 'yumawakayama123', '2024-09-20 14:05:15', '2024-09-20 14:05:15');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `medicines`
--
ALTER TABLE `medicines`
  ADD PRIMARY KEY (`id`),
  ADD KEY `medicines_group_foreign` (`group`);

--
-- Indexes for table `medicine_groups`
--
ALTER TABLE `medicine_groups`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indexes for table `user_admins`
--
ALTER TABLE `user_admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_admins_email_unique` (`email`),
  ADD UNIQUE KEY `user_admins_username_unique` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `medicines`
--
ALTER TABLE `medicines`
  ADD CONSTRAINT `medicines_group_foreign` FOREIGN KEY (`group`) REFERENCES `medicine_groups` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
--
-- Database: `phpmyadmin`
--
CREATE DATABASE IF NOT EXISTS `phpmyadmin` DEFAULT CHARACTER SET utf8 COLLATE utf8_bin;
USE `phpmyadmin`;

-- --------------------------------------------------------

--
-- Table structure for table `pma__bookmark`
--

CREATE TABLE `pma__bookmark` (
  `id` int(10) UNSIGNED NOT NULL,
  `dbase` varchar(255) NOT NULL DEFAULT '',
  `user` varchar(255) NOT NULL DEFAULT '',
  `label` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `query` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Bookmarks';

-- --------------------------------------------------------

--
-- Table structure for table `pma__central_columns`
--

CREATE TABLE `pma__central_columns` (
  `db_name` varchar(64) NOT NULL,
  `col_name` varchar(64) NOT NULL,
  `col_type` varchar(64) NOT NULL,
  `col_length` text DEFAULT NULL,
  `col_collation` varchar(64) NOT NULL,
  `col_isNull` tinyint(1) NOT NULL,
  `col_extra` varchar(255) DEFAULT '',
  `col_default` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Central list of columns';

-- --------------------------------------------------------

--
-- Table structure for table `pma__column_info`
--

CREATE TABLE `pma__column_info` (
  `id` int(5) UNSIGNED NOT NULL,
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `table_name` varchar(64) NOT NULL DEFAULT '',
  `column_name` varchar(64) NOT NULL DEFAULT '',
  `comment` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `mimetype` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `transformation` varchar(255) NOT NULL DEFAULT '',
  `transformation_options` varchar(255) NOT NULL DEFAULT '',
  `input_transformation` varchar(255) NOT NULL DEFAULT '',
  `input_transformation_options` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Column information for phpMyAdmin';

-- --------------------------------------------------------

--
-- Table structure for table `pma__designer_settings`
--

CREATE TABLE `pma__designer_settings` (
  `username` varchar(64) NOT NULL,
  `settings_data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Settings related to Designer';

--
-- Dumping data for table `pma__designer_settings`
--

INSERT INTO `pma__designer_settings` (`username`, `settings_data`) VALUES
('root', '{\"angular_direct\":\"direct\",\"relation_lines\":\"true\",\"snap_to_grid\":\"off\"}');

-- --------------------------------------------------------

--
-- Table structure for table `pma__export_templates`
--

CREATE TABLE `pma__export_templates` (
  `id` int(5) UNSIGNED NOT NULL,
  `username` varchar(64) NOT NULL,
  `export_type` varchar(10) NOT NULL,
  `template_name` varchar(64) NOT NULL,
  `template_data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Saved export templates';

-- --------------------------------------------------------

--
-- Table structure for table `pma__favorite`
--

CREATE TABLE `pma__favorite` (
  `username` varchar(64) NOT NULL,
  `tables` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Favorite tables';

-- --------------------------------------------------------

--
-- Table structure for table `pma__history`
--

CREATE TABLE `pma__history` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `username` varchar(64) NOT NULL DEFAULT '',
  `db` varchar(64) NOT NULL DEFAULT '',
  `table` varchar(64) NOT NULL DEFAULT '',
  `timevalue` timestamp NOT NULL DEFAULT current_timestamp(),
  `sqlquery` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='SQL history for phpMyAdmin';

-- --------------------------------------------------------

--
-- Table structure for table `pma__navigationhiding`
--

CREATE TABLE `pma__navigationhiding` (
  `username` varchar(64) NOT NULL,
  `item_name` varchar(64) NOT NULL,
  `item_type` varchar(64) NOT NULL,
  `db_name` varchar(64) NOT NULL,
  `table_name` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Hidden items of navigation tree';

-- --------------------------------------------------------

--
-- Table structure for table `pma__pdf_pages`
--

CREATE TABLE `pma__pdf_pages` (
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `page_nr` int(10) UNSIGNED NOT NULL,
  `page_descr` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='PDF relation pages for phpMyAdmin';

-- --------------------------------------------------------

--
-- Table structure for table `pma__recent`
--

CREATE TABLE `pma__recent` (
  `username` varchar(64) NOT NULL,
  `tables` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Recently accessed tables';

--
-- Dumping data for table `pma__recent`
--

INSERT INTO `pma__recent` (`username`, `tables`) VALUES
('root', '[{\"db\":\"ortegas_drugstore\",\"table\":\"medicine_groups\"},{\"db\":\"ortegas_drugstore\",\"table\":\"medicines\"},{\"db\":\"ortegas_drugstore\",\"table\":\"user_admins\"},{\"db\":\"ortegas_drugstore\",\"table\":\"users\"},{\"db\":\"aespa_dms\",\"table\":\"druggroups\"},{\"db\":\"aespa_dms\",\"table\":\"participants\"},{\"db\":\"aespa_dms\",\"table\":\"observations\"},{\"db\":\"aespa_dms\",\"table\":\"drugs\"},{\"db\":\"aespa_dms\",\"table\":\"drugassignments\"},{\"db\":\"aespaccis_sms\",\"table\":\"users\"}]');

-- --------------------------------------------------------

--
-- Table structure for table `pma__relation`
--

CREATE TABLE `pma__relation` (
  `master_db` varchar(64) NOT NULL DEFAULT '',
  `master_table` varchar(64) NOT NULL DEFAULT '',
  `master_field` varchar(64) NOT NULL DEFAULT '',
  `foreign_db` varchar(64) NOT NULL DEFAULT '',
  `foreign_table` varchar(64) NOT NULL DEFAULT '',
  `foreign_field` varchar(64) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Relation table';

-- --------------------------------------------------------

--
-- Table structure for table `pma__savedsearches`
--

CREATE TABLE `pma__savedsearches` (
  `id` int(5) UNSIGNED NOT NULL,
  `username` varchar(64) NOT NULL DEFAULT '',
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `search_name` varchar(64) NOT NULL DEFAULT '',
  `search_data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Saved searches';

-- --------------------------------------------------------

--
-- Table structure for table `pma__table_coords`
--

CREATE TABLE `pma__table_coords` (
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `table_name` varchar(64) NOT NULL DEFAULT '',
  `pdf_page_number` int(11) NOT NULL DEFAULT 0,
  `x` float UNSIGNED NOT NULL DEFAULT 0,
  `y` float UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Table coordinates for phpMyAdmin PDF output';

-- --------------------------------------------------------

--
-- Table structure for table `pma__table_info`
--

CREATE TABLE `pma__table_info` (
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `table_name` varchar(64) NOT NULL DEFAULT '',
  `display_field` varchar(64) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Table information for phpMyAdmin';

-- --------------------------------------------------------

--
-- Table structure for table `pma__table_uiprefs`
--

CREATE TABLE `pma__table_uiprefs` (
  `username` varchar(64) NOT NULL,
  `db_name` varchar(64) NOT NULL,
  `table_name` varchar(64) NOT NULL,
  `prefs` text NOT NULL,
  `last_update` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Tables'' UI preferences';

--
-- Dumping data for table `pma__table_uiprefs`
--

INSERT INTO `pma__table_uiprefs` (`username`, `db_name`, `table_name`, `prefs`, `last_update`) VALUES
('root', 'aespaccis_sms', 'machines', '{\"sorted_col\":\"`machines`.`UserAssigned` ASC\"}', '2024-09-23 03:29:59');

-- --------------------------------------------------------

--
-- Table structure for table `pma__tracking`
--

CREATE TABLE `pma__tracking` (
  `db_name` varchar(64) NOT NULL,
  `table_name` varchar(64) NOT NULL,
  `version` int(10) UNSIGNED NOT NULL,
  `date_created` datetime NOT NULL,
  `date_updated` datetime NOT NULL,
  `schema_snapshot` text NOT NULL,
  `schema_sql` text DEFAULT NULL,
  `data_sql` longtext DEFAULT NULL,
  `tracking` set('UPDATE','REPLACE','INSERT','DELETE','TRUNCATE','CREATE DATABASE','ALTER DATABASE','DROP DATABASE','CREATE TABLE','ALTER TABLE','RENAME TABLE','DROP TABLE','CREATE INDEX','DROP INDEX','CREATE VIEW','ALTER VIEW','DROP VIEW') DEFAULT NULL,
  `tracking_active` int(1) UNSIGNED NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Database changes tracking for phpMyAdmin';

-- --------------------------------------------------------

--
-- Table structure for table `pma__userconfig`
--

CREATE TABLE `pma__userconfig` (
  `username` varchar(64) NOT NULL,
  `timevalue` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `config_data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='User preferences storage for phpMyAdmin';

--
-- Dumping data for table `pma__userconfig`
--

INSERT INTO `pma__userconfig` (`username`, `timevalue`, `config_data`) VALUES
('root', '2024-10-17 18:50:07', '{\"Console\\/Mode\":\"collapse\"}');

-- --------------------------------------------------------

--
-- Table structure for table `pma__usergroups`
--

CREATE TABLE `pma__usergroups` (
  `usergroup` varchar(64) NOT NULL,
  `tab` varchar(64) NOT NULL,
  `allowed` enum('Y','N') NOT NULL DEFAULT 'N'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='User groups with configured menu items';

-- --------------------------------------------------------

--
-- Table structure for table `pma__users`
--

CREATE TABLE `pma__users` (
  `username` varchar(64) NOT NULL,
  `usergroup` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Users and their assignments to user groups';

--
-- Indexes for dumped tables
--

--
-- Indexes for table `pma__bookmark`
--
ALTER TABLE `pma__bookmark`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pma__central_columns`
--
ALTER TABLE `pma__central_columns`
  ADD PRIMARY KEY (`db_name`,`col_name`);

--
-- Indexes for table `pma__column_info`
--
ALTER TABLE `pma__column_info`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `db_name` (`db_name`,`table_name`,`column_name`);

--
-- Indexes for table `pma__designer_settings`
--
ALTER TABLE `pma__designer_settings`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `pma__export_templates`
--
ALTER TABLE `pma__export_templates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `u_user_type_template` (`username`,`export_type`,`template_name`);

--
-- Indexes for table `pma__favorite`
--
ALTER TABLE `pma__favorite`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `pma__history`
--
ALTER TABLE `pma__history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `username` (`username`,`db`,`table`,`timevalue`);

--
-- Indexes for table `pma__navigationhiding`
--
ALTER TABLE `pma__navigationhiding`
  ADD PRIMARY KEY (`username`,`item_name`,`item_type`,`db_name`,`table_name`);

--
-- Indexes for table `pma__pdf_pages`
--
ALTER TABLE `pma__pdf_pages`
  ADD PRIMARY KEY (`page_nr`),
  ADD KEY `db_name` (`db_name`);

--
-- Indexes for table `pma__recent`
--
ALTER TABLE `pma__recent`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `pma__relation`
--
ALTER TABLE `pma__relation`
  ADD PRIMARY KEY (`master_db`,`master_table`,`master_field`),
  ADD KEY `foreign_field` (`foreign_db`,`foreign_table`);

--
-- Indexes for table `pma__savedsearches`
--
ALTER TABLE `pma__savedsearches`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `u_savedsearches_username_dbname` (`username`,`db_name`,`search_name`);

--
-- Indexes for table `pma__table_coords`
--
ALTER TABLE `pma__table_coords`
  ADD PRIMARY KEY (`db_name`,`table_name`,`pdf_page_number`);

--
-- Indexes for table `pma__table_info`
--
ALTER TABLE `pma__table_info`
  ADD PRIMARY KEY (`db_name`,`table_name`);

--
-- Indexes for table `pma__table_uiprefs`
--
ALTER TABLE `pma__table_uiprefs`
  ADD PRIMARY KEY (`username`,`db_name`,`table_name`);

--
-- Indexes for table `pma__tracking`
--
ALTER TABLE `pma__tracking`
  ADD PRIMARY KEY (`db_name`,`table_name`,`version`);

--
-- Indexes for table `pma__userconfig`
--
ALTER TABLE `pma__userconfig`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `pma__usergroups`
--
ALTER TABLE `pma__usergroups`
  ADD PRIMARY KEY (`usergroup`,`tab`,`allowed`);

--
-- Indexes for table `pma__users`
--
ALTER TABLE `pma__users`
  ADD PRIMARY KEY (`username`,`usergroup`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `pma__bookmark`
--
ALTER TABLE `pma__bookmark`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pma__column_info`
--
ALTER TABLE `pma__column_info`
  MODIFY `id` int(5) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pma__export_templates`
--
ALTER TABLE `pma__export_templates`
  MODIFY `id` int(5) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pma__history`
--
ALTER TABLE `pma__history`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pma__pdf_pages`
--
ALTER TABLE `pma__pdf_pages`
  MODIFY `page_nr` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pma__savedsearches`
--
ALTER TABLE `pma__savedsearches`
  MODIFY `id` int(5) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- Database: `test`
--
CREATE DATABASE IF NOT EXISTS `test` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `test`;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
