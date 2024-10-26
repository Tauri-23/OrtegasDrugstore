-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 23, 2024 at 07:41 PM
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
  `pic` text DEFAULT NULL,
  `group` varchar(6) DEFAULT NULL,
  `qty` int(11) NOT NULL,
  `price` double NOT NULL DEFAULT 0,
  `directions` longtext NOT NULL,
  `side_effects` longtext NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `medicines`
--

INSERT INTO `medicines` (`id`, `name`, `medicine_id`, `pic`, `group`, `qty`, `price`, `directions`, `side_effects`, `created_at`, `updated_at`) VALUES
('130366168023', 'Ibupronazole', '111112', NULL, '472276', 100, 50, 'sample', 'sample', '2024-10-17 02:21:30', '2024-10-17 02:21:30'),
('152373449375', 'Dolomet', '333338', NULL, '376620', 100, 120, 'sample', 'sample', '2024-10-17 02:48:16', '2024-10-17 02:48:16'),
('163422278251', 'Ibuproprofen', '111117', NULL, '472276', 100, 21, 'sample', 'sample', '2024-10-17 02:34:33', '2024-10-17 02:34:33'),
('238749468814', 'Amoxicillin', '111119', NULL, '472276', 100, 20, 'sample', 'sample', '2024-10-17 02:34:57', '2024-10-17 02:34:57'),
('257652285596', 'Clariprofen', '333339', NULL, '376620', 100, 20, 'sample', 'sample', '2024-10-17 02:48:35', '2024-10-17 02:48:35'),
('284321305440', 'Clarinazole', '222229', NULL, '841581', 100, 25, 'sample', 'sample', '2024-10-17 02:41:18', '2024-10-17 02:41:18'),
('295480974123', 'Ibupromycin', '222228', NULL, '841581', 100, 22, 'sample', 'sample', '2024-10-17 02:40:59', '2024-10-17 02:40:59'),
('301394734559', 'Ibupromycin', '111116', NULL, '472276', 100, 20, 'sample', 'sample', '2024-10-17 02:23:55', '2024-10-17 02:23:55'),
('301746414499', 'Clarimycin', '222220', NULL, '841581', 100, 20, 'sample', 'sample', '2024-10-17 02:41:46', '2024-10-17 02:41:46'),
('305951244409', 'Metocillin', '222227', NULL, '841581', 100, 223, 'sample', 'sample', '2024-10-17 02:40:08', '2024-10-17 02:40:08'),
('315834941313', 'Dextrophen', '222221', NULL, '841581', 100, 20, 'sample', 'sample', '2024-10-17 02:36:46', '2024-10-17 02:36:46'),
('386087662776', 'Clariprofen', '333337', NULL, '376620', 100, 110, 'sample', 'sample', '2024-10-17 02:47:39', '2024-10-17 02:47:39'),
('433695704595', 'Acetophen', '111122', NULL, '472276', 100, 30, 'sample', 'sample', '2024-10-17 02:35:59', '2024-10-17 02:35:59'),
('436449462784', 'Cefmet', '333332', NULL, '376620', 100, 30, 'sample', 'sample', '2024-10-17 02:45:57', '2024-10-17 02:45:57'),
('505943218726', 'Doloprofen', '222226', NULL, '841581', 100, 30, 'sample', 'sample', '2024-10-17 02:39:49', '2024-10-17 02:39:49'),
('561243594361', 'Metocillin', '111115', NULL, '472276', 100, 32, 'sample', 'sample', '2024-10-17 02:23:31', '2024-10-17 02:23:31'),
('561346911867', 'Acetovir', '333335', NULL, '376620', 100, 33, 'sample', 'sample', '2024-10-17 02:46:59', '2024-10-17 02:46:59'),
('564222836430', 'Clarivir', '111117', NULL, '472276', 100, 32, 'sample', 'sample', '2024-10-17 02:25:57', '2024-10-17 02:25:57'),
('593491281892', 'Acetoprofen', '222225', NULL, '841581', 100, 30, 'sample', 'sample', '2024-10-17 02:39:23', '2024-10-17 02:39:23'),
('621851740388', 'Clarimet', '333337', NULL, '376620', 100, 30, 'sample', 'sample', '2024-10-17 02:47:59', '2024-10-17 02:47:59'),
('686585196332', 'Dextromycin', '222227', NULL, '841581', 100, 301, 'sample', 'sample', '2024-10-17 02:40:31', '2024-10-17 02:40:31'),
('750010498942', 'Acetonazole', '333333', NULL, '376620', 100, 33, 'sample', 'sample', '2024-10-17 02:46:19', '2024-10-17 02:46:19'),
('775966336301', 'Ibuprocillin', '333330', NULL, '376620', 100, 30, 'sample', 'sample', '2024-10-17 02:48:57', '2024-10-17 02:48:57'),
('780714811783', 'Acetomycin', '111111', NULL, '472276', 100, 12, 'sample', 'sample', '2024-10-17 02:19:52', '2024-10-17 02:19:52'),
('793195921607', 'Ibuprocillin', '222224', NULL, '841581', 100, 43, 'sample', 'sample', '2024-10-17 02:38:58', '2024-10-17 02:38:58'),
('797149396331', 'Ibupromycin', '222222', NULL, '841581', 100, 32, 'sample', 'sample', '2024-10-17 02:38:04', '2024-10-17 02:38:04'),
('829681937340', 'Cefmet', '111113', NULL, '472276', 100, 30, 'sample', 'sample', '2024-10-17 02:22:14', '2024-10-17 02:22:14'),
('908273277352', 'Ibuproprofen', '333336', NULL, '376620', 100, 23, 'sample', 'sample', '2024-10-17 02:47:20', '2024-10-17 02:47:20'),
('922099093979', 'Dolophen', '222223', NULL, '841581', 100, 23, 'sample', 'sample', '2024-10-17 02:38:33', '2024-10-17 02:38:33'),
('963891611946', 'Amoximet', '111114', NULL, '472276', 100, 23, 'sample', 'sample', '2024-10-17 02:23:10', '2024-10-17 02:23:10'),
('981317291698', 'Ibuprovir', '333331', NULL, '376620', 100, 23, 'sample', 'sample<div><br></div>', '2024-10-17 02:45:38', '2024-10-17 02:45:38'),
('989030696138', 'Acetovir', '333334', NULL, '376620', 100, 23, 'sample', 'sample', '2024-10-17 02:46:37', '2024-10-17 02:46:37');

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
(10, '2024_09_23_093350_create_medicine_groups_table', 5),
(11, '2024_09_23_093751_create_medicines_table', 6);

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
(7, 'App\\Models\\user_admins', 123321, 'main', '810c704a53008401963d60248a79fe1886718c3bd846f52a5425f630e7e97f7b', '[\"*\"]', '2024-10-23 09:40:08', NULL, '2024-10-05 06:17:40', '2024-10-23 09:40:08'),
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
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
