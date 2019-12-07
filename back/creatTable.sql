create database repair_info_manager;
use repair_info_manager;

-- 用户表
CREATE TABLE IF NOT EXISTS `t_user`(
`id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
`name` VARCHAR(40) NOT NULL,
`pwd` VARCHAR(64),
'role' INT UNSIGNED,
'phone' VARCHAR(20)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- 维修项目
CREATE TABLE IF NOT EXISTS `t_repair_item`(
`id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
`name` VARCHAR(100) NOT NULL,
`sid` INT UNSIGNED,
`price` NUMERIC
)ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- 配件类型
CREATE TABLE IF NOT EXISTS `t_parts_type`(
`id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
`name` VARCHAR(100) NOT NULL,
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
insert into t_parts_type(name) values("电器部分");
insert into t_parts_type(name) values("液压部分");
insert into t_parts_type(name) values("其他易损件部分");


-- 配件
CREATE TABLE IF NOT EXISTS `t_device_parts`(
`id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
`name` VARCHAR(100) NOT NULL,
`type` SMALLINT,
`unit` CHAR(2),
`price` NUMERIC,
`remarks` VARCHAR(200),
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

