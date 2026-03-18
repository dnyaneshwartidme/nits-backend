-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 18, 2026 at 06:56 AM
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
-- Database: `nits_academy`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_users`
--

CREATE TABLE `admin_users` (
  `aid` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_users`
--

INSERT INTO `admin_users` (`aid`, `username`, `password`, `created_at`) VALUES
(1, 'admin', '$2a$10$hjg/XKgdYO2a5a3tEcqcNuCDNGG68cMX.Vi4yVMlA0D8MMAra/8Tq', '2026-03-11 07:01:14');

-- --------------------------------------------------------

--
-- Table structure for table `attendance_log`
--

CREATE TABLE `attendance_log` (
  `log_id` bigint(20) NOT NULL,
  `sid` int(11) NOT NULL,
  `attendance_date` date NOT NULL,
  `in_time` varchar(20) DEFAULT NULL,
  `out_time` varchar(20) DEFAULT NULL,
  `total_hours` varchar(10) DEFAULT NULL,
  `topic` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `branch_and_degree`
--

CREATE TABLE `branch_and_degree` (
  `bdi` int(11) NOT NULL,
  `type` varchar(100) DEFAULT NULL,
  `branch` varchar(100) DEFAULT NULL,
  `degree` varchar(100) DEFAULT NULL,
  `sr_no` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `branch_and_degree`
--

INSERT INTO `branch_and_degree` (`bdi`, `type`, `branch`, `degree`, `sr_no`) VALUES
(1, 'degree', NULL, 'B.E', 1),
(2, 'degree', NULL, 'B.Tech', 2),
(3, 'degree', NULL, 'M.E', 3),
(4, 'branch', 'Computer Science', NULL, 1),
(5, 'branch', 'Mechanical', NULL, 2),
(6, 'branch', 'Civil Engineering', NULL, 3),
(8, 'branch', 'Computer Engineering (CE / CSE)', NULL, 2),
(9, 'branch', 'Information Technology (IT)', NULL, 3),
(10, 'branch', 'Mechanical Engineering (ME)', NULL, 4),
(11, 'branch', 'Civil Engineering (CE)', NULL, 5),
(12, 'branch', 'Electrical Engineering (EE)', NULL, 6),
(13, 'branch', 'Electronics & Telecommunication (ENTC / ECE)', NULL, 7),
(14, 'branch', 'Artificial Intelligence & Data Science (AI & DS)', NULL, 8),
(15, 'branch', 'Artificial Intelligence & Machine Learning (AI & ML)', NULL, 9),
(16, 'branch', 'Mechatronics Engineering', NULL, 10),
(17, 'branch', 'Chemical Engineering', NULL, 11),
(18, 'branch', 'Robotics Engineering', NULL, 12),
(19, 'branch', 'Commerce Branche', NULL, 13),
(20, 'branch', 'Arts Branche', NULL, 14),
(21, 'degree', NULL, 'BCA', 2),
(22, 'degree', NULL, 'MCA', 3),
(23, 'degree', NULL, 'BSc', 4),
(24, 'degree', NULL, 'MSc', 5),
(25, 'degree', NULL, 'B-Tech', 6),
(26, 'degree', NULL, 'M-Tech', 7),
(27, 'degree', NULL, 'MBA', 8),
(28, 'degree', NULL, 'BE', 9),
(29, 'degree', NULL, 'ME', 10),
(30, 'degree', NULL, 'BPharm', 11),
(31, 'degree', NULL, 'Diploma', 12),
(32, 'degree', NULL, 'BA', 13),
(33, 'degree', NULL, 'MA', 14),
(34, 'degree', NULL, 'B-Com', 15),
(35, 'degree', NULL, 'M-Com', 16);

-- --------------------------------------------------------

--
-- Table structure for table `course`
--

CREATE TABLE `course` (
  `cid` int(11) NOT NULL,
  `course_id` varchar(100) NOT NULL,
  `course_name` varchar(255) NOT NULL,
  `duration` varchar(100) DEFAULT NULL,
  `sr_no` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `course`
--

INSERT INTO `course` (`cid`, `course_id`, `course_name`, `duration`, `sr_no`) VALUES
(1, 'CS101', 'Full Stack MERN', '6 Months', 2),
(2, 'DA102', 'Data Analytics', '4 Months', 3),
(3, 'AI103', 'Machine Learning', '8 Months', 1),
(4, 'HT104', 'HTML', '15 Day', 4);

-- --------------------------------------------------------

--
-- Table structure for table `email_settings`
--

CREATE TABLE `email_settings` (
  `id` int(11) NOT NULL,
  `smtp_email` varchar(255) DEFAULT '',
  `smtp_password` varchar(255) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `email_settings`
--

INSERT INTO `email_settings` (`id`, `smtp_email`, `smtp_password`) VALUES
(1, 'tidmednyaneshwar@gmail.com', 'kzaqiicofvtqzdkj');

-- --------------------------------------------------------

--
-- Table structure for table `enrollment`
--

CREATE TABLE `enrollment` (
  `eid` int(11) NOT NULL,
  `sid` int(11) DEFAULT NULL,
  `cid` int(11) DEFAULT NULL,
  `iid` int(11) DEFAULT NULL,
  `type` varchar(50) DEFAULT 'course',
  `status` varchar(100) DEFAULT 'active',
  `enrollment_date` date DEFAULT NULL,
  `certificate_no` varchar(255) DEFAULT NULL,
  `exal_file` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `enrollment`
--

INSERT INTO `enrollment` (`eid`, `sid`, `cid`, `iid`, `type`, `status`, `enrollment_date`, `certificate_no`, `exal_file`) VALUES
(27, 27, 1, 2, 'internship', 'active', '2026-03-18', 'NITS/IS/3/260318/0027', 'March_2026.xlsx');

-- --------------------------------------------------------

--
-- Table structure for table `exam_questions`
--

CREATE TABLE `exam_questions` (
  `qid` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `question_text` text NOT NULL,
  `option_a` varchar(255) NOT NULL,
  `option_b` varchar(255) NOT NULL,
  `option_c` varchar(255) NOT NULL,
  `option_d` varchar(255) NOT NULL,
  `correct_option` enum('A','B','C','D') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `exam_questions`
--

INSERT INTO `exam_questions` (`qid`, `subject_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`, `created_at`) VALUES
(1, 1, 'What is React?', 'A UI library', 'A database', 'An OS', 'A browser', 'A', '2026-03-14 05:03:32'),
(2, 1, 'Which concept is NOT part of React?', 'Components', 'States', 'Props', 'Tables', 'D', '2026-03-14 05:03:32'),
(3, 1, 'What is JSX?', 'JavaScript XML', 'Java Syntax Extension', 'JSON X', 'JavaScript X-Factor', 'A', '2026-03-14 05:31:44'),
(4, 2, 'What does HTML stand for?', 'Hyper Text Markup Language', 'Home Tool Markup Language', 'Hyperlinks Text Mark Language', 'Hex Text Markup Language', 'A', '2026-03-14 05:03:32'),
(5, 2, 'Which HTML tag is used to define an internal style sheet?', '<script>', '<css>', '<style>', '<design>', 'C', '2026-03-14 05:03:32'),
(6, 2, 'What does CSS stand for?', 'Cascading Style Sheets', 'Creative Style System', 'Computer Style Sheet', 'Colorful Style Sheets', 'A', '2026-03-18 05:48:21'),
(7, 2, 'Which HTML tag is used to create a hyperlink?', '<a>', '<link>', '<href>', '<url>', 'A', '2026-03-18 05:48:21'),
(8, 2, 'Which CSS property controls text size?', 'font-style', 'text-size', 'font-size', 'text-style', 'C', '2026-03-18 05:48:21'),
(9, 2, 'Which HTML tag is used for images?', '<img>', '<image>', '<pic>', '<src>', 'A', '2026-03-18 05:48:21'),
(10, 2, 'Which attribute is used to provide an alternate text for an image?', 'title', 'alt', 'src', 'href', 'B', '2026-03-18 05:48:21'),
(11, 2, 'Which HTML element is used for the largest heading?', '<h6>', '<heading>', '<h1>', '<head>', 'C', '2026-03-18 05:48:21'),
(12, 2, 'Which CSS property changes background color?', 'color', 'bgcolor', 'background-color', 'background', 'C', '2026-03-18 05:48:21'),
(13, 2, 'Which HTML tag is used to define a table?', '<table>', '<tab>', '<tr>', '<td>', 'A', '2026-03-18 05:48:21'),
(14, 2, 'Which CSS property is used to change text color?', 'text-color', 'color', 'font-color', 'text-style', 'B', '2026-03-18 05:48:21'),
(15, 2, 'Which HTML tag is used to create a line break?', '<br>', '<break>', '<lb>', '<newline>', 'A', '2026-03-18 05:48:21'),
(16, 2, 'Which CSS property controls the space between elements?', 'spacing', 'margin', 'padding', 'border', 'B', '2026-03-18 05:48:21'),
(17, 2, 'Which HTML tag is used to define a paragraph?', '<p>', '<para>', '<text>', '<pg>', 'A', '2026-03-18 05:48:21'),
(18, 2, 'Which CSS property is used for bold text?', 'font-weight', 'text-bold', 'bold', 'weight', 'A', '2026-03-18 05:48:21'),
(19, 2, 'Which HTML attribute specifies a unique id?', 'class', 'id', 'name', 'key', 'B', '2026-03-18 05:48:21'),
(20, 2, 'Which CSS property sets the font type?', 'font-family', 'font-style', 'font-type', 'text-font', 'A', '2026-03-18 05:48:21'),
(21, 2, 'Which HTML tag is used to create an ordered list?', '<ol>', '<ul>', '<li>', '<list>', 'A', '2026-03-18 05:48:21'),
(22, 2, 'Which CSS property controls element width?', 'size', 'width', 'length', 'dimension', 'B', '2026-03-18 05:48:21'),
(23, 2, 'Which HTML tag is used to create a form?', '<form>', '<input>', '<submit>', '<button>', 'A', '2026-03-18 05:48:21'),
(24, 2, 'Which CSS property is used for borders?', 'border', 'outline', 'frame', 'line', 'A', '2026-03-18 05:48:21'),
(25, 2, 'Which HTML tag is used for table rows?', '<tr>', '<td>', '<th>', '<row>', 'A', '2026-03-18 05:48:21'),
(26, 2, 'Which CSS property controls padding?', 'margin', 'spacing', 'padding', 'gap', 'C', '2026-03-18 05:48:21'),
(27, 2, 'Which HTML tag is used for list items?', '<li>', '<ul>', '<ol>', '<item>', 'A', '2026-03-18 05:48:21'),
(28, 2, 'Which CSS property makes text italic?', 'font-style', 'italic', 'text-style', 'style', 'A', '2026-03-18 05:48:21'),
(29, 2, 'Which HTML tag is used to define metadata?', '<meta>', '<data>', '<info>', '<head>', 'A', '2026-03-18 05:48:21'),
(30, 2, 'Which CSS property sets background image?', 'background-img', 'bg-image', 'background-image', 'image-bg', 'C', '2026-03-18 05:48:21'),
(31, 2, 'Which HTML tag is used to embed video?', '<video>', '<media>', '<movie>', '<vid>', 'A', '2026-03-18 05:48:21'),
(32, 2, 'Which CSS property controls display type?', 'display', 'visibility', 'show', 'view', 'A', '2026-03-18 05:48:21'),
(33, 2, 'Which HTML tag is used for input field?', '<input>', '<form>', '<text>', '<field>', 'A', '2026-03-18 05:48:21'),
(34, 2, 'Which CSS property controls position?', 'position', 'align', 'place', 'float', 'A', '2026-03-18 05:48:21'),
(35, 2, 'Which HTML tag defines navigation links?', '<nav>', '<menu>', '<links>', '<navigate>', 'A', '2026-03-18 05:48:21'),
(36, 2, 'Which CSS property controls overflow?', 'overflow', 'scroll', 'hidden', 'clip', 'A', '2026-03-18 05:48:21'),
(37, 2, 'Which HTML tag is used for footer?', '<footer>', '<bottom>', '<end>', '<foot>', 'A', '2026-03-18 05:48:21'),
(38, 2, 'Which CSS property aligns text?', 'align', 'text-align', 'font-align', 'justify', 'B', '2026-03-18 05:48:21'),
(39, 2, 'Which HTML tag is used for header?', '<header>', '<top>', '<head>', '<title>', 'A', '2026-03-18 05:48:21'),
(40, 2, 'Which CSS property controls visibility?', 'display', 'visibility', 'show', 'view', 'B', '2026-03-18 05:48:21'),
(41, 2, 'Which HTML tag is used for division?', '<div>', '<section>', '<span>', '<box>', 'A', '2026-03-18 05:48:21'),
(42, 2, 'Which CSS property sets opacity?', 'opacity', 'visibility', 'alpha', 'transparent', 'A', '2026-03-18 05:48:21'),
(43, 2, 'Which HTML tag is inline element?', '<span>', '<div>', '<p>', '<section>', 'A', '2026-03-18 05:48:21'),
(44, 2, 'Which CSS property sets z-index?', 'z-index', 'layer', 'index', 'depth', 'A', '2026-03-18 05:48:21'),
(45, 2, 'Which HTML tag is used for checkbox?', '<input type=\"checkbox\">', '<checkbox>', '<check>', '<tick>', 'A', '2026-03-18 05:48:21'),
(46, 2, 'Which CSS property sets flexbox?', 'flex', 'flexbox', 'display:flex', 'box-flex', 'C', '2026-03-18 05:48:21'),
(47, 2, 'Which HTML tag is used for button?', '<button>', '<btn>', '<click>', '<input>', 'A', '2026-03-18 05:48:21'),
(48, 2, 'Which CSS property is used for grid?', 'grid', 'display:grid', 'layout', 'grid-system', 'B', '2026-03-18 05:48:21'),
(49, 2, 'Which HTML tag is used for title?', '<title>', '<head>', '<meta>', '<header>', 'A', '2026-03-18 05:48:21'),
(50, 2, 'Which CSS property controls cursor?', 'cursor', 'pointer', 'mouse', 'hover', 'A', '2026-03-18 05:48:21'),
(51, 2, 'Which HTML tag is used for iframe?', '<iframe>', '<frame>', '<embed>', '<object>', 'A', '2026-03-18 05:48:21'),
(52, 2, 'Which CSS property controls shadow?', 'shadow', 'box-shadow', 'text-shadow', 'both', 'D', '2026-03-18 05:48:21'),
(53, 2, 'Which HTML tag is used for audio?', '<audio>', '<sound>', '<music>', '<media>', 'A', '2026-03-18 05:48:21'),
(54, 2, 'Which CSS property controls transition?', 'transition', 'animation', 'transform', 'change', 'A', '2026-03-18 05:48:21'),
(55, 2, 'Which HTML tag is used for script?', '<script>', '<js>', '<code>', '<program>', 'A', '2026-03-18 05:48:21'),
(56, 2, 'What will this HTML display?\n<h1>Hello</h1>', 'Big heading', 'Small text', 'Paragraph', 'Nothing', 'A', '2026-03-18 05:49:56'),
(57, 2, 'What is output?\n<p>Hi</p>', 'Paragraph text', 'Heading', 'Link', 'Image', 'A', '2026-03-18 05:49:56'),
(58, 2, 'What does this do?\n<a href=\"#\">Click</a>', 'Creates link', 'Creates button', 'Creates image', 'Nothing', 'A', '2026-03-18 05:49:56'),
(59, 2, 'What will be shown?\n<img src=\"img.jpg\" alt=\"pic\">', 'Image', 'Text only', 'Error', 'Nothing', 'A', '2026-03-18 05:49:56'),
(60, 2, 'What does CSS do?\np { color:red; }', 'Text red', 'Background red', 'Border red', 'Nothing', 'A', '2026-03-18 05:49:56'),
(61, 2, 'Output?\n<div style=\"color:blue\">Hi</div>', 'Blue text', 'Red text', 'Green text', 'Black text', 'A', '2026-03-18 05:49:56'),
(62, 2, 'What happens?\n<p style=\"font-size:20px\">Text</p>', 'Big text', 'Small text', 'Hidden', 'Italic', 'A', '2026-03-18 05:49:56'),
(63, 2, 'What does this show?\n<ul><li>A</li></ul>', 'List', 'Paragraph', 'Table', 'Image', 'A', '2026-03-18 05:49:56'),
(64, 2, 'Output?\n<ol><li>One</li></ol>', 'Number list', 'Bullet list', 'Table', 'Text', 'A', '2026-03-18 05:49:56'),
(65, 2, 'What is result?\n<span>Hello</span>', 'Inline text', 'Block element', 'Image', 'Link', 'A', '2026-03-18 05:49:56'),
(66, 2, 'What happens?\n<div>Hello</div>', 'Block element', 'Inline', 'Link', 'Image', 'A', '2026-03-18 05:49:56'),
(67, 2, 'Output?\n<p><b>Hi</b></p>', 'Bold text', 'Italic text', 'Normal', 'Hidden', 'A', '2026-03-18 05:49:56'),
(68, 2, 'What does this do?\n<p><i>Hi</i></p>', 'Italic text', 'Bold', 'Underline', 'Normal', 'A', '2026-03-18 05:49:56'),
(69, 2, 'What will display?\n<p><u>Hi</u></p>', 'Underline text', 'Bold', 'Italic', 'None', 'A', '2026-03-18 05:49:56'),
(70, 2, 'CSS effect?\np { background:red; }', 'Red background', 'Red text', 'Border red', 'Nothing', 'A', '2026-03-18 05:49:56'),
(71, 2, 'What happens?\ndiv { width:100px; }', 'Set width', 'Set height', 'Set color', 'Nothing', 'A', '2026-03-18 05:49:56'),
(72, 2, 'Output?\np { text-align:center; }', 'Center text', 'Left', 'Right', 'Hidden', 'A', '2026-03-18 05:49:56'),
(73, 2, 'Result?\np { margin:10px; }', 'Space outside', 'Space inside', 'Border', 'None', 'A', '2026-03-18 05:49:56'),
(74, 2, 'Result?\np { padding:10px; }', 'Space inside', 'Outside', 'Border', 'None', 'A', '2026-03-18 05:49:56'),
(75, 2, 'What happens?\np { border:1px solid; }', 'Adds border', 'Adds color', 'Adds margin', 'None', 'A', '2026-03-18 05:49:56'),
(76, 2, 'Output?\n<h1 style=\"color:green\">Hi</h1>', 'Green heading', 'Red heading', 'Blue', 'None', 'A', '2026-03-18 05:49:56'),
(77, 2, 'What does this do?\n<input type=\"text\">', 'Text input', 'Button', 'Checkbox', 'None', 'A', '2026-03-18 05:49:56'),
(78, 2, 'Output?\n<input type=\"checkbox\">', 'Checkbox', 'Button', 'Text', 'None', 'A', '2026-03-18 05:49:56'),
(79, 2, 'Output?\n<button>Click</button>', 'Button', 'Link', 'Image', 'Text', 'A', '2026-03-18 05:49:56'),
(80, 2, 'What happens?\n<form></form>', 'Creates form', 'Creates table', 'Creates div', 'None', 'A', '2026-03-18 05:49:56'),
(81, 2, 'Output?\n<table><tr><td>A</td></tr></table>', 'Table', 'List', 'Div', 'Text', 'A', '2026-03-18 05:49:56'),
(82, 2, 'CSS?\ndiv { display:none; }', 'Hide element', 'Show element', 'Color change', 'None', 'A', '2026-03-18 05:49:56'),
(83, 2, 'CSS?\ndiv { display:block; }', 'Block element', 'Inline', 'Hidden', 'None', 'A', '2026-03-18 05:49:56'),
(84, 2, 'CSS?\ndiv { display:inline; }', 'Inline element', 'Block', 'Hidden', 'None', 'A', '2026-03-18 05:49:56'),
(85, 2, 'CSS?\ndiv { position:absolute; }', 'Absolute position', 'Relative', 'Static', 'None', 'A', '2026-03-18 05:49:56'),
(86, 2, 'Output?\n<p style=\"color:red\">Hi</p>', 'Red text', 'Blue', 'Green', 'Black', 'A', '2026-03-18 05:49:56'),
(87, 2, 'CSS?\np { font-weight:bold; }', 'Bold text', 'Italic', 'Underline', 'None', 'A', '2026-03-18 05:49:56'),
(88, 2, 'CSS?\np { font-style:italic; }', 'Italic text', 'Bold', 'Underline', 'None', 'A', '2026-03-18 05:49:56'),
(89, 2, 'CSS?\np { text-decoration:underline; }', 'Underline', 'Bold', 'Italic', 'None', 'A', '2026-03-18 05:49:56'),
(90, 2, 'Output?\n<a href=\"google.com\">Go</a>', 'Link', 'Button', 'Image', 'Text', 'A', '2026-03-18 05:49:56'),
(91, 2, 'CSS?\ndiv { background:yellow; }', 'Yellow background', 'Yellow text', 'Border', 'None', 'A', '2026-03-18 05:49:56'),
(92, 2, 'CSS?\ndiv { height:100px; }', 'Set height', 'Set width', 'Color', 'None', 'A', '2026-03-18 05:49:56'),
(93, 2, 'CSS?\ndiv { overflow:hidden; }', 'Hide overflow', 'Scroll', 'Show', 'None', 'A', '2026-03-18 05:49:56'),
(94, 2, 'CSS?\ndiv { cursor:pointer; }', 'Pointer cursor', 'Text cursor', 'None', 'Default', 'A', '2026-03-18 05:49:56'),
(95, 2, 'CSS?\ndiv { opacity:0.5; }', 'Half visible', 'Hidden', 'Full', 'None', 'A', '2026-03-18 05:49:56'),
(96, 2, 'CSS?\ndiv { z-index:10; }', 'Layer order', 'Color', 'Size', 'None', 'A', '2026-03-18 05:49:56'),
(97, 2, 'Output?\n<iframe src=\"a.html\"></iframe>', 'Embed page', 'Image', 'Text', 'None', 'A', '2026-03-18 05:49:56'),
(98, 2, 'Output?\n<audio controls></audio>', 'Audio player', 'Video', 'Text', 'None', 'A', '2026-03-18 05:49:56'),
(99, 2, 'Output?\n<video controls></video>', 'Video player', 'Audio', 'Text', 'None', 'A', '2026-03-18 05:49:56'),
(100, 2, 'CSS?\ndiv { box-shadow:2px 2px; }', 'Shadow', 'Border', 'Color', 'None', 'A', '2026-03-18 05:49:56'),
(101, 2, 'CSS?\ndiv { transition:1s; }', 'Animation', 'Color', 'Size', 'None', 'A', '2026-03-18 05:49:56'),
(102, 2, 'CSS?\ndiv { transform:scale(2); }', 'Zoom', 'Rotate', 'Move', 'None', 'A', '2026-03-18 05:49:56'),
(103, 2, 'CSS?\ndiv { display:flex; }', 'Flex layout', 'Grid', 'Inline', 'None', 'A', '2026-03-18 05:49:56'),
(104, 2, 'CSS?\ndiv { display:grid; }', 'Grid layout', 'Flex', 'Inline', 'None', 'A', '2026-03-18 05:49:56'),
(105, 2, 'Output?\n<p>Hello<br>World</p>', 'Line break', 'Single line', 'Bold', 'None', 'A', '2026-03-18 05:49:56'),
(106, 2, 'What is output?\n<div style=\"width:100px;padding:10px;\">Box</div>', '120px', '100px', '110px', 'Depends on box-sizing', 'D', '2026-03-18 05:55:55'),
(107, 2, 'What happens?\ndiv { display:inline; width:100px; }', 'Width ignored', 'Width applied', 'Error', 'Hidden', 'A', '2026-03-18 05:55:55'),
(108, 2, 'Output?\n<p style=\"display:none\">Hi</p>', 'Hidden', 'Visible', 'Space remains', 'Error', 'A', '2026-03-18 05:55:55'),
(109, 2, 'Output?\n<p style=\"visibility:hidden\">Hi</p>', 'Hidden with space', 'Removed', 'Visible', 'Error', 'A', '2026-03-18 05:55:55'),
(110, 2, 'What happens?\ndiv { position:absolute; top:0; }', 'Moves top', 'Center', 'Bottom', 'No change', 'A', '2026-03-18 05:55:55'),
(111, 2, 'Output?\ndiv { overflow:hidden; height:50px; }', 'Cuts content', 'Scroll', 'Expand', 'Error', 'A', '2026-03-18 05:55:55'),
(112, 2, 'What happens?\ndiv { z-index:10; position:static; }', 'No effect', 'Applies', 'Hidden', 'Error', 'A', '2026-03-18 05:55:55'),
(113, 2, 'Which wins?\np {color:red;} .c {color:blue;}', 'Depends usage', 'Red always', 'Blue always', 'Error', 'A', '2026-03-18 05:55:55'),
(114, 2, 'Output?\n<p class=\"c\" style=\"color:green\">Hi</p>', 'Green', 'Blue', 'Red', 'Black', 'A', '2026-03-18 05:55:55'),
(115, 2, 'What happens?\ndiv { float:left; }', 'Moves left', 'Center', 'Hidden', 'No effect', 'A', '2026-03-18 05:55:55'),
(116, 2, 'Output?\ndiv { clear:left; }', 'Moves below float', 'Above', 'Hidden', 'Inline', 'A', '2026-03-18 05:55:55'),
(117, 2, 'CSS?\ndiv { box-sizing:border-box; width:100px; padding:10px; }', 'Total 100px', '120px', '110px', 'Depends', 'A', '2026-03-18 05:55:55'),
(118, 2, 'What happens?\ndiv:hover { color:red; }', 'Changes on hover', 'Always red', 'Hidden', 'Error', 'A', '2026-03-18 05:55:55'),
(119, 2, 'Output?\np::first-letter { font-size:30px; }', 'First letter big', 'Whole text big', 'Hidden', 'None', 'A', '2026-03-18 05:55:55'),
(120, 2, 'Output?\np::before { content:\"Hi \"; }', 'Adds before', 'Adds after', 'Replace', 'Error', 'A', '2026-03-18 05:55:55'),
(121, 2, 'Output?\ndiv { display:flex; justify-content:center; }', 'Center horizontally', 'Vertical center', 'Hidden', 'None', 'A', '2026-03-18 05:55:55'),
(122, 2, 'CSS?\ndiv { align-items:center; }', 'Vertical align (flex)', 'Horizontal', 'None', 'Error', 'A', '2026-03-18 05:55:55'),
(123, 2, 'What happens?\ndiv { display:grid; grid-template-columns:1fr 1fr; }', '2 columns', '1 column', 'Hidden', 'Error', 'A', '2026-03-18 05:55:55'),
(124, 2, 'Output?\ndiv { position:fixed; top:0; }', 'Fixed top', 'Scrolls', 'Bottom', 'Hidden', 'A', '2026-03-18 05:55:55'),
(125, 2, 'Output?\ndiv { position:relative; top:10px; }', 'Moves down', 'Up', 'No change', 'Error', 'A', '2026-03-18 05:55:55'),
(126, 2, 'Which has higher priority?\n#id vs .class', '#id', '.class', 'Equal', 'Depends', 'A', '2026-03-18 05:55:55'),
(127, 2, 'Output?\n<p id=\"a\" class=\"b\" style=\"color:blue\">Hi</p>', 'Blue', 'ID', 'Class', 'Black', 'A', '2026-03-18 05:55:55'),
(128, 2, 'What happens?\ndiv { overflow:auto; }', 'Scroll if needed', 'Always hidden', 'Expand', 'Error', 'A', '2026-03-18 05:55:55'),
(129, 2, 'CSS?\ndiv { white-space:nowrap; }', 'No line break', 'Break lines', 'Hidden', 'Error', 'A', '2026-03-18 05:55:55'),
(130, 2, 'Output?\np { line-height:2; }', 'Double space', 'Half', 'Normal', 'Hidden', 'A', '2026-03-18 05:55:55'),
(131, 2, 'What happens?\ndiv { display:inline-block; }', 'Inline + block', 'Inline only', 'Block only', 'Hidden', 'A', '2026-03-18 05:55:55'),
(132, 2, 'CSS?\ndiv { max-width:100px; }', 'Max width', 'Min width', 'Fixed', 'None', 'A', '2026-03-18 05:55:55'),
(133, 2, 'CSS?\ndiv { min-width:100px; }', 'Min width', 'Max', 'Fixed', 'None', 'A', '2026-03-18 05:55:55'),
(134, 2, 'Output?\ndiv { opacity:0; }', 'Invisible but exists', 'Removed', 'Visible', 'Error', 'A', '2026-03-18 05:55:55'),
(135, 2, 'CSS?\ndiv { visibility:hidden; }', 'Hidden with space', 'Removed', 'Visible', 'Error', 'A', '2026-03-18 05:55:55'),
(136, 2, 'Output?\ndiv { display:none; }', 'Removed', 'Hidden space', 'Visible', 'Error', 'A', '2026-03-18 05:55:55'),
(137, 2, 'CSS?\ndiv { margin:10px; }', 'Outer space', 'Inner', 'Border', 'None', 'A', '2026-03-18 05:55:55'),
(138, 2, 'CSS?\ndiv { padding:10px; }', 'Inner space', 'Outer', 'Border', 'None', 'A', '2026-03-18 05:55:55'),
(139, 2, 'CSS?\ndiv { border:1px solid; }', 'Adds border', 'Adds margin', 'Adds padding', 'None', 'A', '2026-03-18 05:55:55'),
(140, 2, 'CSS?\ndiv { width:50%; }', 'Half parent width', 'Half screen', 'Fixed', 'None', 'A', '2026-03-18 05:55:55'),
(141, 2, 'CSS?\ndiv { height:100vh; }', 'Full viewport height', 'Parent height', 'Fixed', 'None', 'A', '2026-03-18 05:55:55'),
(142, 2, 'CSS?\ndiv { text-align:center; }', 'Center text', 'Left', 'Right', 'None', 'A', '2026-03-18 05:55:55'),
(143, 2, 'CSS?\ndiv { vertical-align:middle; }', 'Align inline', 'Block center', 'None', 'Error', 'A', '2026-03-18 05:55:55'),
(144, 2, 'What happens?\nimg { max-width:100%; }', 'Responsive image', 'Fixed size', 'Hidden', 'Error', 'A', '2026-03-18 05:55:55'),
(145, 2, 'CSS?\ndiv { overflow-x:hidden; }', 'Hide horizontal', 'Vertical', 'Scroll', 'None', 'A', '2026-03-18 05:55:55'),
(146, 2, 'CSS?\ndiv { overflow-y:scroll; }', 'Vertical scroll', 'Horizontal', 'Hidden', 'None', 'A', '2026-03-18 05:55:55'),
(147, 2, 'CSS?\ndiv { float:right; }', 'Moves right', 'Left', 'Center', 'None', 'A', '2026-03-18 05:55:55'),
(148, 2, 'CSS?\ndiv { clear:both; }', 'Below floats', 'Above', 'Hidden', 'None', 'A', '2026-03-18 05:55:55'),
(149, 2, 'CSS?\ndiv { position:sticky; top:0; }', 'Sticky top', 'Fixed', 'Relative', 'None', 'A', '2026-03-18 05:55:55'),
(150, 2, 'CSS?\ndiv { left:10px; position:relative; }', 'Moves right', 'Left', 'No change', 'Error', 'A', '2026-03-18 05:55:55'),
(151, 2, 'CSS?\ndiv { right:10px; position:absolute; }', 'Moves left', 'Right', 'No change', 'Error', 'A', '2026-03-18 05:55:55'),
(152, 2, 'CSS?\ndiv { top:10px; position:fixed; }', 'Moves down fixed', 'Up', 'Scroll', 'None', 'A', '2026-03-18 05:55:55'),
(153, 2, 'CSS?\ndiv { bottom:0; position:fixed; }', 'Bottom fixed', 'Top', 'Scroll', 'None', 'A', '2026-03-18 05:55:55'),
(154, 2, 'CSS?\ndiv { text-overflow:ellipsis; }', 'Adds ...', 'Cuts text', 'Wrap', 'None', 'A', '2026-03-18 05:55:55'),
(155, 2, 'CSS?\ndiv { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }', 'Ellipsis works', 'No effect', 'Wrap', 'Error', 'A', '2026-03-18 05:55:55');

-- --------------------------------------------------------

--
-- Table structure for table `exam_results`
--

CREATE TABLE `exam_results` (
  `result_id` int(11) NOT NULL,
  `sid` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `total_questions` int(11) NOT NULL,
  `correct_answers` int(11) NOT NULL,
  `score_percentage` decimal(5,2) NOT NULL,
  `exam_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `intern`
--

CREATE TABLE `intern` (
  `iid` int(11) NOT NULL,
  `unic_no` varchar(100) NOT NULL,
  `duration` varchar(100) DEFAULT NULL,
  `sr_no` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `intern`
--

INSERT INTO `intern` (`iid`, `unic_no`, `duration`, `sr_no`) VALUES
(1, 'INT-45', '45 Days', 1),
(2, 'INT-90', '3 Months', 2),
(3, 'INT-180', '6 Months', 3);

-- --------------------------------------------------------

--
-- Table structure for table `ip_settings`
--

CREATE TABLE `ip_settings` (
  `id` int(11) NOT NULL,
  `allowed_ip` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ip_settings`
--

INSERT INTO `ip_settings` (`id`, `allowed_ip`) VALUES
(1, '::1');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `sid` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `college_name` varchar(255) DEFAULT NULL,
  `branch` varchar(100) DEFAULT NULL,
  `collage_course` varchar(255) DEFAULT NULL,
  `year` varchar(100) DEFAULT NULL,
  `user_img` varchar(255) DEFAULT NULL,
  `resume` varchar(255) DEFAULT NULL,
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`sid`, `full_name`, `email`, `phone`, `address`, `college_name`, `branch`, `collage_course`, `year`, `user_img`, `resume`, `submitted_at`) VALUES
(27, 'DNYANESHWAR SHARAD TIDME', 'dnyaneshwartidme@gmail.com', '09307152817', 'A.T.POST. ROHILE', 'R.Y.K College', 'Computer Science', 'BCA', 'Passed Out', 'dnyaneshwar_sharad_tidme_1773803663488.jpg', NULL, '2026-03-18 03:14:23');

-- --------------------------------------------------------

--
-- Table structure for table `student_auth`
--

CREATE TABLE `student_auth` (
  `said` int(11) NOT NULL,
  `sid` int(11) DEFAULT NULL,
  `face_descriptor` longtext DEFAULT NULL,
  `pin` int(11) DEFAULT NULL,
  `status` varchar(100) DEFAULT 'PENDING',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_auth`
--

INSERT INTO `student_auth` (`said`, `sid`, `face_descriptor`, `pin`, `status`, `created_at`) VALUES
(27, 27, '[-0.1292785257101059,0.05653812363743782,-0.015458976849913597,-0.08726799488067627,-0.06495968252420425,0.024001190438866615,-0.030978599563241005,-0.10545552521944046,0.15653714537620544,-0.1762057989835739,0.3003866374492645,0.035370804369449615,-0.19001415371894836,-0.20214010775089264,0.047721583396196365,0.08010527491569519,-0.06101646274328232,-0.1541687399148941,-0.06396052241325378,-0.13122676312923431,-0.03192630410194397,-0.05035386607050896,0.052711233496665955,0.041838131844997406,-0.15922203660011292,-0.41255900263786316,-0.1121399775147438,-0.06813935190439224,0.08018174767494202,-0.10717728734016418,-0.009048478677868843,0.028762061148881912,-0.2375761717557907,-0.06382258236408234,-0.03463117778301239,0.15856538712978363,-0.02821161225438118,0.020807767286896706,0.1639537662267685,0.009915093891322613,-0.12436845153570175,-0.034630805253982544,0.020952468737959862,0.2722168564796448,0.15887442231178284,0.03406078368425369,0.06286458671092987,-0.0005081421113573015,0.04144000634551048,-0.21358302235603333,0.10928936302661896,0.07252869009971619,0.13964803516864777,0.01774659939110279,0.04544345289468765,-0.12604163587093353,-0.04070168733596802,0.11910973489284515,-0.1199476420879364,0.046859435737133026,-0.012509364634752274,-0.06616061925888062,-0.12278225272893906,-0.006164040416479111,0.29994064569473267,0.16561219096183777,-0.10533671826124191,-0.15353552997112274,0.2495780885219574,-0.1426648497581482,-0.02013779804110527,0.04492758959531784,-0.08961725234985352,-0.14762520790100098,-0.26542213559150696,0.1527223289012909,0.3793303966522217,0.16950644552707672,-0.16708743572235107,0.038411565124988556,-0.11488087475299835,0.012904117815196514,0.031488679349422455,0.03994683548808098,-0.08548007905483246,0.021132225170731544,-0.09247878193855286,0.05676817521452904,0.16429086029529572,0.026262111961841583,-0.049547452479600906,0.18432679772377014,0.0013890499249100685,0.12228351086378098,0.07100141793489456,0.018577592447400093,-0.11809294670820236,0.0038696848787367344,-0.15411396324634552,-0.022180721163749695,0.07092595845460892,-0.06086970865726471,0.04215867444872856,0.1302768737077713,-0.15870822966098785,0.19810383021831512,-0.0153995081782341,-0.029573282226920128,0.06205384060740471,0.10448486357927322,-0.06366743892431259,-0.1179187148809433,0.09172319620847702,-0.2714793384075165,0.18325482308864594,0.20739877223968506,0.06387031078338623,0.20585666596889496,0.16409343481063843,0.06947261840105057,0.07725773006677628,-0.014270416460931301,-0.17704050242900848,-0.04715569317340851,-0.006513063330203295,-0.09104392677545547,0.02281489595770836,0.053081661462783813]', 466448, 'ACTIVE', '2026-03-18 03:15:04');

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `subject_id` int(11) NOT NULL,
  `subject_name` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `question_limit` int(11) DEFAULT 50,
  `time_per_question` decimal(4,2) DEFAULT 1.50
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`subject_id`, `subject_name`, `is_active`, `created_at`, `question_limit`, `time_per_question`) VALUES
(1, 'ReactJS Basics', 0, '2026-03-14 05:03:32', 50, 1.50),
(2, 'HTML & CSS', 1, '2026-03-14 05:03:32', 50, 1.50);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_users`
--
ALTER TABLE `admin_users`
  ADD PRIMARY KEY (`aid`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `attendance_log`
--
ALTER TABLE `attendance_log`
  ADD PRIMARY KEY (`log_id`),
  ADD UNIQUE KEY `unique_attendance` (`sid`,`attendance_date`),
  ADD KEY `idx_attendance_sid` (`sid`),
  ADD KEY `idx_attendance_date` (`attendance_date`),
  ADD KEY `idx_sid_date` (`sid`,`attendance_date`);

--
-- Indexes for table `branch_and_degree`
--
ALTER TABLE `branch_and_degree`
  ADD PRIMARY KEY (`bdi`);

--
-- Indexes for table `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`cid`),
  ADD UNIQUE KEY `course_id` (`course_id`);

--
-- Indexes for table `email_settings`
--
ALTER TABLE `email_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `enrollment`
--
ALTER TABLE `enrollment`
  ADD PRIMARY KEY (`eid`),
  ADD KEY `sid` (`sid`),
  ADD KEY `cid` (`cid`),
  ADD KEY `iid` (`iid`);

--
-- Indexes for table `exam_questions`
--
ALTER TABLE `exam_questions`
  ADD PRIMARY KEY (`qid`),
  ADD KEY `subject_id` (`subject_id`);

--
-- Indexes for table `exam_results`
--
ALTER TABLE `exam_results`
  ADD PRIMARY KEY (`result_id`),
  ADD KEY `sid` (`sid`),
  ADD KEY `subject_id` (`subject_id`);

--
-- Indexes for table `intern`
--
ALTER TABLE `intern`
  ADD PRIMARY KEY (`iid`),
  ADD UNIQUE KEY `unic_no` (`unic_no`);

--
-- Indexes for table `ip_settings`
--
ALTER TABLE `ip_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`sid`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_student_email` (`email`);

--
-- Indexes for table `student_auth`
--
ALTER TABLE `student_auth`
  ADD PRIMARY KEY (`said`),
  ADD UNIQUE KEY `pin` (`pin`),
  ADD KEY `sid` (`sid`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`subject_id`),
  ADD UNIQUE KEY `subject_name` (`subject_name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_users`
--
ALTER TABLE `admin_users`
  MODIFY `aid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `attendance_log`
--
ALTER TABLE `attendance_log`
  MODIFY `log_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `branch_and_degree`
--
ALTER TABLE `branch_and_degree`
  MODIFY `bdi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `course`
--
ALTER TABLE `course`
  MODIFY `cid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `email_settings`
--
ALTER TABLE `email_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `enrollment`
--
ALTER TABLE `enrollment`
  MODIFY `eid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `exam_questions`
--
ALTER TABLE `exam_questions`
  MODIFY `qid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=156;

--
-- AUTO_INCREMENT for table `exam_results`
--
ALTER TABLE `exam_results`
  MODIFY `result_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `intern`
--
ALTER TABLE `intern`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `student`
--
ALTER TABLE `student`
  MODIFY `sid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `student_auth`
--
ALTER TABLE `student_auth`
  MODIFY `said` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `subject_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance_log`
--
ALTER TABLE `attendance_log`
  ADD CONSTRAINT `attendance_log_ibfk_1` FOREIGN KEY (`sid`) REFERENCES `student` (`sid`) ON DELETE CASCADE;

--
-- Constraints for table `enrollment`
--
ALTER TABLE `enrollment`
  ADD CONSTRAINT `enrollment_ibfk_1` FOREIGN KEY (`sid`) REFERENCES `student` (`sid`) ON DELETE CASCADE,
  ADD CONSTRAINT `enrollment_ibfk_2` FOREIGN KEY (`cid`) REFERENCES `course` (`cid`) ON DELETE SET NULL,
  ADD CONSTRAINT `enrollment_ibfk_3` FOREIGN KEY (`iid`) REFERENCES `intern` (`iid`) ON DELETE SET NULL;

--
-- Constraints for table `exam_questions`
--
ALTER TABLE `exam_questions`
  ADD CONSTRAINT `exam_questions_ibfk_1` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`subject_id`) ON DELETE CASCADE;

--
-- Constraints for table `exam_results`
--
ALTER TABLE `exam_results`
  ADD CONSTRAINT `exam_results_ibfk_1` FOREIGN KEY (`sid`) REFERENCES `student` (`sid`) ON DELETE CASCADE,
  ADD CONSTRAINT `exam_results_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`subject_id`) ON DELETE CASCADE;

--
-- Constraints for table `student_auth`
--
ALTER TABLE `student_auth`
  ADD CONSTRAINT `student_auth_ibfk_1` FOREIGN KEY (`sid`) REFERENCES `student` (`sid`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
