CREATE DATABASE IF NOT EXISTS academia_db;
USE academia_db;

DROP TABLE IF EXISTS rates;
DROP TABLE IF EXISTS inscriptions;
DROP TABLE IF EXISTS courses_schedules;
DROP TABLE IF EXISTS topics;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS classrooms;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS teachers;
DROP TABLE IF EXISTS cities;
DROP TABLE IF EXISTS identification_types;

CREATE TABLE identification_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(6) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(250)
) ENGINE=InnoDB;

CREATE TABLE cities (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(10) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE teachers (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(60) NOT NULL,
  lastName VARCHAR(60) NOT NULL,
  identification_type_id INT NOT NULL,
  identificationNumber VARCHAR(16) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  FOREIGN KEY (identification_type_id) REFERENCES identification_types(id)
) ENGINE=InnoDB;

CREATE TABLE students (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(14) NOT NULL UNIQUE,
  firstName VARCHAR(60) NOT NULL,
  lastName VARCHAR(60) NOT NULL,
  identification_type_id INT NOT NULL,
  identificationNumber VARCHAR(16) NOT NULL UNIQUE,
  gender VARCHAR(20),
  birthdate DATETIME,
  email VARCHAR(60),
  address VARCHAR(100),
  city_id BIGINT,
  FOREIGN KEY (identification_type_id) REFERENCES identification_types(id),
  FOREIGN KEY (city_id) REFERENCES cities(id)
) ENGINE=InnoDB;

CREATE TABLE classrooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(10) NOT NULL UNIQUE,
  description VARCHAR(250),
  capacity INT NOT NULL,
  active TINYINT NOT NULL DEFAULT 1
) ENGINE=InnoDB;

CREATE TABLE courses (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(10) NOT NULL UNIQUE,
  description VARCHAR(250),
  intensity INT,
  weight INT,
  active TINYINT NOT NULL DEFAULT 1
) ENGINE=InnoDB;

CREATE TABLE topics (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  course_id BIGINT NOT NULL,
  code VARCHAR(10) NOT NULL,
  title VARCHAR(100) NOT NULL,
  description VARCHAR(250),
  active TINYINT NOT NULL DEFAULT 1,
  FOREIGN KEY (course_id) REFERENCES courses(id)
) ENGINE=InnoDB;

CREATE TABLE courses_schedules (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  course_id BIGINT NOT NULL,
  teacher_id BIGINT NOT NULL,
  classroom_id INT NOT NULL,
  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,
  active TINYINT NOT NULL DEFAULT 1,
  FOREIGN KEY (course_id) REFERENCES courses(id),
  FOREIGN KEY (teacher_id) REFERENCES teachers(id),
  FOREIGN KEY (classroom_id) REFERENCES classrooms(id)
) ENGINE=InnoDB;

CREATE TABLE inscriptions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  course_schedule_id BIGINT NOT NULL,
  student_id BIGINT NOT NULL,
  register_date DATETIME NOT NULL,
  active TINYINT NOT NULL DEFAULT 1,
  FOREIGN KEY (course_schedule_id) REFERENCES courses_schedules(id),
  FOREIGN KEY (student_id) REFERENCES students(id)
) ENGINE=InnoDB;

CREATE TABLE rates (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  inscription_id BIGINT NOT NULL,
  rate BIGINT NOT NULL,
  comments VARCHAR(250),
  FOREIGN KEY (inscription_id) REFERENCES inscriptions(id)
) ENGINE=InnoDB;

-- Datos semilla
INSERT INTO identification_types (code, name, description) VALUES
('CC', 'Cedula de ciudadania', 'Documento nacional'),
('TI', 'Tarjeta de identidad', 'Para menores de edad'),
('CE', 'Cedula de extranjeria', 'Para extranjeros residentes');

INSERT INTO cities (code, name) VALUES
('BOG', 'Bogota'),
('MED', 'Medellin');

INSERT INTO classrooms (code, description, capacity, active) VALUES
('A-101', 'Aula magna bloque A', 2, 1),
('B-205', 'Laboratorio de sistemas', 25, 1);

INSERT INTO teachers (firstName, lastName, identification_type_id, identificationNumber, email) VALUES
('Mario', 'Lopez', 1, '100200300', 'mario.lopez@academia.edu');

INSERT INTO courses (code, description, intensity, weight, active) VALUES
('NODE-01', 'Fundamentos de Node.js', 40, 3, 1);
