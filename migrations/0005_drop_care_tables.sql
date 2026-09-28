DROP TABLE IF EXISTS favourite_baby_names;
DROP TABLE IF EXISTS mother_weight_logs;

ALTER TABLE users DROP COLUMN preferred_name;
ALTER TABLE users DROP COLUMN pregnancy_start_date;
ALTER TABLE users DROP COLUMN next_doctor_visit_date;
ALTER TABLE users DROP COLUMN due_date;
ALTER TABLE users DROP COLUMN weight_at_start_kg;
ALTER TABLE users DROP COLUMN baby_gender;
