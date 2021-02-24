USE fullstackExercise;

CREATE TABLE registrations (
   id INT NOT NULL AUTO_INCREMENT,
   fullName VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
   phoneNumber VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
   emailAddress VARCHAR(320) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
   password VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
   ipAddress VARCHAR(15) NOT NULL,
   uniqueCode VARCHAR(36) NOT NULL DEFAULT (UUID()),
   created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

   PRIMARY KEY (id)
) ENGINE=InnoDB;
