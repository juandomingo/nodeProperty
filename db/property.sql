
CREATE TABLE IF NOT EXISTS `configuration` (
`id` INTEGER PRIMARY KEY   AUTOINCREMENT,
  `key` varchar(100) NOT NULL,
  `value` varchar(100) NOT NULL
);

-- --------------------------------------------------------

--
-- Table structure for table `postcode`
--

CREATE TABLE IF NOT EXISTS `postcode` (
`id` INTEGER PRIMARY KEY   AUTOINCREMENT,
  `name` varchar(8) NOT NULL
);

-- --------------------------------------------------------

--
-- Table structure for table `property`
--

CREATE TABLE IF NOT EXISTS `property` (
`id` INTEGER PRIMARY KEY   AUTOINCREMENT,
  `type_id` int NOT NULL,
  `number_beedrooms` int NOT NULL,
  `postcode_id` int NOT NULL,
  `state_agent_id` int NOT NULL,
  `price` int NOT NULL,
  `date_listing` date NOT NULL
);

-- --------------------------------------------------------

--
-- Table structure for table `propertytype`
--

CREATE TABLE IF NOT EXISTS `propertytype` (
`id` INTEGER PRIMARY KEY   AUTOINCREMENT,
  `type` varchar(100) NOT NULL
);

-- --------------------------------------------------------

--
-- Table structure for table `rightmoveid` NOT IN USE
--

CREATE TABLE IF NOT EXISTS `rightmoveid` (
`id` INTEGER PRIMARY KEY   AUTOINCREMENT,
  `rightmove_id` int NOT NULL,
  `property_id` int NOT NULL
);

-- --------------------------------------------------------

--
-- Table structure for table `stateagent`
--

CREATE TABLE IF NOT EXISTS `stateagent` (
`id` INTEGER PRIMARY KEY   AUTOINCREMENT,
  `name` varchar(100) NOT NULL,
  `postcode_id` int NOT NULL
);

-- --------------------------------------------------------

--
-- Table structure for table `zooplaid` NOT IN USE
--

CREATE TABLE IF NOT EXISTS `zooplaid` (
`id` INTEGER PRIMARY KEY   AUTOINCREMENT,
  `zoopla_id` int NOT NULL,
  `property_id` int NOT NULL
);

-- --------------------------------------------------------

--
-- Table structure for table `query` NOT IN USE
--

CREATE TABLE IF NOT EXISTS `query` (
`id` INTEGER PRIMARY KEY   AUTOINCREMENT,
  `name` text NOT NULL,
  `postcode` text NOT NULL,
  `days` int NOT NULL,
  `radius` int NOT NULL
);

-- --------------------------------------------------------

--
-- Table structure for table `propInQuery` NOT IN USE
--

CREATE TABLE IF NOT EXISTS `propInQuery` (
`id` INTEGER PRIMARY KEY   AUTOINCREMENT,
  `queryid` int NOT NULL,
  `propid` int NOT NULL
);

-- --------------------------------------------------------

--
-- Table structure for table `propInPage` NOT IN USE
--

CREATE TABLE IF NOT EXISTS `propInPage` (
`id` INTEGER PRIMARY KEY   AUTOINCREMENT,
  `pageid` int NOT NULL,
  `propid` int NOT NULL
);


