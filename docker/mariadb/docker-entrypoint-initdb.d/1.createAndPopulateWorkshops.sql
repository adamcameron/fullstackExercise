USE fullstackExercise;

CREATE TABLE workshops (
    id INT NOT NULL,
    name VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,

    PRIMARY KEY (id)
) ENGINE=InnoDB;

INSERT INTO workshops (id, name)
VALUES
    (2, 'TEST_WORKSHOP 1'),
    (3, 'TEST_WORKSHOP 2'),
    (5, 'TEST_WORKSHOP 3'),
    (7, 'TEST_WORKSHOP 4')
;

ALTER TABLE workshops MODIFY COLUMN id INT auto_increment;