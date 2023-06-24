CREATE TABLE users(
    `id` int AUTO_INCREMENT PRIMARY KEY,
    `uid` varchar(255) not null,
    `postCode` varchar(70) not null,
    `address` varchar(32) not null,
    `name` varchar(70) not null,
    `furigana` varchar(70) not null,
    `phone` varchar(32) not null,
    `birth` varchar(32) not null,
    `isNotice` tinyint default 1 not null
);