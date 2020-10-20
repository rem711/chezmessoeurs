-- phpMyAdmin SQL Dump
-- version OVH
-- https://www.phpmyadmin.net/
--
-- Hôte : bumdufdcrm.mysql.db
-- Généré le :  mar. 20 oct. 2020 à 11:33
-- Version du serveur :  5.6.49-log
-- Version de PHP :  7.0.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `bumdufdcrm`
--

-- --------------------------------------------------------

--
-- Structure de la table `clients`
--

CREATE TABLE `clients` (
  `Id_Client` int(11) NOT NULL,
  `Nom` varchar(350) NOT NULL,
  `Prenom` varchar(350) NOT NULL,
  `Societe` varchar(500) DEFAULT NULL,
  `Adresse_Facturation_Adresse` varchar(500) DEFAULT '',
  `Adresse_Facturation_Adresse_Complement_1` varchar(500) DEFAULT '',
  `Adresse_Facturation_Adresse_Complement_2` varchar(500) DEFAULT '',
  `Adresse_Facturation_CP` varchar(5) DEFAULT '00000',
  `Adresse_Facturation_Ville` varchar(500) DEFAULT '',
  `Numero_TVA` varchar(13) DEFAULT NULL,
  `Email` varchar(320) NOT NULL,
  `Telephone` varchar(10) NOT NULL,
  `Type` enum('Professionnel','Particulier') NOT NULL DEFAULT 'Particulier',
  `Created_At` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Updated_At` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `compteurs`
--

CREATE TABLE `compteurs` (
  `Nom_Compteur` varchar(255) NOT NULL,
  `Valeur_Compteur` int(11) NOT NULL DEFAULT '0',
  `Created_At` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Updated_At` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `compteurs`
--

INSERT INTO `compteurs` (`Nom_Compteur`, `Valeur_Compteur`, `Created_At`, `Updated_At`) VALUES
('COMPTEUR_FACTURES_AVOIRS', 0, '2020-10-01 11:59:21', '2020-10-01 13:24:59'),
('COMPTEUR_FACTURES_GENERALES', 0, '2020-10-01 11:59:21', '2020-10-01 13:06:17');

-- --------------------------------------------------------

--
-- Structure de la table `factures`
--

CREATE TABLE `factures` (
  `Id_Facture` int(11) NOT NULL,
  `Ref_Facture` varchar(100) CHARACTER SET utf8 NOT NULL,
  `Type_Facture` enum('acompte','solde','avoir') CHARACTER SET utf8 NOT NULL,
  `Id_Vente` int(11) NOT NULL,
  `Description` text CHARACTER SET utf8 NOT NULL,
  `Pourcentage_Acompte` float DEFAULT NULL,
  `Prix_TTC` float NOT NULL DEFAULT '0',
  `IsPayed` tinyint(1) NOT NULL DEFAULT '0',
  `IsCanceled` tinyint(1) NOT NULL DEFAULT '0',
  `IdFactureAnnulee` int(11) DEFAULT NULL,
  `Date_Paiement_Du` date NOT NULL,
  `Created_At` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Updated_At` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `utilisateurs`
--

CREATE TABLE `utilisateurs` (
  `Id_Utilisateur` char(36) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
  `Login` varchar(50) CHARACTER SET latin1 NOT NULL,
  `Password` varchar(60) CHARACTER SET latin1 NOT NULL,
  `Created_At` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Updated_At` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf32;

--
-- Déchargement des données de la table `utilisateurs`
--

INSERT INTO `utilisateurs` (`Id_Utilisateur`, `Login`, `Password`, `Created_At`, `Updated_At`) VALUES
('df38b621-9c2d-11ea-9ef9-448a5b44f971', 'utilisateur_cms', '$2a$08$LLjPjKr/JTYPfKOJh.UI7.kLd2.AuYuzLuTY.q.byeccHYvYHYosq', '2020-09-22 16:58:39', '2020-09-22 16:58:39');

-- --------------------------------------------------------

--
-- Structure de la table `ventes`
--

CREATE TABLE `ventes` (
  `Id_Vente` int(11) NOT NULL,
  `Id_Client` int(11) NOT NULL,
  `Description` text NOT NULL,
  `Date_Evenement` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Prix_TTC` float NOT NULL DEFAULT '0',
  `Nb_Personnes` int(11) NOT NULL DEFAULT '0',
  `Ref_Devis` varchar(100) NOT NULL DEFAULT '',
  `Reste_A_Payer` float NOT NULL DEFAULT '0',
  `Created_At` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Updated_At` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`Id_Client`);

--
-- Index pour la table `compteurs`
--
ALTER TABLE `compteurs`
  ADD PRIMARY KEY (`Nom_Compteur`),
  ADD UNIQUE KEY `Nom_Compteur` (`Nom_Compteur`);

--
-- Index pour la table `factures`
--
ALTER TABLE `factures`
  ADD PRIMARY KEY (`Id_Facture`),
  ADD UNIQUE KEY `Ref_Facture` (`Ref_Facture`) USING BTREE,
  ADD KEY `Id_Vente` (`Id_Vente`),
  ADD KEY `IdFactureAnnulee` (`IdFactureAnnulee`);

--
-- Index pour la table `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Index pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  ADD PRIMARY KEY (`Id_Utilisateur`),
  ADD UNIQUE KEY `Login` (`Login`);

--
-- Index pour la table `ventes`
--
ALTER TABLE `ventes`
  ADD PRIMARY KEY (`Id_Vente`),
  ADD KEY `Id_Client` (`Id_Client`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `clients`
--
ALTER TABLE `clients`
  MODIFY `Id_Client` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `factures`
--
ALTER TABLE `factures`
  MODIFY `Id_Facture` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `ventes`
--
ALTER TABLE `ventes`
  MODIFY `Id_Vente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `factures`
--
ALTER TABLE `factures`
  ADD CONSTRAINT `IdFactureAnnulee` FOREIGN KEY (`IdFactureAnnulee`) REFERENCES `factures` (`Id_Facture`),
  ADD CONSTRAINT `Id_Vente` FOREIGN KEY (`Id_Vente`) REFERENCES `ventes` (`Id_Vente`);

--
-- Contraintes pour la table `ventes`
--
ALTER TABLE `ventes`
  ADD CONSTRAINT `Id_Client` FOREIGN KEY (`Id_Client`) REFERENCES `clients` (`Id_Client`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
