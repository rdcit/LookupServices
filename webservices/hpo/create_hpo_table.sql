DROP TABLE IF EXISTS `hpo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hpo` (
  `ID` varchar(30) NOT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `Def` varchar(1024) DEFAULT NULL,
  `Synonyms` varchar(1024) DEFAULT NULL,
  `Comment` varchar(1024) DEFAULT NULL,
  `Xref` varchar(1024) DEFAULT NULL,
  `Is_a` varchar(1024) DEFAULT NULL,
  `Version` varchar(255) DEFAULT NULL,
  `PrevNames` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;