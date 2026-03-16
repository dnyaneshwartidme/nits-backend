-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 16, 2026 at 10:44 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12
SET SESSION sql_require_primary_key = OFF;
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
(1, 'admin', '$2a$10$0yw/qWCJHSOrAU/LjWEphOidzAfLTdx.wVG7mrlrhWUQtFP80ZflC', '2026-03-11 07:01:14');

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

--
-- Dumping data for table `attendance_log`
--

INSERT INTO `attendance_log` (`log_id`, `sid`, `attendance_date`, `in_time`, `out_time`, `total_hours`, `topic`, `created_at`) VALUES
(30, 25, '2026-03-11', '06:52 PM', NULL, NULL, '', '2026-03-11 13:22:22'),
(31, 25, '2026-03-12', '10:25 AM', NULL, NULL, '', '2026-03-12 04:55:44'),
(32, 26, '2026-03-13', '02:14 PM', '02:14 PM', '00:00', 'i am Dnyaneshwaqr', '2026-03-13 08:44:02'),
(34, 25, '2026-03-13', '05:27 PM', '05:35 PM', '00:08', ' Hello Ji,  \nI am a full-stack developer.', '2026-03-13 11:57:38'),
(36, 25, '2026-03-15', '08:58 AM', NULL, NULL, '', '2026-03-15 03:28:28'),
(37, 25, '2026-03-16', '02:12 PM', NULL, NULL, '', '2026-03-16 08:42:12');

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
(25, 25, 1, 1, 'internship', 'active', '2026-03-11', 'NITS/IS/45/260311/0025', 'March_2026.xlsx'),
(26, 26, 2, 1, 'internship', 'active', '2026-03-13', 'NITS/IS/45/260313/0026', 'March_2026.xlsx');

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
(5, 2, 'Which HTML tag is used to define an internal style sheet?', '<script>', '<css>', '<style>', '<design>', 'C', '2026-03-14 05:03:32');

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

--
-- Dumping data for table `exam_results`
--

INSERT INTO `exam_results` (`result_id`, `sid`, `subject_id`, `total_questions`, `correct_answers`, `score_percentage`, `exam_date`) VALUES
(1, 25, 1, 3, 1, 33.33, '2026-03-14 05:34:50'),
(3, 25, 2, 2, 2, 100.00, '2026-03-14 09:11:38');

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
(25, 'DNYANESHWAR SHARAD TIDME', 'dnyaneshwartidme@gmail.com', '09307152817', 'A.T.POST. ROHILE', 'Sandip Univarsity', 'Computer Science', 'B.E', 'Passed Out', 'dnyaneshwar_sharad_tidme_1773235267011.jpg', 'dnyaneshwar_sharad_tidme_1773235267012.pdf', '2026-03-11 13:21:07'),
(26, 'yogesh surywanshi ', 'ysury@gmail.com', '9359652403', 'NSK', 'kthn', 'Computer Science', 'MSc', 'Passed Out', 'yogesh_surywanshi__1773391204037.jpg', NULL, '2026-03-13 08:40:04');

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
(25, 25, '[-0.1412288248538971,0.1553346961736679,0.08487416058778763,-0.06848162412643433,-0.034471236169338226,-0.022743195295333862,-0.04068075865507126,-0.11475934088230133,0.1284448504447937,-0.09415904432535172,0.3041360676288605,0.02245737984776497,-0.16119667887687683,-0.2539190948009491,0.0479460209608078,0.10843589156866074,-0.08562871068716049,-0.18553324043750763,-0.12774112820625305,-0.08819788694381714,-0.023542126640677452,-0.006251238752156496,0.07462175190448761,0.011775780469179153,-0.1733093112707138,-0.4490302503108978,-0.06457220017910004,-0.0780036523938179,0.0882905125617981,-0.09217289835214615,-0.03574475273489952,0.026629500091075897,-0.2455991506576538,-0.08054351061582565,-0.017002591863274574,0.15871919691562653,-0.012727700173854828,-0.004046758636832237,0.1676228642463684,-0.006043676286935806,-0.16970179975032806,0.011521697975695133,0.040913406759500504,0.260577917098999,0.21721450984477997,0.03872064873576164,0.10564371943473816,-0.07343868166208267,0.09587686508893967,-0.14914433658123016,0.10445278137922287,0.11661789566278458,0.0779956802725792,0.0432504303753376,0.052156299352645874,-0.10853015631437302,-0.008805206045508385,0.11174933612346649,-0.17244790494441986,0.05319400131702423,-0.0007914761081337929,-0.09571632742881775,-0.1068301722407341,0.007516459561884403,0.2584483027458191,0.13090722262859344,-0.07813166081905365,-0.1923544704914093,0.19459256529808044,-0.16551770269870758,-0.02780441753566265,0.08097976446151733,-0.1001865342259407,-0.10543672740459442,-0.3290623128414154,0.10382836312055588,0.3844422698020935,0.1068371832370758,-0.20572485029697418,0.06086846813559532,-0.09962042421102524,-0.029331009835004807,0.06712662428617477,0.09694558382034302,-0.11148348450660706,0.05138653889298439,-0.13604828715324402,0.028147170320153236,0.23423101007938385,0.049873143434524536,-0.0420585498213768,0.21988728642463684,0.01521166693419218,0.07808340340852737,0.0879165455698967,0.024643857032060623,-0.1396215856075287,-0.012890883721411228,-0.12911827862262726,-0.07389315962791443,0.09097870439291,-0.06146704778075218,0.004231923725455999,0.10233324021100998,-0.15603917837142944,0.15948668122291565,-0.01541848573833704,0.0397256575524807,0.058550190180540085,0.03183681145310402,-0.027893375605344772,-0.14962448179721832,0.10523714870214462,-0.21025951206684113,0.19154812395572662,0.19117800891399384,0.06110917776823044,0.16294436156749725,0.18411780893802643,0.08155907690525055,0.03141846880316734,0.01130472868680954,-0.11930608749389648,-0.019427675753831863,0.025037894025444984,-0.06223079562187195,0.10048782825469971,0.052886489778757095]', 756700, 'ACTIVE', '2026-03-11 13:21:28'),
(26, 26, '[-0.13873669505119324,0.0214273389428854,0.0756811797618866,-0.027813833206892014,-0.02329045534133911,-0.00928073562681675,-0.012670731171965599,-0.04670262336730957,0.18221065402030945,-0.07330948859453201,0.23018957674503326,-0.010383226908743382,-0.1773674488067627,-0.19720259308815002,0.0038580060936510563,0.12507925927639008,-0.19766578078269958,-0.10494038462638855,-0.0397941879928112,-0.14047186076641083,-0.040185507386922836,0.05608391761779785,0.04891848564147949,0.0674755722284317,-0.08933353424072266,-0.435253381729126,-0.04930906742811203,-0.18792292475700378,0.0022073842119425535,-0.08949983865022659,-0.014345360919833183,0.04159341752529144,-0.19453835487365723,-0.06683816760778427,-0.04601556807756424,0.10399866104125977,0.023262498900294304,0.008141560479998589,0.14377780258655548,0.06249332055449486,-0.06539841741323471,-0.09858638048171997,-0.007851377129554749,0.2973475158214569,0.16087426245212555,0.07020267844200134,-0.020535744726657867,0.0668928325176239,0.0959131270647049,-0.2517063617706299,0.054191671311855316,0.08924505114555359,0.148490771651268,-0.014201786369085312,0.07962260395288467,-0.05907105654478073,-0.03843194991350174,0.0006075206911191344,-0.16705526411533356,0.009168175049126148,-0.0045014433562755585,-0.07884856313467026,-0.1001935824751854,-0.04204355552792549,0.2858135402202606,0.10249222815036774,-0.06885281950235367,-0.08993862569332123,0.14921458065509796,-0.12316813319921494,-0.03888234123587608,0.03771312162280083,-0.08816967159509659,-0.09970516711473465,-0.25909852981567383,0.10100030153989792,0.40532875061035156,0.07330219447612762,-0.15081173181533813,-0.005946697201579809,-0.1676468551158905,-0.02338103950023651,0.03851437568664551,-0.018368149176239967,-0.046528927981853485,0.018445385619997978,-0.10185502469539642,0.02797025255858898,0.1040407344698906,-0.01870821602642536,-0.047132354229688644,0.13402588665485382,-0.05734929442405701,0.05570687726140022,0.028449999168515205,-0.05895832180976868,-0.03959943726658821,0.0789959505200386,-0.08364906907081604,0.016397519037127495,0.09969408065080643,-0.03408227860927582,0.0375710055232048,0.004050458315759897,-0.18708167970180511,0.08298809826374054,0.02394537255167961,-0.07436113804578781,0.09330680966377258,0.03910050541162491,-0.19915759563446045,-0.09256959706544876,0.18203981220722198,-0.2875390946865082,0.16813787817955017,0.1660432517528534,-0.001967574004083872,0.20488815009593964,0.0008302194182761014,0.0834570899605751,-0.05951768159866333,-0.02739199809730053,-0.12148122489452362,-0.0699816644191742,0.07063499093055725,-0.023677531629800797,0.015138871967792511,0.015386831015348434]', 222076, 'ACTIVE', '2026-03-13 08:40:35');

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
  MODIFY `aid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `attendance_log`
--
ALTER TABLE `attendance_log`
  MODIFY `log_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

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
-- AUTO_INCREMENT for table `enrollment`
--
ALTER TABLE `enrollment`
  MODIFY `eid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `exam_questions`
--
ALTER TABLE `exam_questions`
  MODIFY `qid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
  MODIFY `sid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `student_auth`
--
ALTER TABLE `student_auth`
  MODIFY `said` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

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
