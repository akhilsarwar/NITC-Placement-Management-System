create table Recruiter(
    id bigint NOT NULL AUTO_INCREMENT,
    name varchar(150) NOT NULL,
    jobRole varchar(150) NOT NULL,
    jobDescription text,
    ctc bigint unsigned NOT NULL,
    minCgpaRequired float,
    jobLocation varchar(200),
    jobRequirements JSON,
    hiringStatus tinyint(1),
    PRIMARY KEY(id)
);

create table Student(
    uid varchar(100),           
    name varchar(100) NOT NULL,
    rollNo varchar(100) NOT NULL UNIQUE,
    email varchar(100) NOT NULL,
    cgpa float NOT NULL,
    address text NOT NULL,
    contact varchar(20) NOT NULL,
    stream varchar(100) NOT NULL,
    branch varchar(100) NOT NULL,    
    dob date NOT NULL,
    placedAt bigint,
    primary key(uid),
    foreign key(placedAt) references Recruiter(id)
);

create table Resume (
	sid varchar(100),
    name varchar(200),
	data longblob,
    size bigint,
    encoding text,
    mimetype text,
    foreign key (sid) references Student (uid),
    primary key (sid)
);

create table ProfileImage (
	sid varchar(100),
    name varchar(200),
	data longblob,
    size bigint,
    encoding text,
    mimetype text,
    primary key (sid)
);

create table PC(
    uid varchar(100),           
    name varchar(100) NOT NULL,
    email varchar(100) NOT NULL,
    address text NOT NULL,
    contact varchar(100) NOT NULL,
    post varchar(150) NOT NULL,
    qualifications text,
    department varchar(150) NOT NULL,
    dob date NOT NULL,
    primary key(uid)
);


create table Notifications(
    studentId varchar(150) NOT NULL,
    pcId varchar(150) NOT NULL,
    foreign key(studentId) references Student(uid),
    foreign key(pcId) references PC(uid),
    title text,
    content text,
    dateTime datetime NOT NULL
);

create table Applied(
    sid varchar(150) NOT NULL,
    rid varchar(150) NOT NULL,
    foreign key(sid) references Student(uid),
    foreign key(rid) references Recruiter(id)
    appliedTime datetime,
    primary key(sid, rid)
);

INSERT INTO `nitc_pms`.`pcmails` (`email`) VALUES ('pc1@gmail.com');
INSERT INTO `nitc_pms`.`pcmails` (`email`) VALUES ('pc2@gmail.com');
INSERT INTO `nitc_pms`.`pcmails` (`email`) VALUES ('pc3@gmail.com');
INSERT INTO `nitc_pms`.`pcmails` (`email`) VALUES ('pc4@gmail.com');


INSERT INTO Student (uid, name, rollNo, email, cgpa, address, contact, stream, branch, dob, placedAt) values ('17iRXhYix8SNOElydydbMbNefrA3', 'Akhil Sarwar T H', 'B190486CS', 'akhilsarwar18@gmail.com', '8.95', 'Thoppukadavail House, Vayalakkad', '8300855992', 'B Tech', 'Computer Science', '2001-08-24', NULL);
