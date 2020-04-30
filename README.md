# mini-sns-backend

## Project setup
```bash
# npm install
yarn install
# nodemon install
npm install -g nodemon
```

## Environment variable setup
create a .env file
```
DB_HOST = << database host >>
DATABASE = << database name >>
USERNAME = << database username >>
PASSWORD = << database password >>
DB_CONNECTION_COUNT = << database connection count >>
ENC_SECRET_KEY = << encryption secret key >>
JWT_SECRET_KEY = << jwt secret key >>
```

### Compiles and hot-reloads for development
```
yarn run start:dev
```

### Databases DDL
```sql
-- members
CREATE TABLE `members` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `email` text DEFAULT NULL,
  `password` text DEFAULT NULL,
  `agree_TOS` tinyint(1) DEFAULT NULL,
  `agree_privacy` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `members_UN` (`email`) USING HASH
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4

-- feeds
CREATE TABLE `feeds` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `contents` text NOT NULL,
  `member_id` int(10) unsigned NOT NULL,
  `total_likes` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `feeds_FK` (`member_id`),
  CONSTRAINT `feeds_FK` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4

-- hashtags
CREATE TABLE `hashtags` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `hashtag` text NOT NULL,
  `member_id` int(10) unsigned NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hashtags_UN` (`hashtag`) USING HASH,
  KEY `hashtag_FK` (`member_id`),
  CONSTRAINT `hashtag_FK` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4

-- feeds_hashtags
CREATE TABLE `feeds_hashtags` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `feed_id` int(10) unsigned DEFAULT NULL,
  `hashtag_id` int(10) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `feeds_hashtag_FK` (`feed_id`),
  KEY `feeds_hashtag_FK_1` (`hashtag_id`),
  CONSTRAINT `feeds_hashtag_FK` FOREIGN KEY (`feed_id`) REFERENCES `feeds` (`id`),
  CONSTRAINT `feeds_hashtag_FK_1` FOREIGN KEY (`hashtag_id`) REFERENCES `hashtags` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4

-- feeds_likes
CREATE TABLE `feeds_likes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `feed_id` int(10) unsigned DEFAULT NULL,
  `member_id` int(10) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `feeds_likes_UN` (`feed_id`,`member_id`),
  KEY `feeds_likes_FK_1` (`member_id`),
  CONSTRAINT `feeds_likes_FK` FOREIGN KEY (`feed_id`) REFERENCES `feeds` (`id`),
  CONSTRAINT `feeds_likes_FK_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
```