USE ringtounsi;

DROP TABLE IF EXISTS user;

CREATE TABLE
    IF NOT EXISTS user (
        id INT PRIMARY KEY auto_increment,
        nom VARCHAR(50) NOT NULL,
        prenom VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password CHAR(60) NOT NULL,
        date_inscription datetime NOT NULL,
        role ENUM('Admin', 'Coach', 'Athlete') DEFAULT 'Athlete'
    );
    IF NOT EXISTS coach_rating (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    coach_id INT NOT NULL,
    rating INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (coach_id) REFERENCES user(id)
    );
    IF NOT EXISTS coach_comment (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    coach_id INT NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (coach_id) REFERENCES user(id)
    );


