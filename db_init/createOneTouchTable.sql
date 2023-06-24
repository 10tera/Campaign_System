CREATE TABLE onetouch(
    `id` int AUTO_INCREMENT PRIMARY KEY,
    `companyId` int not null,
    `title` varchar(255) not null,
    `description` varchar(255) not null,
    `point` int  not null
);