CREATE DATABASE rodeorecruit;

CREATE TABLE jobs (
    id VARCHAR(255) PRIMARY KEY,
    user_email VARCHAR(255) REFERENCES users(email),
    title VARCHAR(255),
    status VARCHAR(255),
    date VARCHAR(300)
    icon_src VARCHAR(255),
    icon_id VARCHAR(255),
    link TEXT,
    note TEXT
);

CREATE TABLE users (
    email VARCHAR(255) PRIMARY KEY,
    hashed_password VARCHAR(255)
);