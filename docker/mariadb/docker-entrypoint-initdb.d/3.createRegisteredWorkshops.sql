USE fullstackExercise;

CREATE TABLE registeredWorkshops (
   id INT NOT NULL AUTO_INCREMENT,
   registrationId INT NOT NULL,
   workshopId INT NOT NULL,

   PRIMARY KEY (id),
   FOREIGN KEY (registrationId) REFERENCES registrations(id),
   FOREIGN KEY (workshopId) REFERENCES workshops(id)
);